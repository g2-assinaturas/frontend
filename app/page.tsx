import Link from 'next/link';
import Card from '../components/Card';

/**
 * Home Page: Hero landing page com apresentação do sistema e grid de funcionalidades
 * - Hero centralizado com título em gradiente
 * - Descrição clara
 * - Grid de 6 cards de funcionalidades
 * - Sem botões no meio (agora estão no header)
 * - Responsivo mobile-first
 */
export default function Home() {
  // Features data array para manutenção e consistência
  const features = [
    {
      id: 'plans',
      title: 'Planos Flexíveis',
      description: 'Mensal, semestral ou anual para adaptar seu crescimento.',
    },
    {
      id: 'status',
      title: 'Status em Tempo Real',
      description: 'Acompanhe ativação, cancelamento e ciclo de faturação.',
    },
    {
      id: 'invoices',
      title: 'Faturas Centralizadas',
      description: 'Histórico de cobranças acessível e pronto para auditoria.',
    },
    {
      id: 'management',
      title: 'Gestão Simples',
      description: 'Cancelamento seguro no fim do período e upgrades.',
    },
    {
      id: 'darkmode',
      title: 'Dark Mode',
      description: 'Interface otimizada para baixa luminosidade.',
    },
    {
      id: 'integration',
      title: 'Extensível',
      description: 'Preparado para integrações e webhooks Stripe.',
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--background)] transition-colors">
      {/* Hero Section */}
      <section className="w-full py-20 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-blue-50/50 to-indigo-50/30 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800">
        <div className="app-container max-w-4xl mx-auto text-center space-y-8">
          {/* Title with gradient */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
            <span className="accent-gradient-text">Sistema de Assinaturas</span>
            <br />
            <span className="text-zinc-900 dark:text-zinc-50">Grupo 2</span>
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Plataforma prática para gestão de planos, subscrições e faturação. Explore recursos poderosos para sua empresa.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 bg-[var(--background)]">
        <div className="app-container">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
              Recursos Principais
            </h2>
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
              Tudo que você precisa para gerenciar assinaturas de forma profissional.
            </p>
          </div>

          {/* Features Grid: Responsive 1 col → 2 cols → 3 cols */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature) => (
              <Card
                key={feature.id}
                className="space-y-3"
              >
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  {feature.title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
