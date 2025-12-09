"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from 'react';
import { getInvoices } from '../lib/api';

let cachedInvoices: any[] | null = null;
let inflight: Promise<any> | null = null;

export function useInvoices(options: { auto?: boolean } = { auto: true }) {
  const { auto = true } = options;
  const [invoices, setInvoices] = useState<any[]>(cachedInvoices || []);
  const [loading, setLoading] = useState<boolean>(!!auto && !cachedInvoices);
  const [error, setError] = useState<string | null>(null);

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!inflight) inflight = getInvoices();
      const data = await inflight;
      cachedInvoices = Array.isArray(data) ? data : [];
      setInvoices(cachedInvoices || []);
    } catch (err: any) {
      setError(err?.message || 'Failed to load invoices');
      cachedInvoices = [];
      setInvoices([]);
    } finally {
      inflight = null;
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (auto && !cachedInvoices) fetchInvoices(); }, [auto, fetchInvoices]);

  const refresh = useCallback(() => fetchInvoices(), [fetchInvoices]);

  return { invoices, loading, error, refresh };
}
