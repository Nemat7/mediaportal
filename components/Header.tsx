"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { label: "Главная",    href: "/" },
  { label: "Кино",       href: "/kino" },
  { label: "Сериалы",    href: "/serialy" },
  { label: "Комедия",    href: "/comedy" },
  { label: "Боевик",     href: "/boevik" },
  { label: "Подкасты",   href: "/podcasts" },
  { label: "Шоу",        href: "/show" },
  { label: "Клипы",      href: "/clips" },
  { label: "Новинки",    href: "/new" },
  { label: "Популярное", href: "/popular" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 1000,
      background: "#000000",
      borderBottom: "1px solid #1a1a1a",
    }}>
      {/* Top row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px", gap: 16 }}>
        <Link href="/" style={{
          display: "flex", alignItems: "center", gap: 10,
          fontSize: 22, fontWeight: 900, color: "var(--primary)",
          textDecoration: "none", letterSpacing: "-0.5px", flexShrink: 0,
        }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
          </svg>
          Tajflix
        </Link>

        {/* Search — hidden on mobile */}
        <form className="header-desktop-search" style={{ flex: 1, maxWidth: 520, position: "relative" }}
          onSubmit={e => { e.preventDefault(); const v = (e.currentTarget.querySelector("input") as HTMLInputElement).value.trim(); if (v) router.push(`/search?q=${encodeURIComponent(v)}`); }}>
          <svg width="16" height="16" fill="none" stroke="var(--text-muted)" strokeWidth="2" viewBox="0 0 24 24"
               style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Поиск фильмов, сериалов..."
            style={{
              width: "100%", padding: "11px 20px 11px 48px",
              border: "2px solid var(--border)", borderRadius: 100,
              background: "var(--bg-card)", fontSize: 14,
              fontFamily: "inherit", color: "var(--text-primary)", outline: "none",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onFocus={e => { e.currentTarget.style.borderColor = "var(--primary-light)"; e.currentTarget.style.boxShadow = "0 0 0 4px rgba(230,57,70,0.1)"; }}
            onBlur={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
          />
        </form>

        {/* Auth buttons — hidden on mobile */}
        <div className="header-desktop-actions" style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
          {loading ? (
            <div style={{ width: 90, height: 36, borderRadius: 100, background: "var(--bg-card)", opacity: 0.4 }} />
          ) : user ? (
            <Link href="/profile" style={{
              display: "flex", alignItems: "center", gap: 8, textDecoration: "none",
              padding: "6px 14px", borderRadius: 100, border: "2px solid var(--border)",
              color: "var(--text-primary)", fontSize: 13, fontWeight: 600,
            }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "linear-gradient(135deg, var(--primary), var(--primary-dark))", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 11, fontWeight: 900 }}>
                {user.username[0].toUpperCase()}
              </div>
              {user.first_name || user.username}
            </Link>
          ) : (
            <>
              <button onClick={() => router.push("/login")}
                style={{ padding: "10px 20px", borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: "pointer", border: "2px solid var(--border)", background: "transparent", color: "var(--text-secondary)", fontFamily: "inherit", transition: "border-color 0.2s, color 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--primary-light)"; e.currentTarget.style.color = "var(--primary)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}>
                Войти
              </button>
              <button onClick={() => router.push("/register")}
                style={{ padding: "10px 20px", borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: "pointer", border: "none", background: "linear-gradient(135deg, var(--primary), var(--primary-dark))", color: "white", fontFamily: "inherit", boxShadow: "0 4px 15px rgba(230,57,70,0.35)", transition: "transform 0.2s, box-shadow 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(230,57,70,0.45)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 15px rgba(230,57,70,0.35)"; }}>
                Подписка
              </button>
            </>
          )}
        </div>

        {/* Hamburger — mobile only */}
        <button
          className="header-hamburger"
          onClick={() => setMenuOpen(v => !v)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 6, color: "#ffffff", flexShrink: 0 }}
          aria-label="Меню"
        >
          {menuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
          )}
        </button>
      </div>

      {/* Nav pills — hidden on mobile */}
      <nav className="header-desktop-nav scrollbar-hide" style={{ display: "flex", alignItems: "center", gap: 4, padding: "0 24px 12px", overflowX: "auto" }}>
        {navLinks.map(link => {
          const active = pathname === link.href;
          return (
            <Link key={link.href} href={link.href} style={{
              padding: "8px 18px", borderRadius: 100, fontSize: 13, fontWeight: 600,
              textDecoration: "none", whiteSpace: "nowrap" as const,
              color: active ? "white" : "rgba(255,255,255,0.75)",
              background: active ? "linear-gradient(135deg, var(--primary), var(--primary-dark))" : "transparent",
              boxShadow: active ? "0 4px 12px rgba(230,57,70,0.3)" : "none",
              transition: "background 0.2s, color 0.2s",
            }}>
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0, zIndex: 999,
          background: "#000000",
          borderBottom: "1px solid #1a1a1a",
          padding: "12px 16px 20px",
        }}>
          <form style={{ position: "relative", marginBottom: 12 }}
            onSubmit={e => { e.preventDefault(); const v = (e.currentTarget.querySelector("input") as HTMLInputElement).value.trim(); if (v) { router.push(`/search?q=${encodeURIComponent(v)}`); setMenuOpen(false); } }}>
            <svg width="14" height="14" fill="none" stroke="var(--text-muted)" strokeWidth="2" viewBox="0 0 24 24"
                 style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input type="text" placeholder="Поиск..." style={{
              width: "100%", padding: "10px 16px 10px 38px",
              border: "2px solid var(--border)", borderRadius: 10,
              background: "#1a1a1a", fontSize: 14,
              fontFamily: "inherit", color: "#ffffff", outline: "none",
            }} />
          </form>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4 }}>
            {navLinks.map(link => {
              const active = pathname === link.href;
              return (
                <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} style={{
                  padding: "11px 14px", borderRadius: 10, fontSize: 14, fontWeight: 600,
                  textDecoration: "none",
                  color: active ? "var(--primary)" : "rgba(255,255,255,0.85)",
                  background: active ? "rgba(230,57,70,0.08)" : "transparent",
                }}>
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile auth — fix: onClick handlers + show user state */}
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
            {loading ? (
              <div style={{ height: 44, borderRadius: 10, background: "var(--bg-card)", opacity: 0.4 }} />
            ) : user ? (
              <Link href="/profile" onClick={() => setMenuOpen(false)}
                style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", padding: "10px 14px", borderRadius: 10, border: "1.5px solid var(--border)" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, var(--primary), var(--primary-dark))", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 13, fontWeight: 900, flexShrink: 0 }}>
                  {user.username[0].toUpperCase()}
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>{user.first_name || user.username}</p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", margin: 0 }}>{user.email}</p>
                </div>
              </Link>
            ) : (
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => { router.push("/login"); setMenuOpen(false); }}
                  style={{ flex: 1, padding: "11px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", border: "2px solid var(--border)", background: "transparent", color: "var(--text-secondary)", fontFamily: "inherit" }}>
                  Войти
                </button>
                <button
                  onClick={() => { router.push("/register"); setMenuOpen(false); }}
                  style={{ flex: 1, padding: "11px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", border: "none", background: "linear-gradient(135deg, var(--primary), var(--primary-dark))", color: "white", fontFamily: "inherit" }}>
                  Подписка
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
