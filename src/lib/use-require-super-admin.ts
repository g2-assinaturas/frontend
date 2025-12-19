'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSuperAdmin } from './super-admin-context';

/**
 * Hook de guarda de autenticação para páginas de super admin
 * Redireciona para página de login de super admin se usuário não estiver autenticado
 * Use este hook no topo de qualquer página que requer privilégios de super admin
 * @returns Contexto de super admin com token, user, login, logout e loading state
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
