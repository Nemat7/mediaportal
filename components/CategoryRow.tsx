"use client";

import Link from "next/link";
import { useRef } from "react";
import VideoCard from "./VideoCard";
import { MediaItem } from "@/lib/data";

type Props = { title: string; slug: string; items: MediaItem[] };

export default function CategoryRow({ title, slug, items }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!ref.current) return;
    ref.current.scrollBy({ left: dir === "right" ? 600 : -600, behavior: "smooth" });
  };

  if (!items.length) return null;

  return (
    <section style={{ marginBottom: 40 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#ffffff" }}>{title}</h2>
        <div className="cat-row-controls" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link href={`/${slug}`} style={{
            display: "flex", alignItems: "center", gap: 4,
            color: "var(--primary)", fontSize: 13, fontWeight: 600, textDecoration: "none",
          }}>
            Все
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
          </Link>
          <button onClick={() => scroll("left")}
            style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid var(--border)", background: "var(--bg-card)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--primary)"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "var(--primary)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-card)"; e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.borderColor = "var(--border)"; }}
            aria-label="Назад">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button onClick={() => scroll("right")}
            style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid var(--border)", background: "var(--bg-card)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", transition: "all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--primary)"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "var(--primary)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "var(--bg-card)"; e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.borderColor = "var(--border)"; }}
            aria-label="Вперёд">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </div>

      <div ref={ref} className="scrollbar-hide" style={{ display: "flex", gap: 20, overflowX: "auto", paddingBottom: 4 }}>
        {items.map(item => (
          <div key={item.id} className="cat-card-item" style={{ flexShrink: 0, width: 160 }}>
            <VideoCard item={item} />
          </div>
        ))}
        <div style={{ flexShrink: 0, width: 4 }} />
      </div>
    </section>
  );
}
