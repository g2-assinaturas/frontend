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

function formatCPF(value: string): string {
  const cleaned = value.replace(/\D/g, '').slice(0, 11);
  if (cleaned.length <= 3) return cleaned;
  if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
  if (cleaned.length <= 9) return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
  return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6, 9)}-${cleaned.slice(9)}`;
}

function formatCEP(value: string): string {
  const cleaned = value.replace(/\D/g, '').slice(0, 8);
  if (cleaned.length <= 5) return cleaned;
  return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
}

export default function MultiStepRegisterForm({ onSuccess }: { onSuccess?: () => void }) {
  const [data, setData] = useState<FullRegisterPayload>(initial);
  const [step, setStep] = useState<Step>('business');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const update = (part: Partial<FullRegisterPayload>) => {
    setData((d) => ({ ...d, ...part }));
  };

  const validateCurrent = (): boolean => {
    const e: Errors = {};
    if (step === 'business') {
      if (!data.business.name) e.businessName = 'Nome da empresa é obrigatório';
      if (!data.business.email || !/^[^@]+@[^@]+\.[^@]+$/.test(data.business.email)) e.businessEmail = 'Email inválido';
      if (!data.business.phone) e.businessPhone = 'Telefone é obrigatório';
      else if (!/^\d{10,11}$/.test(data.business.phone.replace(/\D/g, ''))) e.businessPhone = 'Formato inválido (10-11 dígitos)';
    } else if (step === 'address') {
      if (!data.address.street) e.addressStreet = 'Rua obrigatória';
      if (!data.address.city) e.addressCity = 'Cidade obrigatória';
      if (!data.address.state) e.addressState = 'Estado obrigatório';
      else if (data.address.state.length !== 2) e.addressState = 'Estado deve ter 2 letras (ex: SP)';
      if (!data.address.zipCode) e.addressZip = 'CEP obrigatório';
    } else if (step === 'user') {
      if (!data.user.name) e.userName = 'Nome obrigatório';
      if (!data.user.email || !/^[^@]+@[^@]+\.[^@]+$/.test(data.user.email)) e.userEmail = 'Email inválido';
      if (!data.user.cpf || data.user.cpf.replace(/\D/g, '').length < 11) e.userCpf = 'CPF deve ter 11 dígitos';
      if (!data.user.password || data.user.password.length < 6) e.userPassword = 'Senha mínimo 6 caracteres';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateCurrent()) return;
    setStep((s) => (s === 'business' ? 'address' : s === 'address' ? 'user' : s === 'user' ? 'review' : 'review'));
  };

  const prev = () => {
    setStep((s) => (s === 'review' ? 'user' : s === 'user' ? 'address' : s === 'address' ? 'business' : 'business'));
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    setLoading(true);
    try {
      await registerFull(data);
      onSuccess?.();
    } catch (err: unknown) {
      const error = err as { message?: string };
      setSubmitError(error?.message || 'Erro ao registar');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 'business' as const, label: 'Empresa' },
    { id: 'address' as const, label: 'Endereço' },
    { id: 'user' as const, label: 'Usuário' },
    { id: 'review' as const, label: 'Revisão' },
  ];
  const currentStepIndex = steps.findIndex((s) => s.id === step);

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-start p-4" style={{ paddingLeft: '15%' }}>
      <div className="w-full max-w-md" style={{ maxWidth: '28rem' }}>
        <Card className="shadow-xl" style={{ marginLeft: '1.5rem', marginRight: '1.5rem' }}>
          <div className="space-y-10">
            {/* Título */}
            <div className="text-left pl-3" style={{ paddingLeft: '0.75rem' }}>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Cadastro Profissional</h1>
              <p className="mt-3 text-lg text-zinc-600 dark:text-zinc-400">Complete todas as etapas para ativar sua conta</p>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center justify-between">
              {steps.map((s, i) => (
                <React.Fragment key={s.id}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-full border-2 font-semibold transition-all ${
                        i <= currentStepIndex
                          ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                          : 'border-zinc-300 bg-white text-zinc-600 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                      }`}
                    >
                      {i < currentStepIndex ? '✓' : i + 1}
                    </div>
                    <span className={`mt-2 text-xs font-medium ${i === currentStepIndex ? 'text-[var(--accent)]' : 'text-zinc-500'}`}>
                      {s.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-3 rounded-full transition-all ${
                        i < currentStepIndex ? 'bg-[var(--accent)]' : 'bg-zinc-200 dark:bg-zinc-700'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Conteúdo dos passos — com padding lateral */}
            <div className="space-y-8">
              {step === 'business' && <StepBusiness data={data} errors={errors} update={update} />}
              {step === 'address' && <StepAddress data={data} errors={errors} update={update} />}
              {step === 'user' && <StepUser data={data} errors={errors} update={update} />}
              {step === 'review' && <StepReview data={data} />}
            </div>

            {/* Erro */}
            {submitError && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300">
                {submitError}
              </div>
            )}

            {/* Botões */}
            <div className="flex items-center justify-between pt-8 border-t border-zinc-200 dark:border-zinc-700">
              <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Etapa {currentStepIndex + 1} de {steps.length}
              </span>
              <div className="flex gap-4">
                {currentStepIndex > 0 && (
                  <Button onClick={prev} variant="outline" disabled={loading}>
                    Voltar
                  </Button>
                )}
                {currentStepIndex < steps.length - 1 ? (
                  <Button onClick={next} disabled={loading}>
                    Próximo
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Criando conta...' : 'Finalizar Cadastro'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* PASSOS COM ESPAÇO LATERAL (px-8) */
function StepBusiness({ data, errors, update }: { data: FullRegisterPayload; errors: Record<string, string | undefined>; update: (part: Partial<FullRegisterPayload>) => void }) {
  return (
    <div className="space-y-6 pl-3 pr-3" style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem' }}>
      <Input label="Nome da Empresa" value={data.business.name} onChange={(e) => update({ business: { ...data.business, name: e.target.value } })} placeholder="Ex: Tech Solutions Ltda." />
      {errors.businessName && <ErrorMessage msg={errors.businessName} />}
      <Input label="Email Corporativo" type="email" value={data.business.email} onChange={(e) => update({ business: { ...data.business, email: e.target.value } })} placeholder="contato@empresa.com" />
      {errors.businessEmail && <ErrorMessage msg={errors.businessEmail} />}
      <Input label="Telefone" value={data.business.phone || ''} onChange={(e) => update({ business: { ...data.business, phone: e.target.value.replace(/\D/g, '') } })} placeholder="(11) 98765-4321" />
      {errors.businessPhone && <ErrorMessage msg={errors.businessPhone} />}
      <Input label="Descrição do Negócio" value={data.business.description || ''} onChange={(e) => update({ business: { ...data.business, description: e.target.value } })} placeholder="Breve descrição sobre sua empresa..." />
    </div>
  );
}

function StepAddress({ data, errors, update }: { data: FullRegisterPayload; errors: Record<string, string | undefined>; update: (part: Partial<FullRegisterPayload>) => void }) {
  return (
    <div className="space-y-6 pl-3 pr-3" style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem' }}>
      <Input label="Rua" value={data.address.street} onChange={(e) => update({ address: { ...data.address, street: e.target.value } })} placeholder="Av. Principal" />
      {errors.addressStreet && <ErrorMessage msg={errors.addressStreet} />}
      <div className="grid grid-cols-2 gap-4">
        <Input label="Número" value={data.address.number} onChange={(e) => update({ address: { ...data.address, number: e.target.value } })} placeholder="123" />
        <Input label="Bairro" value={data.address.neighborhood} onChange={(e) => update({ address: { ...data.address, neighborhood: e.target.value } })} placeholder="Centro" />
      </div>
      <Input label="Cidade" value={data.address.city} onChange={(e) => update({ address: { ...data.address, city: e.target.value } })} placeholder="São Paulo" />
      {errors.addressCity && <ErrorMessage msg={errors.addressCity} />}
      <div className="grid grid-cols-2 gap-4">
        <Input label="Estado (UF)" value={data.address.state} onChange={(e) => update({ address: { ...data.address, state: e.target.value.toUpperCase().slice(0, 2) } })} placeholder="SP" />
        <Input label="CEP" value={formatCEP(data.address.zipCode)} onChange={(e) => update({ address: { ...data.address, zipCode: e.target.value.replace(/\D/g, '').slice(0, 8) } })} placeholder="01234-567" />
      </div>
      <Input label="Complemento (Opcional)" value={data.address.complement || ''} onChange={(e) => update({ address: { ...data.address, complement: e.target.value } })} placeholder="Apto 101" />
    </div>
  );
}

function StepUser({ data, errors, update }: { data: FullRegisterPayload; errors: Record<string, string | undefined>; update: (part: Partial<FullRegisterPayload>) => void }) {
  return (
    <div className="space-y-6 pl-3 pr-3" style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem' }}>
      <Input label="Nome Completo" value={data.user.name} onChange={(e) => update({ user: { ...data.user, name: e.target.value } })} placeholder="João Silva" />
      {errors.userName && <ErrorMessage msg={errors.userName} />}
      <Input label="Email Pessoal" type="email" value={data.user.email} onChange={(e) => update({ user: { ...data.user, email: e.target.value } })} placeholder="joao@email.com" />
      {errors.userEmail && <ErrorMessage msg={errors.userEmail} />}
      <Input label="CPF" value={formatCPF(data.user.cpf)} onChange={(e) => update({ user: { ...data.user, cpf: e.target.value.replace(/\D/g, '').slice(0, 11) } })} placeholder="000.000.000-00" />
      {errors.userCpf && <ErrorMessage msg={errors.userCpf} />}
      <Input label="Senha" type="password" value={data.user.password} onChange={(e) => update({ user: { ...data.user, password: e.target.value } })} placeholder="Mínimo 6 caracteres" />
      {errors.userPassword && <ErrorMessage msg={errors.userPassword} />}
    </div>
  );
}

function StepReview({ data }: { data: FullRegisterPayload }) {
  return (
    <div className="space-y-6 pl-3 pr-3" style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem' }}>
      <ReviewSection title="Dados da Empresa">
        <ReviewField label="Nome" value={data.business.name} />
        <ReviewField label="Email" value={data.business.email} />
        <ReviewField label="Telefone" value={data.business.phone || '-'} />
        <ReviewField label="Descrição" value={data.business.description || '-'} />
      </ReviewSection>

      <ReviewSection title="Endereço">
        <ReviewField label="Rua" value={data.address.street} />
        <ReviewField label="Número" value={data.address.number} />
        <ReviewField label="Bairro" value={data.address.neighborhood} />
        <ReviewField label="Cidade/UF" value={`${data.address.city}, ${data.address.state}`} />
        <ReviewField label="CEP" value={formatCEP(data.address.zipCode)} />
        {data.address.complement && <ReviewField label="Complemento" value={data.address.complement} />}
      </ReviewSection>

      <ReviewSection title="Dados do Usuário">
        <ReviewField label="Nome" value={data.user.name} />
        <ReviewField label="Email" value={data.user.email} />
        <ReviewField label="CPF" value={formatCPF(data.user.cpf)} />
      </ReviewSection>

      <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900/50 dark:bg-green-950/30">
        <p className="text-sm font-medium text-green-900 dark:text-green-200">✓ Todos os dados foram validados com sucesso!</p>
      </div>
    </div>
  );
}

function ReviewSection({ title, children }: React.PropsWithChildren<{ title: string }>) {
  return (
    <div className="rounded-lg border border-zinc-200 p-6 dark:border-zinc-700">
      <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-zinc-50">{title}</h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function ReviewField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{label}</div>
      <div className="mt-1 text-sm font-medium text-zinc-900 dark:text-zinc-50">{value}</div>
    </div>
  );
}

function ErrorMessage({ msg }: { msg: string }) {
  return <p className="mt-2 flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400">Warning {msg}</p>;
}