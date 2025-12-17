'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { createCompany } from '@/lib/api';
import { useRequireSuperAdmin } from '@/lib/use-require-super-admin';
import { Toast } from '@/components/toast';
import { ThemeToggle } from '@/components/theme-toggle';
import { formatPhone, formatCnpj, formatCep, digitsOnly } from '@/lib/formatters';
import type { CreateCompanyInput } from '@/lib/types';

export default function NewCompanyPage() {
  const { token, loading: authLoading } = useRequireSuperAdmin();
  
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; kind: 'error' | 'success' | 'info' } | null>(null);
  const [createdUser, setCreatedUser] = useState<{ email: string; temporaryPassword: string } | null>(null);
  
  // Estado do formulário da empresa
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [description, setDescription] = useState('');
  
  // Estado do formulário do endereço
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    setToast(null);

    try {
      const companyData: CreateCompanyInput = {
        name,
        email,
        phone: digitsOnly(phone),
        cnpj: cnpj ? digitsOnly(cnpj) : undefined,
        description: description || undefined,
        address: {
          street,
          number,
          complement: complement || undefined,
          neighborhood,
          city,
          state: state.toUpperCase(),
          zipCode: digitsOnly(zipCode),
        },
      };

      const result = await createCompany(companyData, token);
      
      // Exibe as credenciais do usuário criado
      setCreatedUser({
        email: result.companyUser.email,
        temporaryPassword: result.companyUser.temporaryPassword,
      });
      
      setToast({ message: result.message, kind: 'success' });
    } catch (err) {
      let message = 'Erro ao criar empresa.';
      if (err instanceof Error) {
        message = err.message;
      }
      setToast({ message, kind: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Se usuário foi criado com sucesso, exibe modal de credenciais
  if (createdUser) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ink-50 px-6 py-12 dark:bg-slate-900">
        <div className="w-full max-w-md rounded-2xl border border-ink-100 bg-white p-8 shadow-card dark:border-slate-700 dark:bg-slate-800">
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
              <svg className="h-6 w-6 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-ink-900 dark:text-white">Empresa Criada!</h1>
            <p className="mt-2 text-sm text-ink-600 dark:text-slate-400">
              Guarde as credenciais abaixo. A senha temporária não será mostrada novamente.
            </p>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 mb-6 dark:border-amber-700 dark:bg-amber-900/30">
            <p className="text-sm font-semibold text-amber-800 mb-2 dark:text-amber-300">Credenciais de acesso:</p>
            <div className="space-y-2 text-sm">
              <p className="text-amber-700 dark:text-amber-400">
                <span className="font-medium">Email:</span> {createdUser.email}
              </p>
              <p className="text-amber-700 dark:text-amber-400">
                <span className="font-medium">Senha temporária:</span>{' '}
                <code className="rounded bg-amber-100 px-2 py-0.5 font-mono dark:bg-amber-800">{createdUser.temporaryPassword}</code>
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href="/super-admin/dashboard"
              className="flex-1 rounded-xl border border-ink-200 px-4 py-3 text-center text-sm font-semibold text-ink-700 hover:bg-ink-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Voltar ao Dashboard
            </Link>
            <button
              onClick={() => {
                setCreatedUser(null);
                setName('');
                setEmail('');
                setPhone('');
                setCnpj('');
                setDescription('');
                setStreet('');
                setNumber('');
                setComplement('');
                setNeighborhood('');
                setCity('');
                setState('');
                setZipCode('');
              }}
              className="flex-1 rounded-xl bg-ink-900 px-4 py-3 text-sm font-semibold text-white shadow-card hover:bg-ink-800 dark:bg-slate-600 dark:hover:bg-slate-500"
            >
              Criar Outra
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-12 dark:bg-slate-900">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/super-admin/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-ink-500 hover:text-ink-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar ao Dashboard
          </Link>
          <ThemeToggle />
        </div>
        <h1 className="text-3xl font-semibold text-ink-900 dark:text-white">Nova Empresa</h1>
        <p className="mt-1 text-sm text-ink-600 dark:text-slate-400">
          Preencha os dados abaixo para criar uma nova empresa. Um usuário administrador será criado automaticamente.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Company Information */}
        <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-lg font-semibold text-ink-900 mb-4 dark:text-white">Dados da Empresa</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-ink-700 mb-1 dark:text-slate-300" htmlFor="name">
                Nome da Empresa *
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-ink-200 px-4 py-3 text-ink-900 outline-none focus:border-ink-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-slate-500"
                placeholder="Nome da empresa"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1 dark:text-slate-300" htmlFor="email">
                Email *
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-ink-200 px-4 py-3 text-ink-900 outline-none focus:border-ink-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-slate-500"
                placeholder="empresa@exemplo.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1 dark:text-slate-300" htmlFor="phone">
                Telefone *
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                className="w-full rounded-xl border border-ink-200 px-4 py-3 text-ink-900 outline-none focus:border-ink-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-slate-500"
                placeholder="(11) 99999-9999"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1 dark:text-slate-300" htmlFor="cnpj">
                CNPJ
              </label>
              <input
                id="cnpj"
                type="text"
                value={cnpj}
                onChange={(e) => setCnpj(formatCnpj(e.target.value))}
                className="w-full rounded-xl border border-ink-200 px-4 py-3 text-ink-900 outline-none focus:border-ink-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-slate-500"
                placeholder="00.000.000/0000-00"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-ink-700 mb-1 dark:text-slate-300" htmlFor="description">
                Descrição
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-ink-200 px-4 py-3 text-ink-900 outline-none focus:border-ink-400 resize-none dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-slate-500"
                placeholder="Descrição opcional da empresa..."
              />
            </div>
          </div>
        </section>

        {/* Address Information */}
        <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card dark:border-slate-700 dark:bg-slate-800">
          <h2 className="text-lg font-semibold text-ink-900 mb-4 dark:text-white">Endereço</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1 dark:text-slate-300" htmlFor="zipCode">
                CEP *
              </label>
              <input
                id="zipCode"
                type="text"
                required
                value={zipCode}
                onChange={(e) => setZipCode(formatCep(e.target.value))}
                className="w-full rounded-xl border border-ink-200 px-4 py-3 text-ink-900 outline-none focus:border-ink-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-slate-500"
                placeholder="00000-000"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-ink-700 mb-1 dark:text-slate-300" htmlFor="street">
                Rua *
              </label>
              <input
                id="street"
                type="text"
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full rounded-xl border border-ink-200 px-4 py-3 text-ink-900 outline-none focus:border-ink-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-slate-500"
                placeholder="Rua, Avenida, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1 dark:text-slate-300" htmlFor="number">
                Número *
              </label>
              <input
                id="number"
                type="text"
                required
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="w-full rounded-xl border border-ink-200 px-4 py-3 text-ink-900 outline-none focus:border-ink-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-slate-500"
                placeholder="123"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1 dark:text-slate-300" htmlFor="complement">
                Complemento
              </label>
              <input
                id="complement"
                type="text"
                value={complement}
                onChange={(e) => setComplement(e.target.value)}
                className="w-full rounded-xl border border-ink-200 px-4 py-3 text-ink-900 outline-none focus:border-ink-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-slate-500"
                placeholder="Apto, Sala, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1 dark:text-slate-300" htmlFor="neighborhood">
                Bairro *
              </label>
              <input
                id="neighborhood"
                type="text"
                required
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full rounded-xl border border-ink-200 px-4 py-3 text-ink-900 outline-none focus:border-ink-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-slate-500"
                placeholder="Bairro"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1 dark:text-slate-300" htmlFor="city">
                Cidade *
              </label>
              <input
                id="city"
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-xl border border-ink-200 px-4 py-3 text-ink-900 outline-none focus:border-ink-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-slate-500"
                placeholder="Cidade"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1 dark:text-slate-300" htmlFor="state">
                Estado *
              </label>
              <input
                id="state"
                type="text"
                required
                maxLength={2}
                value={state}
                onChange={(e) => setState(e.target.value.toUpperCase())}
                className="w-full rounded-xl border border-ink-200 px-4 py-3 text-ink-900 outline-none focus:border-ink-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-slate-500"
                placeholder="SP"
              />
            </div>
          </div>
        </section>

        {/* Submit Button */}
        <div className="flex gap-4">
          <Link
            href="/super-admin/dashboard"
            className="rounded-xl border border-ink-200 px-6 py-3 text-sm font-semibold text-ink-700 hover:bg-ink-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={loading || authLoading}
            className="flex-1 rounded-xl bg-ink-900 px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed dark:bg-slate-600 dark:hover:bg-slate-500"
          >
            {loading ? 'A criar...' : 'Criar Empresa'}
          </button>
        </div>
      </form>

      {toast && <Toast message={toast.message} kind={toast.kind} onClose={() => setToast(null)} />}
    </main>
  );
}
