'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { listCompanies, toggleCompanyStatus } from '@/lib/api';
import { useRequireSuperAdmin } from '@/lib/use-require-super-admin';
import type { CompanySummary } from '@/lib/types';
import { Toast } from '@/components/toast';

export default function SuperAdminDashboardPage() {
  const { token, user, logout, loading: authLoading } = useRequireSuperAdmin();
  const [companies, setCompanies] = useState<CompanySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; kind: 'error' | 'success' | 'info' } | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    listCompanies(token)
      .then(setCompanies)
      .catch((err) => {
        const message = err instanceof Error ? err.message : 'Erro ao carregar empresas.';
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

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-6 py-12">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Super Admin</p>
          <h1 className="text-3xl font-semibold text-ink-900">Empresas</h1>
          <p className="text-sm text-ink-600">Sessão: {user?.email ?? '—'}</p>
        </div>
        <div className="flex gap-3 text-sm font-semibold">
          <Link className="rounded-full border border-ink-200 px-4 py-2 text-ink-900" href="/">
            Landing
          </Link>
          <button
            onClick={logout}
            className="rounded-full bg-ink-900 px-4 py-2 text-ink-50 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Sair
          </button>
        </div>
      </header>

      {authLoading || loading ? <p className="text-ink-700">A carregar empresas...</p> : null}

      <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card">
        <div className="grid grid-cols-6 gap-2 border-b border-ink-100 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-500">
          <span>Nome</span>
          <span>Email</span>
          <span>Clientes</span>
          <span>Subscrições</span>
          <span>Estado</span>
          <span>Ações</span>
        </div>
        {companies.length === 0 && !loading ? (
          <p className="px-4 py-6 text-sm text-ink-700">Nenhuma empresa encontrada.</p>
        ) : null}
        {companies.map((company) => (
          <div key={company.id} className="grid grid-cols-6 items-center gap-2 border-b border-ink-50 px-4 py-3 text-sm text-ink-700 last:border-b-0">
            <div>
              <p className="font-semibold text-ink-900">{company.name}</p>
              <p className="text-xs text-ink-500">{company.address?.city ?? '-'} </p>
            </div>
            <span>{company.email ?? '-'}</span>
            <span>{company.customersCount ?? 0}</span>
            <span>{company.subscriptionsCount ?? 0}</span>
            <span className={company.isActive ? 'text-emerald-700' : 'text-red-600'}>
              {company.isActive ? 'Ativa' : 'Inativa'}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleToggle(company.id)}
                className="rounded-lg border border-ink-200 px-3 py-2 text-xs font-semibold text-ink-900"
              >
                Alternar
              </button>
            </div>
          </div>
        ))}
      </div>

      {toast ? <Toast message={toast.message} kind={toast.kind} onClose={() => setToast(null)} /> : null}
    </main>
  );
}
