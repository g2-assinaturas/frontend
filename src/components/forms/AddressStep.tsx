'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddressSchema, type AddressInput } from '@/lib/validators';
import { formatCep, formatHouseNumber, formatUf } from '@/lib/formatters';

async function fetchViaCep(zip: string) {
  const cleaned = zip.replace(/\D/g, '');
  if (cleaned.length !== 8) return null;
  const res = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
  if (!res.ok) return null;
  const data = await res.json();
  if (data.erro) return null;
  return data as {
    logradouro?: string;
    bairro?: string;
    localidade?: string;
    uf?: string;
  };
}

type Props = {
  defaultValues?: Partial<AddressInput>;
  onChange: (data: AddressInput, valid: boolean) => void;
};

export function AddressStep({ defaultValues, onChange }: Props) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<AddressInput>({
    resolver: zodResolver(AddressSchema),
    mode: 'onChange',
    defaultValues,
  });

  useEffect(() => {
    const subscription = watch((value) => {
      onChange(value as AddressInput, isValid);
    });
    return () => subscription.unsubscribe();
  }, [watch, onChange, isValid]);

  const handleZipBlur = async () => {
    const zip = watch('zipCode');
    const data = await fetchViaCep(zip);
    if (!data) return;
    if (data.logradouro) setValue('street', data.logradouro, { shouldValidate: true });
    if (data.bairro) setValue('neighborhood', data.bairro, { shouldValidate: true });
    if (data.localidade) setValue('city', data.localidade, { shouldValidate: true });
    if (data.uf) setValue('state', data.uf, { shouldValidate: true });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(() => undefined)}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-ink-800" htmlFor="zipCode">
          CEP
        </label>
        <input
          id="zipCode"
          {...register('zipCode', {
            onChange: (e) => setValue('zipCode', formatCep(e.target.value), { shouldValidate: true }),
          })}
          onBlur={handleZipBlur}
          className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-ink-900 outline-none ring-0 transition focus:border-ink-400"
          placeholder="00000-000"
        />
        {errors.zipCode && <p className="text-sm text-red-600">{errors.zipCode.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-ink-800" htmlFor="street">
          Rua
        </label>
        <input
          id="street"
          {...register('street')}
          className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-ink-900 outline-none ring-0 transition focus:border-ink-400"
          placeholder="Av. Paulista"
        />
        {errors.street && <p className="text-sm text-red-600">{errors.street.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-ink-800" htmlFor="number">
          Número
        </label>
        <input
          id="number"
          {...register('number', {
            onChange: (e) => setValue('number', formatHouseNumber(e.target.value), { shouldValidate: true }),
          })}
          className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-ink-900 outline-none ring-0 transition focus:border-ink-400"
          placeholder="123"
        />
        {errors.number && <p className="text-sm text-red-600">{errors.number.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-ink-800" htmlFor="neighborhood">
          Bairro
        </label>
        <input
          id="neighborhood"
          {...register('neighborhood')}
          className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-ink-900 outline-none ring-0 transition focus:border-ink-400"
          placeholder="Centro"
        />
        {errors.neighborhood && <p className="text-sm text-red-600">{errors.neighborhood.message}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink-800" htmlFor="city">
            Cidade
          </label>
          <input
            id="city"
            {...register('city')}
            className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-ink-900 outline-none ring-0 transition focus:border-ink-400"
            placeholder="São Paulo"
          />
          {errors.city && <p className="text-sm text-red-600">{errors.city.message}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-ink-800" htmlFor="state">
            UF
          </label>
          <input
            id="state"
            maxLength={2}
            {...register('state', {
              onChange: (e) => setValue('state', formatUf(e.target.value), { shouldValidate: true }),
            })}
            className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-ink-900 uppercase outline-none ring-0 transition focus:border-ink-400"
            placeholder="SP"
          />
          {errors.state && <p className="text-sm text-red-600">{errors.state.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-ink-800" htmlFor="complement">
          Complemento (opcional)
        </label>
        <input
          id="complement"
          {...register('complement')}
          className="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-ink-900 outline-none ring-0 transition focus:border-ink-400"
          placeholder="Apto 45"
        />
        {errors.complement && <p className="text-sm text-red-600">{errors.complement.message}</p>}
      </div>
    </form>
  );
}
