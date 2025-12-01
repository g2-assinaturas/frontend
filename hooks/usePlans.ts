"use client";
import { useEffect, useState, useCallback } from 'react';
import { getPlans } from '../lib/api';

let cachedPlans: any[] | null = null;
let inflight: Promise<any> | null = null;

export function usePlans(options: { auto?: boolean } = { auto: true }) {
  const { auto = true } = options;
  const [plans, setPlans] = useState<any[]>(cachedPlans || []);
  const [loading, setLoading] = useState<boolean>(!!auto && !cachedPlans);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!inflight) inflight = getPlans();
      const data = await inflight;
      cachedPlans = Array.isArray(data) ? data : [];
      setPlans(cachedPlans || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to load plans');
      cachedPlans = [];
      setPlans([]);
    } finally {
      inflight = null;
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (auto && !cachedPlans) fetchPlans(); }, [auto, fetchPlans]);

  const refresh = useCallback(() => fetchPlans(), [fetchPlans]);

  return { plans, loading, error, refresh };
}
