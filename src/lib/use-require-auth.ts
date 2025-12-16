'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth-context';

/**
 * Hook de guarda de autenticação para páginas de usuário da empresa
 * Redireciona para página de login se usuário não estiver autenticado
 * Use este hook no topo de qualquer página que requer autenticação da empresa
 * @returns Contexto de autenticação com token, user, login, logout e loading state
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
