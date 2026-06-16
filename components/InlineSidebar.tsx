"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function HomeIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>; }
function FireIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>; }
function StarIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>; }
function HeartIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>; }
function FilmIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>; }
function TvIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/></svg>; }
function SmileIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 13s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>; }
function ZapIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>; }
function MicIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/></svg>; }
function MusicIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>; }

const MENU = [
  { href: "/",          label: "Главная",    icon: <HomeIcon /> },
  { href: "/popular",   label: "Популярное", icon: <FireIcon /> },
  { href: "/new",       label: "Новинки",    icon: <StarIcon /> },
  { href: "/favorites", label: "Избранное",  icon: <HeartIcon /> },
];

const LIBRARY = [
  { href: "/kino",     label: "Кино",     slug: "kino",     icon: <FilmIcon /> },
  { href: "/serialy",  label: "Сериалы",  slug: "serialy",  icon: <TvIcon /> },
  { href: "/comedy",   label: "Комедия",  slug: "comedy",   icon: <SmileIcon /> },
  { href: "/boevik",   label: "Боевик",   slug: "boevik",   icon: <ZapIcon /> },
  { href: "/podcasts", label: "Подкасты", slug: "podcasts", icon: <MicIcon /> },
  { href: "/show",     label: "Шоу",      slug: "show",     icon: <TvIcon /> },
  { href: "/clips",    label: "Клипы",    slug: "clips",    icon: <MusicIcon /> },
];

export default function InlineSidebar() {
  const pathname = usePathname();

  const Item = ({ href, label, icon, count }: { href: string; label: string; icon: React.ReactNode; count?: number }) => {
    const active = pathname === href;
    return (
      <Link href={href} className="sb-link" style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "10px 14px", borderRadius: "var(--radius-md)",
        color: active ? "var(--primary)" : "var(--text-secondary)",
        textDecoration: "none", fontSize: 14, fontWeight: active ? 600 : 500,
        background: active ? "linear-gradient(135deg, rgba(230,57,70,0.1), rgba(230,57,70,0.05))" : "transparent",
        marginBottom: 2, transition: "background 0.2s, color 0.2s",
      }}>
        <span style={{ color: active ? "var(--primary)" : "var(--text-muted)", flexShrink: 0 }}>{icon}</span>
        <span style={{ flex: 1 }}>{label}</span>
        {count !== undefined && (
          <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 600 }}>{count}</span>
        )}
      </Link>
    );
  };

  return (
    <aside style={{ position: "sticky", top: 120, height: "calc(100vh - 140px)", overflowY: "auto" }} className="scrollbar-hide">
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "1.5px", color: "var(--text-muted)", marginBottom: 14, paddingLeft: 14 }}>
          Меню
        </div>
        {MENU.map(item => <Item key={item.href} href={item.href} label={item.label} icon={item.icon} />)}
      </div>

      <div style={{ height: 1, background: "var(--border)", margin: "0 14px 20px" }} />

      <div>
        <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase" as const, letterSpacing: "1.5px", color: "var(--text-muted)", marginBottom: 14, paddingLeft: 14 }}>
          Библиотека
        </div>
        {LIBRARY.map(item => (
          <Item key={item.href} href={item.href} label={item.label} icon={item.icon} />
        ))}
      </div>
    </aside>
  );
}
