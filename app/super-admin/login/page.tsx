"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card from '../../../components/Card';
import Input from '../../../components/Input';
import Button from '../../../components/Button';
import { loginSuperAdmin } from '../../../lib/api';
import { useToast } from '../../../components/toast/ToastProvider';

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await loginSuperAdmin(email, password);
      addToast({ type: 'success', message: 'Login realizado com sucesso!' });
      router.push('/super-admin/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Erro ao fazer login');
      addToast({ type: 'error', message: err?.message || 'Erro ao fazer login' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-zinc-900 dark:via-purple-950 dark:to-indigo-950">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl mb-4">
              <span className="text-white font-bold text-2xl">SA</span>
            </div>
            <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-100">
              Super Admin
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Painel de Gestão do Sistema
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@exemplo.com"
          />

          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-sm text-red-700 dark:text-red-400">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !email || !password}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-700">
          <p className="text-xs text-center text-zinc-500 dark:text-zinc-400">
            Acesso restrito a administradores do sistema
          </p>
        </div>
        </Card>
      </div>
    </div>
  );
}
