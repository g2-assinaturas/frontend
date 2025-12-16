'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { listAllSubscriptions, getSubscriptionStats, updateSubscriptionStatus, adminCancelSubscription } from '@/lib/api';
import { useRequireSuperAdmin } from '@/lib/use-require-super-admin';
import type { SubscriptionDetails, SubscriptionStats, SubscriptionStatus } from '@/lib/types';
import { Toast } from '@/components/toast';
import { ThemeToggle } from '@/components/theme-toggle';
import { StatsCard } from '@/components/stats-card';
import { formatCurrency, formatDate } from '@/lib/formatters';

const STATUS_LABELS: Record<SubscriptionStatus, string> = {
  ACTIVE: 'Ativa',
  TRIALING: 'Trial',
  PAST_DUE: 'Atrasada',
  CANCELED: 'Cancelada',
  EXPIRED: 'Expirada',
  PAUSED: 'Pausada',
};

const STATUS_COLORS: Record<SubscriptionStatus, string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  TRIALING: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  PAST_DUE: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  CANCELED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  EXPIRED: 'bg-ink-100 text-ink-600 dark:bg-slate-700 dark:text-slate-400',
  PAUSED: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

const STATS_COLORS = {
  total: 'bg-ink-100 text-ink-700 dark:bg-slate-700 dark:text-slate-300',
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  trialing: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  pastDue: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  canceled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  expired: 'bg-ink-100 text-ink-600 dark:bg-slate-700 dark:text-slate-400',
};

