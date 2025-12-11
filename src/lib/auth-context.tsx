'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { companyProfile, loginCompany } from './api';
import type { CompanyUser } from './types';

type AuthContextValue = {
  token: string | null;
  user: CompanyUser | null;
  loading: boolean;
  login: (emailOrCpf: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<CompanyUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!savedToken) {
      setLoading(false);
      return;
    }

    setToken(savedToken);
    companyProfile(savedToken)
      .then((res) => {
        const profileUser = res.user ?? null;
        setUser(profileUser);
      })
      .catch(() => {
        setToken(null);
        localStorage.removeItem('token');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (emailOrCpf: string, password: string) => {
    setLoading(true);
    try {
      const { accessToken, user: loggedUser } = await loginCompany(emailOrCpf, password);
      localStorage.setItem('token', accessToken);
      setToken(accessToken);
      setUser(loggedUser);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ token, user, loading, login, logout }),
    [token, user, loading, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
