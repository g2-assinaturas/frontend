'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSuperAdmin } from './super-admin-context';

/**
 * Authentication guard hook for super admin pages
 * Redirects to super admin login page if user is not authenticated
 * Use this hook at the top of any page that requires super admin privileges
 * @returns Super admin context with token, user, login, logout, and loading state
 */
export function useRequireSuperAdmin() {
  const router = useRouter();
  const sa = useSuperAdmin();

  useEffect(() => {
    if (!sa.loading && !sa.token) {
      router.replace('/super-admin/login');
    }
  }, [sa.loading, sa.token, router]);

  return sa;
}
