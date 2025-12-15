'use client';

import { FormEvent, useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Toast } from '@/components/toast';
import { resetPassword } from '@/lib/api';
import { ResetPasswordSchema } from '@/lib/validators';

function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; kind: 'error' | 'success' | 'info' } | null>(null);
  const [errors, setErrors] = useState<{ newPassword?: string; confirmNewPassword?: string }>({});

  useEffect(() => {
    if (!token) {
      setToast({ message: 'Token de recuperação em falta. Solicite um novo.', kind: 'error' });
    }
  }, [token]);

  const validateForm = () => {
    const result = ResetPasswordSchema.safeParse({ newPassword, confirmNewPassword });
    if (!result.success) {
      const fieldErrors: typeof errors = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof typeof errors;
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setToast(null);

    if (!token) {
      setToast({ message: 'Token de recuperação em falta.', kind: 'error' });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await resetPassword(token, newPassword, confirmNewPassword);
      setToast({ message: result.message, kind: 'success' });

      // Redirecionar para login após sucesso
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao redefinir palavra-passe.';
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
          <h1 className="text-2xl font-semibold text-ink-900">Redefinir palavra-passe</h1>
          <p className="text-sm text-ink-600">Introduza a sua nova palavra-passe.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-medium text-ink-800" htmlFor="newPassword">
              Nova palavra-passe
            </label>
            <input
              id="newPassword"
              className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-ink-900 outline-none ring-0 transition focus:border-ink-400"
              placeholder="Mínimo 8 caracteres"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              aria-label="Nova palavra-passe"
              aria-required="true"
              aria-describedby="password-requirements password-error"
              aria-invalid={!!errors.newPassword}
            />
            {errors.newPassword && <p id="password-error" className="text-sm text-red-600" role="alert">{errors.newPassword}</p>}
            <p id="password-requirements" className="text-xs text-ink-500">
              Deve conter maiúscula, minúscula, número e símbolo.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-ink-800" htmlFor="confirmNewPassword">
              Confirmar palavra-passe
            </label>
            <input
              id="confirmNewPassword"
              className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-ink-900 outline-none ring-0 transition focus:border-ink-400"
              placeholder="Repita a palavra-passe"
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
              aria-label="Confirmar palavra-passe"
              aria-required="true"
              aria-describedby="confirm-password-error"
              aria-invalid={!!errors.confirmNewPassword}
            />
            {errors.confirmNewPassword && <p id="confirm-password-error" className="text-sm text-red-600" role="alert">{errors.confirmNewPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={loading || !token}
            className="flex w-full items-center justify-center rounded-xl bg-ink-900 px-4 py-3 text-sm font-semibold text-ink-50 shadow-card transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'A redefinir...' : 'Redefinir palavra-passe'}
          </button>

          <p className="text-center text-sm text-ink-600">
            <Link className="font-semibold text-ink-900 hover:underline" href="/forgot-password">
              Solicitar novo link
            </Link>
            {' · '}
            <Link className="font-semibold text-ink-900 hover:underline" href="/login">
              Voltar ao login
            </Link>
          </p>
        </form>
      </div>

      {toast ? <Toast message={toast.message} kind={toast.kind} onClose={() => setToast(null)} /> : null}
    </main>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordPage />
    </Suspense>
  );
}
