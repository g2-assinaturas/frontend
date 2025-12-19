'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MultiStepForm } from '@/components/forms/MultiStepForm';
import { CompanyStep } from '@/components/forms/CompanyStep';
import { AddressStep } from '@/components/forms/AddressStep';
import { UserStep } from '@/components/forms/UserStep';
import { Toast } from '@/components/toast';
import { ThemeToggle } from '@/components/theme-toggle';
import { type AddressInput, type CompanyInput, type RegisterInput, type UserInput, RegisterSchema } from '@/lib/validators';
import { registerCompany } from '@/lib/api';

const stepTitles = ['Empresa', 'Endereço', 'Acesso'];

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [company, setCompany] = useState<CompanyInput | null>(null);
  const [address, setAddress] = useState<AddressInput | null>(null);
  const [user, setUser] = useState<UserInput | null>(null);
  const [validity, setValidity] = useState({ company: false, address: false, user: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; kind: 'error' | 'success' | 'info' } | null>(null);

  const canProceed = [validity.company, validity.address, validity.user][currentStep] ?? false;

  const handleSubmit = async () => {
    setToast(null);

    if (!company || !address || !user) {
      setToast({ message: 'Preencha todos os campos obrigatórios antes de continuar.', kind: 'error' });
      return;
    }

    const payload: RegisterInput = {
      business: company,
      address,
      user,
    };

    const parsed = RegisterSchema.safeParse(payload);
    if (!parsed.success) {
      setToast({ message: 'Preencha todos os campos obrigatórios antes de continuar.', kind: 'error' });
      return;
    }

    setIsSubmitting(true);
    try {
      await registerCompany(parsed.data);
      setToast({ message: 'Registo concluído! Faça login para continuar.', kind: 'success' });
      router.push('/login');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Não foi possível concluir o registo.';
      setToast({ message, kind: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-ink-50 px-6 py-12 dark:bg-slate-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold uppercase tracking-wide text-ink-500 dark:text-slate-400">SaaS Control</p>
            <div className="flex items-center gap-3">
              <Link 
                href="/" 
                className="text-sm font-semibold text-ink-700 hover:text-ink-900 dark:text-slate-300 dark:hover:text-white"
              >
                ← Voltar à página inicial
              </Link>
              <ThemeToggle />
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-3xl font-semibold text-ink-900 dark:text-white">Registe a sua empresa em 3 passos</h1>
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="rounded-full bg-white px-3 py-1 shadow-card dark:bg-slate-800 dark:text-slate-300">Passo {currentStep + 1} de 3</span>
              <span className="rounded-full border border-ink-200 px-3 py-1 text-ink-800 dark:border-slate-600 dark:text-slate-300">{stepTitles[currentStep]}</span>
            </div>
          </div>
          <p className="text-sm text-ink-600 dark:text-slate-300">Preencha os dados da empresa, endereço via CEP e o utilizador responsável com palavra-passe segura.</p>
        </header>

        <MultiStepForm onSubmit={handleSubmit} isSubmitting={isSubmitting} canProceed={canProceed} onStepChange={setCurrentStep}>
          <CompanyStep
            defaultValues={company ?? undefined}
            onChange={(data, valid) => {
              setCompany(data);
              setValidity((prev) => ({ ...prev, company: valid }));
            }}
          />

          <AddressStep
            defaultValues={address ?? undefined}
            onChange={(data, valid) => {
              setAddress(data);
              setValidity((prev) => ({ ...prev, address: valid }));
            }}
          />

          <UserStep
            defaultValues={user ?? undefined}
            onChange={(data, valid) => {
              setUser(data);
              setValidity((prev) => ({ ...prev, user: valid }));
            }}
          />
        </MultiStepForm>
      </div>

      {toast ? <Toast message={toast.message} kind={toast.kind} onClose={() => setToast(null)} /> : null}
    </main>
  );
}
