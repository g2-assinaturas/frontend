"use client";
import React, { useState } from 'react';
import Card from '../Card';
import Input from '../Input';
import Button from '../Button';
import { CreateCompanyDto } from '../../lib/api';

interface Errors {
  [k: string]: string | undefined;
}

const initial: CreateCompanyDto = {
  name: '',
  email: '',
  phone: '',
  cpfOrCnpj: '',
  description: '',
  address: {
    street: '',
    number: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    complement: '',
  },
  user: {
    name: '',
    email: '',
    cpf: '',
    password: '',
  },
};

type Step = 'company' | 'address' | 'user' | 'review';

interface CompanyFormProps {
  onSubmit: (data: CreateCompanyDto) => Promise<void>;
  loading?: boolean;
}

export default function CompanyForm({ onSubmit, loading = false }: CompanyFormProps) {
  const [data, setData] = useState<CreateCompanyDto>(initial);
  const [step, setStep] = useState<Step>('company');
  const [errors, setErrors] = useState<Errors>({});

  function update(part: Partial<CreateCompanyDto>) {
    setData((d) => ({ ...d, ...part }));
  }

  function validateCurrent(): boolean {
    const e: Errors = {};
    
    if (step === 'company') {
      if (!data.name) e.name = 'Nome é obrigatório';
      if (!data.email || !/^[^@]+@[^@]+\.[^@]+$/.test(data.email)) e.email = 'Email inválido';
      if (!data.phone) e.phone = 'Telefone é obrigatório';
      else if (!/^(\+\d{1,3})?\d{10,11}$/.test(data.phone)) e.phone = 'Formato inválido (10-11 dígitos)';
    } else if (step === 'address') {
      if (!data.address.street) e.street = 'Rua obrigatória';
      if (!data.address.city) e.city = 'Cidade obrigatória';
      if (!data.address.state) e.state = 'Estado obrigatório';
      else if (data.address.state.length !== 2) e.state = 'Estado deve ter 2 letras (ex: SP)';
      if (!data.address.zipCode) e.zipCode = 'CEP obrigatório';
      else if (!/^\d{8}$/.test(data.address.zipCode)) e.zipCode = 'CEP deve ter 8 dígitos';
    } else if (step === 'user') {
      if (!data.user.name) e.userName = 'Nome obrigatório';
      if (!data.user.email || !/^[^@]+@[^@]+\.[^@]+$/.test(data.user.email)) e.userEmail = 'Email inválido';
      if (!data.user.cpf || !/^\d{11}$/.test(data.user.cpf.replace(/\D/g, ''))) e.userCpf = 'CPF deve ter 11 dígitos';
      if (!data.user.password || data.user.password.length < 6) e.userPassword = 'Senha mínima 6 caracteres';
    }
    
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (!validateCurrent()) return;
    setStep((s) => 
      s === 'company' ? 'address' : 
      s === 'address' ? 'user' : 
      s === 'user' ? 'review' : 'review'
    );
  }

  function prev() {
    setStep((s) => 
      s === 'review' ? 'user' : 
      s === 'user' ? 'address' : 
      s === 'address' ? 'company' : 'company'
    );
  }

  async function handleSubmit() {
    await onSubmit(data);
  }

  return (
    <Card className="w-full max-w-3xl">
      <h2 className="mb-4 text-xl font-semibold text-zinc-800 dark:text-zinc-100">
        {step === 'review' ? 'Revisar Dados' : 'Nova Empresa'}
      </h2>
      
      <ProgressIndicator step={step} />

      {step === 'company' && (
        <div className="mt-6 space-y-4">
          <Input 
            label="Nome da Empresa *" 
            value={data.name} 
            onChange={(e) => update({ name: e.target.value })} 
          />
          {errors.name && <Error msg={errors.name} />}
          
          <Input 
            label="Email *" 
            type="email"
            value={data.email} 
            onChange={(e) => update({ email: e.target.value })} 
          />
          {errors.email && <Error msg={errors.email} />}
          
          <Input 
            label="Telefone * (ex: 11987654321)" 
            value={data.phone} 
            onChange={(e) => update({ phone: e.target.value })} 
          />
          {errors.phone && <Error msg={errors.phone} />}
          
          <Input 
            label="CPF/CNPJ (opcional)" 
            value={data.cpfOrCnpj || ''} 
            onChange={(e) => update({ cpfOrCnpj: e.target.value })} 
          />
          
          <Input 
            label="Descrição (opcional)" 
            value={data.description || ''} 
            onChange={(e) => update({ description: e.target.value })} 
          />
        </div>
      )}

      {step === 'address' && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <Input 
              label="Rua *" 
              value={data.address.street} 
              onChange={(e) => update({ address: { ...data.address, street: e.target.value } })} 
            />
            {errors.street && <Error msg={errors.street} />}
          </div>
          
          <Input 
            label="Número *" 
            value={data.address.number} 
            onChange={(e) => update({ address: { ...data.address, number: e.target.value } })} 
          />
          
          <Input 
            label="Bairro *" 
            value={data.address.neighborhood} 
            onChange={(e) => update({ address: { ...data.address, neighborhood: e.target.value } })} 
          />
          
          <Input 
            label="Cidade *" 
            value={data.address.city} 
            onChange={(e) => update({ address: { ...data.address, city: e.target.value } })} 
          />
          {errors.city && <Error msg={errors.city} />}
          
          <Input 
            label="Estado * (2 letras)" 
            value={data.address.state} 
            onChange={(e) => update({ address: { ...data.address, state: e.target.value.toUpperCase().slice(0, 2) } })} 
          />
          {errors.state && <Error msg={errors.state} />}
          
          <Input 
            label="CEP * (8 dígitos)" 
            value={data.address.zipCode} 
            onChange={(e) => update({ address: { ...data.address, zipCode: e.target.value.replace(/\D/g, '') } })} 
          />
          {errors.zipCode && <Error msg={errors.zipCode} />}
          
          <Input 
            label="Complemento (opcional)" 
            value={data.address.complement || ''} 
            onChange={(e) => update({ address: { ...data.address, complement: e.target.value } })} 
          />
        </div>
      )}

      {step === 'user' && (
        <div className="mt-6 space-y-4">
          <Input 
            label="Nome do Usuário Administrador *" 
            value={data.user.name} 
            onChange={(e) => update({ user: { ...data.user, name: e.target.value } })} 
          />
          {errors.userName && <Error msg={errors.userName} />}
          
          <Input 
            label="Email *" 
            type="email"
            value={data.user.email} 
            onChange={(e) => update({ user: { ...data.user, email: e.target.value } })} 
          />
          {errors.userEmail && <Error msg={errors.userEmail} />}
          
          <Input 
            label="CPF * (11 dígitos)" 
            value={data.user.cpf} 
            onChange={(e) => update({ user: { ...data.user, cpf: e.target.value.replace(/\D/g, '') } })} 
          />
          {errors.userCpf && <Error msg={errors.userCpf} />}
          
          <Input 
            label="Senha * (mínimo 6 caracteres)" 
            type="password"
            value={data.user.password} 
            onChange={(e) => update({ user: { ...data.user, password: e.target.value } })} 
          />
          {errors.userPassword && <Error msg={errors.userPassword} />}
        </div>
      )}

      {step === 'review' && (
        <div className="mt-6 space-y-6 text-sm">
          <Section title="Dados da Empresa">
            <Field label="Nome" value={data.name} />
            <Field label="Email" value={data.email} />
            <Field label="Telefone" value={data.phone} />
            {data.cpfOrCnpj && <Field label="CPF/CNPJ" value={data.cpfOrCnpj} />}
            {data.description && <Field label="Descrição" value={data.description} />}
          </Section>
          
          <Section title="Endereço">
            <Field label="Rua" value={data.address.street} />
            <Field label="Número" value={data.address.number} />
            <Field label="Bairro" value={data.address.neighborhood} />
            <Field label="Cidade" value={data.address.city} />
            <Field label="Estado" value={data.address.state} />
            <Field label="CEP" value={data.address.zipCode} />
            {data.address.complement && <Field label="Complemento" value={data.address.complement} />}
          </Section>
          
          <Section title="Usuário Administrador">
            <Field label="Nome" value={data.user.name} />
            <Field label="Email" value={data.user.email} />
            <Field label="CPF" value={data.user.cpf} />
            <Field label="Senha" value="••••••••" />
          </Section>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <div className="text-xs text-zinc-500">
          Passo {['company', 'address', 'user', 'review'].indexOf(step) + 1} de 4
        </div>
        <div className="flex gap-2">
          {step !== 'company' && (
            <Button onClick={prev} variant="outline" disabled={loading}>
              Voltar
            </Button>
          )}
          {step !== 'review' && (
            <Button onClick={next} disabled={loading}>
              Próximo
            </Button>
          )}
          {step === 'review' && (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Criando...' : 'Criar Empresa'}
            </Button>
          )}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-md border border-zinc-200 dark:border-zinc-700 p-2 text-xs">
      <div className="font-medium text-zinc-600 dark:text-zinc-300">{label}</div>
      <div className="mt-1 text-zinc-800 dark:text-zinc-100 truncate">{value}</div>
    </div>
  );
}

function ProgressIndicator({ step }: { step: Step }) {
  const steps: Step[] = ['company', 'address', 'user', 'review'];
  const index = steps.indexOf(step);
  
  const labels: Record<Step, string> = {
    company: 'Empresa',
    address: 'Endereço',
    user: 'Usuário',
    review: 'Revisar',
  };
  
  return (
    <div className="flex items-center gap-2 text-xs">
      {steps.map((s, i) => (
        <div key={s} className={"flex items-center gap-1 " + (i <= index ? 'text-purple-600 dark:text-purple-400' : 'text-zinc-400')}>
          <span className="rounded-full border border-current px-2 py-0.5">{i + 1}</span>
          <span className="hidden sm:inline">{labels[s]}</span>
          {i < steps.length - 1 && <span className="mx-1 h-px w-6 bg-current opacity-40" />}
        </div>
      ))}
    </div>
  );
}
