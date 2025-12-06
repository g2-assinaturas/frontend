"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { useSuperAdminAuth } from '../../hooks/useSuperAdminAuth';

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const { superAdmin, signOut } = useSuperAdminAuth({ auto: true });
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push('/super-admin/login');
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">SA</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-zinc-800 dark:text-zinc-100">Super Admin</h1>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Painel de Gestão</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => router.push('/super-admin/dashboard')}
                className="text-sm text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={() => router.push('/super-admin/companies')}
                className="text-sm text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                Empresas
              </button>
            </nav>

            {superAdmin && (
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
                    {superAdmin.name || superAdmin.email}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Super Admin</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-sm bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
