"use client";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SuperAdminLayout from '../../../components/super-admin/SuperAdminLayout';
import Card from '../../../components/Card';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from '../../../components/Badge';
import { useSuperAdminAuth } from '../../../hooks/useSuperAdminAuth';
import { useCompanies } from '../../../hooks/useCompanies';

export default function SuperAdminDashboard() {
  const router = useRouter();
  const { superAdmin, loading: authLoading } = useSuperAdminAuth({ auto: true });
  const { companies, loading: companiesLoading } = useCompanies({ auto: true });

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

  const totalCompanies = companies.length;
  const activeCompanies = companies.filter((c: any) => c.isActive).length;
  const inactiveCompanies = totalCompanies - activeCompanies;

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
            Dashboard
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Visão geral do sistema
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Total de Empresas</p>
                <p className="text-3xl font-bold text-zinc-800 dark:text-zinc-100 mt-2">
                  {companiesLoading ? '...' : totalCompanies}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Empresas Ativas</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
                  {companiesLoading ? '...' : activeCompanies}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Empresas Inativas</p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">
                  {companiesLoading ? '...' : inactiveCompanies}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </Card>
        </div>

        {/* Ações Rápidas */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-4">
            Ações Rápidas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => router.push('/super-admin/companies/new')}
              className="p-4 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg hover:border-purple-500 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-purple-900/50 transition-colors">
                  <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-zinc-800 dark:text-zinc-100">Nova Empresa</p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">Cadastrar uma nova empresa</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => router.push('/super-admin/companies')}
              className="p-4 border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/50 transition-colors">
                  <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-zinc-800 dark:text-zinc-100">Gerenciar Empresas</p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">Ver todas as empresas</p>
                </div>
              </div>
            </button>
          </div>
        </Card>

        {/* Últimas Empresas */}
        {!companiesLoading && companies.length > 0 && (
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-4">
              Últimas Empresas
            </h2>
            <div className="space-y-3">
              {companies.slice(0, 5).map((company: any) => (
                <div
                  key={company.id}
                  className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {company.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-zinc-800 dark:text-zinc-100">
                        {company.name}
                      </p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">
                        {company.email}
                      </p>
                    </div>
                  </div>
                  <Badge status={company.isActive ? 'ACTIVE' : 'CANCELED'} />
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </SuperAdminLayout>
  );
}
