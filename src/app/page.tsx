import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-6 py-16 dark:bg-slate-900">
      <header className="flex items-center justify-between">
        <div className="text-lg font-semibold text-ink-900 dark:text-white">SaaS Control</div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <ThemeToggle />
          <Link className="text-ink-700 hover:text-ink-900 dark:text-slate-300 dark:hover:text-white" href="/login">
            Entrar
          </Link>
          <Link
            className="rounded-full bg-ink-900 px-4 py-2 text-ink-50 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-slate-600 dark:hover:bg-slate-500"
            href="/register"
          >
            Criar conta
          </Link>
        </div>
      </header>

      <section className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
        <div className="space-y-6">
          <p className="inline rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink-700 shadow-card dark:bg-slate-800 dark:text-slate-300">
            Gestão de assinaturas B2B
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-ink-900 md:text-5xl dark:text-white">
            Um painel claro para planos, faturação e acessos.
          </h1>
          <p className="text-lg text-ink-700 dark:text-slate-300">
            Um cockpit único para gerir planos, subscrições, faturação e acessos das suas empresas cliente.
          </p>
          <div className="flex gap-4">
            <Link
              className="rounded-full bg-ink-900 px-5 py-3 text-sm font-semibold text-ink-50 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-slate-600 dark:hover:bg-slate-500"
              href="/register"
            >
              Criar conta
            </Link>
            <Link className="rounded-full border border-ink-200 px-5 py-3 text-sm font-semibold text-ink-900 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-700" href="/plans">
              Ver planos
            </Link>
          </div>
          <ul className="space-y-2 text-sm text-ink-700 dark:text-slate-400">
            <li>• Autenticação JWT para empresas</li>
            <li>• Checkout rápido e gestão de faturas</li>
            <li>• Espaço de super-admin para gerir empresas</li>
          </ul>
        </div>

        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-ink-100 via-white to-ink-50 blur-3xl dark:from-slate-800 dark:via-slate-900 dark:to-slate-800" />
          <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-800">
            <div className="grid grid-cols-2 gap-4 text-sm font-medium text-ink-700 dark:text-slate-300">
              <div className="rounded-2xl bg-ink-50 p-4 dark:bg-slate-700">
                <div className="text-xs text-ink-500 dark:text-slate-400">Subscrições ativas</div>
                <div className="text-3xl font-semibold text-ink-900 dark:text-white">128</div>
              </div>
              <div className="rounded-2xl bg-ink-50 p-4 dark:bg-slate-700">
                <div className="text-xs text-ink-500 dark:text-slate-400">MRR</div>
                <div className="text-3xl font-semibold text-ink-900 dark:text-white">R$ 87,5k</div>
              </div>
              <div className="rounded-2xl bg-ink-50 p-4 dark:bg-slate-700">
                <div className="text-xs text-ink-500 dark:text-slate-400">Churn</div>
                <div className="text-3xl font-semibold text-ink-900 dark:text-white">1.9%</div>
              </div>
              <div className="rounded-2xl bg-ink-50 p-4 dark:bg-slate-700">
                <div className="text-xs text-ink-500 dark:text-slate-400">Novas empresas</div>
                <div className="text-3xl font-semibold text-ink-900 dark:text-white">12</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
