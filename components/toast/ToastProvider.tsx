"use client";
import React, { createContext, useCallback, useContext, useState } from 'react';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
interface ToastContextValue {
  addToast: (t: Omit<Toast,'id'>) => void;
  removeToast: (id: string) => void;
}
const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const removeToast = useCallback((id: string) => {
    setToasts(t => t.filter(x => x.id !== id));
  }, []);
  const addToast = useCallback((t: Omit<Toast,'id'>) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { ...t, id }]);
    setTimeout(() => removeToast(id), 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-72">
        {toasts.map(t => (
          <div key={t.id} className={`rounded-md shadow px-3 py-2 text-sm border animate-fade-in
            ${t.type === 'success' ? 'bg-green-50 border-green-300 text-green-800 dark:bg-green-900/30 dark:text-green-200 dark:border-green-700'
            : t.type === 'error' ? 'bg-red-50 border-red-300 text-red-800 dark:bg-red-900/30 dark:text-red-200 dark:border-red-700'
            : 'bg-zinc-50 border-zinc-300 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100 dark:border-zinc-700'}`}> 
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
