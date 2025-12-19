'use client';

import { useEffect, useState, FormEvent } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getCompanyDetails, updateCompany } from '@/lib/api';
import { useRequireSuperAdmin } from '@/lib/use-require-super-admin';
import { Toast } from '@/components/toast';
import { ThemeToggle } from '@/components/theme-toggle';
import { formatPhone, formatCnpj, formatCep, digitsOnly } from '@/lib/formatters';
import type { CompanyDetails, UpdateCompanyInput } from '@/lib/types';

export default function EditCompanyPage() {
  const params = useParams();
  const router = useRouter();
  const { token, loading: authLoading } = useRequireSuperAdmin();
  
  const companyId = params.id as string;
  
  const [company, setCompany] = useState<CompanyDetails | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; kind: 'error' | 'success' | 'info' } | null>(null);
  
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

  // Carrega dados da empresa
  useEffect(() => {
    if (!token || !companyId) return;
    
    setLoadingData(true);
    getCompanyDetails(companyId, token)
      .then((data) => {
        setCompany(data);
        // Preenche campos do formulário
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
      
      // Redireciona para detalhes da empresa após sucesso
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
      <main className="mx-auto min-h-screen max-w-4xl px-6 py-12 dark:bg-slate-900">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 rounded bg-ink-100 dark:bg-slate-700" />
          <div className="h-64 rounded-2xl bg-ink-100 dark:bg-slate-700" />
          <div className="h-64 rounded-2xl bg-ink-100 dark:bg-slate-700" />
        </div>
      </main>
    );
  }

  if (!company) {
    return (
      <main className="mx-auto min-h-screen max-w-4xl px-6 py-12 dark:bg-slate-900">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-ink-900 dark:text-white">Empresa não encontrada</h1>
          <Link href="/super-admin/dashboard" className="mt-4 inline-block text-blue-600 hover:underline dark:text-blue-400">
            Voltar ao Dashboard
          </Link>
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
            href={`/super-admin/companies/${company.id}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-ink-500 hover:text-ink-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar aos Detalhes
          </Link>
          <ThemeToggle />
        </div>
        <h1 className="text-3xl font-semibold text-ink-900 dark:text-white">Editar Empresa</h1>
        <p className="mt-1 text-sm text-ink-600 dark:text-slate-400">
          Atualize os dados da empresa <strong>{company.name}</strong>.
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
            href={`/super-admin/companies/${company.id}`}
            className="rounded-xl border border-ink-200 px-6 py-3 text-sm font-semibold text-ink-700 hover:bg-ink-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded-xl bg-ink-900 px-6 py-3 text-sm font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed dark:bg-slate-600 dark:hover:bg-slate-500"
          >
            {saving ? 'A guardar...' : 'Guardar Alterações'}
          </button>
        </div>
      </form>

      {toast && <Toast message={toast.message} kind={toast.kind} onClose={() => setToast(null)} />}
    </main>
  );
}
