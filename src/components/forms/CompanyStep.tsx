'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CompanySchema, type CompanyInput } from '@/lib/validators';
import { formatCpfCnpj, formatPhone } from '@/lib/formatters';

type Props = {
  defaultValues?: Partial<CompanyInput>;
  onChange: (data: CompanyInput, valid: boolean) => void;
  formId?: string;
  onValidSubmit?: () => void;
};

export function CompanyStep({ defaultValues, onChange, formId, onValidSubmit }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<CompanyInput>({
    resolver: zodResolver(CompanySchema),
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    const subscription = watch((value) => {
      onChange(value as CompanyInput, isValid);
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange, isValid]);

  const handleFormSubmit = handleSubmit(() => {
    if (isValid && onValidSubmit) {
      onValidSubmit();
    }
  });

  return (
    <form id={formId} className="space-y-4" onSubmit={handleFormSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-ink-800 dark:text-slate-200" htmlFor="name">
          Nome da empresa <span className="text-red-600 dark:text-red-400">*</span>
        </label>
        <input
          id="name"
          {...register('name')}
          className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-ink-900 outline-none ring-0 transition focus:border-ink-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-slate-500"
          placeholder="Ex: Acme Ltda"
          required
        />
        {errors.name && <p className="text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-ink-800 dark:text-slate-200" htmlFor="email">
          Email corporativo <span className="text-red-600 dark:text-red-400">*</span>
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-ink-900 outline-none ring-0 transition focus:border-ink-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-slate-500"
          placeholder="contato@empresa.com"
          required
        />
        {errors.email && <p className="text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-ink-800 dark:text-slate-200" htmlFor="phone">
          Telefone (DDD + número) <span className="text-red-600 dark:text-red-400">*</span>
        </label>
        <input
          id="phone"
          {...register('phone', {
            onChange: (e) => setValue('phone', formatPhone(e.target.value), { shouldValidate: true }),
          })}
          className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-ink-900 outline-none ring-0 transition focus:border-ink-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-slate-500"
          placeholder="(11) 91234-5678"
          required
        />
        {errors.phone && <p className="text-sm text-red-600 dark:text-red-400">{errors.phone.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-ink-800 dark:text-slate-200" htmlFor="cnpj">
          CPF ou CNPJ (opcional)
        </label>
        <input
          id="cnpj"
          {...register('cnpj', {
            onChange: (e) => setValue('cnpj', formatCpfCnpj(e.target.value), { shouldValidate: true }),
          })}
          className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-ink-900 outline-none ring-0 transition focus:border-ink-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-slate-500"
          placeholder="000.000.000-00 ou 00.000.000/0000-00"
        />
        {errors.cnpj && <p className="text-sm text-red-600 dark:text-red-400">{errors.cnpj.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-ink-800 dark:text-slate-200" htmlFor="description">
          Descrição (opcional)
        </label>
        <textarea
          id="description"
          rows={3}
          {...register('description')}
          className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-ink-900 outline-none ring-0 transition focus:border-ink-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-slate-500"
          placeholder="Escreva um resumo da empresa"
        />
        {errors.description && <p className="text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>}
      </div>
    </form>
  );
}
