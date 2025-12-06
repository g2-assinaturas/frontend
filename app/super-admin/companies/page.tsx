"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SuperAdminLayout from '../../../components/super-admin/SuperAdminLayout';
import CompanyTable from '../../../components/super-admin/CompanyTable';
import Button from '../../../components/Button';
import Skeleton from '../../../components/Skeleton';
import { useSuperAdminAuth } from '../../../hooks/useSuperAdminAuth';
import { useCompanies } from '../../../hooks/useCompanies';

export default function CompaniesListPage() {
  const router = useRouter();
  const { superAdmin, loading: authLoading } = useSuperAdminAuth({ auto: true });
  const { companies, loading, refresh } = useCompanies({ auto: true });

  useEffect(() => {
    if (!authLoading && !superAdmin) {
      router.push('/super-admin/login');
    }
  }, [superAdmin, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-zinc-600 dark:text-zinc-400">Carregando...</p>
      </div>
    );
  }

  if (!superAdmin) {
    return null;
  }

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
              Empresas
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Gerencie todas as empresas do sistema
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={refresh} disabled={loading}>
              {loading ? 'Atualizando...' : 'Atualizar'}
            </Button>
            <Button onClick={() => router.push('/super-admin/companies/new')}>
              + Nova Empresa
            </Button>
          </div>
        </div>

        {loading && companies.length === 0 ? (
          <div className="space-y-3">
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
          </div>
        ) : (
          <CompanyTable
            companies={companies}
            onRefresh={refresh}
            onEdit={(id) => router.push(`/super-admin/companies/${id}/edit`)}
            onView={(id) => router.push(`/super-admin/companies/${id}`)}
          />
        )}
      </div>
    </SuperAdminLayout>
  );
}
