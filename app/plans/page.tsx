"use client";
import React, { useEffect, useState } from 'react';
import { getPlans, checkoutSubscription, getCurrentSubscription } from '../../lib/api';
import Skeleton from '../../components/Skeleton';
import { useToast } from '../../components/toast/ToastProvider';
import PlanCard, { PlanDto } from '../../components/subscription/PlanCard';

/**
 * Planos fictícios para fallback quando a API falha
 * Mantém a experiência visual mesmo sem dados reais
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
  const [isDemoMode, setIsDemoMode] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    let mounted = true;
    Promise.all([getPlans(), getCurrentSubscription()])
      .then(([plansRes, subRes]: any) => {
        if (!mounted) return;
        
        // Se não houver planos, usa os planos demo como fallback
        if (!plansRes || plansRes.length === 0) {
          setPlans(DEMO_PLANS);
          setIsDemoMode(true);
        } else {
          setPlans(plansRes);
          setIsDemoMode(false);
        }
        
        setCurrentPlanId(subRes?.plan?.id || null);
      })
      .catch((err) => {
        console.error(err);
        // Em caso de erro, usa os planos demo
        setPlans(DEMO_PLANS);
        setIsDemoMode(true);
        addToast({ type: 'info', message: 'Exibindo planos em modo demo.' });
      })
      .finally(() => setInitialLoading(false));
    return () => { mounted = false; };
  }, [addToast]);

  async function handleSubscribe(planId: string) {
    // Se estiver em modo demo, não permite subscrição
    if (isDemoMode) {
      addToast({ type: 'info', message: 'Planos fictícios - subscrição não disponível no modo demo.' });
      return;
    }

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
        {/* Header Section */}
        <div className="mb-12 space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-50">
            Planos de Assinatura
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Escolha o plano ideal para suas necessidades
          </p>
        </div>

        {/* Demo Mode Badge */}
        {isDemoMode && (
          <div className="mb-8 inline-flex items-center gap-2 rounded-lg bg-yellow-50 px-4 py-2 text-sm font-medium text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-200">
            <span className="inline-block h-2 w-2 rounded-full bg-yellow-600 dark:bg-yellow-400" />
            Modo demo – planos reais em breve
          </div>
        )}

        {/* Loading State */}
        {initialLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-56" />
            <Skeleton className="h-56" />
            <Skeleton className="h-56" />
          </div>
        )}

        {/* Plans Grid */}
        {!initialLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plans.length === 0 ? (
              <p className="col-span-full text-center text-sm text-zinc-600 dark:text-zinc-300">
                Sem planos disponíveis.
              </p>
            ) : (
              plans.map((p) => (
                <PlanCard
                  key={p.id}
                  plan={p}
                  current={p.id === currentPlanId}
                  onSelect={isDemoMode ? undefined : (id) => handleSubscribe(id)}
                  loading={loading}
                />
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}
