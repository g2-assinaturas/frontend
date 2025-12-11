'use client';

import { FormEvent, Suspense, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Toast } from '@/components/toast';
import { checkoutSubscription } from '@/lib/api';
import { useRequireAuth } from '@/lib/use-require-auth';

function CheckoutContent() {
  const { token, loading: authLoading } = useRequireAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = useMemo(() => searchParams.get('planId') ?? '', [searchParams]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; kind: 'error' | 'success' | 'info' } | null>(null);

  const handleCheckout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setToast(null);

    if (!token) {
      router.replace('/login');
      return;
    }

    try {
      setLoading(true);
      const subscription = await checkoutSubscription(planId, token);
      setToast({ message: `Subscrição criada: ${subscription.id}`, kind: 'success' });
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : 'Falha ao criar subscrição.', kind: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-8 px-6 py-12">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-ink-500">Checkout</p>
          <h1 className="text-3xl font-semibold text-ink-900">Confirmar subscrição</h1>
        </div>
        <Link className="text-sm font-semibold text-ink-700 hover:text-ink-900" href="/plans">
          Voltar aos planos
        </Link>
      </div>

      <form className="space-y-4 rounded-2xl border border-ink-100 bg-white p-6 shadow-card" onSubmit={handleCheckout}>
        <div className="space-y-1 text-sm text-ink-700">
          <p>
            Plano selecionado: <span className="font-semibold text-ink-900">{planId || 'nenhum'}</span>
          </p>
          <p className="text-ink-500">Confirme para criar a subscrição. Necessita de sessão iniciada.</p>
        </div>

        {!planId ? <p className="text-sm text-red-700">Escolha um plano para continuar.</p> : null}

        <button
          type="submit"
          disabled={!planId || loading || authLoading}
          className="inline-flex w-full items-center justify-center rounded-xl bg-ink-900 px-4 py-3 text-sm font-semibold text-ink-50 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'A processar...' : 'Confirmar subscrição'}
        </button>
      </form>

      {toast ? <Toast message={toast.message} kind={toast.kind} onClose={() => setToast(null)} /> : null}
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="px-6 py-12 text-sm text-ink-600">A carregar checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
