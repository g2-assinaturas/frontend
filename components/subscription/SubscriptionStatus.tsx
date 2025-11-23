"use client";
import React from 'react';
import { Badge } from '../Badge';
import Card from '../Card';
import Button from '../Button';
import { formatDate } from '../../lib/format';

export interface SubscriptionDto {
  id: string;
  status: string;
  plan?: { id: string; name: string; price: number; currency?: string };
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
}



function statusMessage(sub: SubscriptionDto) {
  switch (sub.status) {
    case 'ACTIVE': return 'Subscrição ativa.';
    case 'PENDING': return 'Pagamento a processar.';
    case 'PAST_DUE': return 'Pagamento em atraso – ação necessária.';
    case 'CANCELED': return 'Subscrição cancelada.';
    case 'EXPIRED': return 'Subscrição expirada.';
    case 'PAYMENT_FAILED': return 'Falha no pagamento – verifique o método.';
    default: return 'Estado desconhecido.';
  }
}

export default function SubscriptionStatus({ subscription, onManage }: { subscription?: SubscriptionDto | null; onManage?: () => void }) {
  if (!subscription) {
    return (
      <Card>
        <h2 className="mb-2 text-lg font-medium text-zinc-800 dark:text-zinc-100">Estado da Subscrição</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">Não existe subscrição activa.</p>
      </Card>
    );
  }
  return (
    <Card>
      <div className="flex items-start justify-between">
        <h2 className="text-lg font-medium text-zinc-800 dark:text-zinc-100">Estado da Subscrição</h2>
        <Badge status={subscription.status} />
      </div>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{statusMessage(subscription)}</p>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3 text-sm">
        <div>
          <div className="text-zinc-500">Plano</div>
          <div className="font-medium text-zinc-800 dark:text-zinc-100">{subscription.plan?.name}</div>
        </div>
        <div>
          <div className="text-zinc-500">Início</div>
          <div>{formatDate(subscription.currentPeriodStart)}</div>
        </div>
        <div>
          <div className="text-zinc-500">Fim</div>
          <div>{formatDate(subscription.currentPeriodEnd)}</div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-end">
        <Button onClick={onManage}>Gerir</Button>
      </div>
    </Card>
  );
}
