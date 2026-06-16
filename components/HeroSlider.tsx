"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { MediaItem } from "@/lib/data";

export default function HeroSlider({ items }: { items: MediaItem[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setCurrent(c => (c + 1) % items.length), 6000);
    return () => clearInterval(t);
  }, [paused, items.length]);

  const item = items[current];

  return (
    <section className="hero-section">
      <div
        className="hero-card"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {items.map((it, i) => (
          <div key={it.id} style={{ position: "absolute", inset: 0, opacity: i === current ? 1 : 0, transition: "opacity 0.8s ease" }}>
            <Image src={it.backdrop} alt={it.title} fill className="object-cover" unoptimized priority={i === 0} />
          </div>
        ))}

        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,26,46,0.95) 0%, rgba(26,26,46,0.45) 40%, rgba(26,26,46,0.1) 70%, transparent 100%)" }} />

        <div className="hero-content-pad">
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "6px 14px", background: "rgba(230,57,70,0.9)", color: "white",
            fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const,
            letterSpacing: 1, borderRadius: 100, marginBottom: 14,
          }}>
            🔥 В тренде
          </div>

          <h1 className="hero-h1">{item.title}</h1>

          <div className="hero-meta">
            <span style={{ color: "#ffc107", fontWeight: 700 }}>★ {item.rating}</span>
            <span>{item.year}</span>
            <span style={{ padding: "2px 8px", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 4, fontSize: 11, fontWeight: 700 }}>HD</span>
            <span>{item.duration}</span>
          </div>

          <p className="hero-desc" style={{ color: "rgba(255,255,255,0.75)", fontSize: 15, lineHeight: 1.7, marginBottom: 28, maxWidth: 560, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
            {item.description}
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" as const }}>
            <Link href={`/watch/${item.id}`} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "14px 32px", borderRadius: 100, fontSize: 15, fontWeight: 700,
              background: "white", color: "var(--text-primary)", textDecoration: "none",
              boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
              Смотреть
            </Link>
            <button style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "14px 32px", borderRadius: 100, fontSize: 15, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
              background: "rgba(255,255,255,0.15)", color: "white",
              backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.2)",
            }}>
              + В список
            </button>
          </div>
        </div>

        <div className="hero-dots">
          {items.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} style={{
              height: 10, padding: 0, border: "none", cursor: "pointer", borderRadius: 100,
              width: i === current ? 32 : 10,
              background: i === current ? "white" : "rgba(255,255,255,0.3)",
              transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
            }} />
          ))}
        </div>
      </div>
    </section>
  );
}
