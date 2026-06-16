import type { MediaItem } from "./data";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// ── Types from Django API ─────────────────────────────────────────────────────

interface ApiVideo {
  id: number;
  title: string;
  description: string;
  year: number;
  rating: string;
  duration: string;
  quality: string;
  category: { id: number; name: string; slug: string } | null;
  tags: { id: number; name: string; slug: string }[];
  thumbnail: string | null;
  backdrop: string | null;
  views: number;
  studio: string;
  is_new: boolean;
  is_popular: boolean;
  is_hero: boolean;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// ── Mapper ────────────────────────────────────────────────────────────────────

function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}М`;
  if (n >= 1_000)     return `${Math.round(n / 1_000)}К`;
  return String(n);
}

function mapVideo(v: ApiVideo): MediaItem {
  return {
    id:          String(v.id),
    title:       v.title,
    description: v.description,
    year:        v.year,
    rating:      v.rating,
    duration:    v.duration,
    quality:     v.quality as "4K" | "HD",
    category:    v.category?.slug ?? "",
    tags:        v.tags.map((t) => t.name),
    thumbnail:   v.thumbnail ?? "",
    backdrop:    v.backdrop  ?? "",
    views:       formatViews(v.views),
    studio:      v.studio,
    isNew:       v.is_new,
    isPopular:   v.is_popular,
  };
}

// ── Fetch helpers ─────────────────────────────────────────────────────────────

async function get<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${API}${path}`);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`API error ${res.status}: ${path}`);
  return res.json();
}

// ── Public API functions ──────────────────────────────────────────────────────

export async function fetchHero(): Promise<MediaItem[]> {
  const data = await get<ApiVideo[]>("/videos/hero/");
  return data.map(mapVideo);
}

export async function fetchPopular(): Promise<MediaItem[]> {
  const data = await get<ApiVideo[]>("/videos/popular/");
  return data.map(mapVideo);
}

export async function fetchNew(): Promise<MediaItem[]> {
  const data = await get<ApiVideo[]>("/videos/new/");
  return data.map(mapVideo);
}

export async function fetchByCategory(slug: string): Promise<MediaItem[]> {
  const data = await get<PaginatedResponse<ApiVideo>>("/videos/", {
    category__slug: slug,
    page_size: "50",
  });
  return data.results.map(mapVideo);
}

export async function fetchAll(): Promise<MediaItem[]> {
  const data = await get<PaginatedResponse<ApiVideo>>("/videos/", { page_size: "100" });
  return data.results.map(mapVideo);
}

export async function fetchVideoById(id: string): Promise<MediaItem | null> {
  try {
    const data = await get<ApiVideo>(`/videos/${id}/`);
    return mapVideo(data);
  } catch {
    return null;
  }
}

export async function fetchRelated(categorySlug: string, excludeId: string): Promise<MediaItem[]> {
  const items = await fetchByCategory(categorySlug);
  return items.filter((v) => v.id !== excludeId).slice(0, 8);
}

export async function fetchSearch(params: {
  q?: string;
  category?: string;
  ordering?: string;
}): Promise<{ items: MediaItem[]; count: number }> {
  const p: Record<string, string> = { page_size: "50" };
  if (params.q)        p.search          = params.q;
  if (params.category) p.category__slug  = params.category;
  if (params.ordering) p.ordering        = params.ordering;

  const data = await get<PaginatedResponse<ApiVideo>>("/videos/", p);
  return { items: data.results.map(mapVideo), count: data.count };
}

export async function fetchCategories(): Promise<{ name: string; slug: string; video_count: number }[]> {
  const data = await get<PaginatedResponse<{ name: string; slug: string; video_count: number }>>("/categories/", { page_size: "20" });
  return data.results;
}
