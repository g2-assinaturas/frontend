'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { createCompany } from '@/lib/api';
import { useRequireSuperAdmin } from '@/lib/use-require-super-admin';
import { Toast } from '@/components/toast';
import type { CreateCompanyInput } from '@/lib/types';

/**
 * Format phone number as user types
 */
function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

/**
 * Format CNPJ as user types
 */
function formatCnpj(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 14);
  if (digits.length <= 2) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 2)}.${digits.slice(2)}`;
  if (digits.length <= 8) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5)}`;
  if (digits.length <= 12) return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8)}`;
  return `${digits.slice(0, 2)}.${digits.slice(2, 5)}.${digits.slice(5, 8)}/${digits.slice(8, 12)}-${digits.slice(12)}`;
}

/**
 * Format CEP as user types
 */
function formatCep(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

/**
 * Extract only digits from a string
 */
function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

export default function NewCompanyPage() {
  const { token, loading: authLoading } = useRequireSuperAdmin();
  
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; kind: 'error' | 'success' | 'info' } | null>(null);
  const [createdUser, setCreatedUser] = useState<{ email: string; temporaryPassword: string } | null>(null);
  
  // Company form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [description, setDescription] = useState('');
  
  // Address form state
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
      
      // Show the created user credentials
      setCreatedUser({
        email: result.companyUser.email,
        temporaryPassword: result.companyUser.temporaryPassword,
      });
      
      setToast({ message: result.message, kind: 'success' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao criar empresa.';
      setToast({ message, kind: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // If user was created successfully, show credentials modal
  if (createdUser) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ink-50 px-6 py-12">
        <div className="w-full max-w-md rounded-2xl border border-ink-100 bg-white p-8 shadow-card">
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
              <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-ink-900">Empresa Criada!</h1>
            <p className="mt-2 text-sm text-ink-600">
              Guarde as credenciais abaixo. A senha temporária não será mostrada novamente.
            </p>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 mb-6">
            <p className="text-sm font-semibold text-amber-800 mb-2">Credenciais de acesso:</p>
            <div className="space-y-2 text-sm">
              <p className="text-amber-700">
                <span className="font-medium">Email:</span> {createdUser.email}
              </p>
              <p className="text-amber-700">
                <span className="font-medium">Senha temporária:</span>{' '}
                <code className="rounded bg-amber-100 px-2 py-0.5 font-mono">{createdUser.temporaryPassword}</code>
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href="/super-admin/dashboard"
              className="flex-1 rounded-xl border border-ink-200 px-4 py-3 text-center text-sm font-semibold text-ink-700 hover:bg-ink-50"
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
              className="flex-1 rounded-xl bg-ink-900 px-4 py-3 text-sm font-semibold text-white shadow-card hover:bg-ink-800"
            >
              Criar Outra
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-12">
      {/* Header */}
      <header className="mb-8">
        <Link
          href="/super-admin/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-ink-500 hover:text-ink-700 mb-4"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar ao Dashboard
        </Link>
        <h1 className="text-3xl font-semibold text-ink-900">Nova Empresa</h1>
        <p className="mt-1 text-sm text-ink-600">
          Preencha os dados abaixo para criar uma nova empresa. Um usuário administrador será criado automaticamente.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Company Information */}
        <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
          <h2 className="text-lg font-semibold text-ink-900 mb-4">Dados da Empresa</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-ink-700 mb-1" htmlFor="name">
                Nome da Empresa *
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-ink-200 px-4 py-3 text-ink-900 outline-none focus:border-ink-400"
                placeholder="Nome da empresa"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1" htmlFor="email">
                Email *
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-ink-200 px-4 py-3 text-ink-900 outline-none focus:border-ink-400"
                placeholder="empresa@exemplo.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1" htmlFor="phone">
                Telefone *
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                className="w-full rounded-xl border border-ink-200 px-4 py-3 text-ink-900 outline-none focus:border-ink-400"
                placeholder="(11) 99999-9999"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1" htmlFor="cnpj">
                CNPJ
              </label>
              <input
                id="cnpj"
                type="text"
                value={cnpj}
                onChange={(e) => setCnpj(formatCnpj(e.target.value))}
                className="w-full rounded-xl border border-ink-200 px-4 py-3 text-ink-900 outline-none focus:border-ink-400"
                placeholder="00.000.000/0000-00"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-ink-700 mb-1" htmlFor="description">
                Descrição
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-ink-200 px-4 py-3 text-ink-900 outline-none focus:border-ink-400 resize-none"
                placeholder="Descrição opcional da empresa..."
              />
            </div>
          </div>
        </section>

        {/* Address Information */}
        <section className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
          <h2 className="text-lg font-semibold text-ink-900 mb-4">Endereço</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1" htmlFor="zipCode">
                CEP *
              </label>
              <input
                id="zipCode"
                type="text"
                required
                value={zipCode}
                onChange={(e) => setZipCode(formatCep(e.target.value))}
                className="w-full rounded-xl border border-ink-200 px-4 py-3 text-ink-900 outline-none focus:border-ink-400"
                placeholder="00000-000"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-ink-700 mb-1" htmlFor="street">
                Rua *
              </label>
              <input
                id="street"
                type="text"
                required
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full rounded-xl border border-ink-200 px-4 py-3 text-ink-900 outline-none focus:border-ink-400"
                placeholder="Rua, Avenida, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1" htmlFor="number">
                Número *
              </label>
              <input
                id="number"
                type="text"
                required
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="w-full rounded-xl border border-ink-200 px-4 py-3 text-ink-900 outline-none focus:border-ink-400"
                placeholder="123"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1" htmlFor="complement">
                Complemento
              </label>
              <input
                id="complement"
                type="text"
                value={complement}
                onChange={(e) => setComplement(e.target.value)}
                className="w-full rounded-xl border border-ink-200 px-4 py-3 text-ink-900 outline-none focus:border-ink-400"
                placeholder="Apto, Sala, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1" htmlFor="neighborhood">
                Bairro *
              </label>
              <input
                id="neighborhood"
                type="text"
                required
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                className="w-full rounded-xl border border-ink-200 px-4 py-3 text-ink-900 outline-none focus:border-ink-400"
                placeholder="Bairro"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1" htmlFor="city">
                Cidade *
              </label>
              <input
                id="city"
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-xl border border-ink-200 px-4 py-3 text-ink-900 outline-none focus:border-ink-400"
                placeholder="Cidade"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1" htmlFor="state">
                Estado *
              </label>
              <input
                id="state"
                type="text"
                required
                maxLength={2}
                value={state}
                onChange={(e) => setState(e.target.value.toUpperCase())}
                className="w-full rounded-xl border border-ink-200 px-4 py-3 text-ink-900 outline-none focus:border-ink-400"
                placeholder="SP"
              />
            </div>
          </div>
        </section>

        {/* Submit Button */}
        <div className="flex gap-4">
          <Link
            href="/super-admin/dashboard"
            className="rounded-xl border border-ink-200 px-6 py-3 text-sm font-semibold text-ink-700 hover:bg-ink-50"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={loading || authLoading}
            className="flex-1 rounded-xl bg-ink-900 px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'A criar...' : 'Criar Empresa'}
          </button>
        </div>
      </form>

      {toast && <Toast message={toast.message} kind={toast.kind} onClose={() => setToast(null)} />}
    </main>
  );
}
