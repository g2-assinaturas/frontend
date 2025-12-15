'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { Toast } from '@/components/toast';
import { forgotPassword } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; kind: 'error' | 'success' | 'info' } | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setToast(null);
    setLoading(true);

    try {
      const result = await forgotPassword(email);
      setSubmitted(true);
      setToast({ message: result.message, kind: 'success' });

      // Em desenvolvimento, o token é retornado para testes
      if (result.token) {
        console.log('Token de reset (apenas para desenvolvimento):', result.token);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao processar pedido.';
      setToast({ message, kind: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink-50 px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-ink-100 bg-white p-8 shadow-card">
        <div className="mb-6 space-y-2 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-ink-500">SaaS Control</p>
          <h1 className="text-2xl font-semibold text-ink-900">Recuperar palavra-passe</h1>
          <p className="text-sm text-ink-600">
            {submitted
              ? 'Verifique o seu email para instruções de recuperação.'
              : 'Introduza o email associado à sua conta.'}
          </p>
        </div>

        {!submitted ? (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ink-800" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-ink-900 outline-none ring-0 transition focus:border-ink-400"
                placeholder="email@empresa.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-xl bg-ink-900 px-4 py-3 text-sm font-semibold text-ink-50 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'A enviar...' : 'Enviar instruções'}
            </button>

            <p className="text-center text-sm text-ink-600">
              Lembra-se da palavra-passe?{' '}
              <Link className="font-semibold text-ink-900 hover:underline" href="/login">
                Entrar
              </Link>
            </p>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              <p>Se o email estiver registado, receberá instruções para redefinir a palavra-passe.</p>
            </div>

            <Link
              href="/login"
              className="flex w-full items-center justify-center rounded-xl bg-ink-900 px-4 py-3 text-sm font-semibold text-ink-50 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Voltar ao login
            </Link>
          </div>
        )}
      </div>

      {toast ? <Toast message={toast.message} kind={toast.kind} onClose={() => setToast(null)} /> : null}
    </main>
  );
}
