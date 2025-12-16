'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getCompanyDetails, toggleCompanyStatus, deleteCompany } from '@/lib/api';
import { useRequireSuperAdmin } from '@/lib/use-require-super-admin';
import { Toast } from '@/components/toast';
import { ThemeToggle } from '@/components/theme-toggle';
import { DeleteModal } from '@/components/delete-modal';
import type { CompanyDetails } from '@/lib/types';
import { formatCurrency, formatDate, formatPhone, formatCnpj } from '@/lib/formatters';

/**
 * Formata telefone com fallback para valores nulos
 */
function formatPhoneDisplay(value: string | null): string {
  if (!value) return '-';
  return formatPhone(value);
}

/**
 * Formata CNPJ com fallback para valores nulos
 */
function formatCnpjDisplay(value: string | null): string {
  if (!value) return '-';
  return formatCnpj(value);
}

export default function CompanyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { token, loading: authLoading } = useRequireSuperAdmin();
  
  const companyId = params.id as string;
  
  const [company, setCompany] = useState<CompanyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; kind: 'error' | 'success' | 'info' } | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!token || !companyId) return;
    
    setLoading(true);
    getCompanyDetails(companyId, token)
      .then(setCompany)
      .catch((err) => {
        const message = err instanceof Error ? err.message : 'Erro ao carregar empresa.';
        setToast({ message, kind: 'error' });
      })
      .finally(() => setLoading(false));
  }, [token, companyId]);

  const handleToggleStatus = async () => {
    if (!token || !company) return;
    try {
      await toggleCompanyStatus(company.id, token);
      setCompany({ ...company, isActive: !company.isActive });
      setToast({ message: 'Estado atualizado.', kind: 'success' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Falha ao alterar estado.';
      setToast({ message, kind: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!token || !company) return;
    setDeleting(true);
    try {
      await deleteCompany(company.id, token);
      setToast({ message: 'Empresa eliminada com sucesso.', kind: 'success' });
      setTimeout(() => router.push('/super-admin/dashboard'), 1500);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Falha ao eliminar empresa.';
      setToast({ message, kind: 'error' });
    } finally {
      setDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (authLoading || loading) {
    return (
      <main className="mx-auto min-h-screen max-w-6xl px-6 py-12 dark:bg-slate-900">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 rounded bg-ink-100 dark:bg-slate-700" />
          <div className="h-64 rounded-2xl bg-ink-100 dark:bg-slate-700" />
        </div>
      </main>
    );
  }

  if (!company) {
    return (
      <main className="mx-auto min-h-screen max-w-6xl px-6 py-12 dark:bg-slate-900">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-ink-900 dark:text-white">Empresa não encontrada</h1>
          <Link href="/super-admin/dashboard" className="mt-4 inline-block text-blue-600 hover:underline dark:text-blue-400">
            Voltar ao Dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12 dark:bg-slate-900">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/super-admin/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink-500 hover:text-ink-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar ao Dashboard
          </Link>
          <ThemeToggle />
        </div>
        
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold text-ink-900 dark:text-white">{company.name}</h1>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                company.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {company.isActive ? 'Ativa' : 'Inativa'}
              </span>
            </div>
            <p className="mt-1 text-sm text-ink-500 dark:text-slate-400">Criada em {formatDate(company.createdAt, 'long')}</p>
          </div>
          
          <div className="flex gap-3">
            <Link
              href={`/super-admin/companies/${company.id}/edit`}
              className="rounded-xl border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-ink-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Editar
            </Link>
            <button
              onClick={handleToggleStatus}
              className="rounded-xl border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-ink-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              {company.isActive ? 'Desativar' : 'Ativar'}
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/30"
            >
              Eliminar
            </button>
          </div>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Company Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-800">
            <h2 className="text-lg font-semibold text-ink-900 mb-4 dark:text-white">Informações Básicas</h2>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-ink-500 dark:text-slate-400">Email</dt>
                <dd className="mt-1 text-sm text-ink-900 dark:text-slate-200">{company.email || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-ink-500 dark:text-slate-400">Telefone</dt>
                <dd className="mt-1 text-sm text-ink-900 dark:text-slate-200">{formatPhoneDisplay(company.phone)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-ink-500 dark:text-slate-400">CNPJ</dt>
                <dd className="mt-1 text-sm text-ink-900 dark:text-slate-200">{formatCnpjDisplay(company.cnpj)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-ink-500 dark:text-slate-400">Slug</dt>
                <dd className="mt-1 text-sm text-ink-900 font-mono dark:text-slate-200">{company.slug}</dd>
              </div>
              {company.description && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-ink-500 dark:text-slate-400">Descrição</dt>
                  <dd className="mt-1 text-sm text-ink-900 dark:text-slate-200">{company.description}</dd>
                </div>
              )}
            </dl>
          </section>

          {/* Address */}
          {company.address && (
            <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-800">
              <h2 className="text-lg font-semibold text-ink-900 mb-4 dark:text-white">Endereço</h2>
              <p className="text-sm text-ink-900 dark:text-slate-200">
                {company.address.street}, {company.address.number}
                {company.address.complement && ` - ${company.address.complement}`}
              </p>
              <p className="text-sm text-ink-700 dark:text-slate-300">
                {company.address.neighborhood} - {company.address.city}/{company.address.state}
              </p>
              <p className="text-sm text-ink-500 dark:text-slate-400">CEP: {company.address.zipCode}</p>
            </section>
          )}

          {/* Users */}
          <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-800">
            <h2 className="text-lg font-semibold text-ink-900 mb-4 dark:text-white">
              Usuários ({company.users.length})
            </h2>
            {company.users.length === 0 ? (
              <p className="text-sm text-ink-500 dark:text-slate-400">Nenhum usuário cadastrado.</p>
            ) : (
              <div className="space-y-3">
                {company.users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 rounded-xl bg-ink-50 dark:bg-slate-700">
                    <div>
                      <p className="font-medium text-ink-900 dark:text-white">{user.name}</p>
                      <p className="text-xs text-ink-500 dark:text-slate-400">{user.email}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      user.isActive ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {user.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Subscriptions */}
          <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-800">
            <h2 className="text-lg font-semibold text-ink-900 mb-4 dark:text-white">
              Assinaturas Recentes ({company.subscriptions.length})
            </h2>
            {company.subscriptions.length === 0 ? (
              <p className="text-sm text-ink-500 dark:text-slate-400">Nenhuma assinatura encontrada.</p>
            ) : (
              <div className="space-y-3">
                {company.subscriptions.map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between p-3 rounded-xl bg-ink-50 dark:bg-slate-700">
                    <div>
                      <p className="font-medium text-ink-900 dark:text-white">{sub.plan.name}</p>
                      <p className="text-xs text-ink-500 dark:text-slate-400">Cliente: {sub.customer.name}</p>
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
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-800">
            <h2 className="text-lg font-semibold text-ink-900 mb-4 dark:text-white">Resumo</h2>
            <dl className="space-y-4">
              <div className="flex justify-between">
                <dt className="text-sm text-ink-500 dark:text-slate-400">Usuários</dt>
                <dd className="text-sm font-semibold text-ink-900 dark:text-white">{company.users.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-ink-500 dark:text-slate-400">Planos</dt>
                <dd className="text-sm font-semibold text-ink-900 dark:text-white">{company.plans.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-ink-500 dark:text-slate-400">Clientes</dt>
                <dd className="text-sm font-semibold text-ink-900 dark:text-white">{company.customers.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-ink-500 dark:text-slate-400">Assinaturas</dt>
                <dd className="text-sm font-semibold text-ink-900 dark:text-white">{company.subscriptions.length}</dd>
              </div>
            </dl>
          </section>

          {/* Plans */}
          <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-800">
            <h2 className="text-lg font-semibold text-ink-900 mb-4 dark:text-white">Planos ({company.plans.length})</h2>
            {company.plans.length === 0 ? (
              <p className="text-sm text-ink-500 dark:text-slate-400">Nenhum plano cadastrado.</p>
            ) : (
              <div className="space-y-2">
                {company.plans.map((plan) => (
                  <div key={plan.id} className="p-3 rounded-xl bg-ink-50 dark:bg-slate-700">
                    <p className="font-medium text-ink-900 dark:text-white">{plan.name}</p>
                    <p className="text-sm text-ink-600 dark:text-slate-300">{formatCurrency(plan.price)}/{plan.interval}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Recent Customers */}
          <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-800">
            <h2 className="text-lg font-semibold text-ink-900 mb-4 dark:text-white">Clientes Recentes</h2>
            {company.customers.length === 0 ? (
              <p className="text-sm text-ink-500 dark:text-slate-400">Nenhum cliente encontrado.</p>
            ) : (
              <div className="space-y-2">
                {company.customers.map((customer) => (
                  <div key={customer.id} className="p-3 rounded-xl bg-ink-50 dark:bg-slate-700">
                    <p className="font-medium text-ink-900 dark:text-white">{customer.name}</p>
                    <p className="text-xs text-ink-500 dark:text-slate-400">{customer.email}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <DeleteModal
          itemName={company.name}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
          loading={deleting}
        />
      )}

      {toast && <Toast message={toast.message} kind={toast.kind} onClose={() => setToast(null)} />}
    </main>
  );
}
