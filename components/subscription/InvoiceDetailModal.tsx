"use client";
import React, { useEffect } from 'react';
import { InvoiceDto } from './InvoiceList';
import Card from '../Card';
import Button from '../Button';
import { formatMoney, formatDate } from '../../lib/format';

interface Props {
  invoice: InvoiceDto | null;
  onClose: () => void;
}



export default function InvoiceDetailModal({ invoice, onClose }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (invoice) {
      window.addEventListener('keydown', onKey);
    }
    return () => window.removeEventListener('keydown', onKey);
  }, [invoice, onClose]);

  if (!invoice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <Card className="relative z-10 w-full max-w-md p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">Fatura</h2>
          <Button onClick={onClose} className="text-xs px-2 py-1">Fechar</Button>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-500">ID</span>
            <span className="font-medium text-zinc-800 dark:text-zinc-100 truncate max-w-[60%]" title={invoice.id}>{invoice.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Valor</span>
            <span className="font-medium text-zinc-800 dark:text-zinc-100">{formatMoney(invoice.amount, invoice.currency)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Status</span>
            <span className="font-medium text-zinc-800 dark:text-zinc-100">{invoice.status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Vencimento</span>
            <span className="font-medium text-zinc-800 dark:text-zinc-100">{formatDate(invoice.dueDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">Pago em</span>
            <span className="font-medium text-zinc-800 dark:text-zinc-100">{formatDate(invoice.paidAt)}</span>
          </div>
        </div>
        <p className="text-xs text-zinc-500">Prima ESC ou fora da caixa para fechar.</p>
      </Card>
    </div>
  );
}
