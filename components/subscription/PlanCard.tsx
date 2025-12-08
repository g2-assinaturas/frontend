"use client";
import React from 'react';
import Card from '../Card';
import Button from '../Button';
import { formatMoney, intervalLabel } from '../../lib/format';

export interface PlanDto {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  interval?: string;
  active?: boolean;
}

export default function PlanCard({ plan, current, onSelect, loading }: {
  plan: PlanDto;
  current?: boolean;
  onSelect?: (planId: string) => void;
  loading?: boolean;
}) {
  return (
    <Card className={"flex flex-col justify-between gap-4 " + (current ? 'ring-2 ring-[var(--accent)]' : '')}>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">{plan.name}</h3>
          {current && (
            <span className="rounded-full bg-[var(--accent)]/10 px-2 py-0.5 text-xs font-medium text-[var(--accent)]">Atual</span>
          )}
        </div>
        {plan.description && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{plan.description}</p>
        )}
        <div className="text-sm text-zinc-500 dark:text-zinc-400">{intervalLabel(plan.interval)}</div>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{formatMoney(plan.price, plan.currency)}</div>
        {onSelect && !current && (
          <Button
            onClick={() => onSelect(plan.id)}
            disabled={loading}
            variant="outline"
            aria-label={`Escolher plano ${plan.name}`}
          >{loading ? '...' : 'Escolher'}</Button>
        )}
        {current && <Button variant="ghost" disabled aria-label={`Plano ${plan.name} ativo`}>Ativo</Button>}
      </div>
    </Card>
  );
}
