"use client";
import React, { useEffect, useState } from 'react';
import { getPlans, checkoutSubscription, getCurrentSubscription } from '../../lib/api';
import Skeleton from '../../components/Skeleton';
import { useToast } from '../../components/toast/ToastProvider';
import PlanCard, { PlanDto } from '../../components/subscription/PlanCard';

/**
 * Planos fictícios para fallback
 */
const DEMO_PLANS: PlanDto[] = [
  {
    id: 'demo-basic',
    name: 'Básico',
    price: 4900, // R$ 49
    currency: 'BRL',
    interval: 'month',
    description: '1 instância WhatsApp\n500 mensagens/dia\nSuporte por email',
  },
  {
    id: 'demo-pro',
    name: 'Pro',
    price: 9900, // R$ 99
    currency: 'BRL',
    interval: 'month',
    description: '5 instâncias\n5000 mensagens/dia\nSuporte prioritário\nRelatórios avançados',
  },
  {
    id: 'demo-enterprise',
    name: 'Enterprise',
    price: 29900, // R$ 299
    currency: 'BRL',
    interval: 'month',
    description: 'Instâncias ilimitadas\nMensagens ilimitadas\nSuporte 24/7\nAPI dedicada',
  },
];

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
      <main className="app-container py-10 sm:py-16">
        <div className="mb-12 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-50">
            Planos de Assinatura
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Escolha o plano ideal para suas necessidades
          </p>
        </div>

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
