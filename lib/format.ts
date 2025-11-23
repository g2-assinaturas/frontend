export function formatMoney(cents: number | null | undefined, currency: string = 'BRL') {
  const v = ((cents ?? 0) / 100);
  return v.toFixed(2) + ' ' + currency;
}

export function formatDate(iso?: string | null, withTime: boolean = false) {
  if (!iso) return '-';
  try {
    const d = new Date(iso);
    return withTime ? d.toLocaleString() : d.toLocaleDateString();
  } catch {
    return iso;
  }
}

export function intervalLabel(interval?: string) {
  switch (interval) {
    case 'YEARLY': return 'Cobrança anual';
    case 'HALF_YEARLY': return 'Cobrança semestral';
    case 'MONTHLY':
    default: return 'Cobrança mensal';
  }
}