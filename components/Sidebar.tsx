"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/* ── icons ─────────────────────────────────────────────────────── */
const Icon = ({ name }: { name: string }) => {
  const paths: Record<string, React.ReactNode> = {
    home:   <><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></>,
    flame:  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>,
    new:    <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8M8 12h8"/></>,
    heart:  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>,
    film:   <><rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></>,
    tv:     <><rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/></>,
    smile:  <><circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></>,
    zap:    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
    mic:    <><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></>,
    star:   <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
    music:  <><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></>,
    search: <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    bell:   <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    user:   <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
  };
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
};

/* ── data ───────────────────────────────────────────────────────── */
const MENU = [
  { href: "/",         label: "Главная",    icon: "home" },
  { href: "/popular",  label: "Популярное", icon: "flame" },
  { href: "/new",      label: "Новое",      icon: "new" },
  { href: "/favorites",label: "Избранное",  icon: "heart" },
];

const LIBRARY = [
  { href: "/kino",     label: "Кино",     icon: "film",  slug: "kino" },
  { href: "/serialy",  label: "Сериалы",  icon: "tv",    slug: "serialy" },
  { href: "/comedy",   label: "Комедия",  icon: "smile", slug: "comedy" },
  { href: "/boevik",   label: "Боевик",   icon: "zap",   slug: "boevik" },
  { href: "/podcasts", label: "Подкасты", icon: "mic",   slug: "podcasts" },
  { href: "/show",     label: "Шоу",      icon: "star",  slug: "show" },
  { href: "/clips",    label: "Клипы",    icon: "music", slug: "clips" },
];

/* ── component ──────────────────────────────────────────────────── */
export default function Sidebar() {
  const pathname = usePathname();

  const Item = ({ href, label, icon, count }: { href: string; label: string; icon: string; count?: number }) => {
    const active = pathname === href;
    return (
      <Link href={href} style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 16px 10px 20px",
        borderRadius: 8,
        textDecoration: "none",
        borderLeft: active ? "3px solid var(--accent)" : "3px solid transparent",
        background: active ? "var(--sidebar-active-bg)" : "transparent",
        color: active ? "#ffffff" : "rgba(255,255,255,0.55)",
        fontSize: 14,
        fontWeight: active ? 600 : 400,
        transition: "all 0.15s ease",
        cursor: "pointer",
      }}
      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.color = "#fff"; }}
      onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.55)"; } }}
      >
        <span style={{ color: active ? "var(--accent)" : "inherit", flexShrink: 0 }}>
          <Icon name={icon} />
        </span>
        <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {label}
        </span>
        {count !== undefined && (
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontWeight: 500, fontVariantNumeric: "tabular-nums" }}>
            {count}
          </span>
        )}
      </Link>
    );
  };

  return (
    <aside style={{
      position: "fixed", top: 0, left: 0, bottom: 0,
      width: "var(--sidebar-w, 240px)",
      background: "var(--sidebar-bg, #0f1728)",
      display: "flex", flexDirection: "column",
      overflowY: "auto", overflowX: "hidden",
      zIndex: 40,
    }} className="scrollbar-hide">

      {/* Logo */}
      <Link href="/" style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "20px 20px 18px",
        textDecoration: "none",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        marginBottom: 8,
        flexShrink: 0,
      }}>
        {/* Play icon */}
        <div style={{
          width: 34, height: 34, borderRadius: 8,
          background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 2 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: "#fff", letterSpacing: "0.04em" }}>МЕДИА</span>
            <span style={{ fontSize: 15, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.04em" }}>ПОРТАЛ</span>
          </div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", marginTop: 1, letterSpacing: "0.06em" }}>
            СТРИМИНГ ДЛЯ ТАДЖИКИСТАНА
          </div>
        </div>
      </Link>

      {/* Search bar */}
      <div style={{ padding: "0 16px 16px" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "rgba(255,255,255,0.06)", borderRadius: 8,
          padding: "8px 12px", border: "1px solid rgba(255,255,255,0.08)",
        }}>
          <span style={{ color: "rgba(255,255,255,0.3)" }}><Icon name="search" /></span>
          <input placeholder="Поиск..." style={{
            background: "none", border: "none", outline: "none",
            color: "#fff", fontSize: 13, width: "100%",
          }} />
        </div>
      </div>

      {/* MENU section */}
      <div style={{ padding: "0 8px" }}>
        <div style={{ padding: "4px 12px 8px", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.25)", letterSpacing: "0.12em" }}>
          МЕНЮ
        </div>
        {MENU.map(item => <Item key={item.href} {...item} />)}
      </div>

      {/* LIBRARY section */}
      <div style={{ padding: "16px 8px 0", flex: 1 }}>
        <div style={{ padding: "4px 12px 8px", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.25)", letterSpacing: "0.12em" }}>
          БИБЛИОТЕКА
        </div>
        {LIBRARY.map(item => (
          <Item key={item.href} href={item.href} label={item.label} icon={item.icon} />
        ))}
      </div>

      {/* Bottom user section */}
      <div style={{ padding: "16px 8px", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 16 }}>
        <Link href="/login" style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "10px 16px", borderRadius: 8, textDecoration: "none",
          background: "var(--accent)", color: "#fff",
          fontSize: 13, fontWeight: 600, justifyContent: "center",
          transition: "background 0.15s ease",
        }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--accent-hover)"}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "var(--accent)"}
        >
          <Icon name="user" />
          Войти в аккаунт
        </Link>
      </div>
    </aside>
  );
}
