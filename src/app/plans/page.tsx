'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { listPlans } from '@/lib/api';
import { ThemeToggle } from '@/components/theme-toggle';
import type { Plan } from '@/lib/types';

function formatPrice(value: number, currency = 'BRL') {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(value);
}

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listPlans()
      .then(setPlans)
      .catch((err) => setError(err instanceof Error ? err.message : 'Erro ao carregar planos.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-12 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-ink-500 dark:text-slate-400">Planos</p>
          <h1 className="text-3xl font-semibold text-ink-900 dark:text-white">Escolha um plano</h1>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link className="text-sm font-semibold text-ink-700 hover:text-ink-900 dark:text-slate-300 dark:hover:text-white" href="/dashboard">
            Voltar ao painel
          </Link>
        </div>
      </div>

      {loading ? <p className="text-ink-700 dark:text-slate-300">A carregar planos...</p> : null}
      {error ? <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">{error}</p> : null}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.id} className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-800">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink-500 dark:text-slate-400">{plan.interval}</p>
            <h2 className="mt-2 text-xl font-semibold text-ink-900 dark:text-white">{plan.name}</h2>
            <p className="mt-2 text-sm text-ink-600 dark:text-slate-300">{plan.description ?? 'Plano disponível.'}</p>
            <p className="mt-4 text-3xl font-semibold text-ink-900 dark:text-white">{formatPrice(plan.price, plan.currency ?? 'BRL')}</p>
            <p className="text-xs text-ink-500 dark:text-slate-400">Intervalo: {plan.interval}</p>
            <Link
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-ink-900 px-4 py-3 text-sm font-semibold text-ink-50 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-slate-600 dark:hover:bg-slate-500"
              href={{ pathname: '/checkout', query: { planId: plan.id } }}
            >
              Subscrever
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
