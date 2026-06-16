"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

type State = "loading" | "success" | "error";

export default function VerifyEmailPage({ params }: { params: Promise<{ token: string }> }) {
  const [state, setState] = useState<State>("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    params.then(({ token }) => {
      fetch(`${API}/auth/verify-email/${token}/`)
        .then(r => r.json().then(data => ({ ok: r.ok, data })))
        .then(({ ok, data }) => {
          if (ok) {
            setState("success");
            setMessage(data.detail || "Email подтверждён!");
          } else {
            setState("error");
            setMessage(data.detail || "Недействительная или устаревшая ссылка.");
          }
        })
        .catch(() => {
          setState("error");
          setMessage("Ошибка соединения. Попробуйте позже.");
        });
    });
  }, [params]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", background: "var(--bg)" }}>
      <div style={{ width: "100%", maxWidth: 400, textAlign: "center" }}>

        {state === "loading" && (
          <>
            <div style={{ width: 56, height: 56, borderRadius: "50%", border: "3px solid var(--border)", borderTopColor: "var(--primary)", animation: "spin 0.8s linear infinite", margin: "0 auto 24px" }} />
            <p style={{ fontSize: 16, color: "var(--text-secondary)" }}>Проверяем ссылку...</p>
          </>
        )}

        {state === "success" && (
          <>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(34,197,94,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 10, letterSpacing: "-0.02em" }}>Email подтверждён!</h1>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 28, lineHeight: 1.6 }}>{message}</p>
            <Link href="/login" style={{ display: "inline-block", padding: "12px 32px", borderRadius: 100, background: "var(--primary)", color: "white", fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
              Войти в аккаунт
            </Link>
          </>
        )}

        {state === "error" && (
          <>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(239,68,68,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 10, letterSpacing: "-0.02em" }}>Ссылка недействительна</h1>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 28, lineHeight: 1.6 }}>{message}</p>
            <Link href="/login" style={{ display: "inline-block", padding: "12px 32px", borderRadius: 100, border: "2px solid var(--border)", color: "var(--text-primary)", fontWeight: 600, fontSize: 14, textDecoration: "none", marginRight: 12 }}>
              На главную
            </Link>
          </>
        )}

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
