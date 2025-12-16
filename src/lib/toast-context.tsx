'use client';

import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Toast, ToastKind } from '@/components/toast';

type ToastMessage = {
  message: string;
  kind: ToastKind;
};

type ToastContextValue = {
  showToast: (message: string, kind: ToastKind) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = useCallback((message: string, kind: ToastKind) => {
    setToast({ message, kind });
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && <Toast message={toast.message} kind={toast.kind} onClose={() => setToast(null)} />}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