function CancelModal({
  onConfirm,
  onCancel,
  loading,
}: {
  onConfirm: (atPeriodEnd: boolean) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-800">
        <h3 className="text-lg font-semibold text-ink-900 dark:text-white">Cancelar Assinatura</h3>
        <p className="mt-2 text-sm text-ink-600 dark:text-slate-300">
          Como deseja cancelar esta assinatura?
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => onConfirm(true)}
            disabled={loading}
            className="w-full rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700 hover:bg-amber-100 disabled:opacity-50 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50"
          >
            Cancelar no fim do período
          </button>
          <button
            onClick={() => onConfirm(false)}
            disabled={loading}
            className="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'A cancelar...' : 'Cancelar imediatamente'}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="w-full rounded-xl border border-ink-200 px-4 py-3 text-sm font-semibold text-ink-700 hover:bg-ink-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SubscriptionsPage() {
  const { token, loading: authLoading } = useRequireSuperAdmin();
  const [subscriptions, setSubscriptions] = useState<SubscriptionDetails[]>([]);
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; kind: 'error' | 'success' | 'info' } | null>(null);
  const [statusFilter, setStatusFilter] = useState<SubscriptionStatus | ''>('');
  const [cancelModal, setCancelModal] = useState<string | null>(null);
  const [canceling, setCanceling] = useState(false);

  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const filters = statusFilter ? { status: statusFilter as SubscriptionStatus } : undefined;
      const [subsData, statsData] = await Promise.all([
        listAllSubscriptions(token, filters),
        getSubscriptionStats(token),
      ]);
      setSubscriptions(subsData);
      setStats(statsData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar dados.';
      setToast({ message, kind: 'error' });
    } finally {
      setLoading(false);
    }
  }, [token, statusFilter]);

  useEffect(() => {
    if (!token) return;
    loadData();
  }, [token, loadData]);

  const handleStatusChange = async (id: string, newStatus: SubscriptionStatus) => {
    if (!token) return;
    try {
      await updateSubscriptionStatus(id, newStatus, token);
      setToast({ message: 'Estado atualizado com sucesso.', kind: 'success' });
      loadData();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Falha ao atualizar estado.';
      setToast({ message, kind: 'error' });
    }
  };

  const handleCancel = async (atPeriodEnd: boolean) => {
    if (!token || !cancelModal) return;
    setCanceling(true);
    try {
      await adminCancelSubscription(cancelModal, token, atPeriodEnd);
      setToast({ message: 'Assinatura cancelada com sucesso.', kind: 'success' });
      setCancelModal(null);
      loadData();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Falha ao cancelar assinatura.';
      setToast({ message, kind: 'error' });
    } finally {
      setCanceling(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-6 py-12">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500 dark:text-slate-400">Super Admin</p>
          <h1 className="text-3xl font-semibold text-ink-900 dark:text-white">Assinaturas</h1>
          <p className="text-sm text-ink-600 dark:text-slate-300">Gestão de todas as assinaturas do sistema</p>
        </div>
        <div className="flex items-center gap-3 text-sm font-semibold">
          <ThemeToggle />
          <Link className="rounded-full border border-ink-200 px-4 py-2 text-ink-900 hover:bg-ink-50 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-700" href="/super-admin/dashboard">
            ← Dashboard
          </Link>
        </div>
      </header>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <StatsCard title="Total" value={stats.total} color={STATS_COLORS.total} />
          <StatsCard title="Ativas" value={stats.active} color={STATS_COLORS.active} />
          <StatsCard title="Trial" value={stats.trialing} color={STATS_COLORS.trialing} />
          <StatsCard title="Atrasadas" value={stats.pastDue} color={STATS_COLORS.pastDue} />
          <StatsCard title="Canceladas" value={stats.canceled} color={STATS_COLORS.canceled} />
          <StatsCard title="Expiradas" value={stats.expired} color={STATS_COLORS.expired} />
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <label className="text-sm font-medium text-ink-700 dark:text-slate-300">
          Filtrar por estado:
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as SubscriptionStatus | '')}
            className="ml-2 rounded-lg border border-ink-200 px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
          >
            <option value="">Todos</option>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
      </div>

      {/* Table */}
      {authLoading || loading ? (
        <p className="text-ink-700 dark:text-slate-300">A carregar assinaturas...</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card dark:border-slate-700 dark:bg-slate-800">
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              <div className="grid grid-cols-7 gap-2 border-b border-ink-100 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-500 dark:border-slate-700 dark:text-slate-400">
                <span>Empresa</span>
                <span>Plano</span>
                <span>Preço</span>
                <span>Início</span>
                <span>Fim Período</span>
                <span>Estado</span>
                <span>Ações</span>
              </div>
              {subscriptions.length === 0 ? (
                <p className="px-4 py-6 text-sm text-ink-700 dark:text-slate-300">Nenhuma assinatura encontrada.</p>
              ) : (
                subscriptions.map((sub) => (
                  <div key={sub.id} className="grid grid-cols-7 items-center gap-2 border-b border-ink-50 px-4 py-3 text-sm text-ink-700 last:border-b-0 hover:bg-ink-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700/50">
                    <div>
                      <p className="font-semibold text-ink-900 dark:text-white">{sub.company?.name ?? '-'}</p>
                      <p className="text-xs text-ink-500 dark:text-slate-400">{sub.company?.email ?? '-'}</p>
                    </div>
                    <span>{sub.plan?.name ?? '-'}</span>
                    <span className="font-semibold">{formatCurrency(sub.plan?.price ?? 0, sub.plan?.currency)}</span>
                    <span>{formatDate(sub.startDate)}</span>
                    <span>{formatDate(sub.currentPeriodEnd)}</span>
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${STATUS_COLORS[sub.status] || 'bg-ink-100 text-ink-600 dark:bg-slate-700 dark:text-slate-400'}`}>
                      {STATUS_LABELS[sub.status] || sub.status}
                    </span>
                    <div className="flex gap-2">
                      <select
                        value=""
                        onChange={(e) => {
                          if (e.target.value) handleStatusChange(sub.id, e.target.value as SubscriptionStatus);
                        }}
                        className="rounded-lg border border-ink-200 px-2 py-1 text-xs dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100"
                      >
                        <option value="">Alterar</option>
                        {Object.entries(STATUS_LABELS)
                          .filter(([key]) => key !== sub.status)
                          .map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                      </select>
                      {sub.status === 'ACTIVE' && (
                        <button
                          onClick={() => setCancelModal(sub.id)}
                          className="rounded-lg border border-red-200 px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30"
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {cancelModal && (
        <CancelModal
          onConfirm={handleCancel}
          onCancel={() => setCancelModal(null)}
          loading={canceling}
        />
      )}

      {toast && <Toast message={toast.message} kind={toast.kind} onClose={() => setToast(null)} />}
    </main>
  );
}
