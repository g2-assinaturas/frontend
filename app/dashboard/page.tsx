"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import SubscriptionStatus from '../../components/subscription/SubscriptionStatus';
import InvoiceList from '../../components/subscription/InvoiceList';
import Skeleton from '../../components/Skeleton';
import { useToast } from '../../components/toast/ToastProvider';
import { getCurrentSubscription, getInvoices } from '../../lib/api';

type Subscription = {
  id: string;
  status: string;
  plan: { id: string; name: string; price: number; currency?: string };
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd: boolean;
};

type Invoice = { id: string; amount: number; currency: string; status: string; dueDate?: string; paidAt?: string };

export default function DashboardPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    let mounted = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    Promise.all([getCurrentSubscription(), getInvoices()])
      .then(([subRes, invRes]: any) => {
        if (!mounted) return;
        setSubscription(subRes ?? null);
        setInvoices(invRes ?? []);
      })
      .catch((err) => { console.error(err); addToast({ type: 'error', message: 'Falha ao carregar dados.' }); })
      .finally(() => setLoading(false));
    return () => { mounted = false; };
  }, [addToast]);

  return (
    <div className="min-h-screen bg-[var(--background)] transition-colors">
      <main className="app-container py-10">
        <h1 className="mb-4 text-2xl font-semibold">Dashboard</h1>

        <section className="mb-6">
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-24" />
            </div>
          ) : (
            <SubscriptionStatus subscription={subscription} onManage={() => addToast({ type: 'info', message: 'Funcionalidade de gestão em construção.' })} />
          )}
        </section>

        <section>
          <h2 className="mb-3 text-lg font-medium">Faturas</h2>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          ) : (
            <InvoiceList invoices={invoices} onSelect={(inv) => addToast({ type: 'info', message: `Fatura ${inv.id}` })} />
          )}
        </section>
      </main>
    </div>
  );
}
