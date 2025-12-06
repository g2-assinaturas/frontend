"use client";
import { useEffect, useState, useCallback } from 'react';
import { getSuperAdminProfile, logoutSuperAdmin } from '../lib/api';

let cachedSuperAdmin: any = undefined;
let inflight: Promise<any> | null = null;

export function useSuperAdminAuth(options: { auto?: boolean } = { auto: true }) {
  const { auto = true } = options;
  const [superAdmin, setSuperAdmin] = useState<any>(cachedSuperAdmin);
  const [loading, setLoading] = useState<boolean>(!!auto && !cachedSuperAdmin);
  const [error, setError] = useState<string | null>(null);

  const fetchSuperAdmin = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!inflight) {
        inflight = getSuperAdminProfile();
      }
      const data = await inflight;
      cachedSuperAdmin = data?.profile || data;
      setSuperAdmin(cachedSuperAdmin);
    } catch (err: any) {
      setError(err?.message || 'Failed to load super admin profile');
      setSuperAdmin(undefined);
      cachedSuperAdmin = undefined;
    } finally {
      inflight = null;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (auto && !cachedSuperAdmin) fetchSuperAdmin();
  }, [auto, fetchSuperAdmin]);

  const refresh = useCallback(() => fetchSuperAdmin(), [fetchSuperAdmin]);

  const signOut = useCallback(async () => {
    try {
      await logoutSuperAdmin();
    } catch {}
    cachedSuperAdmin = undefined;
    setSuperAdmin(undefined);
  }, []);

  return {
    superAdmin,
    loading,
    error,
    refresh,
    signOut,
    isAuthenticated: !!superAdmin,
  };
}
