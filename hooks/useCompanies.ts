"use client";
import { useEffect, useState, useCallback } from 'react';
import { listCompanies } from '../lib/api';

let cachedCompanies: any[] | null = null;
let inflight: Promise<any> | null = null;

export function useCompanies(options: { auto?: boolean } = { auto: true }) {
  const { auto = true } = options;
  const [companies, setCompanies] = useState<any[]>(cachedCompanies || []);
  const [loading, setLoading] = useState<boolean>(!!auto && !cachedCompanies);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!inflight) inflight = listCompanies();
      const response = await inflight;
      // Backend retorna { success: true, data: [...], meta: {...} }
      const data = response?.data || response;
      cachedCompanies = Array.isArray(data) ? data : [];
      setCompanies(cachedCompanies || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to load companies');
      cachedCompanies = [];
      setCompanies([]);
    } finally {
      inflight = null;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (auto && !cachedCompanies) fetchCompanies();
  }, [auto, fetchCompanies]);

  const refresh = useCallback(() => {
    cachedCompanies = null;
    return fetchCompanies();
  }, [fetchCompanies]);

  return { companies, loading, error, refresh };
}
