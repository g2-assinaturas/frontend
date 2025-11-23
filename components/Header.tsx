"use client";
import React from 'react';
import NavBar from './NavBar';
import { logout } from '../lib/api';
import { clientLogoutCleanup } from '../lib/auth';
import { Badge } from './Badge';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  async function handleLogout() {
    try { await logout(); } catch {}
    clientLogoutCleanup();
    window.location.href = '/login';
  }
  return (
    <NavBar
      right={
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Badge status="BETA" />
          <button
            onClick={handleLogout}
            className="rounded-md border border-[var(--border)] bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-700 shadow-sm
                       hover:bg-zinc-200 hover:text-zinc-900
                       dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 dark:hover:text-white
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)]"
          >
            Logout
          </button>
        </div>
      }
    />
  );
}
