"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SuperAdminLayout from '../../../../components/super-admin/SuperAdminLayout';
import CompanyForm from '../../../../components/super-admin/CompanyForm';
import { useSuperAdminAuth } from '../../../../hooks/useSuperAdminAuth';
import { createCompany, CreateCompanyDto } from '../../../../lib/api';
import { useToast } from '../../../../components/toast/ToastProvider';

export default function NewCompanyPage() {
  const router = useRouter();
  const { superAdmin, loading: authLoading } = useSuperAdminAuth({ auto: true });
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !superAdmin) {
      router.push('/super-admin/login');
    }
  }, [superAdmin, authLoading, router]);

  const handleSubmit = async (data: CreateCompanyDto) => {
    setLoading(true);
    try {
      await createCompany(data);
      addToast({ type: 'success', message: 'Empresa criada com sucesso!' });
      router.push('/super-admin/companies');
    } catch (err: any) {
      addToast({ type: 'error', message: err?.message || 'Erro ao criar empresa' });
    } finally {
      setLoading(false);
    }
  };

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
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <button
            onClick={() => router.back()}
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 mb-4 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </button>
          <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
            Nova Empresa
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Cadastre uma nova empresa no sistema
          </p>
        </div>

        <CompanyForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </SuperAdminLayout>
  );
}
