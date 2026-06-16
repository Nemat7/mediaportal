"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import VideoCard from "@/components/VideoCard";
import { useAuth } from "@/context/AuthContext";
import { MediaItem } from "@/lib/data";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export default function FavoritesPage() {
  const { token, user, loading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!token) return;
    fetch(`${API}/auth/favorites/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        const favs = (data.results || data).map((f: any) => ({
          id:          String(f.video.id),
          title:       f.video.title,
          description: f.video.description,
          year:        f.video.year,
          rating:      f.video.rating,
          duration:    f.video.duration,
          quality:     f.video.quality,
          category:    f.video.category?.slug ?? "",
          tags:        (f.video.tags || []).map((t: any) => t.name),
          thumbnail:   f.video.thumbnail ?? "",
          backdrop:    f.video.backdrop  ?? "",
          studio:      f.video.studio,
          isNew:       f.video.is_new,
          isPopular:   f.video.is_popular,
        }));
        setItems(favs);
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [token]);

  if (loading || fetching) return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "var(--text-muted)" }}>Загрузка...</p>
    </div>
  );

  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 32px 80px" }}>
      <h1 style={{ fontSize: 28, fontWeight: 900, color: "var(--text-primary)", marginBottom: 8 }}>Избранное</h1>
      <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 32 }}>{items.length} видео</p>
      {items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)" }}>
          <p style={{ fontSize: 14 }}>Вы ещё ничего не добавили в избранное</p>
          <Link href="/" style={{ display: "inline-block", marginTop: 16, color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>На главную →</Link>
        </div>
      ) : (
        <div className="card-grid">
          {items.map(item => <VideoCard key={item.id} item={item} />)}
        </div>
      )}
    </div>
  );
}
