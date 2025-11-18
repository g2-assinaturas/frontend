'use client';
import React, { createContext, useEffect, useState } from 'react';

export type AuthContextType = {
  token: string | null;
  login: (t: string) => void;
  logout: () => void;
};


const DEFAULT_VALUE: AuthContextType = {
  token: null,
  login: () => {},
  logout: () => {},
};

export const AuthContext = createContext<AuthContextType>(DEFAULT_VALUE);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  });

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  const login = (t: string) => setToken(t);
  const logout = () => setToken(null);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}