import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-6 py-16">
      <header className="flex items-center justify-between">
        <div className="text-lg font-semibold text-ink-900">SaaS Control</div>
        <div className="flex gap-4 text-sm font-medium">
          <Link className="text-ink-700 hover:text-ink-900" href="/login">
            Entrar
          </Link>
          <Link
            className="rounded-full bg-ink-900 px-4 py-2 text-ink-50 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg"
            href="/register"
          >
            Criar conta
          </Link>
        </div>
      </header>

      <section className="grid grid-cols-1 items-center gap-12 md:grid-cols-2">
        <div className="space-y-6">
          <p className="inline rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink-700 shadow-card">
            Gestão de assinaturas B2B
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-ink-900 md:text-5xl">
            Um painel claro para planos, faturação e acessos.
          </h1>
          <p className="text-lg text-ink-700">
            Um cockpit único para gerir planos, subscrições, faturação e acessos das suas empresas cliente.
          </p>
          <div className="flex gap-4">
            <Link
              className="rounded-full bg-ink-900 px-5 py-3 text-sm font-semibold text-ink-50 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg"
              href="/register"
            >
              Criar conta
            </Link>
            <Link className="rounded-full border border-ink-200 px-5 py-3 text-sm font-semibold text-ink-900" href="/plans">
              Ver planos
            </Link>
          </div>
          <ul className="space-y-2 text-sm text-ink-700">
            <li>• Autenticação JWT para empresas</li>
            <li>• Checkout rápido e gestão de faturas</li>
            <li>• Espaço de super-admin para gerir empresas</li>
          </ul>
        </div>

        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-ink-100 via-white to-ink-50 blur-3xl" />
          <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-card">
            <div className="grid grid-cols-2 gap-4 text-sm font-medium text-ink-700">
              <div className="rounded-2xl bg-ink-50 p-4">
                <div className="text-xs text-ink-500">Subscrições ativas</div>
                <div className="text-3xl font-semibold text-ink-900">128</div>
              </div>
              <div className="rounded-2xl bg-ink-50 p-4">
                <div className="text-xs text-ink-500">MRR</div>
                <div className="text-3xl font-semibold text-ink-900">€18.7k</div>
              </div>
              <div className="rounded-2xl bg-ink-50 p-4">
                <div className="text-xs text-ink-500">Churn</div>
                <div className="text-3xl font-semibold text-ink-900">1.9%</div>
              </div>
              <div className="rounded-2xl bg-ink-50 p-4">
                <div className="text-xs text-ink-500">Novas empresas</div>
                <div className="text-3xl font-semibold text-ink-900">12</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
