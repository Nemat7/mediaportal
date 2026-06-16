export type MediaItem = {
  id: string;
  title: string;
  year: number;
  rating: string;
  duration: string;
  category: string;
  tags: string[];
  description: string;
  thumbnail: string;
  backdrop: string;
  quality?: "4K" | "HD";
  views?: string;
  studio?: string;
  isNew?: boolean;
  isPopular?: boolean;
};

export const categories = [
  { slug: "kino",     label: "Кино" },
  { slug: "serialy",  label: "Сериалы" },
  { slug: "comedy",   label: "Комедия" },
  { slug: "boevik",   label: "Боевик" },
  { slug: "podcasts", label: "Подкасты" },
  { slug: "show",     label: "Шоу" },
  { slug: "clips",    label: "Клипы" },
];

const LABELS: Record<string, string> = Object.fromEntries(
  categories.map((c) => [c.slug, c.label])
);

export function getCategoryLabel(slug: string): string {
  return LABELS[slug] ?? slug;
}
