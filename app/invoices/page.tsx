"use client";
import React, { useState } from 'react';
import { useInvoices } from '../../hooks/useInvoices';
import InvoiceList, { InvoiceDto } from '../../components/subscription/InvoiceList';
import InvoiceDetailModal from '../../components/subscription/InvoiceDetailModal';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Skeleton from '../../components/Skeleton';
import { useToast } from '../../components/toast/ToastProvider';

export default function InvoicesPage() {
  const { invoices, loading, error, refresh } = useInvoices({ auto: true });
  const [selected, setSelected] = useState<InvoiceDto | null>(null);
  const { addToast } = useToast();

  return (
    <div className="app-container py-8">
      <h1 className="text-2xl font-semibold mb-6 text-zinc-800 dark:text-zinc-100">Faturas</h1>
      {loading && (
        <div className="space-y-2 mb-4">
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      )}
      {error && <p className="text-sm text-red-600 dark:text-red-400 mb-4" role="alert">{error}</p>}
      {!loading && !error && (
        <InvoiceList invoices={invoices} onSelect={(inv) => { setSelected(inv); addToast({ type: 'info', message: `Fatura ${inv.id}` }); }} />
      )}
      <InvoiceDetailModal invoice={selected} onClose={() => setSelected(null)} />
      <div className="mt-6">
        <Button onClick={refresh} variant="outline" aria-label="Atualizar lista de faturas" className="text-xs px-3 py-2">Atualizar</Button>
      </div>
    </div>
  );
}
