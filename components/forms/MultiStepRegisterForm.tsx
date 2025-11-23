"use client";
import React, { useState } from 'react';
import Card from '../Card';
import Input from '../Input';
import Button from '../Button';
import { registerFull, FullRegisterPayload } from '../../lib/api';

type Step = 'business' | 'address' | 'user' | 'review';

interface Errors {
  [k: string]: string | undefined;
}

const initial: FullRegisterPayload = {
  business: { name: '', email: '', phone: '', description: '' },
  address: { street: '', number: '', neighborhood: '', city: '', state: '', zipCode: '' },
  user: { name: '', email: '', cpf: '', password: '' },
};

export default function MultiStepRegisterForm({ onSuccess }: { onSuccess?: () => void }) {
  const [data, setData] = useState<FullRegisterPayload>(initial);
  const [step, setStep] = useState<Step>('business');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  function update(part: Partial<FullRegisterPayload>) {
    setData((d) => {
      const next = { ...d, ...part };
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.log('[Form update]', next);
      }
      return next;
    });
  }

  function validateCurrent(): boolean {
    const e: Errors = {};
    if (step === 'business') {
      if (!data.business.name) e.businessName = 'Nome da empresa é obrigatório';
      if (!data.business.email || !/^[^@]+@[^@]+\.[^@]+$/.test(data.business.email)) e.businessEmail = 'Email inválido';
    } else if (step === 'address') {
      if (!data.address.street) e.addressStreet = 'Rua obrigatória';
      if (!data.address.city) e.addressCity = 'Cidade obrigatória';
      if (!data.address.state) e.addressState = 'Estado obrigatório';
      if (!data.address.zipCode) e.addressZip = 'CEP obrigatório';
    } else if (step === 'user') {
      if (!data.user.name) e.userName = 'Nome obrigatório';
      if (!data.user.email || !/^[^@]+@[^@]+\.[^@]+$/.test(data.user.email)) e.userEmail = 'Email inválido';
      if (!data.user.cpf || data.user.cpf.replace(/\D/g, '').length < 11) e.userCpf = 'CPF deve ter 11 dígitos';
      if (!data.user.password || data.user.password.length < 6) e.userPassword = 'Password mínimo 6 caracteres';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (!validateCurrent()) return;
    setStep((s) => (s === 'business' ? 'address' : s === 'address' ? 'user' : s === 'user' ? 'review' : 'review'));
  }
  function prev() {
    setStep((s) => (s === 'review' ? 'user' : s === 'user' ? 'address' : s === 'address' ? 'business' : 'business'));
  }

  async function handleSubmit() {
    setSubmitError(null);
    setLoading(true);
    try {
      await registerFull(data);
      onSuccess?.();
    } catch (err: any) {
      setSubmitError(err?.message || 'Erro ao registar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl">
      <h2 className="mb-4 text-xl font-semibold text-zinc-800 dark:text-zinc-100">Registo Multi-Etapas</h2>
      <ProgressIndicator step={step} />
      {step === 'business' && (
        <div className="mt-4 space-y-4">
          <Input label="Nome da Empresa" value={data.business.name} onChange={(e) => update({ business: { ...data.business, name: e.target.value } })} />
          {errors.businessName && <Error msg={errors.businessName} />}
          <Input label="Email da Empresa" value={data.business.email} onChange={(e) => update({ business: { ...data.business, email: e.target.value } })} />
          {errors.businessEmail && <Error msg={errors.businessEmail} />}
          <Input label="Telefone" value={data.business.phone || ''} onChange={(e) => update({ business: { ...data.business, phone: e.target.value } })} />
          <Input label="Descrição" value={data.business.description || ''} onChange={(e) => update({ business: { ...data.business, description: e.target.value } })} />
        </div>
      )}
      {step === 'address' && (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Input label="Rua" value={data.address.street} onChange={(e) => update({ address: { ...data.address, street: e.target.value } })} />
            {errors.addressStreet && <Error msg={errors.addressStreet} />}
          </div>
          <Input label="Número" value={data.address.number} onChange={(e) => update({ address: { ...data.address, number: e.target.value } })} />
          <Input label="Bairro" value={data.address.neighborhood} onChange={(e) => update({ address: { ...data.address, neighborhood: e.target.value } })} />
          <Input label="Cidade" value={data.address.city} onChange={(e) => update({ address: { ...data.address, city: e.target.value } })} />
          {errors.addressCity && <Error msg={errors.addressCity} />}
          <Input label="Estado" value={data.address.state} onChange={(e) => update({ address: { ...data.address, state: e.target.value } })} />
          {errors.addressState && <Error msg={errors.addressState} />}
          <Input label="CEP" value={data.address.zipCode} onChange={(e) => update({ address: { ...data.address, zipCode: e.target.value } })} />
          {errors.addressZip && <Error msg={errors.addressZip} />}
          <Input label="Complemento" value={data.address.complement || ''} onChange={(e) => update({ address: { ...data.address, complement: e.target.value } })} />
        </div>
      )}
      {step === 'user' && (
        <div className="mt-4 space-y-4">
          <Input label="Nome do Usuário" value={data.user.name} onChange={(e) => update({ user: { ...data.user, name: e.target.value } })} />
          {errors.userName && <Error msg={errors.userName} />}
          <Input label="Email do Usuário" value={data.user.email} onChange={(e) => update({ user: { ...data.user, email: e.target.value } })} />
          {errors.userEmail && <Error msg={errors.userEmail} />}
          <Input label="CPF" value={data.user.cpf} onChange={(e) => update({ user: { ...data.user, cpf: e.target.value } })} />
          {errors.userCpf && <Error msg={errors.userCpf} />}
          <Input label="Password" type="password" value={data.user.password} onChange={(e) => update({ user: { ...data.user, password: e.target.value } })} />
          {errors.userPassword && <Error msg={errors.userPassword} />}
        </div>
      )}
      {step === 'review' && (
        <div className="mt-4 space-y-6 text-sm">
          <Section title="Empresa">
            <Field label="Nome" value={data.business.name} />
            <Field label="Email" value={data.business.email} />
            <Field label="Telefone" value={data.business.phone || '-'} />
            <Field label="Descrição" value={data.business.description || '-'} />
          </Section>
          <Section title="Endereço">
            <Field label="Rua" value={data.address.street} />
            <Field label="Número" value={data.address.number} />
            <Field label="Bairro" value={data.address.neighborhood} />
            <Field label="Cidade" value={data.address.city} />
            <Field label="Estado" value={data.address.state} />
            <Field label="CEP" value={data.address.zipCode} />
            <Field label="Complemento" value={data.address.complement || '-'} />
          </Section>
          <Section title="Usuário">
            <Field label="Nome" value={data.user.name} />
            <Field label="Email" value={data.user.email} />
            <Field label="CPF" value={data.user.cpf} />
            <Field label="Password" value={'••••••••'} />
          </Section>
        </div>
      )}
      {submitError && <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/40 dark:text-red-300">{submitError}</div>}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-xs text-zinc-500">Etapa: {step}</div>
        <div className="flex gap-2">
          {step !== 'business' && <Button onClick={prev} className="bg-zinc-200 text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600">Voltar</Button>}
          {step !== 'review' && <Button onClick={next}>Próximo</Button>}
          {step === 'review' && <Button onClick={handleSubmit}>{loading ? 'A enviar...' : 'Concluir Registo'}</Button>}
        </div>
      </div>
    </Card>
  );
}

function Error({ msg }: { msg: string }) {
  return <p className="mt-1 text-xs text-red-600 dark:text-red-400">{msg}</p>;
}

function Section({ title, children }: React.PropsWithChildren<{ title: string }>) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-zinc-700 dark:text-zinc-200">{title}</h3>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-md border border-[var(--border)] p-2 text-xs dark:border-zinc-700">
      <div className="font-medium text-zinc-600 dark:text-zinc-300">{label}</div>
      <div className="mt-1 text-zinc-800 dark:text-zinc-100 truncate">{value}</div>
    </div>
  );
}

function ProgressIndicator({ step }: { step: Step }) {
  const steps: Step[] = ['business', 'address', 'user', 'review'];
  const index = steps.indexOf(step);
  return (
    <div className="flex items-center gap-2 text-xs">
      {steps.map((s, i) => (
        <div key={s} className={"flex items-center gap-1 " + (i <= index ? 'text-[var(--accent)]' : 'text-zinc-400') }>
          <span className="rounded-full border border-current px-2 py-0.5">{i + 1}</span>
          <span className="hidden sm:inline capitalize">{labelForStep(s)}</span>
          {i < steps.length - 1 && <span className="mx-1 h-px w-6 bg-current opacity-40" />}
        </div>
      ))}
    </div>
  );
}

function labelForStep(s: Step) {
  switch (s) {
    case 'business': return 'Empresa';
    case 'address': return 'Endereço';
    case 'user': return 'Usuário';
    case 'review': return 'Revisão';
  }
}
