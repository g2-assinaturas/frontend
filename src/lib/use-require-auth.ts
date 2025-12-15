'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth-context';

/**
 * Authentication guard hook for company user pages
 * Redirects to login page if user is not authenticated
 * Use this hook at the top of any page that requires company authentication
 * @returns Authentication context with token, user, login, logout, and loading state
 */
export function useRequireAuth() {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (!auth.loading && !auth.token) {
      router.replace('/login');
    }
  }, [auth.loading, auth.token, router]);

  return auth;
}
