'use client';
import React, { useEffect, useState } from 'react';
import { getPlans, checkout } from '../../services/api';
import PlanCard from '../../components/PlanCard';

type Plan = {
  id: string;
  name: string;
  description?: string;
  price: number; // cêntimos
  currency?: string;
  interval?: string;
};

type CheckoutResponse = {
  checkoutUrl?: string;
  
} & Record<string, unknown>;

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  try {
    return JSON.stringify(err);
  } catch {
    return 'Erro desconhecido';
  }
}

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        // assumi que getPlans retorna um array compatível com Plan[]
        const data = (await getPlans()) as Plan[];
        setPlans(data);
      } catch (err: unknown) {
        setError(getErrorMessage(err) || 'Erro ao carregar planos');
      }
    }
    load();
  }, []);

  async function handleChoose(planId: string) {
    setLoading(true);
    try {
      const resp = (await checkout(planId)) as CheckoutResponse;
      if (resp?.checkoutUrl && typeof resp.checkoutUrl === 'string') {
        window.location.href = resp.checkoutUrl;
        return;
      }
      alert('Checkout (simulado) — resposta: ' + JSON.stringify(resp));
    } catch (err: unknown) {
      alert('Erro no checkout: ' + getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  if (error) return <div className="p-8">Erro: {error}</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Planos</h1>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        {plans.map((p) => (
          <PlanCard key={p.id} plan={p} onChoose={handleChoose} />
        ))}
      </div>
      {loading && <div className="mt-4">Processando...</div>}
    </div>
  );
}