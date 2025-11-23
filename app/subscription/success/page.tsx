"use client";
import React from 'react';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import { useRouter } from 'next/navigation';
import { useSubscription } from '../../../hooks/useSubscription';

export default function SuccessPage() {
  const { subscription } = useSubscription({ auto: true });
  const router = useRouter();
  return (
    <div className="app-container py-10 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6 text-zinc-800 dark:text-zinc-100">Subscrição Atualizada</h1>
      <div className="max-w-lg space-y-6">
        <Card className="p-6 flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">Resumo</h2>
          {subscription ? (
            <div className="text-sm space-y-1">
              <div><span className="text-zinc-500">Status:</span> <span className="font-medium">{subscription.status}</span></div>
              <div><span className="text-zinc-500">Plano:</span> <span className="font-medium">{subscription.plan?.name || '—'}</span></div>
              <div><span className="text-zinc-500">Renovação:</span> <span className="font-medium">{subscription.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : '—'}</span></div>
            </div>
          ) : (
            <p className="text-sm text-zinc-600 dark:text-zinc-300">Subscrição não carregada.</p>
          )}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => router.push('/dashboard')} aria-label="Ir para dashboard">Dashboard</Button>
            <Button variant="ghost" onClick={() => router.push('/plans')} aria-label="Ver planos">Planos</Button>
            <Button onClick={() => router.push('/subscription/manage')} aria-label="Gerir subscrição">Gerir</Button>
          </div>
        </Card>
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2 text-zinc-800 dark:text-zinc-100">Próximos Passos</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">Aqui podemos adicionar confirmação de pagamento, nota fiscal, ou upsell para funcionalidades adicionais.</p>
        </Card>
      </div>
    </div>
  );
}
