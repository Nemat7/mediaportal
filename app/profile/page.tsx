"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export default function ProfilePage() {
  const { user, token, logout, loading } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };
    Promise.all([
      fetch(`${API}/auth/history/`, { headers }).then(r => r.json()),
      fetch(`${API}/auth/favorites/`, { headers }).then(r => r.json()),
    ]).then(([hist, favs]) => {
      setHistory(hist.results || hist);
      setFavorites(favs.results || favs);
    }).catch(() => {});
  }, [token]);

  if (loading || !user) return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "var(--text-muted)" }}>Загрузка...</p>
    </div>
  );

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 80px" }}>

      {/* Profile header */}
      <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 48, padding: 32, background: "var(--bg-card)", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-sm)" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, var(--primary), var(--primary-dark))", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {user.avatar_url ? (
            <Image src={user.avatar_url} alt={user.username} width={80} height={80} style={{ borderRadius: "50%", objectFit: "cover" }} />
          ) : (
            <span style={{ fontSize: 32, fontWeight: 900, color: "white" }}>{user.username[0].toUpperCase()}</span>
          )}
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>
            {user.first_name || user.username}
            {user.is_premium && <span style={{ marginLeft: 10, fontSize: 12, background: "linear-gradient(135deg, #f59e0b, #d97706)", color: "white", padding: "2px 10px", borderRadius: 100, fontWeight: 700, verticalAlign: "middle" }}>PREMIUM</span>}
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 2 }}>{user.email}</p>
          {user.bio && <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 6 }}>{user.bio}</p>}
        </div>
        <button onClick={logout} style={{ padding: "10px 20px", borderRadius: "var(--radius-md)", border: "2px solid var(--border)", background: "transparent", color: "var(--text-secondary)", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}>
          Выйти
        </button>
      </div>

      {/* Continue watching */}
      {history.length > 0 && (
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", marginBottom: 20 }}>Продолжить просмотр</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {history.map((h: any) => (
              <Link key={h.id} href={`/watch/${h.video.id}`} style={{ display: "flex", gap: 16, textDecoration: "none", background: "var(--bg-card)", borderRadius: "var(--radius-lg)", padding: 16, boxShadow: "var(--shadow-sm)", alignItems: "center" }}>
                <div style={{ position: "relative", width: 120, flexShrink: 0 }}>
                  <div style={{ aspectRatio: "16/9", borderRadius: "var(--radius-sm)", overflow: "hidden", background: "var(--bg-hover)" }}>
                    <img src={h.video.thumbnail} alt={h.video.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ height: 3, background: "var(--border)", borderRadius: 2, marginTop: 6 }}>
                    <div style={{ width: `${h.progress_percent}%`, height: "100%", background: "var(--primary)", borderRadius: 2 }} />
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 4 }}>{h.video.title}</p>
                  <p style={{ fontSize: 12, color: "var(--text-muted)" }}>Осталось {Math.ceil(h.remaining_seconds / 60)} мин</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Favorites */}
      <section>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "var(--text-primary)", marginBottom: 20 }}>
          Избранное <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-muted)" }}>({favorites.length})</span>
        </h2>
        {favorites.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-muted)" }}>
            <p style={{ fontSize: 14 }}>Ещё ничего не добавлено</p>
            <Link href="/" style={{ display: "inline-block", marginTop: 16, color: "var(--primary)", fontWeight: 600, textDecoration: "none", fontSize: 14 }}>Перейти на главную →</Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 16 }}>
            {favorites.map((f: any) => (
              <Link key={f.id} href={`/watch/${f.video.id}`} style={{ textDecoration: "none" }}>
                <div style={{ position: "relative", aspectRatio: "2/3", borderRadius: "var(--radius-md)", overflow: "hidden", background: "var(--bg-hover)" }}>
                  <img src={f.video.thumbnail} alt={f.video.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%)" }} />
                  <div style={{ position: "absolute", bottom: 8, left: 8, right: 8 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: "white", textTransform: "uppercase" }}>{f.video.title}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
