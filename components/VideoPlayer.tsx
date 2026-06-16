"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
const BUNNY_LIBRARY_ID = process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID || "";

function parseDuration(duration: string): number {
  const hms = duration.match(/^(\d+):(\d+):(\d+)$/);
  if (hms) return +hms[1] * 3600 + +hms[2] * 60 + +hms[3];
  const ms = duration.match(/^(\d+):(\d+)$/);
  if (ms) return +ms[1] * 60 + +ms[2];
  const h = duration.match(/(\d+)\s*[чh]/i);
  const m = duration.match(/(\d+)\s*[мm]/i);
  const sec = (h ? +h[1] * 3600 : 0) + (m ? +m[1] * 60 : 0);
  return sec > 0 ? sec : 7200;
}

function fmtTime(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  return h > 0
    ? `${h}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`
    : `${m}:${String(sec).padStart(2, "0")}`;
}

export default function VideoPlayer({ videoId, backdrop, title, duration, bunnyVideoId }: {
  videoId: string;
  backdrop: string;
  title: string;
  duration: string;
  bunnyVideoId?: string;
}) {
  const { user, token, updateProgress } = useAuth();
  const total = parseDuration(duration);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const elapsedRef = useRef(0);
  const totalRef = useRef(total);

  useEffect(() => { elapsedRef.current = elapsed; }, [elapsed]);
  useEffect(() => { totalRef.current = total; }, [total]);

  // Restore saved progress on mount
  useEffect(() => {
    if (!token) return;
    fetch(`${API}/auth/history/`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        const results = data.results ?? data;
        const entry = results.find((h: { video_id: number; progress: number }) => String(h.video_id) === videoId);
        if (entry && entry.progress > 0) setElapsed(entry.progress);
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, videoId]);

  // Listen for Bunny player postMessage events (timeupdate, play, pause, ended)
  useEffect(() => {
    if (!bunnyVideoId) return;
    function handleMessage(e: MessageEvent) {
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (data.event === "timeupdate" && typeof data.seconds === "number") {
          const s = Math.floor(data.seconds);
          setElapsed(s);
          elapsedRef.current = s;
          if (data.duration) totalRef.current = Math.floor(data.duration);
        }
        if (data.event === "play") setIsPlaying(true);
        if (data.event === "pause" || data.event === "ended") setIsPlaying(false);
      } catch {}
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [bunnyVideoId]);

  // Save progress every 15s while playing (both Bunny and fake player)
  useEffect(() => {
    if (!isPlaying || !user) return;
    const id = setInterval(() => {
      updateProgress(Number(videoId), elapsedRef.current, totalRef.current);
    }, 15000);
    return () => clearInterval(id);
  }, [isPlaying, user, updateProgress, videoId]);

  // Save on unmount
  useEffect(() => {
    return () => {
      if (elapsedRef.current > 0) {
        updateProgress(Number(videoId), elapsedRef.current, totalRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Real Bunny Player ─────────────────────────────────────────────────────────
  if (bunnyVideoId && BUNNY_LIBRARY_ID) {
    return (
      <div style={{ position: "relative", width: "100%", background: "#000", aspectRatio: "16/9", maxHeight: 540 }}>
        <iframe
          src={`https://iframe.mediadelivery.net/embed/${BUNNY_LIBRARY_ID}/${bunnyVideoId}?autoplay=false&loop=false&muted=false&preload=true&responsive=true`}
          style={{ width: "100%", height: "100%", border: "none", display: "block" }}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          title={title}
          loading="lazy"
        />
      </div>
    );
  }

  // ── Fake Player (no Bunny video attached yet) ─────────────────────────────────
  const progress = total > 0 ? elapsed / total : 0;

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    setElapsed(Math.floor(ratio * total));
  }

  return (
    <div style={{ position: "relative", width: "100%", background: "#0f1728", aspectRatio: "16/9", maxHeight: 480 }}>
      <Image
        src={backdrop}
        alt={title}
        fill
        className="object-cover"
        style={{ opacity: isPlaying ? 0.15 : 0.4, transition: "opacity 0.3s" }}
        unoptimized
        priority
      />

      {/* Big play overlay when paused */}
      {!isPlaying && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <button
            onClick={() => setIsPlaying(true)}
            style={{ width: 72, height: 72, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.5)", background: "rgba(229,9,20,0.85)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.15s, background 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.background = "rgba(229,9,20,1)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.background = "rgba(229,9,20,0.85)"; }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
          </button>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
            {elapsed > 0 ? `Продолжить с ${fmtTime(elapsed)}` : "Видео скоро будет добавлено"}
          </p>
        </div>
      )}

      {/* Tick timer for fake player */}
      {isPlaying && <FakePlayerTicker total={total} setElapsed={setElapsed} setIsPlaying={setIsPlaying} />}

      {/* Controls bar */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px 20px", background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)" }}>
        <div
          onClick={seek}
          style={{ height: 4, background: "rgba(255,255,255,0.2)", borderRadius: 2, cursor: "pointer", marginBottom: 8, position: "relative" }}
        >
          <div style={{ width: `${progress * 100}%`, height: "100%", background: "var(--accent)", borderRadius: 2, position: "relative", transition: elapsed > 0 ? "width 0.9s linear" : "none" }}>
            <div style={{ position: "absolute", right: -5, top: "50%", transform: "translateY(-50%)", width: 12, height: 12, borderRadius: "50%", background: "#fff" }} />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button onClick={() => setIsPlaying(p => !p)} style={{ background: "none", border: "none", color: "#fff", cursor: "pointer", padding: 0 }}>
              {isPlaying
                ? <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                : <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z"/></svg>
              }
            </button>
            <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: "monospace" }}>
              {fmtTime(elapsed)} / {fmtTime(total)}
            </span>
            <button style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer", padding: 0 }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
              </svg>
            </button>
          </div>
          <button style={{ background: "none", border: "none", color: "rgba(255,255,255,0.7)", cursor: "pointer", padding: 0 }}>
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function FakePlayerTicker({ total, setElapsed, setIsPlaying }: {
  total: number;
  setElapsed: React.Dispatch<React.SetStateAction<number>>;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  useEffect(() => {
    const tick = setInterval(() => {
      setElapsed(prev => {
        const next = Math.min(prev + 1, total);
        if (next >= total) setIsPlaying(false);
        return next;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, [total, setElapsed, setIsPlaying]);
  return null;
}
