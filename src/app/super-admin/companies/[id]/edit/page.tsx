'use client';

import { useEffect, useState, FormEvent } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getCompanyDetails, updateCompany } from '@/lib/api';
import { useRequireSuperAdmin } from '@/lib/use-require-super-admin';
import { Toast } from '@/components/toast';
import type { CompanyDetails, UpdateCompanyInput } from '@/lib/types';

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

export default function EditCompanyPage() {
  const params = useParams();
  const router = useRouter();
  const { token, loading: authLoading } = useRequireSuperAdmin();
  
  const companyId = params.id as string;
  
  const [company, setCompany] = useState<CompanyDetails | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; kind: 'error' | 'success' | 'info' } | null>(null);
  
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

  // Load company data
  useEffect(() => {
    if (!token || !companyId) return;
    
    setLoadingData(true);
    getCompanyDetails(companyId, token)
      .then((data) => {
        setCompany(data);
        // Populate form fields
        setName(data.name || '');
        setEmail(data.email || '');
        setPhone(data.phone ? formatPhone(data.phone) : '');
        setCnpj(data.cnpj ? formatCnpj(data.cnpj) : '');
        setDescription(data.description || '');
        
        if (data.address) {
          setStreet(data.address.street || '');
          setNumber(data.address.number || '');
          setComplement(data.address.complement || '');
          setNeighborhood(data.address.neighborhood || '');
          setCity(data.address.city || '');
          setState(data.address.state || '');
          setZipCode(data.address.zipCode ? formatCep(data.address.zipCode) : '');
        }
      })
      .catch((err) => {
        const message = err instanceof Error ? err.message : 'Erro ao carregar empresa.';
        setToast({ message, kind: 'error' });
      })
      .finally(() => setLoadingData(false));
  }, [token, companyId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!token || !company) return;
    
    setSaving(true);
    setToast(null);

    try {
      const updateData: UpdateCompanyInput = {
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

      await updateCompany(company.id, updateData, token);
      setToast({ message: 'Empresa atualizada com sucesso!', kind: 'success' });
      
      // Redirect to company details after success
      setTimeout(() => router.push(`/super-admin/companies/${company.id}`), 1500);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao atualizar empresa.';
      setToast({ message, kind: 'error' });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loadingData) {
    return (
      <main className="mx-auto min-h-screen max-w-4xl px-6 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 rounded bg-ink-100" />
          <div className="h-64 rounded-2xl bg-ink-100" />
          <div className="h-64 rounded-2xl bg-ink-100" />
        </div>
      </main>
    );
  }

  if (!company) {
    return (
      <main className="mx-auto min-h-screen max-w-4xl px-6 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-ink-900">Empresa não encontrada</h1>
          <Link href="/super-admin/dashboard" className="mt-4 inline-block text-blue-600 hover:underline">
            Voltar ao Dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-12">
      {/* Header */}
      <header className="mb-8">
        <Link
          href={`/super-admin/companies/${company.id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-ink-500 hover:text-ink-700 mb-4"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar aos Detalhes
        </Link>
        <h1 className="text-3xl font-semibold text-ink-900">Editar Empresa</h1>
        <p className="mt-1 text-sm text-ink-600">
          Atualize os dados da empresa <strong>{company.name}</strong>.
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
            href={`/super-admin/companies/${company.id}`}
            className="rounded-xl border border-ink-200 px-6 py-3 text-sm font-semibold text-ink-700 hover:bg-ink-50"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded-xl bg-ink-900 px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'A guardar...' : 'Guardar Alterações'}
          </button>
        </div>
      </form>

      {toast && <Toast message={toast.message} kind={toast.kind} onClose={() => setToast(null)} />}
    </main>
  );
}
