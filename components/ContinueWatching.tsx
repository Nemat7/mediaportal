"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

interface HistoryEntry {
  id: number;
  video: {
    id: number;
    title: string;
    thumbnail: string | null;
    year: number;
    duration: string;
    quality: string;
  };
  progress: number;
  total_duration: number;
  progress_percent: number;
  is_finished: boolean;
}

export default function ContinueWatching() {
  const { token, user } = useAuth();
  const [items, setItems] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    if (!token) { setItems([]); return; }
    fetch(`${API}/auth/history/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const results: HistoryEntry[] = data.results ?? data;
        setItems(results.filter(i => !i.is_finished && i.progress > 0).slice(0, 10));
      })
      .catch(() => {});
  }, [token]);

  if (!user || items.length === 0) return null;

  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--text-primary)", marginBottom: 14, letterSpacing: "-0.02em" }}>
        Продолжить просмотр
      </h2>
      <div className="scrollbar-hide" style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4 }}>
        {items.map(entry => {
          const pct = entry.total_duration > 0
            ? Math.round((entry.progress / entry.total_duration) * 100)
            : entry.progress_percent;
          return (
            <Link
              key={entry.id}
              href={`/watch/${entry.video.id}`}
              style={{ textDecoration: "none", flexShrink: 0, width: 150 }}
            >
              <div style={{ position: "relative", width: 150, aspectRatio: "2/3", borderRadius: 10, overflow: "hidden", background: "var(--bg-card)" }}>
                {entry.video.thumbnail && (
                  <Image
                    src={entry.video.thumbnail}
                    alt={entry.video.title}
                    fill
                    className="object-cover"
                    unoptimized
                    sizes="150px"
                  />
                )}
                {/* Red progress bar at bottom */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "rgba(255,255,255,0.15)" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: "var(--primary)" }}/>
                </div>
                {/* Quality badge */}
                {entry.video.quality && (
                  <span style={{ position: "absolute", top: 7, right: 7, fontSize: 9, fontWeight: 800, background: "rgba(0,0,0,0.65)", color: "#fff", padding: "2px 5px", borderRadius: 4, letterSpacing: "0.5px" }}>
                    {entry.video.quality}
                  </span>
                )}
                {/* Resume icon overlay */}
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "opacity 0.2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "0"; }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(229,9,20,0.85)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", marginTop: 6, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, lineHeight: 1.4 }}>
                {entry.video.title}
              </p>
              <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{pct}% просмотрено</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
