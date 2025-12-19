'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserSchema, type UserInput } from '@/lib/validators';
import { formatCpf, formatPhone } from '@/lib/formatters';

type Props = {
  defaultValues?: Partial<UserInput>;
  onChange: (data: UserInput, valid: boolean) => void;
  formId?: string;
  onValidSubmit?: () => void;
};

export function UserStep({ defaultValues, onChange, formId, onValidSubmit }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<UserInput>({
    resolver: zodResolver(UserSchema),
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    const subscription = watch((value) => {
      onChange(value as UserInput, isValid);
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
          Nome completo <span className="text-red-600 dark:text-red-400">*</span>
        </label>
        <input
          id="name"
          {...register('name')}
          className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-ink-900 outline-none ring-0 transition focus:border-ink-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-slate-500"
          placeholder="Maria Silva"
          aria-label="Nome completo"
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
          required
        />
        {errors.name && <p id="name-error" className="text-sm text-red-600 dark:text-red-400" role="alert">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-ink-800 dark:text-slate-200" htmlFor="email">
          E-mail <span className="text-red-600 dark:text-red-400">*</span>
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-ink-900 outline-none ring-0 transition focus:border-ink-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-slate-500"
          placeholder="voce@empresa.com"
          autoComplete="email"
          aria-label="E-mail"
          aria-required="true"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
          required
        />
        {errors.email && <p id="email-error" className="text-sm text-red-600 dark:text-red-400" role="alert">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-ink-800 dark:text-slate-200" htmlFor="cpf">
          CPF <span className="text-red-600 dark:text-red-400">*</span>
        </label>
        <input
          id="cpf"
          {...register('cpf', {
            onChange: (e) => setValue('cpf', formatCpf(e.target.value), { shouldValidate: true }),
          })}
          className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-ink-900 outline-none ring-0 transition focus:border-ink-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-slate-500"
          placeholder="000.000.000-00"
          autoComplete="off"
          aria-label="CPF"
          aria-required="true"
          aria-invalid={!!errors.cpf}
          aria-describedby={errors.cpf ? 'cpf-error' : undefined}
          required
        />
        {errors.cpf && <p id="cpf-error" className="text-sm text-red-600 dark:text-red-400" role="alert">{errors.cpf.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-ink-800 dark:text-slate-200" htmlFor="phone">
          Telefone <span className="text-red-600 dark:text-red-400">*</span>
        </label>
        <input
          id="phone"
          {...register('phone', {
            onChange: (e) => setValue('phone', formatPhone(e.target.value), { shouldValidate: true }),
          })}
          className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-ink-900 outline-none ring-0 transition focus:border-ink-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-slate-500"
          placeholder="(11) 99999-9999"
          autoComplete="tel"
          aria-label="Telefone"
          aria-required="true"
          aria-invalid={!!errors.phone}
          aria-describedby={errors.phone ? 'phone-error' : undefined}
          required
        />
        {errors.phone && <p id="phone-error" className="text-sm text-red-600 dark:text-red-400" role="alert">{errors.phone.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-ink-800 dark:text-slate-200" htmlFor="password">
          Senha <span className="text-red-600 dark:text-red-400">*</span>
        </label>
        <input
          id="password"
          type="password"
          {...register('password')}
          className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-ink-900 outline-none ring-0 transition focus:border-ink-400 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:focus:border-slate-500"
          placeholder="Mínimo 8 caracteres"
          autoComplete="new-password"
          aria-label="Senha"
          aria-required="true"
          aria-invalid={!!errors.password}
          aria-describedby={errors.password ? 'password-error password-requirements' : 'password-requirements'}
          required
        />
        {errors.password && <p id="password-error" className="text-sm text-red-600 dark:text-red-400" role="alert">{errors.password.message}</p>}
        <p id="password-requirements" className="text-xs text-ink-500 dark:text-slate-400">Deve conter maiúscula, minúscula, número e símbolo</p>
      </div>
    </form>
  );
}
