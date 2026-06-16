"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function WatchActions({ videoId }: { videoId: string }) {
  const { user, isFavorite, toggleFavorite } = useAuth();
  const router = useRouter();
  const numId = Number(videoId);
  const fav = isFavorite(numId);

  function handleFavorite() {
    if (!user) { router.push("/login"); return; }
    toggleFavorite(numId);
  }

  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" as const }}>
      {/* Watch */}
      <button className="wp-watch-btn" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 24px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "background 0.15s" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
        Смотреть
      </button>

      {/* Favorite / В список */}
      <button
        onClick={handleFavorite}
        className="wp-outline-btn"
        style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "10px 20px",
          background: fav ? "rgba(230,57,70,0.08)" : "#fff",
          color: fav ? "var(--accent)" : "var(--text-primary)",
          border: fav ? "1.5px solid var(--accent)" : "1.5px solid var(--border)",
          borderRadius: 8, fontSize: 14, fontWeight: 600,
          cursor: "pointer", transition: "all 0.15s",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24"
          fill={fav ? "var(--accent)" : "none"}
          stroke={fav ? "var(--accent)" : "currentColor"}
          strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        {fav ? "В избранном" : "В список"}
      </button>

      {/* Share */}
      <button className="wp-outline-btn" style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", background: "#fff", color: "var(--text-primary)", border: "1.5px solid var(--border)", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "all 0.15s" }}>
        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
          <path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98"/>
        </svg>
        Поделиться
      </button>
    </div>
  );
}
