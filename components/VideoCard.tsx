"use client";

import Link from "next/link";
import Image from "next/image";
import { MediaItem } from "@/lib/data";
import { useAuth } from "@/context/AuthContext";

const GENRE: Record<string, string> = {
  kino: "ФИЛЬМ", serialy: "СЕРИАЛ", comedy: "КОМЕДИЯ", boevik: "БОЕВИК",
  podcasts: "ПОДКАСТ", show: "ШОУ", clips: "КЛИП",
};

export default function VideoCard({ item }: { item: MediaItem }) {
  const { user, isFavorite, toggleFavorite } = useAuth();
  const videoId = Number(item.id);
  const fav = isFavorite(videoId);

  function handleFav(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (user) toggleFavorite(videoId);
  }

  return (
    <Link href={`/watch/${item.id}`} className="vc-link" style={{ display: "block", textDecoration: "none" }}>
      <div className="vc-card" style={{ position: "relative", aspectRatio: "2/3", borderRadius: 10, overflow: "hidden", background: "#1a1a1a", transition: "transform 0.25s cubic-bezier(0.4,0,0.2,1), box-shadow 0.25s" }}>
        <Image
          src={item.thumbnail} alt={item.title} fill sizes="180px"
          style={{ objectFit: "cover" }}
          unoptimized
        />

        {/* Gradient overlay */}
        <div className="vc-overlay" style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.35) 50%, transparent 100%)" }} />

        {/* Play button on hover */}
        <div className="vc-play" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%) scale(0.8)", width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "all 0.25s cubic-bezier(0.4,0,0.2,1)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="var(--primary)"><path d="M8 5v14l11-7z"/></svg>
        </div>

        {/* Favorite button */}
        {user && (
          <button onClick={handleFav} style={{
            position: "absolute", top: 8, left: 8,
            width: 30, height: 30, borderRadius: "50%",
            background: fav ? "var(--primary)" : "rgba(0,0,0,0.55)",
            border: fav ? "none" : "1.5px solid rgba(255,255,255,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "all 0.2s", backdropFilter: "blur(4px)",
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill={fav ? "white" : "none"} stroke="white" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        )}

        {/* Quality badge */}
        {item.quality && (
          <div style={{ position: "absolute", top: 8, right: 8, background: "var(--primary)", color: "white", fontSize: 9, fontWeight: 800, padding: "3px 7px", borderRadius: 4 }}>
            {item.quality}
          </div>
        )}

        {/* New badge */}
        {item.isNew && !user && (
          <div style={{ position: "absolute", top: 8, left: 8, background: "#4caf50", color: "white", fontSize: 9, fontWeight: 800, padding: "3px 8px", borderRadius: 4, letterSpacing: 0.8 }}>
            НОВИНКА
          </div>
        )}

        {/* Bottom text overlay */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "10px 10px 8px" }}>
          <p className="vc-title" style={{ fontSize: 12, fontWeight: 900, color: "white", textTransform: "uppercase" as const, letterSpacing: 0.3, lineHeight: 1.2, marginBottom: 5, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
            {item.title}
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 9, color: "#bbb", textTransform: "uppercase" as const, letterSpacing: 0.5 }}>
              {GENRE[item.category] ?? item.category.toUpperCase()}
            </span>
            <span style={{ fontSize: 10, color: "#ffc107", fontWeight: 700 }}>★ {item.rating}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
