'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserSchema, type UserInput } from '@/lib/validators';
import { formatCpf, formatPhone } from '@/lib/formatters';

type Props = {
  defaultValues?: Partial<UserInput>;
  onChange: (data: UserInput, valid: boolean) => void;
};

export function UserStep({ defaultValues, onChange }: Props) {
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

  return (
    <form className="space-y-4" onSubmit={handleSubmit(() => undefined)}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-ink-800" htmlFor="name">
          Nome completo
        </label>
        <input
          id="name"
          {...register('name')}
          className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-ink-900 outline-none ring-0 transition focus:border-ink-400"
          placeholder="Maria Silva"
        />
        {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-ink-800" htmlFor="email">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          {...register('email')}
          className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-ink-900 outline-none ring-0 transition focus:border-ink-400"
          placeholder="voce@empresa.com"
          autoComplete="email"
        />
        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-ink-800" htmlFor="cpf">
          CPF
        </label>
        <input
          id="cpf"
          {...register('cpf', {
            onChange: (e) => setValue('cpf', formatCpf(e.target.value), { shouldValidate: true }),
          })}
          className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-ink-900 outline-none ring-0 transition focus:border-ink-400"
          placeholder="000.000.000-00"
          autoComplete="off"
        />
        {errors.cpf && <p className="text-sm text-red-600">{errors.cpf.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-ink-800" htmlFor="phone">
          Telefone
        </label>
        <input
          id="phone"
          {...register('phone', {
            onChange: (e) => setValue('phone', formatPhone(e.target.value), { shouldValidate: true }),
          })}
          className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-ink-900 outline-none ring-0 transition focus:border-ink-400"
          placeholder="(11) 99999-9999"
          autoComplete="tel"
        />
        {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-ink-800" htmlFor="password">
          Senha
        </label>
        <input
          id="password"
          type="password"
          {...register('password')}
          className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-ink-900 outline-none ring-0 transition focus:border-ink-400"
          placeholder="Mínimo 8 caracteres"
          autoComplete="new-password"
        />
        {errors.password && <p className="text-sm text-red-600">{errors.password.message}</p>}
      </div>
    </form>
  );
}
