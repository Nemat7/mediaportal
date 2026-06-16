"use client";

export default function Footer() {
  return (
    <footer style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border)", padding: "48px 24px 24px", marginTop: 40 }}>
      <div className="footer-cols">
        {[
          { title: "О нас",       links: ["О компании", "Карьера", "Пресса", "Блог"] },
          { title: "Поддержка",   links: ["Помощь", "Безопасность", "Условия", "Конфиденциальность"] },
          { title: "Сообщество",  links: ["Правила", "Авторам", "Реклама", "Разработчикам"] },
          { title: "Ещё",         links: ["Подписка", "Мобильное приложение", "Партнёрам", "Контакты"] },
        ].map(col => (
          <div key={col.title}>
            <h4 style={{ fontSize: 14, fontWeight: 800, marginBottom: 16, color: "var(--text-primary)" }}>{col.title}</h4>
            {col.links.map(l => (
              <a key={l} href="#" style={{ display: "block", color: "var(--text-secondary)", textDecoration: "none", fontSize: 13, marginBottom: 10, transition: "color 0.2s" }}
                 onMouseEnter={e => (e.currentTarget.style.color = "var(--primary)")}
                 onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}>
                {l}
              </a>
            ))}
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 1400, margin: "0 auto", paddingTop: 24, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", gap: 12 }}>
          {[["F", "Facebook"], ["T", "Twitter"], ["I", "Instagram"], ["Y", "YouTube"]].map(([letter, name]) => (
            <a key={name} href="#" aria-label={name} style={{
              width: 36, height: 36, borderRadius: "50%", background: "var(--bg-hover)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--text-secondary)", textDecoration: "none", fontSize: 13, fontWeight: 700,
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "var(--primary)"; el.style.color = "#fff"; el.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "var(--bg-hover)"; el.style.color = "var(--text-secondary)"; el.style.transform = "translateY(0)"; }}>
              {letter}
            </a>
          ))}
        </div>
        <span style={{ fontSize: 15, fontWeight: 900, color: "var(--primary)" }}>Tajflix</span>
        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>© 2024 Tajflix. Все права защищены.</p>
      </div>
    </footer>
  );
}
