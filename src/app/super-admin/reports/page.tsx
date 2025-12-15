'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { getRevenueReport, getChurnReport } from '@/lib/api';
import { useRequireSuperAdmin } from '@/lib/use-require-super-admin';
import type { RevenueReport, ChurnReport } from '@/lib/types';
import { Toast } from '@/components/toast';

function formatCurrency(value: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: currency,
  }).format(value / 100);
}

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon,
  color = 'blue' 
}: { 
  title: string; 
  value: string | number; 
  subtitle?: string;
  icon: React.ReactNode;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
}) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-emerald-50 text-emerald-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-ink-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-ink-900">{value}</p>
          {subtitle && <p className="mt-1 text-sm text-ink-500">{subtitle}</p>}
        </div>
        <div className={`rounded-xl p-3 ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const { token, loading: authLoading } = useRequireSuperAdmin();
  const [revenueReport, setRevenueReport] = useState<RevenueReport | null>(null);
  const [churnReport, setChurnReport] = useState<ChurnReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; kind: 'error' | 'success' | 'info' } | null>(null);
  const [churnPeriod, setChurnPeriod] = useState(1);
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
  const [filteringRevenue, setFilteringRevenue] = useState(false);
  const [filteringChurn, setFilteringChurn] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [revenue, churn] = await Promise.all([
        getRevenueReport(token),
        getChurnReport(token, churnPeriod),
      ]);
      setRevenueReport(revenue);
      setChurnReport(churn);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao carregar relatórios.';
      setToast({ message, kind: 'error' });
    } finally {
      setLoading(false);
    }
  }, [token, churnPeriod]);

  useEffect(() => {
    if (!token) return;
    loadData();
  }, [token, loadData]);

  const handleFilterRevenue = async () => {
    if (!token) return;
    
    // Validar datas
    if (dateRange.startDate && dateRange.endDate) {
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      if (start > end) {
        setToast({ message: 'A data de início deve ser anterior à data de fim.', kind: 'error' });
        return;
      }
    }
    
    // Cancelar requisição anterior se existir
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Criar novo AbortController
    abortControllerRef.current = new AbortController();
    
    setFilteringRevenue(true);
    try {
      const revenue = await getRevenueReport(token, dateRange.startDate || undefined, dateRange.endDate || undefined);
      setRevenueReport(revenue);
      setToast({ message: 'Relatório de receita atualizado.', kind: 'success' });
    } catch (err) {
      // Ignorar erros de abort
      if (err instanceof Error && err.name === 'AbortError') return;
      const message = err instanceof Error ? err.message : 'Falha ao filtrar receita.';
      setToast({ message, kind: 'error' });
    } finally {
      setFilteringRevenue(false);
      abortControllerRef.current = null;
    }
  };

  const handleChurnPeriodChange = async (period: number) => {
    if (!token) return;
    setChurnPeriod(period);
    setFilteringChurn(true);
    try {
      const churn = await getChurnReport(token, period);
      setChurnReport(churn);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Falha ao carregar churn.';
      setToast({ message, kind: 'error' });
    } finally {
      setFilteringChurn(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-6 py-12">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Super Admin</p>
          <h1 className="text-3xl font-semibold text-ink-900">Relatórios</h1>
          <p className="text-sm text-ink-600">Métricas e análises do negócio</p>
        </div>
        <div className="flex gap-3 text-sm font-semibold">
          <Link className="rounded-full border border-ink-200 px-4 py-2 text-ink-900 hover:bg-ink-50" href="/super-admin/dashboard">
            ← Dashboard
          </Link>
        </div>
      </header>

      {authLoading || loading ? (
        <p className="text-ink-700">A carregar relatórios...</p>
      ) : (
        <>
          {/* Revenue Section */}
          <section>
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="text-xl font-semibold text-ink-900">Receita</h2>
              <div className="flex flex-wrap items-end gap-3">
                <div>
                  <label className="block text-xs font-medium text-ink-500 mb-1">Data Início</label>
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                    className="rounded-lg border border-ink-200 px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-ink-500 mb-1">Data Fim</label>
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                    className="rounded-lg border border-ink-200 px-3 py-2 text-sm"
                  />
                </div>
                <button
                  onClick={handleFilterRevenue}
                  disabled={filteringRevenue}
                  className="rounded-lg bg-ink-900 px-4 py-2 text-sm font-semibold text-white hover:bg-ink-800 disabled:opacity-50"
                >
                  {filteringRevenue ? 'A filtrar...' : 'Filtrar'}
                </button>
              </div>
            </div>

            {revenueReport && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <MetricCard
                  title="Receita Total"
                  value={formatCurrency(revenueReport.totalRevenue, revenueReport.currency)}
                  subtitle={`${revenueReport.invoiceCount} faturas`}
                  icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                  color="green"
                />
                <MetricCard
                  title="Ticket Médio"
                  value={formatCurrency(revenueReport.averageInvoiceAmount, revenueReport.currency)}
                  subtitle="Por fatura"
                  icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
                  color="blue"
                />
                <MetricCard
                  title="Faturas Pagas"
                  value={revenueReport.invoiceCount}
                  subtitle="No período selecionado"
                  icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                  color="purple"
                />
              </div>
            )}

            {/* Revenue Details Table */}
            {revenueReport && revenueReport.invoices.length > 0 && (
              <div className="mt-6 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card">
                <div className="border-b border-ink-100 px-4 py-3">
                  <h3 className="text-sm font-semibold text-ink-900">Detalhes das Faturas Pagas</h3>
                </div>
                <div className="overflow-x-auto">
                  <div className="min-w-[600px]">
                    <div className="grid grid-cols-4 gap-2 border-b border-ink-100 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-500">
                      <span>Empresa</span>
                      <span>Plano</span>
                      <span>Valor</span>
                      <span>Data Pagamento</span>
                    </div>
                    {revenueReport.invoices.slice(0, 20).map((invoice) => (
                      <div key={invoice.id} className="grid grid-cols-4 gap-2 border-b border-ink-50 px-4 py-3 text-sm text-ink-700 last:border-b-0">
                        <span className="font-medium text-ink-900">{invoice.company?.name ?? '-'}</span>
                        <span>{invoice.subscription?.plan?.name ?? '-'}</span>
                        <span className="font-semibold">{formatCurrency(invoice.amount, invoice.currency)}</span>
                        <span>{formatDate(invoice.paidAt)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Churn Section */}
          <section className="mt-8">
            <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="text-xl font-semibold text-ink-900">Churn</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-ink-600">Período:</span>
                {[1, 3, 6, 12].map((months) => (
                  <button
                    key={months}
                    onClick={() => handleChurnPeriodChange(months)}
                    disabled={filteringChurn}
                    className={`rounded-lg px-3 py-1 text-sm font-medium transition ${
                      churnPeriod === months
                        ? 'bg-ink-900 text-white'
                        : 'bg-ink-100 text-ink-700 hover:bg-ink-200'
                    } disabled:opacity-50`}
                  >
                    {months}m
                  </button>
                ))}
              </div>
            </div>

            {churnReport && (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                  title="Taxa de Churn"
                  value={`${churnReport.churnRate.toFixed(1)}%`}
                  subtitle={`Últimos ${churnReport.periodMonths} meses`}
                  icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>}
                  color={churnReport.churnRate > 5 ? 'red' : churnReport.churnRate > 2 ? 'orange' : 'green'}
                />
                <MetricCard
                  title="Canceladas"
                  value={churnReport.totalCanceled}
                  subtitle="Assinaturas canceladas"
                  icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>}
                  color="red"
                />
                <MetricCard
                  title="Ativas"
                  value={churnReport.totalActive}
                  subtitle="Assinaturas ativas"
                  icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                  color="green"
                />
                <MetricCard
                  title="Retenção"
                  value={`${(100 - churnReport.churnRate).toFixed(1)}%`}
                  subtitle="Taxa de retenção"
                  icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                  color="blue"
                />
              </div>
            )}

            {/* Canceled Subscriptions Table */}
            {churnReport && churnReport.canceledSubscriptions.length > 0 && (
              <div className="mt-6 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card">
                <div className="border-b border-ink-100 px-4 py-3">
                  <h3 className="text-sm font-semibold text-ink-900">Assinaturas Canceladas</h3>
                </div>
                <div className="overflow-x-auto">
                  <div className="min-w-[500px]">
                    <div className="grid grid-cols-3 gap-2 border-b border-ink-100 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-500">
                      <span>Empresa</span>
                      <span>Plano</span>
                      <span>Data Cancelamento</span>
                    </div>
                    {churnReport.canceledSubscriptions.slice(0, 20).map((sub) => (
                      <div key={sub.id} className="grid grid-cols-3 gap-2 border-b border-ink-50 px-4 py-3 text-sm text-ink-700 last:border-b-0">
                        <span className="font-medium text-ink-900">{sub.company?.name ?? '-'}</span>
                        <span>{sub.plan?.name ?? '-'}</span>
                        <span>{formatDate(sub.canceledAt)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>
        </>
      )}

      {toast && <Toast message={toast.message} kind={toast.kind} onClose={() => setToast(null)} />}
    </main>
  );
}
