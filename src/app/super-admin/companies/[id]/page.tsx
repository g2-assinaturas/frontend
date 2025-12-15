'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getCompanyDetails, toggleCompanyStatus, deleteCompany } from '@/lib/api';
import { useRequireSuperAdmin } from '@/lib/use-require-super-admin';
import { Toast } from '@/components/toast';
import type { CompanyDetails } from '@/lib/types';

/**
 * Format date to localized string
 */
function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Format currency value in BRL
 */
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value / 100);
}

/**
 * Format phone number
 */
function formatPhone(value: string | null): string {
  if (!value) return '-';
  const digits = value.replace(/\D/g, '');
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return value;
}

/**
 * Format CNPJ
 */
function formatCnpj(value: string | null): string {
  if (!value) return '-';
  const digits = value.replace(/\D/g, '');
  if (digits.length === 14) {
    return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
  }
  return value;
}

/**
 * Delete confirmation modal
 */
function DeleteModal({
  companyName,
  onConfirm,
  onCancel,
  loading,
}: {
  companyName: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-ink-900">Confirmar eliminação</h3>
        <p className="mt-2 text-sm text-ink-600">
          Tem a certeza que deseja eliminar permanentemente a empresa <strong>{companyName}</strong>? 
          Esta ação não pode ser desfeita e todos os dados serão perdidos.
        </p>
        <div className="mt-6 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-ink-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'A eliminar...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
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
      <main className="mx-auto min-h-screen max-w-6xl px-6 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 rounded bg-ink-100" />
          <div className="h-64 rounded-2xl bg-ink-100" />
        </div>
      </main>
    );
  }

  if (!company) {
    return (
      <main className="mx-auto min-h-screen max-w-6xl px-6 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-ink-900">Empresa não encontrada</h1>
          <Link href="/super-admin/dashboard" className="mt-4 inline-block text-blue-600 hover:underline">
            Voltar ao Dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-6 py-12">
      {/* Header */}
      <header className="mb-8">
        <Link
          href="/super-admin/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-ink-500 hover:text-ink-700 mb-4"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar ao Dashboard
        </Link>
        
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold text-ink-900">{company.name}</h1>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                company.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
              }`}>
                {company.isActive ? 'Ativa' : 'Inativa'}
              </span>
            </div>
            <p className="mt-1 text-sm text-ink-500">Criada em {formatDate(company.createdAt)}</p>
          </div>
          
          <div className="flex gap-3">
            <Link
              href={`/super-admin/companies/${company.id}/edit`}
              className="rounded-xl border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-ink-50"
            >
              Editar
            </Link>
            <button
              onClick={handleToggleStatus}
              className="rounded-xl border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-ink-50"
            >
              {company.isActive ? 'Desativar' : 'Ativar'}
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
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
          <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
            <h2 className="text-lg font-semibold text-ink-900 mb-4">Informações Básicas</h2>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-ink-500">Email</dt>
                <dd className="mt-1 text-sm text-ink-900">{company.email || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-ink-500">Telefone</dt>
                <dd className="mt-1 text-sm text-ink-900">{formatPhone(company.phone)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-ink-500">CNPJ</dt>
                <dd className="mt-1 text-sm text-ink-900">{formatCnpj(company.cnpj)}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-ink-500">Slug</dt>
                <dd className="mt-1 text-sm text-ink-900 font-mono">{company.slug}</dd>
              </div>
              {company.description && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-ink-500">Descrição</dt>
                  <dd className="mt-1 text-sm text-ink-900">{company.description}</dd>
                </div>
              )}
            </dl>
          </section>

          {/* Address */}
          {company.address && (
            <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
              <h2 className="text-lg font-semibold text-ink-900 mb-4">Endereço</h2>
              <p className="text-sm text-ink-900">
                {company.address.street}, {company.address.number}
                {company.address.complement && ` - ${company.address.complement}`}
              </p>
              <p className="text-sm text-ink-700">
                {company.address.neighborhood} - {company.address.city}/{company.address.state}
              </p>
              <p className="text-sm text-ink-500">CEP: {company.address.zipCode}</p>
            </section>
          )}

          {/* Users */}
          <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
            <h2 className="text-lg font-semibold text-ink-900 mb-4">
              Usuários ({company.users.length})
            </h2>
            {company.users.length === 0 ? (
              <p className="text-sm text-ink-500">Nenhum usuário cadastrado.</p>
            ) : (
              <div className="space-y-3">
                {company.users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 rounded-xl bg-ink-50">
                    <div>
                      <p className="font-medium text-ink-900">{user.name}</p>
                      <p className="text-xs text-ink-500">{user.email}</p>
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      user.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {user.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Subscriptions */}
          <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
            <h2 className="text-lg font-semibold text-ink-900 mb-4">
              Assinaturas Recentes ({company.subscriptions.length})
            </h2>
            {company.subscriptions.length === 0 ? (
              <p className="text-sm text-ink-500">Nenhuma assinatura encontrada.</p>
            ) : (
              <div className="space-y-3">
                {company.subscriptions.map((sub) => (
                  <div key={sub.id} className="flex items-center justify-between p-3 rounded-xl bg-ink-50">
                    <div>
                      <p className="font-medium text-ink-900">{sub.plan.name}</p>
                      <p className="text-xs text-ink-500">Cliente: {sub.customer.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-ink-900">{formatCurrency(sub.plan.price)}</p>
                      <span className={`text-xs font-medium ${
                        sub.status === 'ACTIVE' ? 'text-emerald-600' : 
                        sub.status === 'TRIALING' ? 'text-blue-600' : 'text-ink-500'
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
          <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
            <h2 className="text-lg font-semibold text-ink-900 mb-4">Resumo</h2>
            <dl className="space-y-4">
              <div className="flex justify-between">
                <dt className="text-sm text-ink-500">Usuários</dt>
                <dd className="text-sm font-semibold text-ink-900">{company.users.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-ink-500">Planos</dt>
                <dd className="text-sm font-semibold text-ink-900">{company.plans.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-ink-500">Clientes</dt>
                <dd className="text-sm font-semibold text-ink-900">{company.customers.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-ink-500">Assinaturas</dt>
                <dd className="text-sm font-semibold text-ink-900">{company.subscriptions.length}</dd>
              </div>
            </dl>
          </section>

          {/* Plans */}
          <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
            <h2 className="text-lg font-semibold text-ink-900 mb-4">Planos ({company.plans.length})</h2>
            {company.plans.length === 0 ? (
              <p className="text-sm text-ink-500">Nenhum plano cadastrado.</p>
            ) : (
              <div className="space-y-2">
                {company.plans.map((plan) => (
                  <div key={plan.id} className="p-3 rounded-xl bg-ink-50">
                    <p className="font-medium text-ink-900">{plan.name}</p>
                    <p className="text-sm text-ink-600">{formatCurrency(plan.price)}/{plan.interval}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Recent Customers */}
          <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
            <h2 className="text-lg font-semibold text-ink-900 mb-4">Clientes Recentes</h2>
            {company.customers.length === 0 ? (
              <p className="text-sm text-ink-500">Nenhum cliente encontrado.</p>
            ) : (
              <div className="space-y-2">
                {company.customers.map((customer) => (
                  <div key={customer.id} className="p-3 rounded-xl bg-ink-50">
                    <p className="font-medium text-ink-900">{customer.name}</p>
                    <p className="text-xs text-ink-500">{customer.email}</p>
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
          companyName={company.name}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
          loading={deleting}
        />
      )}

      {toast && <Toast message={toast.message} kind={toast.kind} onClose={() => setToast(null)} />}
    </main>
  );
}
