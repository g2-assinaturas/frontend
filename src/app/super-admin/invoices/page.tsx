'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { listAllInvoices, getInvoiceStats, updateInvoiceStatus } from '@/lib/api';
import { useRequireSuperAdmin } from '@/lib/use-require-super-admin';
import type { InvoiceDetails, InvoiceStats, InvoiceStatus } from '@/lib/types';
import { Toast } from '@/components/toast';

const STATUS_LABELS: Record<InvoiceStatus, string> = {
  DRAFT: 'Rascunho',
  PENDING: 'Pendente',
  PAID: 'Paga',
  OVERDUE: 'Vencida',
  CANCELED: 'Cancelada',
  REFUNDED: 'Reembolsada',
};

const STATUS_COLORS: Record<InvoiceStatus, string> = {
  DRAFT: 'bg-ink-100 text-ink-600',
  PENDING: 'bg-amber-100 text-amber-700',
  PAID: 'bg-emerald-100 text-emerald-700',
  OVERDUE: 'bg-red-100 text-red-700',
  CANCELED: 'bg-ink-100 text-ink-500',
  REFUNDED: 'bg-purple-100 text-purple-700',
};

function formatCurrency(value: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: currency,
  }).format(value / 100);
}

function formatDate(dateString: string | null): string {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function StatsCard({ title, value, subtitle, color }: { title: string; value: string | number; subtitle?: string; color: string }) {
  return (
    <div className={`rounded-xl p-4 ${color}`}>
      <p className="text-sm font-medium opacity-80">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
      {subtitle && <p className="text-xs opacity-70">{subtitle}</p>}
    </div>
  );
}

export default function InvoicesPage() {
  const { token, loading: authLoading } = useRequireSuperAdmin();
  const [invoices, setInvoices] = useState<InvoiceDetails[]>([]);
  const [stats, setStats] = useState<InvoiceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; kind: 'error' | 'success' | 'info' } | null>(null);
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | ''>('');

  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const filters = statusFilter ? { status: statusFilter as InvoiceStatus } : undefined;
      const [invoicesData, statsData] = await Promise.all([
        listAllInvoices(token, filters),
        getInvoiceStats(token),
      ]);
      setInvoices(invoicesData);
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

  const handleStatusChange = async (id: string, newStatus: InvoiceStatus) => {
    if (!token) return;
    try {
      await updateInvoiceStatus(id, newStatus, token);
      setToast({ message: 'Estado da fatura atualizado.', kind: 'success' });
      loadData();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Falha ao atualizar estado.';
      setToast({ message, kind: 'error' });
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-6 py-12">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Super Admin</p>
          <h1 className="text-3xl font-semibold text-ink-900">Faturas</h1>
          <p className="text-sm text-ink-600">Histórico e gestão de todas as faturas</p>
        </div>
        <div className="flex gap-3 text-sm font-semibold">
          <Link className="rounded-full border border-ink-200 px-4 py-2 text-ink-900 hover:bg-ink-50" href="/super-admin/dashboard">
            ← Dashboard
          </Link>
        </div>
      </header>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          <StatsCard title="Total" value={stats.total} color="bg-ink-100 text-ink-700" />
          <StatsCard title="Pagas" value={stats.paid} color="bg-emerald-100 text-emerald-700" />
          <StatsCard title="Pendentes" value={stats.pending} color="bg-amber-100 text-amber-700" />
          <StatsCard title="Vencidas" value={stats.overdue} color="bg-red-100 text-red-700" />
          <StatsCard 
            title="Receita Total" 
            value={formatCurrency(stats.totalRevenue)} 
            subtitle={`${stats.paid} faturas pagas`}
            color="bg-purple-100 text-purple-700" 
          />
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <label className="text-sm font-medium text-ink-700">
          Filtrar por estado:
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as InvoiceStatus | '')}
            className="ml-2 rounded-lg border border-ink-200 px-3 py-2 text-sm"
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
        <p className="text-ink-700">A carregar faturas...</p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="grid grid-cols-6 gap-2 border-b border-ink-100 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-500">
                <span>Empresa</span>
                <span>Valor</span>
                <span>Data Vencimento</span>
                <span>Data Pagamento</span>
                <span>Estado</span>
                <span>Ações</span>
              </div>
              {invoices.length === 0 ? (
                <p className="px-4 py-6 text-sm text-ink-700">Nenhuma fatura encontrada.</p>
              ) : (
                invoices.map((inv) => (
                  <div key={inv.id} className="grid grid-cols-6 items-center gap-2 border-b border-ink-50 px-4 py-3 text-sm text-ink-700 last:border-b-0 hover:bg-ink-50">
                    <div>
                      <p className="font-semibold text-ink-900">{inv.company?.name ?? '-'}</p>
                      <p className="text-xs text-ink-500">{inv.subscription?.plan?.name ?? '-'}</p>
                    </div>
                    <span className="font-semibold">{formatCurrency(inv.amount, inv.currency)}</span>
                    <span>{formatDate(inv.dueDate)}</span>
                    <span>{formatDate(inv.paidAt)}</span>
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${STATUS_COLORS[inv.status] || 'bg-ink-100 text-ink-600'}`}>
                      {STATUS_LABELS[inv.status] || inv.status}
                    </span>
                    <div className="flex gap-2">
                      <select
                        value=""
                        onChange={(e) => {
                          if (e.target.value) handleStatusChange(inv.id, e.target.value as InvoiceStatus);
                        }}
                        className="rounded-lg border border-ink-200 px-2 py-1 text-xs"
                      >
                        <option value="">Alterar</option>
                        {Object.entries(STATUS_LABELS)
                          .filter(([key]) => key !== inv.status)
                          .map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} kind={toast.kind} onClose={() => setToast(null)} />}
    </main>
  );
}
