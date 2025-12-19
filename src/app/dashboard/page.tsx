'use client';

import Link from 'next/link';
import { useRequireAuth } from '@/lib/use-require-auth';
import { ThemeToggle } from '@/components/theme-toggle';

export default function DashboardPage() {
  const { user, loading, logout } = useRequireAuth();

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ink-50 text-ink-700 dark:bg-slate-900 dark:text-slate-300">
        A carregar...
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-12 dark:bg-slate-900">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm text-ink-500 dark:text-slate-400">Sessão</p>
          <h1 className="text-2xl font-semibold text-ink-900 dark:text-white">Olá, {user?.name ?? 'utilizador'}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
          <ThemeToggle />
          <Link className="rounded-full border border-ink-200 px-4 py-2 text-ink-900 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-700" href="/plans">
            Planos
          </Link>
          <Link className="rounded-full border border-ink-200 px-4 py-2 text-ink-900 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-700" href="/subscription">
            Subscrição
          </Link>
          <Link className="rounded-full border border-ink-200 px-4 py-2 text-ink-900 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-700" href="/invoices">
            Faturas
          </Link>
          <button
            onClick={logout}
            className="rounded-full bg-ink-900 px-4 py-2 text-ink-50 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-slate-600 dark:hover:bg-slate-500"
          >
            Sair
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500 dark:text-slate-400">Perfil</p>
          <div className="mt-3 space-y-2 text-sm text-ink-700 dark:text-slate-300">
            <div>
              <span className="font-medium text-ink-800 dark:text-white">Nome:</span> {user?.name ?? '-'}
            </div>
            <div>
              <span className="font-medium text-ink-800 dark:text-white">Email:</span> {user?.email ?? '-'}
            </div>
            <div>
              <span className="font-medium text-ink-800 dark:text-white">Ativo:</span> {user?.isActive ? 'Sim' : 'Não'}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500 dark:text-slate-400">Próximos passos</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-700 dark:text-slate-300">
            <li>• Rever planos disponíveis</li>
            <li>• Efetuar checkout de um plano</li>
            <li>• Consultar faturas emitidas</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
