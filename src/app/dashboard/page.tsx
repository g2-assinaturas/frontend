'use client';

import Link from 'next/link';
import { useRequireAuth } from '@/lib/use-require-auth';

export default function DashboardPage() {
  const { user, loading, logout } = useRequireAuth();

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ink-50 text-ink-700">
        A carregar...
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-12">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm text-ink-500">Sessão</p>
          <h1 className="text-2xl font-semibold text-ink-900">Olá, {user?.name ?? 'utilizador'}</h1>
        </div>
        <div className="flex flex-wrap gap-3 text-sm font-medium">
          <Link className="rounded-full border border-ink-200 px-4 py-2 text-ink-900" href="/plans">
            Planos
          </Link>
          <Link className="rounded-full border border-ink-200 px-4 py-2 text-ink-900" href="/subscription">
            Subscrição
          </Link>
          <Link className="rounded-full border border-ink-200 px-4 py-2 text-ink-900" href="/invoices">
            Faturas
          </Link>
          <button
            onClick={logout}
            className="rounded-full bg-ink-900 px-4 py-2 text-ink-50 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            Sair
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Perfil</p>
          <div className="mt-3 space-y-2 text-sm text-ink-700">
            <div>
              <span className="font-medium text-ink-800">Nome:</span> {user?.name ?? '-'}
            </div>
            <div>
              <span className="font-medium text-ink-800">Email:</span> {user?.email ?? '-'}
            </div>
            <div>
              <span className="font-medium text-ink-800">Ativo:</span> {user?.isActive ? 'Sim' : 'Não'}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">Próximos passos</p>
          <ul className="mt-3 space-y-2 text-sm text-ink-700">
            <li>• Rever planos disponíveis</li>
            <li>• Efetuar checkout de um plano</li>
            <li>• Consultar faturas emitidas</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
