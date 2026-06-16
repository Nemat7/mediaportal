export default function Loading() {
  return (
    <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px 24px" }}>
      {/* Hero skeleton */}
      <div style={{ width: "100%", height: 420, borderRadius: 16, background: "var(--bg-card)", animation: "pulse 1.5s ease-in-out infinite", marginBottom: 40 }} />

      {/* Row skeletons */}
      {[1, 2, 3].map(i => (
        <div key={i} style={{ marginBottom: 40 }}>
          <div style={{ width: 140, height: 22, borderRadius: 6, background: "var(--bg-card)", animation: "pulse 1.5s ease-in-out infinite", marginBottom: 16 }} />
          <div style={{ display: "flex", gap: 12 }}>
            {Array.from({ length: 6 }).map((_, j) => (
              <div key={j} style={{ flexShrink: 0, width: 150, aspectRatio: "2/3", borderRadius: 10, background: "var(--bg-card)", animation: "pulse 1.5s ease-in-out infinite" }} />
            ))}
          </div>
        </div>
      ))}
      <style>{`@keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:.75} }`}</style>
    </div>
  );
}
