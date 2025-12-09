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
    <div className="w-full flex items-center justify-start">
      <div className="w-full" style={{ maxWidth: '24rem' }}>
        <Card className="shadow-xl w-full max-w-sm" style={{ marginLeft: '1.5rem', marginRight: '1.5rem', maxWidth: '24rem' }}>
          <div className="flex flex-col gap-8">
            {/* Título */}
            <div className="space-y-1" style={{ paddingLeft: '0.75rem' }}>
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Cadastro Profissional</h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-400">Complete todas as etapas para ativar sua conta</p>
            </div>

            {/* Progress Bar */}
            <div className="flex items-center justify-between" style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem' }}>
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

            {/* Conteúdo dos passos */}
            <div style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem' }}>
              {step === 'business' && <StepBusiness data={data} errors={errors} update={update} />}
              {step === 'address' && <StepAddress data={data} errors={errors} update={update} />}
              {step === 'user' && <StepUser data={data} errors={errors} update={update} />}
              {step === 'review' && <StepReview data={data} />}
            </div>

            {/* Erro */}
            {submitError && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300" style={{ marginLeft: '0.75rem', marginRight: '0.75rem', marginBottom: '0.75rem' }}>
                {submitError}
              </div>
            )}

            {/* Botões */}
            <div
              className="pt-6 pb-2 border-t border-zinc-200 dark:border-zinc-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem' }}
            >
              <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 leading-6">
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

