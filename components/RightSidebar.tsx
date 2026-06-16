"use client";

import Image from "next/image";
import Link from "next/link";
import { MediaItem, categories } from "@/lib/data";

export default function RightSidebar({ items }: { items: MediaItem[] }) {
  const trending = [...items]
    .sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
    .slice(0, 5);

  return (
    <aside style={{ position: "sticky", top: 120, height: "calc(100vh - 140px)", overflowY: "auto" }} className="scrollbar-hide">
      {/* Trending */}
      <div style={{
        background: "linear-gradient(135deg, #fff5f5, #fff)",
        border: "1px solid #ffe0e0",
        borderRadius: "var(--radius-lg)",
        padding: 20, marginBottom: 24,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, display: "flex", alignItems: "center", gap: 8 }}>
            <span>📈</span> В тренде
          </h3>
          <Link href="/popular" style={{ fontSize: 12, color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>
            Все
          </Link>
        </div>
        {trending.map((item, i) => (
          <Link
            key={item.id}
            href={`/watch/${item.id}`}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "10px 0",
              borderBottom: i < 4 ? "1px solid var(--border)" : "none",
              textDecoration: "none", color: "inherit",
              transition: "transform 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "translateX(4px)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "translateX(0)"}
          >
            <span style={{
              fontSize: 20, fontWeight: 900,
              color: i < 3 ? "var(--primary)" : "var(--primary-light)",
              width: 28, textAlign: "center" as const, flexShrink: 0,
            }}>
              {i + 1}
            </span>
            <div style={{ position: "relative", width: 64, height: 36, borderRadius: "var(--radius-sm)", overflow: "hidden", flexShrink: 0 }}>
              <Image src={item.thumbnail} alt={item.title} fill className="object-cover" unoptimized />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const, marginBottom: 2 }}>
                {item.title}
              </p>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>★ {item.rating} · {item.year}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Promo */}
      <div style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-dark))", borderRadius: "var(--radius-lg)", padding: 24, color: "white", textAlign: "center" as const }}>
        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>🎬 Смотрите всё</h3>
        <p style={{ fontSize: 13, opacity: 0.9, marginBottom: 16, lineHeight: 1.5 }}>
          Тысячи фильмов и сериалов для всей семьи
        </p>
        <button style={{
          width: "100%", padding: 12, background: "white", color: "var(--primary)",
          border: "none", borderRadius: "var(--radius-sm)", fontSize: 13, fontWeight: 700,
          cursor: "pointer", fontFamily: "inherit", transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.2)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
        >
          Начать бесплатно
        </button>
      </div>
    </aside>
  );
}
