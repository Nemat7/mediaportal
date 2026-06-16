"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 8, letterSpacing: "-0.02em" }}>
        Что-то пошло не так
      </h2>
      <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 28, maxWidth: 360, lineHeight: 1.6 }}>
        Не удалось загрузить данные. Проверьте соединение или попробуйте позже.
      </p>
      <button
        onClick={reset}
        style={{ padding: "12px 28px", borderRadius: 100, fontSize: 14, fontWeight: 700, cursor: "pointer", border: "none", background: "var(--primary)", color: "white", fontFamily: "inherit", transition: "opacity 0.2s" }}
        onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
      >
        Попробовать снова
      </button>
    </div>
  );
}
