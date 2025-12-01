import Link from 'next/link';
import Button from '../components/Button';
import Card from '../components/Card';

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)] transition-colors">
      <main className="app-container py-20 flex flex-col gap-12">
        <section className="flex flex-col gap-6 max-w-3xl">
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            <span className="accent-gradient-text">Sistema de Assinaturas</span> Grupo 2
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-300 max-w-xl">
            Plataforma prática para gestão de planos, subscrições e faturação. Experimente criar uma conta ou explorar os planos disponíveis.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/plans"><Button>Ver Planos</Button></Link>
            <Link href="/register"><Button className="bg-zinc-200 text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600">Criar Conta</Button></Link>
            <Link href="/login"><Button className="bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700">Entrar</Button></Link>
          </div>
        </section>
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="space-y-2">
            <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Planos Flexíveis</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-300">Mensal, semestral ou anual para adaptar seu crescimento.</p>
          </Card>
          <Card className="space-y-2">
            <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Status em Tempo Real</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-300">Acompanhe ativação, cancelamento e ciclo de faturação.</p>
          </Card>
          <Card className="space-y-2">
            <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Faturas Centralizadas</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-300">Histórico de cobranças acessível e pronto para auditoria.</p>
          </Card>
          <Card className="space-y-2">
            <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Gestão Simples</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-300">Cancelamento seguro no fim do período e upgrades.</p>
          </Card>
          <Card className="space-y-2">
            <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Dark Mode</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-300">Interface otimizada para baixa luminosidade.</p>
          </Card>
          <Card className="space-y-2">
            <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">Extensível</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-300">Preparado para integrações e webhooks Stripe.</p>
          </Card>
        </section>
      </main>
    </div>
  );
}
