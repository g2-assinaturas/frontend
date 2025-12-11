'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { superAdminLogin, superAdminProfile } from './api';
import type { SuperAdminUser } from './types';

export type SuperAdminContextValue = {
  token: string | null;
  user: SuperAdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const SuperAdminContext = createContext<SuperAdminContextValue | undefined>(undefined);

export function SuperAdminProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<SuperAdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('sa_token') : null;
    if (!saved) {
      setLoading(false);
      return;
    }

    setToken(saved);
    superAdminProfile(saved)
      .then((profile) => setUser(profile.user))
      .catch(() => {
        localStorage.removeItem('sa_token');
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const { accessToken, user: loggedUser } = await superAdminLogin(email, password);
      localStorage.setItem('sa_token', accessToken);
      setToken(accessToken);
      setUser(loggedUser);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('sa_token');
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ token, user, loading, login, logout }), [token, user, loading, login, logout]);

  return <SuperAdminContext.Provider value={value}>{children}</SuperAdminContext.Provider>;
}

export function useSuperAdmin() {
  const ctx = useContext(SuperAdminContext);
  if (!ctx) throw new Error('useSuperAdmin must be used within SuperAdminProvider');
  return ctx;
}
