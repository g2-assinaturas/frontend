'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { changePassword } from '@/lib/api';
import { useRequireAuth } from '@/lib/use-require-auth';
import { Toast } from '@/components/toast';

/**
 * Password validation regex - must have uppercase, lowercase, number, and symbol
 */
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

export default function ProfilePage() {
  const router = useRouter();
  const { token, user, logout, loading: authLoading } = useRequireAuth();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; kind: 'error' | 'success' | 'info' } | null>(null);
  const [errors, setErrors] = useState<{ 
    currentPassword?: string; 
    newPassword?: string; 
    confirmPassword?: string 
  }>({});

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    
    if (!currentPassword) {
      newErrors.currentPassword = 'Senha atual é obrigatória';
    }
    
    if (!newPassword) {
      newErrors.newPassword = 'Nova senha é obrigatória';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Senha deve ter pelo menos 8 caracteres';
    } else if (!passwordRegex.test(newPassword)) {
      newErrors.newPassword = 'Senha deve conter maiúscula, minúscula, número e símbolo';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    if (!validateForm()) return;
    
    setSaving(true);
    setToast(null);

    try {
      const result = await changePassword(token, currentPassword, newPassword, confirmPassword);
      
      setToast({ message: result.message || 'Senha alterada com sucesso!', kind: 'success' });
      
      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // If requires reauth, logout after a delay
      if (result.data?.requiresReauth) {
        setTimeout(() => {
          logout();
          router.push('/login');
        }, 2000);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao alterar senha.';
      setToast({ message, kind: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <main className="mx-auto min-h-screen max-w-2xl px-6 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 rounded bg-ink-100" />
          <div className="h-64 rounded-2xl bg-ink-100" />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-12">
      {/* Header */}
      <header className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-ink-500 hover:text-ink-700 mb-4"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar ao Dashboard
        </Link>
        <h1 className="text-3xl font-semibold text-ink-900">Meu Perfil</h1>
        <p className="mt-1 text-sm text-ink-600">Gerencie suas informações de conta e segurança.</p>
      </header>

      {/* User Info */}
      <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card mb-6">
        <h2 className="text-lg font-semibold text-ink-900 mb-4">Informações da Conta</h2>
        <dl className="grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-ink-500">Nome</dt>
            <dd className="mt-1 text-sm text-ink-900">{user?.name || '-'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-ink-500">Email</dt>
            <dd className="mt-1 text-sm text-ink-900">{user?.email || '-'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-ink-500">Função</dt>
            <dd className="mt-1 text-sm text-ink-900">{user?.role || 'Usuário'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-ink-500">Estado</dt>
            <dd className="mt-1">
              <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                user?.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
              }`}>
                {user?.isActive ? 'Ativo' : 'Inativo'}
              </span>
            </dd>
          </div>
        </dl>
      </section>

      {/* Change Password Form */}
      <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
        <h2 className="text-lg font-semibold text-ink-900 mb-4">Alterar Senha</h2>
        <p className="text-sm text-ink-600 mb-6">
          Para sua segurança, recomendamos usar uma senha forte com pelo menos 8 caracteres, 
          incluindo letras maiúsculas, minúsculas, números e símbolos.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1" htmlFor="currentPassword">
              Senha Atual *
            </label>
            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={`w-full rounded-xl border px-4 py-3 text-ink-900 outline-none focus:border-ink-400 ${
                errors.currentPassword ? 'border-red-300' : 'border-ink-200'
              }`}
              placeholder="Digite sua senha atual"
              aria-invalid={!!errors.currentPassword}
              aria-describedby={errors.currentPassword ? 'current-password-error' : undefined}
            />
            {errors.currentPassword && (
              <p id="current-password-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.currentPassword}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1" htmlFor="newPassword">
              Nova Senha *
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={`w-full rounded-xl border px-4 py-3 text-ink-900 outline-none focus:border-ink-400 ${
                errors.newPassword ? 'border-red-300' : 'border-ink-200'
              }`}
              placeholder="Mínimo 8 caracteres"
              aria-invalid={!!errors.newPassword}
              aria-describedby="password-requirements new-password-error"
            />
            {errors.newPassword && (
              <p id="new-password-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.newPassword}
              </p>
            )}
            <p id="password-requirements" className="mt-1 text-xs text-ink-500">
              Deve conter maiúscula, minúscula, número e símbolo.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1" htmlFor="confirmPassword">
              Confirmar Nova Senha *
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full rounded-xl border px-4 py-3 text-ink-900 outline-none focus:border-ink-400 ${
                errors.confirmPassword ? 'border-red-300' : 'border-ink-200'
              }`}
              placeholder="Repita a nova senha"
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
            />
            {errors.confirmPassword && (
              <p id="confirm-password-error" className="mt-1 text-sm text-red-600" role="alert">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-ink-900 px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'A alterar...' : 'Alterar Senha'}
            </button>
          </div>
        </form>
      </section>

      {/* Danger Zone */}
      <section className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6">
        <h2 className="text-lg font-semibold text-red-800 mb-2">Zona de Perigo</h2>
        <p className="text-sm text-red-700 mb-4">
          Ações irreversíveis. Tenha cuidado ao realizar estas operações.
        </p>
        <button
          onClick={logout}
          className="rounded-xl border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
        >
          Terminar Sessão
        </button>
      </section>

      {toast && <Toast message={toast.message} kind={toast.kind} onClose={() => setToast(null)} />}
    </main>
  );
}
