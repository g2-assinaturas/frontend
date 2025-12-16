'use client';

interface StatsCardProps {
  /** Título do card */
  title: string;
  /** Valor principal a exibir */
  value: string | number;
  /** Subtítulo/descrição opcional */
  subtitle?: string;
  /** Classes de cor Tailwind para fundo e texto */
  color: string;
}

/**
 * Componente reutilizável de card de estatísticas para resumos
 */
export function StatsCard({ title, value, subtitle, color }: StatsCardProps) {
  return (
    <div className={`rounded-xl p-4 ${color}`}>
      <p className="text-sm font-medium opacity-80">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
      {subtitle && <p className="text-xs opacity-70">{subtitle}</p>}
    </div>
  );
}
