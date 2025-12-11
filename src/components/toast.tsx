'use client';

import { useEffect } from 'react';

export type ToastKind = 'error' | 'success' | 'info';

const palette: Record<ToastKind, string> = {
  error: 'bg-red-50 text-red-800 border-red-200',
  success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  info: 'bg-ink-900 text-ink-50 border-ink-800',
};

export function Toast({
  message,
  kind = 'info',
  onClose,
  duration = 3200,
}: {
  message: string;
  kind?: ToastKind;
  onClose: () => void;
  duration?: number;
}) {
  useEffect(() => {
    const id = setTimeout(onClose, duration);
    return () => clearTimeout(id);
  }, [duration, onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm shadow-card transition ${palette[kind]}`}
      role="status"
      aria-live="polite"
    >
      <span>{message}</span>
      <button className="text-xs underline" onClick={onClose}>
        fechar
      </button>
    </div>
  );
}
