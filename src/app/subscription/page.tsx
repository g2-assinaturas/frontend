'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { cancelSubscription, currentSubscription } from '@/lib/api';
import { useRequireAuth } from '@/lib/use-require-auth';
import type { Subscription } from '@/lib/types';
import { Toast } from '@/components/toast';

export default function SubscriptionPage() {
  const { token, loading: authLoading } = useRequireAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; kind: 'success' | 'error' | 'info' } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    currentSubscription(token)
      .then(setSubscription)
      .catch(() => setSubscription(null))
      .finally(() => setLoading(false));
  }, [token]);

  const handleCancel = async (cancelAtPeriodEnd: boolean) => {
    if (!token) return;
    setActionLoading(true);
    try {
      await cancelSubscription(token, cancelAtPeriodEnd);
      setToast({ message: 'Pedido de cancelamento enviado.', kind: 'success' });
      const updated = await currentSubscription(token);
      setSubscription(updated);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao cancelar.';
      setToast({ message, kind: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-12">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-ink-500">Subscrição</p>
          <h1 className="text-3xl font-semibold text-ink-900">Estado atual</h1>
        </div>
        <Link className="text-sm font-semibold text-ink-700 hover:text-ink-900" href="/dashboard">
          Voltar ao painel
        </Link>
      </div>

      {authLoading || loading ? <p className="text-ink-700">A carregar subscrição...</p> : null}

      {!loading && !subscription ? (
        <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
          <p className="text-sm text-ink-700">Nenhuma subscrição ativa.</p>
          <Link className="mt-4 inline-flex rounded-xl bg-ink-900 px-4 py-3 text-sm font-semibold text-ink-50" href="/plans">
            Escolher plano
          </Link>
        </div>
      ) : null}

      {subscription ? (
        <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Plano</p>
              <h2 className="text-2xl font-semibold text-ink-900">{subscription.planId}</h2>
              <p className="text-sm text-ink-600">Estado: {subscription.status}</p>
            </div>
            <div className="text-right text-sm text-ink-600">
              <p>Início: {subscription.currentPeriodStart ?? '-'} </p>
              <p>Fim: {subscription.currentPeriodEnd ?? '-'} </p>
              <p>Renova: {subscription.cancelAtPeriodEnd ? 'Não (cancelado no fim do período)' : 'Sim'}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 text-sm font-semibold">
            <button
              disabled={actionLoading}
              onClick={() => handleCancel(true)}
              className="rounded-xl border border-ink-200 px-4 py-3 text-ink-900 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Cancelar no fim do período
            </button>
            <button
              disabled={actionLoading}
              onClick={() => handleCancel(false)}
              className="rounded-xl bg-red-600 px-4 py-3 text-ink-50 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
            >
              Cancelar agora
            </button>
            <Link
              className="rounded-xl border border-ink-200 px-4 py-3 text-ink-900"
              href="/invoices"
            >
              Ver faturas
            </Link>
          </div>
        </div>
      ) : null}

      {toast ? <Toast message={toast.message} kind={toast.kind} onClose={() => setToast(null)} /> : null}
    </main>
  );
}
