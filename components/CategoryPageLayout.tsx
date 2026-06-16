"use client";

import Link from "next/link";
import VideoCard from "./VideoCard";
import InlineSidebar from "./InlineSidebar";
import { MediaItem } from "@/lib/data";

type Props = { title: string; description?: string; items: MediaItem[] };

export default function CategoryPageLayout({ title, description, items }: Props) {
  return (
    <div className="cat-layout">
      <div className="cat-left"><InlineSidebar /></div>

      <main>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 20, fontSize: 12, color: "var(--text-muted)" }}>
          <Link href="/" style={{ color: "var(--text-muted)", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--primary)"}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"}>
            Главная
          </Link>
          <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
          <span>{title}</span>
        </div>

        <div style={{ marginBottom: 28, paddingBottom: 20, borderBottom: "1px solid var(--border)" }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 6 }}>{title}</h1>
          {description && <p style={{ fontSize: 14, color: "var(--text-secondary)", maxWidth: 500, lineHeight: 1.6 }}>{description}</p>}
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>{items.length} материалов</p>
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-muted)" }}>
            <p style={{ fontSize: 14 }}>Контент скоро появится</p>
          </div>
        ) : (
          <div className="card-grid">
            {items.map(item => <VideoCard key={item.id} item={item} />)}
          </div>
        )}
      </main>
    </div>
  );
}
