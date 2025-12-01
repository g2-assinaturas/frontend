"use client";
import React, { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const useDark = saved ? saved === 'dark' : prefersDark;
    setDark(useDark);
    document.documentElement.classList.toggle('dark', useDark);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }

  if (!mounted) return null;

  return (
    <button
      onClick={toggle}
      aria-label="Alternar tema"
      className="inline-flex items-center gap-1 rounded-md border bg-[var(--surface)] px-3 py-1.5 text-xs font-medium shadow-sm transition-colors
                 border-[var(--border)] text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]
                 dark:bg-[var(--surface)] dark:text-[var(--foreground)] dark:border-zinc-600 dark:hover:border-[var(--accent)]
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)]"
    >
      {dark ? 'Dark' : 'Light'}
      <span className="text-[10px] opacity-60">mode</span>
    </button>
  );
}
