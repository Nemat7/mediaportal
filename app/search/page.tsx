"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import VideoCard from "@/components/VideoCard";
import { MediaItem } from "@/lib/data";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const CATEGORIES = [
  { slug: "",         label: "Все" },
  { slug: "kino",     label: "Кино" },
  { slug: "serialy",  label: "Сериалы" },
  { slug: "comedy",   label: "Комедия" },
  { slug: "boevik",   label: "Боевик" },
  { slug: "podcasts", label: "Подкасты" },
  { slug: "show",     label: "Шоу" },
  { slug: "clips",    label: "Клипы" },
];

const SORT_OPTIONS = [
  { value: "",          label: "По умолчанию" },
  { value: "-rating",   label: "Рейтинг ↓" },
  { value: "-views",    label: "Просмотры ↓" },
  { value: "-year",     label: "Новые сначала" },
  { value: "year",      label: "Старые сначала" },
];

function mapVideo(v: any): MediaItem {
  return {
    id:          String(v.id),
    title:       v.title,
    description: v.description ?? "",
    year:        v.year,
    rating:      v.rating,
    duration:    v.duration,
    quality:     v.quality,
    category:    v.category?.slug ?? "",
    tags:        (v.tags || []).map((t: any) => t.name),
    thumbnail:   v.thumbnail ?? "",
    backdrop:    v.backdrop  ?? "",
    studio:      v.studio,
    isNew:       v.is_new,
    isPopular:   v.is_popular,
  };
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialQ = searchParams.get("q") ?? "";
  const [query, setQuery]       = useState(initialQ);
  const [input, setInput]       = useState(initialQ);
  const [category, setCategory] = useState("");
  const [ordering, setOrdering] = useState("");
  const [items, setItems]       = useState<MediaItem[]>([]);
  const [count, setCount]       = useState(0);
  const [loading, setLoading]   = useState(false);

  const doSearch = useCallback(async (q: string, cat: string, ord: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page_size: "50" });
      if (q)   params.set("search", q);
      if (cat) params.set("category__slug", cat);
      if (ord) params.set("ordering", ord);
      const res = await fetch(`${API}/videos/?${params}`);
      const data = await res.json();
      setItems((data.results || []).map(mapVideo));
      setCount(data.count ?? 0);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Run search whenever filters change
  useEffect(() => {
    doSearch(query, category, ordering);
  }, [query, category, ordering, doSearch]);

  // Sync URL param on mount
  useEffect(() => {
    if (initialQ) doSearch(initialQ, "", "");
  }, []); // eslint-disable-line

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setQuery(input);
    router.replace(`/search?q=${encodeURIComponent(input)}`, { scroll: false });
  }

  const pillStyle = (active: boolean) => ({
    padding: "8px 16px", borderRadius: 100, fontSize: 13, fontWeight: 600,
    cursor: "pointer", border: "none", fontFamily: "inherit",
    background: active ? "var(--primary)" : "var(--bg-card)",
    color: active ? "white" : "var(--text-secondary)",
    boxShadow: active ? "0 4px 12px rgba(230,57,70,0.3)" : "var(--shadow-sm)",
    transition: "all 0.2s",
  });

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 24px 80px" }}>

      {/* Search bar */}
      <form onSubmit={handleSubmit} style={{ position: "relative", marginBottom: 32 }}>
        <svg width="20" height="20" fill="none" stroke="var(--text-muted)" strokeWidth="2" viewBox="0 0 24 24"
          style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Поиск фильмов, сериалов, актёров..."
          autoFocus
          style={{
            width: "100%", padding: "16px 60px 16px 54px",
            fontSize: 16, fontFamily: "inherit",
            border: "2px solid var(--border)", borderRadius: 100,
            background: "var(--bg-card)", color: "var(--text-primary)",
            outline: "none", transition: "border-color 0.2s, box-shadow 0.2s",
          }}
          onFocus={e => { e.currentTarget.style.borderColor = "var(--primary-light)"; e.currentTarget.style.boxShadow = "0 0 0 4px rgba(230,57,70,0.08)"; }}
          onBlur={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
        />
        {input && (
          <button type="button" onClick={() => { setInput(""); setQuery(""); }}
            style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        )}
      </form>

      {/* Category filters */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {CATEGORIES.map(c => (
          <button key={c.slug} onClick={() => setCategory(c.slug)} style={pillStyle(category === c.slug)}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Sort + count */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
          {loading ? "Поиск..." : query || category ? (
            <><span style={{ color: "var(--text-primary)", fontWeight: 700 }}>{count}</span> результатов{query ? ` по запросу «${query}»` : ""}</>
          ) : (
            "Введите запрос или выберите категорию"
          )}
        </p>
        <select
          value={ordering} onChange={e => setOrdering(e.target.value)}
          style={{ padding: "8px 14px", borderRadius: "var(--radius-md)", border: "1.5px solid var(--border)", background: "var(--bg-card)", color: "var(--text-primary)", fontSize: 13, fontFamily: "inherit", cursor: "pointer", outline: "none" }}>
          {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* Results */}
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 16 }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{ aspectRatio: "2/3", borderRadius: 10, background: "var(--bg-card)", animation: "pulse 1.5s ease-in-out infinite" }} />
          ))}
        </div>
      ) : items.length === 0 && (query || category) ? (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <p style={{ fontSize: 40, marginBottom: 16 }}>🎬</p>
          <p style={{ fontSize: 18, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>Ничего не найдено</p>
          <p style={{ fontSize: 14, color: "var(--text-muted)" }}>Попробуйте другой запрос или выберите другую категорию</p>
        </div>
      ) : (
        <div className="card-grid">
          {items.map(item => <VideoCard key={item.id} item={item} />)}
        </div>
      )}

      {/* Pulse animation */}
      <style>{`@keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:.8} }`}</style>
    </div>
  );
}
