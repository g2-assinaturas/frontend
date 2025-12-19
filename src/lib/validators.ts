import { z } from 'zod';
import { digitsOnly } from './formatters';

const brPhoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

export const CompanySchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z
    .string()
    .min(10, 'Telefone inválido')
    .refine((v) => brPhoneRegex.test(v) || /^\d{10,11}$/.test(digitsOnly(v)), {
      message: 'Telefone deve ser válido (DDD + número)',
    }),
  cnpj: z
    .string()
    .optional()
    .refine((v) => !v || [11, 14].includes(digitsOnly(v).length), {
      message: 'CPF ou CNPJ deve ter 11 ou 14 dígitos',
    }),
  description: z.string().optional().or(z.literal('')),
});

export const AddressSchema = z.object({
  street: z.string().min(3, 'Rua deve ter pelo menos 3 caracteres'),
  number: z.string().min(1, 'Número é obrigatório'),
  neighborhood: z.string().min(2, 'Bairro deve ter pelo menos 2 caracteres'),
  city: z.string().min(2, 'Cidade deve ter pelo menos 2 caracteres'),
  state: z.string().regex(/^[A-Za-z]{2}$/, 'Estado deve ter 2 letras'),
  zipCode: z
    .string()
    .refine((v) => /^\d{5}-?\d{3}$/.test(v) || digitsOnly(v).length === 8, {
      message: 'CEP deve ser válido (8 dígitos)',
    }),
  ibgeCode: z.string().optional(),
  complement: z.string().optional(),
});

export const UserSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z
    .string()
    .min(10, 'Telefone inválido')
    .refine((v) => brPhoneRegex.test(v) || /^\d{10,11}$/.test(digitsOnly(v)), {
      message: 'Telefone deve ser válido (DDD + número)',
    }),
  cpf: z
    .string()
    .refine((v) => digitsOnly(v).length === 11, {
      message: 'CPF deve ter 11 dígitos',
    }),
  password: z
    .string()
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .regex(passwordRegex, 'Senha deve ter maiúscula, minúscula, número e símbolo'),
});

export const RegisterSchema = z.object({
  business: CompanySchema,
  address: AddressSchema,
  user: UserSchema,
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Email inválido'),
});

export const ResetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Senha deve ter pelo menos 8 caracteres')
      .regex(passwordRegex, 'Senha deve ter maiúscula, minúscula, número e símbolo'),
    confirmNewPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmNewPassword'],
  });

export type CompanyInput = z.infer<typeof CompanySchema>;
export type AddressInput = z.infer<typeof AddressSchema>;
export type UserInput = z.infer<typeof UserSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
