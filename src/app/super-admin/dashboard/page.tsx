'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { listCompanies, toggleCompanyStatus, getDashboardMetrics, deleteCompany } from '@/lib/api';
import { useRequireSuperAdmin } from '@/lib/use-require-super-admin';
import type { CompanySummary, DashboardMetrics } from '@/lib/types';
import { Toast } from '@/components/toast';
import { ThemeToggle } from '@/components/theme-toggle';
import { DeleteModal } from '@/components/delete-modal';
import { MetricCard } from '@/components/metric-card';
import { formatCurrency, formatDate } from '@/lib/formatters';

export default function SuperAdminDashboardPage() {
  const { token, user, logout, loading: authLoading } = useRequireSuperAdmin();
  const [companies, setCompanies] = useState<CompanySummary[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; kind: 'error' | 'success' | 'info' } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    
    // Load companies and metrics in parallel
    Promise.all([
      listCompanies(token),
      getDashboardMetrics(token),
    ])
      .then(([companiesData, metricsData]) => {
        setCompanies(companiesData);
        setMetrics(metricsData);
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : 'Erro ao carregar dados.';
        setToast({ message, kind: 'error' });
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleToggle = async (id: string) => {
    if (!token) return;
    try {
      await toggleCompanyStatus(id, token);
      setCompanies((prev) => prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)));
      setToast({ message: 'Estado atualizado.', kind: 'success' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Falha ao alterar estado.';
      setToast({ message, kind: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!token || !deleteModal) return;
    setDeleting(true);
    try {
      await deleteCompany(deleteModal.id, token);
      setCompanies((prev) => prev.filter((c) => c.id !== deleteModal.id));
      setToast({ message: 'Empresa eliminada com sucesso.', kind: 'success' });
      setDeleteModal(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Falha ao eliminar empresa.';
      setToast({ message, kind: 'error' });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-6 py-12">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500 dark:text-slate-400">Super Admin</p>
          <h1 className="text-3xl font-semibold text-ink-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-ink-600 dark:text-slate-300">Bem-vindo, {user?.name ?? user?.email ?? '—'}</p>
        </div>
        <div className="flex items-center gap-3 text-sm font-semibold">
          <ThemeToggle />
          <Link className="rounded-full border border-ink-200 px-4 py-2 text-ink-900 hover:bg-ink-50 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-700" href="/">
            Landing
          </Link>
          <button
            onClick={logout}
            className="rounded-full bg-ink-900 px-4 py-2 text-ink-50 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
          >
            Sair
          </button>
        </div>
      </header>

      {/* Metrics Cards */}
      {authLoading || loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-2xl bg-ink-100 dark:bg-slate-700" />
          ))}
        </div>
      ) : metrics && metrics.companies && metrics.subscriptions && metrics.revenue ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Empresas"
            value={metrics.companies.total}
            subtitle={`${metrics.companies.active} ativas`}
            color="blue"
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            }
          />
          <MetricCard
            title="Assinaturas"
            value={metrics.subscriptions.total}
            subtitle={`${metrics.subscriptions.active} ativas`}
            color="green"
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            }
          />
          <MetricCard
            title="Receita Total"
            value={formatCurrency(metrics.revenue.total)}
            subtitle="Todas as faturas pagas"
            color="purple"
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <MetricCard
            title="MRR"
            value={formatCurrency(metrics.revenue.mrr)}
            subtitle="Receita mensal recorrente"
            color="orange"
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            }
          />
        </div>
      ) : null}

      {/* Quick Navigation */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/super-admin/subscriptions"
          className="flex items-center gap-4 rounded-2xl border border-ink-200 bg-white p-4 shadow-card transition hover:border-emerald-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:border-emerald-500"
        >
          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-ink-900 dark:text-white">Assinaturas</p>
            <p className="text-sm text-ink-500 dark:text-slate-400">Gerir todas as assinaturas</p>
          </div>
        </Link>
        <Link
          href="/super-admin/invoices"
          className="flex items-center gap-4 rounded-2xl border border-ink-200 bg-white p-4 shadow-card transition hover:border-blue-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:border-blue-500"
        >
          <div className="rounded-xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-ink-900 dark:text-white">Faturas</p>
            <p className="text-sm text-ink-500 dark:text-slate-400">Histórico de faturação</p>
          </div>
        </Link>
        <Link
          href="/super-admin/reports"
          className="flex items-center gap-4 rounded-2xl border border-ink-200 bg-white p-4 shadow-card transition hover:border-purple-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:border-purple-500"
        >
          <div className="rounded-xl bg-purple-50 p-3 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-ink-900 dark:text-white">Relatórios</p>
            <p className="text-sm text-ink-500 dark:text-slate-400">Métricas e análises</p>
          </div>
        </Link>
        <Link
          href="/super-admin/companies/new"
          className="flex items-center gap-4 rounded-2xl border border-ink-200 bg-white p-4 shadow-card transition hover:border-orange-300 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800 dark:hover:border-orange-500"
        >
          <div className="rounded-xl bg-orange-50 p-3 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-ink-900 dark:text-white">Nova Empresa</p>
            <p className="text-sm text-ink-500 dark:text-slate-400">Adicionar empresa</p>
          </div>
        </Link>
      </div>

      {/* Quick Stats Row */}
      {metrics && metrics.recent && metrics.recent.companies && metrics.recent.subscriptions && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Companies */}
          <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-ink-900 dark:text-white">Empresas Recentes</h2>
              <Link href="/super-admin/companies/new" className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-400">
                + Nova Empresa
              </Link>
            </div>
            <div className="space-y-3">
              {metrics.recent.companies.length === 0 ? (
                <p className="text-sm text-ink-500 dark:text-slate-400">Nenhuma empresa registada.</p>
              ) : (
                metrics.recent.companies.map((company) => (
                  <Link
                    key={company.id}
                    href={`/super-admin/companies/${company.id}`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-ink-50 transition dark:hover:bg-slate-700"
                  >
                    <div>
                      <p className="font-medium text-ink-900 dark:text-white">{company.name}</p>
                      <p className="text-xs text-ink-500 dark:text-slate-400">{formatDate(company.createdAt)}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${company.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                      {company.isActive ? 'Ativa' : 'Inativa'}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Recent Subscriptions */}
          <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-800">
            <h2 className="text-lg font-semibold text-ink-900 mb-4 dark:text-white">Assinaturas Recentes</h2>
            <div className="space-y-3">
              {metrics.recent.subscriptions.length === 0 ? (
                <p className="text-sm text-ink-500 dark:text-slate-400">Nenhuma assinatura registada.</p>
              ) : (
                metrics.recent.subscriptions.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-ink-50 dark:bg-slate-700/50"
                  >
                    <div>
                      <p className="font-medium text-ink-900 dark:text-white">{sub.company.name}</p>
                      <p className="text-xs text-ink-500 dark:text-slate-400">{sub.plan.name} · {formatDate(sub.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-ink-900 dark:text-white">{formatCurrency(sub.plan.price)}</p>
                      <span className={`text-xs font-medium ${
                        sub.status === 'ACTIVE' ? 'text-emerald-600 dark:text-emerald-400' : 
                        sub.status === 'TRIALING' ? 'text-blue-600 dark:text-blue-400' : 'text-ink-500 dark:text-slate-400'
                      }`}>
                        {sub.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Companies Table */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-ink-900 dark:text-white">Todas as Empresas</h2>
          <Link
            href="/super-admin/companies/new"
            className="rounded-xl bg-ink-900 px-4 py-2 text-sm font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
          >
            + Nova Empresa
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card dark:border-slate-700 dark:bg-slate-800">
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              <div className="grid grid-cols-7 gap-2 border-b border-ink-100 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-500 dark:border-slate-700 dark:text-slate-400">
                <span>Nome</span>
                <span>Email</span>
                <span>Telefone</span>
                <span>Clientes</span>
                <span>Subscrições</span>
                <span>Estado</span>
                <span>Ações</span>
              </div>
              {loading ? (
                <div className="px-4 py-8 text-center text-ink-500 dark:text-slate-400">A carregar empresas...</div>
              ) : companies.length === 0 ? (
                <p className="px-4 py-6 text-sm text-ink-700 dark:text-slate-300">Nenhuma empresa encontrada.</p>
              ) : (
                companies.map((company) => (
                  <div key={company.id} className="grid grid-cols-7 items-center gap-2 border-b border-ink-50 px-4 py-3 text-sm text-ink-700 last:border-b-0 hover:bg-ink-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700/50">
                    <div>
                      <Link href={`/super-admin/companies/${company.id}`} className="font-semibold text-ink-900 hover:text-blue-600 dark:text-white dark:hover:text-blue-400">
                        {company.name}
                      </Link>
                      <p className="text-xs text-ink-500 dark:text-slate-400">{company.address?.city ?? '-'}</p>
                    </div>
                    <span className="truncate">{company.email ?? '-'}</span>
                    <span>{company.phone ?? '-'}</span>
                    <span>{company.customersCount ?? 0}</span>
                    <span>{company.subscriptionsCount ?? 0}</span>
                    <span className={company.isActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>
                      {company.isActive ? 'Ativa' : 'Inativa'}
                    </span>
                    <div className="flex gap-2">
                      <Link
                        href={`/super-admin/companies/${company.id}`}
                        className="rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-700 hover:bg-ink-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-600"
                      >
                        Ver
                      </Link>
                      <Link
                        href={`/super-admin/companies/${company.id}/edit`}
                        className="rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-700 hover:bg-ink-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-600"
                      >
                        Editar
                      </Link>
                      <button
                        onClick={() => handleToggle(company.id)}
                        className="rounded-lg border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-700 hover:bg-ink-100 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-600"
                      >
                        {company.isActive ? 'Desativar' : 'Ativar'}
                      </button>
                      <button
                        onClick={() => setDeleteModal({ id: company.id, name: company.name })}
                        className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <DeleteModal
          itemName={deleteModal.name}
          onConfirm={handleDelete}
          onCancel={() => setDeleteModal(null)}
          loading={deleting}
        />
      )}

      {toast && <Toast message={toast.message} kind={toast.kind} onClose={() => setToast(null)} />}
    </main>
  );
}
