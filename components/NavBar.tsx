"use client";
import React from 'react';
import Link from 'next/link';

export default function NavBar({ right }: { right?: React.ReactNode }) {
  const links = [
    { href: '/plans', label: 'Planos' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/login', label: 'Login' },
    { href: '/register', label: 'Registo' }
  ];
  return (
    <header className="w-full border-b border-[var(--border)] bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-zinc-800 dark:bg-zinc-900/80">
      <nav className="app-container flex items-center justify-between py-3">
        <div className="flex items-center gap-8">
          <Link href="/" className="accent-gradient-text text-lg font-semibold">Sistema Assinaturas</Link>
          <div className="hidden items-center gap-5 text-sm font-medium sm:flex">
            {links.map(l => (
              <Link key={l.href} href={l.href} className="relative text-zinc-600 transition-colors hover:text-[var(--accent)] dark:text-zinc-300 dark:hover:text-[var(--accent)]">
                {l.label}
                <span className="absolute inset-x-0 -bottom-1 mx-auto h-[2px] w-0 rounded bg-[var(--accent)] transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">{right}</div>
      </nav>
    </header>
  );
}