/* PASSOS SEM PADDING DUPLICADO */
function StepBusiness({ data, errors, update }: { data: FullRegisterPayload; errors: Record<string, string | undefined>; update: (part: Partial<FullRegisterPayload>) => void }) {
  return (
    <div className="space-y-6">
      <Input
        label="Nome da Empresa"
        labelIcon={(
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4 4.00012C4 3.44784 4.44772 3.00012 5 3.00012H19C19.5523 3.00012 20 3.44784 20 4.00012C20 4.55241 19.5523 5.00012 19 5.00012V19.0001C19.5523 19.0001 20 19.4478 20 20.0001C20 20.5524 19.5523 21.0001 19 21.0001H5C4.44772 21.0001 4 20.5524 4 20.0001C4 19.4478 4.44772 19.0001 5 19.0001V5.00012C4.44772 5.00012 4 4.55241 4 4.00012ZM9 6.00012C8.44772 6.00012 8 6.44784 8 7.00012V8.00012C8 8.55241 8.44772 9.00012 9 9.00012H10C10.5523 9.00012 11 8.55241 11 8.00012V7.00012C11 6.44784 10.5523 6.00012 10 6.00012H9ZM14 6.00012C13.4477 6.00012 13 6.44784 13 7.00012V8.00012C13 8.55241 13.4477 9.00012 14 9.00012H15C15.5523 9.00012 16 8.55241 16 8.00012V7.00012C16 6.44784 15.5523 6.00012 15 6.00012H14ZM9 10.0001C8.44772 10.0001 8 10.4478 8 11.0001V12.0001C8 12.5524 8.44772 13.0001 9 13.0001H10C10.5523 13.0001 11 12.5524 11 12.0001V11.0001C11 10.4478 10.5523 10.0001 10 10.0001H9ZM14 10.0001C13.4477 10.0001 13 10.4478 13 11.0001V12.0001C13 12.5524 13.4477 13.0001 14 13.0001H15C15.5523 13.0001 16 12.5524 16 12.0001V11.0001C16 10.4478 15.5523 10.0001 15 10.0001H14ZM11 14.0001C10.4696 14.0001 9.96086 14.2108 9.58579 14.5859C9.21071 14.961 9 15.4697 9 16.0001V19H11V16.0001H13V19H15V16.0001C15 15.4697 14.7893 14.961 14.4142 14.5859C14.0391 14.2108 13.5304 14.0001 13 14.0001H11Z"
              fill="#111928"
            />
          </svg>
        )}
        value={data.business.name}
        onChange={(e) => update({ business: { ...data.business, name: e.target.value } })}
        placeholder="Ex: Tech Solutions Ltda."
      />
      {errors.businessName && <ErrorMessage msg={errors.businessName} />}
      <Input
        label="Email Corporativo"
        labelIcon={(
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <path d="M7.3125 0L7.01367 0.193359L0 4.76367V14.625H14.625V4.76367L7.61133 0.193359L7.3125 0ZM7.3125 1.33594L13.043 5.0625L7.3125 8.77148L1.58203 5.0625L7.3125 1.33594ZM1.125 6.09961L7.01367 9.91406L7.3125 10.1074L13.5 6.09961V13.5H1.125V6.09961Z" fill="#1C1D21" />
          </svg>
        )}
        type="email"
        value={data.business.email}
        onChange={(e) => update({ business: { ...data.business, email: e.target.value } })}
        placeholder="contato@empresa.com"
      />
      {errors.businessEmail && <ErrorMessage msg={errors.businessEmail} />}
      <Input
        label="Telefone"
        labelIcon={(
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <path
              d="M7.97825 4C7.60535 4 7.23697 4.08169 6.89899 4.23933C6.57505 4.39043 6.28656 4.60779 6.05203 4.8772C4.23311 6.69909 3.69901 8.75143 4.15304 10.8139C4.5922 12.8088 5.93051 14.7068 7.60946 16.3859C9.28843 18.065 11.1856 19.4036 13.1798 19.845C15.241 20.3013 17.2939 19.7724 19.1194 17.9597C19.3899 17.7249 19.6082 17.4357 19.7599 17.1108C19.918 16.7721 20 16.4028 20 16.0289C20 15.655 19.918 15.2857 19.7599 14.947C19.6083 14.6223 19.3903 14.3334 19.1201 14.0987L17.9103 12.8881C17.406 12.3841 16.7224 12.1009 16.0096 12.1009C15.2968 12.1009 14.6128 12.3844 14.1085 12.8885L13.4907 13.5067C13.3395 13.6579 13.1344 13.7429 12.9206 13.7429C12.7068 13.7429 12.5017 13.6579 12.3505 13.5066L10.4971 11.6521C10.346 11.5008 10.261 11.2956 10.261 11.0817C10.261 10.8677 10.346 10.6625 10.4972 10.5112L11.1153 9.8927C11.619 9.38809 11.902 8.70402 11.902 7.99079C11.902 7.27756 11.6187 6.59312 11.1149 6.08851L9.90499 4.87781C9.67037 4.60812 9.38169 4.39054 9.0575 4.23933C8.71952 4.08169 8.35114 4 7.97825 4Z"
              fill="#111928"
            />
          </svg>
        )}
        value={data.business.phone || ''}
        onChange={(e) => update({ business: { ...data.business, phone: e.target.value.replace(/\D/g, '') } })}
        placeholder="(11) 98765-4321"
      />
      {errors.businessPhone && <ErrorMessage msg={errors.businessPhone} />}
      <Input
        label="Descrição do Negócio"
        labelIcon={(
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12ZM11.4079 6.5C10.8556 6.5 10.4079 6.94772 10.4079 7.5C10.4079 8.05228 10.8556 8.5 11.4079 8.5H11.4179C11.9702 8.5 12.4179 8.05228 12.4179 7.5C12.4179 6.94772 11.9702 6.5 11.4179 6.5H11.4079ZM10 10C9.44772 10 9 10.4477 9 11C9 11.5523 9.44772 12 10 12H11V15H10C9.44772 15 9 15.4477 9 16C9 16.5523 9.44772 17 10 17H14C14.5523 17 15 16.5523 15 16C15 15.4477 14.5523 15 14 15H13V11C13 10.4477 12.5523 10 12 10H10Z"
              fill="#111928"
            />
          </svg>
        )}
        value={data.business.description || ''}
        onChange={(e) => update({ business: { ...data.business, description: e.target.value } })}
        placeholder="Breve descrição sobre sua empresa..."
      />
    </div>
  );
}

function StepAddress({ data, errors, update }: { data: FullRegisterPayload; errors: Record<string, string | undefined>; update: (part: Partial<FullRegisterPayload>) => void }) {
  return (
    <div className="space-y-6">
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
    <div className="space-y-6">
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
    <div className="space-y-6">
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