"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '../../lib/api';
import { useAuthContext } from '../../contexts/AuthContext';
import Skeleton from '../../components/Skeleton';
import { useToast } from '../../components/toast/ToastProvider';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const router = useRouter();
  const { addToast } = useToast();

  function validate() {
    let valid = true;
    setEmailError('');
    setPasswordError('');
    // Accept either email pattern or CPF (11 digits)
    const digits = email.replace(/\D/g, '');
    const isEmail = /.+@.+\..+/.test(email);
    const isCpf = digits.length === 11;
    if (!email) {
      setEmailError('Campo obrigatório');
      valid = false;
    } else if (!isEmail && !isCpf) {
      setEmailError('Use email válido ou CPF (11 dígitos)');
      valid = false;
    }
    if (!password) {
      setPasswordError('Password obrigatória');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Mínimo 6 caracteres');
      valid = false;
    }
    return valid;
  }

  const { login: authLogin, isAuthenticated } = useAuthContext();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoginError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await authLogin(email, password);
      addToast({ type: 'success', message: 'Login efetuado.' });
      router.push('/plans');
    } catch (err: any) {
      const msg = err?.message || 'Falha no login';
      setLoginError(msg);
      addToast({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    if (isAuthenticated) router.replace('/dashboard');
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-[var(--background)] transition-colors">
      <main className="app-container flex max-w-md flex-col gap-6 py-16">
        <Card>
          <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100">Entrar</h2>
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4" aria-describedby={loginError ? 'login-error' : undefined}>
            <div>
              <Input
                label="Email ou CPF"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => validate()}
                placeholder="email@exemplo.com"
                className={emailError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
              />
              {emailError && <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{emailError}</p>}
            </div>
            <div>
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => validate()}
                placeholder="••••••••"
                className={passwordError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
              />
              {passwordError && <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{passwordError}</p>}
            </div>
            {loginError && (
              <div id="login-error" className="rounded-md bg-red-50 p-3 text-xs text-red-700 dark:bg-red-900/40 dark:text-red-300" role="alert">
                {loginError}
              </div>
            )}
            <div className="mt-2">
              <Button
                type="submit"
                disabled={loading || !!emailError || !!passwordError || !email || !password}
                aria-busy={loading}
              >
                {loading ? 'A processar...' : 'Entrar'}
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}
