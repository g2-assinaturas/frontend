"use client";
import React, { useEffect, Suspense } from 'react';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import Skeleton from '../../../components/Skeleton';
import { useSubscription } from '../../../hooks/useSubscription';
import { useToast } from '../../../components/toast/ToastProvider';
import { useRouter, useSearchParams } from 'next/navigation';

function CheckoutInner() {
  const { subscription, loading, error } = useSubscription({ auto: true, pollPendingMs: 4000, backoffFactor: 1.6, maxIntervalMs: 30000, maxAttempts: 15 });
  const { addToast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get('plan');

  
  useEffect(() => {
    if (subscription?.status === 'ACTIVE') {
      addToast({ type: 'success', message: 'Subscrição ativa.' });
      const t = setTimeout(() => router.replace('/subscription/success'), 1000);
      return () => clearTimeout(t);
    }
  }, [subscription, router, addToast]);

  return (
    <div className="app-container py-10 min-h-screen">
      <h1 className="text-2xl font-semibold mb-6 text-zinc-800 dark:text-zinc-100">Checkout da Subscrição</h1>
      <div className="max-w-lg space-y-6">
        <Card className="p-6 flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">Estado</h2>
          {loading && !subscription && (
            <div className="space-y-3">
              <Skeleton className="h-6" />
              <Skeleton className="h-16" />
            </div>
          )}
          {!loading && error && <p className="text-sm text-red-600 dark:text-red-400" role="alert">{error}</p>}
          {subscription && (
            <div className="space-y-2 text-sm">
              <div><span className="text-zinc-500">Status:</span> <span className="font-medium">{subscription.status}</span></div>
              <div><span className="text-zinc-500">Plano:</span> <span className="font-medium">{subscription.plan?.name || planId || '—'}</span></div>
              {subscription.status === 'PENDING' && (
                <p className="text-xs text-zinc-600 dark:text-zinc-300">A aguardar confirmação. Isto irá atualizar automaticamente.</p>
              )}
              {subscription.status === 'ACTIVE' && (
                <p className="text-xs text-green-700 dark:text-green-300">Ativada com sucesso. Redirecionando...</p>
              )}
            </div>
          )}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" onClick={() => router.push('/dashboard')} aria-label="Ir para dashboard">Dashboard</Button>
            <Button variant="ghost" onClick={() => router.push('/subscription/manage')} aria-label="Gerir subscrição">Gerir</Button>
          </div>
        </Card>
        <Card className="p-6 flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">Detalhes Simulados</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">Esta é uma página placeholder. Futuramente aqui poderemos exibir formulário de pagamento externo ou confirmação adicional.</p>
          <ul className="text-xs list-disc pl-4 text-zinc-500 dark:text-zinc-400">
            <li>Polling para estado PENDING com backoff</li>
            <li>Redireciona ao ficar ACTIVE</li>
            <li>Links de navegação úteis</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="app-container py-10 min-h-screen"><p className="text-sm text-zinc-600 dark:text-zinc-300">A carregar checkout...</p></div>}>
      <CheckoutInner />
    </Suspense>
  );
}
