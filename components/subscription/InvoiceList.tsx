"use client";
import React from 'react';
import Card from '../Card';
import { Badge } from '../Badge';
import Button from '../Button';
import { formatMoney, formatDate } from '../../lib/format';

export interface InvoiceDto {
  id: string;
  amount: number;
  currency: string;
  status: string;
  dueDate?: string;
  paidAt?: string;
}



export default function InvoiceList({ invoices, onSelect }: { invoices: InvoiceDto[]; onSelect?: (inv: InvoiceDto) => void }) {
  if (!invoices.length) {
    return <Card className="text-sm text-zinc-700 dark:text-zinc-200">Sem faturas disponíveis.</Card>;
  }
  return (
    <div className="space-y-3">
      {invoices.map(inv => (
        <Card key={inv.id} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 min-w-0">
            <div className="text-xs text-zinc-500">ID</div>
            <div className="truncate text-xs font-medium text-zinc-800 dark:text-zinc-100" title={inv.id}>{inv.id}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-500">Valor</div>
            <div className="text-sm font-medium text-zinc-800 dark:text-zinc-100">{formatMoney(inv.amount, inv.currency)}</div>
          </div>
          <div>
            <div className="text-xs text-zinc-500">Status</div>
            <Badge status={inv.status.toUpperCase()} />
          </div>
          <div className="text-xs text-zinc-500">
            {inv.paidAt ? formatDate(inv.paidAt) : (inv.dueDate ? formatDate(inv.dueDate) : '-')}
          </div>
          {onSelect && (
            <div>
              <Button
                onClick={() => onSelect(inv)}
                className="text-xs py-1 px-2"
                variant="ghost"
                aria-label={`Ver detalhes da fatura ${inv.id}`}
              >Detalhes</Button>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}
