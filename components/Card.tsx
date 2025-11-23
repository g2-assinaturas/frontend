"use client";
import React from 'react';

export default function Card({ children, className = '' }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={"fade-in rounded-lg border border-[var(--border)] bg-white p-6 shadow-sm transition-colors dark:border-zinc-800 dark:bg-zinc-900 " + className}>
      {children}
    </div>
  );
}
