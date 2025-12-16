'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { listInvoices } from '@/lib/api';
import { useRequireAuth } from '@/lib/use-require-auth';
import { ThemeToggle } from '@/components/theme-toggle';
import type { Invoice } from '@/lib/types';
import { Toast } from '@/components/toast';

function formatMoney(amount: number, currency: string) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(amount / 100);
}

export default function InvoicesPage() {
  const { token, loading: authLoading } = useRequireAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; kind: 'error' | 'success' | 'info' } | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    listInvoices(token)
      .then(setInvoices)
      .catch((err) => {
        const message = err instanceof Error ? err.message : 'Erro ao carregar faturas.';
        setToast({ message, kind: 'error' });
      })
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col gap-8 px-6 py-12 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-ink-500 dark:text-slate-400">Faturas</p>
          <h1 className="text-3xl font-semibold text-ink-900 dark:text-white">Histórico de faturação</h1>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link className="text-sm font-semibold text-ink-700 hover:text-ink-900 dark:text-slate-300 dark:hover:text-white" href="/dashboard">
            Voltar ao painel
          </Link>
        </div>
      </div>

      {authLoading || loading ? <p className="text-ink-700 dark:text-slate-300">A carregar faturas...</p> : null}

      <div className="rounded-2xl border border-ink-100 bg-white shadow-card dark:border-slate-700 dark:bg-slate-800">
        <div className="grid grid-cols-5 gap-2 border-b border-ink-100 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-ink-500 dark:border-slate-700 dark:text-slate-400">
          <span>ID</span>
          <span>Status</span>
          <span>Montante</span>
          <span>Emissão</span>
          <span>Vencimento</span>
        </div>
        {invoices.length === 0 && !loading ? (
          <p className="px-4 py-6 text-sm text-ink-700 dark:text-slate-300">Nenhuma fatura encontrada.</p>
        ) : null}
        {invoices.map((invoice) => (
          <div key={invoice.id} className="grid grid-cols-5 gap-2 border-b border-ink-50 px-4 py-3 text-sm text-ink-700 last:border-b-0 dark:border-slate-700 dark:text-slate-300">
            <span className="truncate text-ink-900 dark:text-white">{invoice.id}</span>
            <span>{invoice.status}</span>
            <span className="font-semibold text-ink-900 dark:text-white">{formatMoney(invoice.amount, invoice.currency)}</span>
            <span>{invoice.issuedAt ?? '-'}</span>
            <span>{invoice.dueAt ?? '-'}</span>
          </div>
        ))}
      </div>

      {toast ? <Toast message={toast.message} kind={toast.kind} onClose={() => setToast(null)} /> : null}
    </main>
  );
}
