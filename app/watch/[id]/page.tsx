import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { fetchVideoById, fetchRelated } from "@/lib/api";
import { getCategoryLabel } from "@/lib/data";
import WatchActions from "@/components/WatchActions";
import VideoPlayer from "@/components/VideoPlayer";

export default async function WatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await fetchVideoById(id);
  if (!item) notFound();

  const catSlug  = item.category;
  const catLabel = getCategoryLabel(catSlug);
  const related  = await fetchRelated(catSlug, id);

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>

      <VideoPlayer videoId={id} backdrop={item.backdrop} title={item.title} duration={item.duration} />

      {/* Content */}
      <div className="watch-content">

        {/* Main info */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16, fontSize: 12, color: "var(--text-muted)" }}>
            <Link href="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Главная</Link>
            <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
            <Link href={`/${catSlug}`} style={{ color: "var(--text-muted)", textDecoration: "none" }}>{catLabel}</Link>
            <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
            <span style={{ color: "var(--text-secondary)" }}>{item.title}</span>
          </div>

          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 10, color: "var(--text-primary)" }}>
            {item.title}
          </h1>

          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, marginBottom: 14, fontSize: 13 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#e8a000", fontWeight: 700 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#e8a000"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              {item.rating}
            </span>
            <span style={{ color: "var(--border)" }}>|</span>
            <span style={{ color: "var(--text-secondary)" }}>{item.year}</span>
            <span style={{ color: "var(--border)" }}>|</span>
            <span style={{ color: "var(--text-secondary)" }}>{item.duration}</span>
            <span style={{ color: "var(--border)" }}>|</span>
            <Link href={`/${catSlug}`} style={{ color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>{catLabel}</Link>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            {item.tags.map(tag => (
              <span key={tag} style={{ fontSize: 12, padding: "4px 10px", borderRadius: 20, background: "var(--accent-light)", color: "var(--accent)", fontWeight: 600, border: "1px solid rgba(229,9,20,0.15)" }}>
                {tag}
              </span>
            ))}
          </div>

          <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 24, maxWidth: 540 }}>
            {item.description}
          </p>

          <WatchActions videoId={id} />
        </div>

        {/* Related sidebar */}
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)", marginBottom: 16, paddingBottom: 10, borderBottom: "1px solid var(--border)" }}>
            Похожее
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {related.map(rel => (
              <Link key={rel.id} href={`/watch/${rel.id}`} style={{ display: "flex", gap: 10, textDecoration: "none", color: "inherit" }}>
                <div style={{ position: "relative", width: 100, aspectRatio: "16/9", borderRadius: 6, overflow: "hidden", flexShrink: 0, background: "#e5e7eb" }}>
                  <Image src={rel.thumbnail} alt={rel.title} fill sizes="100px" className="object-cover" unoptimized />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.3, marginBottom: 3, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                    {rel.title}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--text-muted)" }}>{rel.year} · {rel.duration}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: 2 }}>
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="#e8a000"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 600 }}>{rel.rating}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
