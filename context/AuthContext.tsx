"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  bio: string;
  avatar_url: string | null;
  is_premium: boolean;
  is_email_verified: boolean;
  date_joined: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  favoriteIds: number[];
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  toggleFavorite: (videoId: number) => Promise<void>;
  isFavorite: (videoId: number) => boolean;
  updateProgress: (videoId: number, progress: number, total: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("tajflix_access");
    if (saved) {
      setToken(saved);
      fetchMe(saved);
      fetchFavoriteIds(saved);
    } else {
      setLoading(false);
    }
  }, []);

  async function fetchMe(accessToken: string) {
    try {
      const res = await fetch(`${API}/auth/me/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) {
        setUser(await res.json());
      } else {
        // Token expired — try refresh
        await refreshToken();
      }
    } finally {
      setLoading(false);
    }
  }

  async function fetchFavoriteIds(accessToken: string) {
    try {
      const res = await fetch(`${API}/auth/me/favorite-ids/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.ok) setFavoriteIds(await res.json());
    } catch { /* silent */ }
  }

  async function refreshToken() {
    const refresh = localStorage.getItem("tajflix_refresh");
    if (!refresh) { setLoading(false); return; }
    try {
      const res = await fetch(`${API}/auth/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("tajflix_access", data.access);
        setToken(data.access);
        await fetchMe(data.access);
      } else {
        clearSession();
      }
    } catch {
      clearSession();
    }
  }

  function clearSession() {
    localStorage.removeItem("tajflix_access");
    localStorage.removeItem("tajflix_refresh");
    setToken(null);
    setUser(null);
    setFavoriteIds([]);
    setLoading(false);
  }

  async function login(email: string, password: string) {
    const res = await fetch(`${API}/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Ошибка входа");
    localStorage.setItem("tajflix_access", data.access);
    localStorage.setItem("tajflix_refresh", data.refresh);
    setToken(data.access);
    setUser(data.user);
    fetchFavoriteIds(data.access);
  }

  async function logout() {
    const refresh = localStorage.getItem("tajflix_refresh");
    if (token && refresh) {
      fetch(`${API}/auth/logout/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ refresh }),
      }).catch(() => {});
    }
    clearSession();
  }

  const toggleFavorite = useCallback(async (videoId: number) => {
    if (!token) return;
    const isFav = favoriteIds.includes(videoId);
    if (isFav) {
      setFavoriteIds((prev) => prev.filter((id) => id !== videoId));
      await fetch(`${API}/auth/favorites/${videoId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      setFavoriteIds((prev) => [...prev, videoId]);
      await fetch(`${API}/auth/favorites/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ video_id: videoId }),
      });
    }
  }, [token, favoriteIds]);

  const isFavorite = useCallback((videoId: number) => favoriteIds.includes(videoId), [favoriteIds]);

  const updateProgress = useCallback(async (videoId: number, progress: number, total: number) => {
    if (!token) return;
    fetch(`${API}/auth/history/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ video_id: videoId, progress, total_duration: total, is_finished: progress >= total * 0.95 }),
    }).catch(() => {});
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, favoriteIds, loading, login, logout, toggleFavorite, isFavorite, updateProgress }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
