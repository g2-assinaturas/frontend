'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSuperAdmin } from '@/lib/super-admin-context';
import { Toast } from '@/components/toast';
import { ThemeToggle } from '@/components/theme-toggle';

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const { login, loading } = useSuperAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState<{ message: string; kind: 'error' | 'success' | 'info' } | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setToast(null);
    try {
      await login(email, password);
      setToast({ message: 'Sessão iniciada', kind: 'success' });
      router.push('/super-admin/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Falha ao entrar.';
      setToast({ message, kind: 'error' });
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink-50 px-6 py-12 dark:bg-slate-900">
      <div className="w-full max-w-md rounded-3xl border border-ink-100 bg-white p-8 shadow-card dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-6 space-y-2 text-center">
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>
          <p className="text-sm font-semibold uppercase tracking-wide text-ink-500 dark:text-slate-400">Super Admin</p>
          <h1 className="text-2xl font-semibold text-ink-900 dark:text-white">Acesso restrito</h1>
          <p className="text-sm text-ink-600 dark:text-slate-400">Gestão de empresas e utilizadores.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink-800 dark:text-slate-300" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-ink-900 outline-none ring-0 transition focus:border-ink-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-slate-500"
              placeholder="admin@empresa.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ink-800 dark:text-slate-300" htmlFor="password">
              Palavra-passe
            </label>
            <input
              id="password"
              className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-ink-900 outline-none ring-0 transition focus:border-ink-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-slate-500"
              placeholder="••••••••"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-xl bg-ink-900 px-4 py-3 text-sm font-semibold text-ink-50 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70 dark:bg-slate-600 dark:hover:bg-slate-500"
          >
            {loading ? 'A entrar...' : 'Entrar'}
          </button>
        </form>
      </div>

      {toast ? <Toast message={toast.message} kind={toast.kind} onClose={() => setToast(null)} /> : null}
    </main>
  );
}
