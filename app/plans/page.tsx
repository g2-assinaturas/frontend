"use client";
import React, { useEffect, useState } from 'react';
import { getPlans, checkoutSubscription, getCurrentSubscription } from '../../lib/api';
import Skeleton from '../../components/Skeleton';
import { useToast } from '../../components/toast/ToastProvider';
import PlanCard from '../../components/subscription/PlanCard';

type Plan = { id: string; name: string; price: number; currency?: string; description?: string; interval?: string };

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    let mounted = true;
    Promise.all([getPlans(), getCurrentSubscription()])
      .then(([plansRes, subRes]: any) => {
        if (!mounted) return;
        setPlans(plansRes || []);
        setCurrentPlanId(subRes?.plan?.id || null);
      })
      .catch((err) => { console.error(err); addToast({ type: 'error', message: 'Falha ao carregar planos.' }); })
      .finally(() => setInitialLoading(false));
    return () => { mounted = false; };
  }, []);

  async function handleSubscribe(planId: string) {
    setLoading(true);
    try {
      await checkoutSubscription(planId);
      addToast({ type: 'success', message: 'Assinatura iniciada.' });
    } catch (err: any) {
      addToast({ type: 'error', message: err?.message || 'Erro ao criar assinatura.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)] transition-colors">
      <main className="app-container py-10">
        <h1 className="mb-6 text-2xl font-semibold">Planos</h1>
        {initialLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        )}
        {!initialLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {plans.length === 0 && <p className="text-sm text-zinc-600 dark:text-zinc-300">Sem planos disponíveis.</p>}
            {plans.map((p) => (
              <PlanCard
                key={p.id}
                plan={p}
                current={p.id === currentPlanId}
                onSelect={(id) => handleSubscribe(id)}
                loading={loading}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
