"use client";

import { useState } from "react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export default function RegisterPage() {
  const [form, setForm] = useState({ email: "", username: "", password: "", password2: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (form.password !== form.password2) { setError("Пароли не совпадают"); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        const msgs = Object.values(data).flat().join(" ");
        throw new Error(msgs || "Ошибка регистрации");
      }
      setSuccess(data.detail);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = { width: "100%", padding: "12px 16px", border: "2px solid var(--border)", borderRadius: "var(--radius-md)", fontSize: 14, fontFamily: "inherit", color: "var(--text-primary)", background: "#f8f9fa", outline: "none", transition: "border-color 0.2s" };

  if (success) return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 16px" }}>
      <div style={{ textAlign: "center", maxWidth: 420 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>✉️</div>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", marginBottom: 12 }}>Проверьте почту</h2>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 24 }}>{success}</p>
        <Link href="/login" style={{ display: "inline-block", padding: "12px 32px", background: "linear-gradient(135deg, var(--primary), var(--primary-dark))", color: "white", borderRadius: "var(--radius-md)", fontWeight: 700, textDecoration: "none", fontSize: 14 }}>
          Войти
        </Link>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 16px" }}>
      <div style={{ width: "100%", maxWidth: 420, background: "var(--bg-card)", borderRadius: "var(--radius-xl)", padding: 40, boxShadow: "var(--shadow-lg)" }}>

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <p style={{ fontSize: 28, fontWeight: 900, color: "var(--primary)", letterSpacing: "-0.5px" }}>Tajflix</p>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", marginTop: 6 }}>Создайте аккаунт</p>
        </div>

        {error && (
          <div style={{ background: "rgba(229,9,20,0.08)", border: "1px solid rgba(229,9,20,0.2)", borderRadius: "var(--radius-md)", padding: "12px 16px", marginBottom: 20, fontSize: 14, color: "var(--primary)" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { key: "email",     label: "Email",             type: "email",    placeholder: "your@email.com" },
            { key: "username",  label: "Имя пользователя",  type: "text",     placeholder: "username" },
            { key: "password",  label: "Пароль",            type: "password", placeholder: "Минимум 8 символов" },
            { key: "password2", label: "Повторите пароль",  type: "password", placeholder: "••••••••" },
          ].map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>{label}</label>
              <input type={type} value={form[key as keyof typeof form]} onChange={set(key)}
                required placeholder={placeholder} style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = "var(--primary-light)"}
                onBlur={e => e.currentTarget.style.borderColor = "var(--border)"}
              />
            </div>
          ))}

          <button type="submit" disabled={loading} style={{ padding: "14px", borderRadius: "var(--radius-md)", fontSize: 15, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", border: "none", background: loading ? "var(--text-muted)" : "linear-gradient(135deg, var(--primary), var(--primary-dark))", color: "white", fontFamily: "inherit", marginTop: 8 }}>
            {loading ? "Создание аккаунта..." : "Зарегистрироваться"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: 14, color: "var(--text-secondary)" }}>
          Уже есть аккаунт?{" "}
          <Link href="/login" style={{ color: "var(--primary)", fontWeight: 600, textDecoration: "none" }}>Войти</Link>
        </p>
      </div>
    </div>
  );
}
