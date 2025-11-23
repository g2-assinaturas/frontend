"use client";
import React, { createContext, useContext, useCallback, useState, useEffect } from "react";
import { login as apiLogin, logout as apiLogout, getCurrentUser } from "../lib/api";
import { clientLogoutCleanup } from "../lib/auth";

interface AuthContextValue {
  user: any | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCurrentUser();
      setUser(data);
    } catch (err: any) {
      setUser(null);
      setError(err?.message || "Falha ao obter utilizador");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await apiLogin(email, password);
      await loadUser();
    } catch (err: any) {
      setError(err?.message || "Falha no login");
      setUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadUser]);

  const logout = useCallback(async () => {
    try { await apiLogout(); } catch {}
    clientLogoutCleanup();
    setUser(null);
  }, []);

  const refresh = useCallback(async () => {
    await loadUser();
  }, [loadUser]);

  const value: AuthContextValue = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    refresh,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext deve ser usado dentro de AuthProvider");
  return ctx;
}
