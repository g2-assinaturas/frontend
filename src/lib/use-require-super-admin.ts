'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSuperAdmin } from './super-admin-context';

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
