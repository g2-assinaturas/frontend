"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuthContext } from '../contexts/AuthContext';
import { logout } from '../lib/api';
import { clientLogoutCleanup } from '../lib/auth';
import { useToast } from './toast/ToastProvider';
import ThemeToggle from './ThemeToggle';
import Button from './Button';

/**
 * Header: Navegação fixa com logo, links autenticados e controles
 */
export default function Header() {
  const { isAuthenticated, user, logout: contextLogout } = useAuthContext();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { addToast } = useToast();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      await contextLogout();
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
      addToast({ type: 'error', message: 'Erro ao fazer logout' });
    } finally {
      setIsLoggingOut(false);
      clientLogoutCleanup();
      window.location.href = '/login';
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-zinc-800 dark:bg-zinc-900/70">
      <nav className="app-container flex items-center justify-between py-3 sm:py-4">
        {/* Left: Logo */}
        <Link
          href="/"
          className="accent-gradient-text text-lg sm:text-xl font-bold tracking-tight focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          Assinaturas
        </Link>

        {/* Center: Authenticated Links (Desktop only) */}
        {isAuthenticated && (
          <div className="hidden sm:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/plans"
              className="text-zinc-600 hover:text-[var(--accent)] dark:text-zinc-300 dark:hover:text-[var(--accent)] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              Planos
            </Link>
            <Link
              href="/dashboard"
              className="text-zinc-600 hover:text-[var(--accent)] dark:text-zinc-300 dark:hover:text-[var(--accent)] transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              Dashboard
            </Link>
          </div>
        )}

        {/* Right: ThemeToggle + Auth Buttons */}
        <div className="flex items-center gap-2 sm:gap-4 ml-auto">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Auth Actions */}
          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link href="/login" className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]">
                <Button
                  variant="ghost"
                  className="text-xs sm:text-sm px-2 sm:px-3 py-2.5 sm:py-2.5"
                >
                  Login
                </Button>
              </Link>
              <Link href="/register" className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]">
                <Button
                  variant="solid"
                  className="text-xs sm:text-sm px-2 sm:px-3 py-2.5 sm:py-2.5"
                >
                  Criar Conta
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                {user?.email}
              </span>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="rounded-md border border-[var(--border)] bg-zinc-100 px-2 sm:px-3 py-2.5 text-xs sm:text-sm font-medium text-zinc-700 shadow-sm
                           hover:bg-zinc-200 hover:text-zinc-900
                           dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 dark:hover:text-white
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-colors duration-200
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)]"
              >
                {isLoggingOut ? 'Saindo...' : 'Logout'}
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
