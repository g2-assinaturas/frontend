"use client";
import React from 'react';

export default function Card({ children, className = '', style }: React.PropsWithChildren<{ className?: string; style?: React.CSSProperties }>) {
  return (
    <div className={"fade-in rounded-lg border border-[var(--border)] bg-white p-8 shadow-sm transition-colors dark:border-zinc-800 dark:bg-zinc-900 " + className} style={style}>
      {children}
    </div>
  );
}
