'use client';

import type { ReactNode } from 'react';

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  green: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  red: 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400',
};

interface MetricCardProps {
  /** Título do card */
  title: string;
  /** Valor principal a exibir */
  value: string | number;
  /** Subtítulo/descrição opcional */
  subtitle?: string;
  /** Ícone a exibir */
  icon: ReactNode;
  /** Tema de cor */
  color?: keyof typeof colorClasses;
}

/**
 * Componente reutilizável de card de métrica para dashboards
 */
export function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon,
  color = 'blue' 
}: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-ink-500 dark:text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-ink-900 dark:text-white">{value}</p>
          {subtitle && <p className="mt-1 text-sm text-ink-500 dark:text-slate-400">{subtitle}</p>}
        </div>
        <div className={`rounded-xl p-3 ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
