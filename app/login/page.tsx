"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ошибка входа");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 16px" }}>
      <div style={{ width: "100%", maxWidth: 420, background: "var(--bg-card)", borderRadius: "var(--radius-xl)", padding: 40, boxShadow: "var(--shadow-lg)" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <p style={{ fontSize: 28, fontWeight: 900, color: "var(--primary)", letterSpacing: "-0.5px" }}>Tajflix</p>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 6 }}>Войдите в аккаунт</p>
        </div>

        {error && (
          <div style={{ background: "rgba(229,9,20,0.08)", border: "1px solid rgba(229,9,20,0.2)", borderRadius: "var(--radius-md)", padding: "12px 16px", marginBottom: 20, fontSize: 14, color: "var(--primary)" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>Email</label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)} required
              placeholder="your@email.com"
              style={{ width: "100%", padding: "12px 16px", border: "2px solid var(--border)", borderRadius: "var(--radius-md)", fontSize: 14, fontFamily: "inherit", color: "var(--text-primary)", background: "#f8f9fa", outline: "none", transition: "border-color 0.2s" }}
              onFocus={e => e.currentTarget.style.borderColor = "var(--primary-light)"}
              onBlur={e => e.currentTarget.style.borderColor = "var(--border)"}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>Пароль</label>
              <Link href="/reset-password" style={{ fontSize: 13, color: "var(--primary)", textDecoration: "none" }}>Забыли пароль?</Link>
            </div>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)} required
              placeholder="••••••••"
              style={{ width: "100%", padding: "12px 16px", border: "2px solid var(--border)", borderRadius: "var(--radius-md)", fontSize: 14, fontFamily: "inherit", color: "var(--text-primary)", background: "#f8f9fa", outline: "none", transition: "border-color 0.2s" }}
              onFocus={e => e.currentTarget.style.borderColor = "var(--primary-light)"}
              onBlur={e => e.currentTarget.style.borderColor = "var(--border)"}
            />
          </div>

          <button
            type="submit" disabled={loading}
            style={{ width: "100%", padding: "14px", borderRadius: "var(--radius-md)", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", border: "none", background: loading ? "var(--text-muted)" : "linear-gradient(135deg, var(--primary), var(--primary-dark))", color: "white", fontFamily: "inherit", transition: "opacity 0.2s" }}>
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "var(--text-secondary)" }}>
          Нет аккаунта?{" "}
          <Link href="/register" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
}
