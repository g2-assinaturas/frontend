"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { getCurrentSubscription } from '../lib/api';

let cachedSubscription: any = undefined;
let inflight: Promise<any> | null = null;

interface Options {
  auto?: boolean;
  pollPendingMs?: number; 
  backoffFactor?: number; 
  maxIntervalMs?: number; 
  maxAttempts?: number;   
  pollUntilStatuses?: string[]; 
}

export function useSubscription(options: Options = { auto: true }) {
  const auto = options.auto !== undefined ? options.auto : true;
  const initialInterval = options.pollPendingMs ?? 4000;
  const backoffFactor = options.backoffFactor ?? 1.5;
  const maxIntervalMs = options.maxIntervalMs ?? 30000;
  const maxAttempts = options.maxAttempts ?? 12; 
  const pollUntilStatuses = useMemo(() => options.pollUntilStatuses ?? ['ACTIVE','CANCELED','INACTIVE','EXPIRED'], [options.pollUntilStatuses]);
  const [subscription, setSubscription] = useState<any>(cachedSubscription);
  const [loading, setLoading] = useState<boolean>(!!(auto && !cachedSubscription));
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<number | null>(null);
  const attemptsRef = useRef<number>(0);
  const intervalRef = useRef<number>(initialInterval);
  const manualStopRef = useRef<boolean>(false);

  const fetchSub = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!inflight) inflight = getCurrentSubscription();
      const data = await inflight;
      cachedSubscription = data ?? null;
      setSubscription(cachedSubscription);
    } catch (err: any) {
      setError(err?.message || 'Failed to load subscription');
      cachedSubscription = null;
      setSubscription(null);
    } finally {
      inflight = null;
      setLoading(false);
    }
  }, []);

  useEffect(() => { if (auto && !cachedSubscription) fetchSub(); }, [auto, fetchSub]);

 
  useEffect(() => {
    if (!initialInterval || initialInterval <= 0) return;
    if (manualStopRef.current) return;
    const status = subscription?.status;
    const shouldStop = status && pollUntilStatuses.includes(status) && status !== 'PENDING';
    if (shouldStop) {
      if (pollRef.current) { clearTimeout(pollRef.current); pollRef.current = null; }
      return;
    }
    if (status === 'PENDING') {
      if (attemptsRef.current >= maxAttempts) {
        manualStopRef.current = true;
        return;
      }
      pollRef.current = window.setTimeout(() => {
        attemptsRef.current += 1;
        intervalRef.current = Math.min(Math.round(intervalRef.current * backoffFactor), maxIntervalMs);
        fetchSub();
      }, intervalRef.current);
    } else {
      
      attemptsRef.current = 0;
      intervalRef.current = initialInterval;
      if (pollRef.current) { clearTimeout(pollRef.current); pollRef.current = null; }
    }
    return () => { if (pollRef.current) { clearTimeout(pollRef.current); } };
  }, [subscription, fetchSub, initialInterval, backoffFactor, maxIntervalMs, maxAttempts, pollUntilStatuses]);

  const refresh = useCallback(() => {
    
    attemptsRef.current = 0; intervalRef.current = initialInterval; manualStopRef.current = false;
    return fetchSub();
  }, [fetchSub, initialInterval]);

  return { subscription, loading, error, refresh };
}
