"use client";
import { useEffect, useState, useCallback } from 'react';
import { getCurrentUser, logout } from '../lib/api';
import { clientLogoutCleanup } from '../lib/auth';


let cachedUser: any = undefined; 
let inflight: Promise<any> | null = null;

export function useAuth(options: { auto?: boolean } = { auto: true }) {
  const { auto = true } = options;
  const [user, setUser] = useState<any>(cachedUser);
  const [loading, setLoading] = useState<boolean>(!!auto && !cachedUser);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!inflight) {
        inflight = getCurrentUser();
      }
      const data = await inflight;
      cachedUser = data;
      setUser(data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load user');
      setUser(undefined);
      cachedUser = undefined;
    } finally {
      inflight = null;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (auto && !cachedUser) fetchUser();
  }, [auto, fetchUser]);

  const refresh = useCallback(() => fetchUser(), [fetchUser]);

  const signOut = useCallback(async () => {
    try { await logout(); } catch {}
    clientLogoutCleanup();
    cachedUser = undefined;
    setUser(undefined);
  }, []);

  return { user, loading, error, refresh, signOut, isAuthenticated: !!user };
}
