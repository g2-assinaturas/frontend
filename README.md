# SaaS Control - Frontend

> **Plataforma de gestão de assinaturas, faturação e empresas para serviços SaaS**

Sistema completo de gestão multi-tenant construído com **Next.js 15**, **React 19**, **TypeScript** e **Tailwind CSS**. Suporta autenticação JWT, gerenciamento de empresas, planos de assinatura, faturação e painéis administrativos.

---

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Executar o Projeto](#-executar-o-projeto)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Rotas e Páginas](#-rotas-e-páginas)
- [Autenticação](#-autenticação)
- [Contextos e Estado Global](#-contextos-e-estado-global)
- [API e Integração com Backend](#-api-e-integração-com-backend)
- [Componentes](#-componentes)
- [Validação e Formatação](#-validação-e-formatação)
- [Temas (Dark/Light Mode)](#-temas-darklight-mode)
- [Boas Práticas](#-boas-práticas)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Troubleshooting](#-troubleshooting)

---

## ✨ Funcionalidades

### 🏢 **Gestão de Empresas**
- Registro multi-step com validação em tempo real
- Validação de CPF/CNPJ e CEP
- Upload de dados empresariais e endereço completo
- Painel administrativo para Super Admin gerenciar todas as empresas

### 👤 **Autenticação e Autorização**
- Login com email ou CPF
- Autenticação JWT com refresh tokens
- Recuperação de senha via email
- Separação de contextos: usuários de empresas e Super Admin
- Guards para rotas protegidas

### 💳 **Planos e Assinaturas**
- Visualização de planos disponíveis (Básico, Profissional, Empresarial)
- Checkout integrado com Stripe (opcional)
- Gerenciamento de assinatura ativa
- Cancelamento de assinatura com opções de período

### 📊 **Dashboards**
- **Dashboard Empresa**: Métricas de uso, faturas e assinatura ativa
- **Dashboard Super Admin**: Overview de todas as empresas, assinaturas, receita e MRR
- Gráficos e estatísticas em tempo real

### 🧾 **Faturação**
- Listagem de faturas com filtros por status e data
- Download de faturas em PDF
- Histórico de pagamentos
- Relatórios de receita e churn

### 🎨 **UI/UX**
- Design moderno e responsivo
- Dark Mode / Light Mode
- Animações suaves e feedback visual
- Acessibilidade (ARIA labels, keyboard navigation)

---

## 🛠 Tecnologias

| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| **Next.js** | 15.5.7 | Framework React com SSR e App Router |
| **React** | 19.0.0 | Biblioteca para construção de interfaces |
| **TypeScript** | 5.6.3 | Superset tipado de JavaScript |
| **Tailwind CSS** | 3.4.14 | Framework CSS utility-first |
| **React Hook Form** | 7.68.0 | Gerenciamento de formulários |
| **Zod** | 4.1.13 | Validação de schemas TypeScript-first |
| **Next Themes** | - | Suporte a Dark Mode |

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** >= 18.x
- **npm** ou **yarn** ou **pnpm**
- **Backend API** rodando em `http://localhost:3001` (ou configure a URL no `.env`)

---

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd frontend-novo
```

### 2. Instale as dependências

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

---

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
cp .env.example .env.local
```

**`.env.local`:**

```env
# URL da API backend
NEXT_PUBLIC_API_URL=http://localhost:3001
```

> **Nota:** O prefixo `NEXT_PUBLIC_` é necessário para que a variável seja acessível no cliente.

---

## ▶️ Executar o Projeto

### Modo Desenvolvimento

```bash
npm run dev
```

Acesse: **http://localhost:3000**

### Build para Produção

```bash
npm run build
npm run start
```

### Verificação de Tipos

```bash
npm run typecheck
```

### Lint

```bash
npm run lint
```

---

## 📁 Estrutura do Projeto

```
frontend-novo/
├── src/
│   ├── app/                      # Rotas e páginas (App Router)
│   │   ├── layout.tsx            # Layout principal
│   │   ├── page.tsx              # Página inicial
│   │   ├── providers.tsx         # Providers globais
│   │   ├── globals.css           # Estilos globais
│   │   ├── login/                # Login de usuários de empresas
│   │   ├── register/             # Registro de novas empresas
│   │   ├── dashboard/            # Dashboard de empresas
│   │   ├── plans/                # Listagem de planos
│   │   ├── checkout/             # Checkout de assinatura
│   │   ├── subscription/         # Gerenciamento de assinatura
│   │   ├── invoices/             # Listagem de faturas
│   │   ├── profile/              # Perfil do usuário
│   │   ├── forgot-password/      # Recuperação de senha
│   │   ├── reset-password/       # Redefinição de senha
│   │   └── super-admin/          # Área administrativa
│   │       ├── login/            # Login do Super Admin
│   │       ├── dashboard/        # Dashboard administrativo
│   │       ├── companies/        # Gestão de empresas
│   │       ├── subscriptions/    # Gestão de assinaturas
│   │       ├── invoices/         # Gestão de faturas
│   │       └── reports/          # Relatórios e análises
│   ├── components/               # Componentes reutilizáveis
│   │   ├── forms/                # Componentes de formulários
│   │   ├── theme-toggle.tsx     # Toggle Dark/Light Mode
│   │   ├── toast.tsx            # Notificações
│   │   ├── metric-card.tsx      # Card de métricas
│   │   └── delete-modal.tsx     # Modal de confirmação
│   └── lib/                      # Utilitários e lógica de negócio
│       ├── api.ts                # Cliente HTTP e funções de API
│       ├── auth-context.tsx      # Contexto de autenticação de empresas
│       ├── super-admin-context.tsx # Contexto de Super Admin
│       ├── theme-context.tsx     # Contexto de tema
│       ├── types.ts              # Definições de tipos TypeScript
│       ├── validators.ts         # Schemas Zod para validação
│       ├── formatters.ts         # Formatação de dados
│       ├── use-require-auth.ts   # Hook para proteção de rotas
│       └── use-require-super-admin.ts # Hook para proteção de rotas admin
├── public/                       # Arquivos estáticos
├── .env.example                  # Exemplo de variáveis de ambiente
├── .env.local                    # Variáveis de ambiente (git-ignored)
├── next.config.mjs               # Configuração do Next.js
├── tailwind.config.ts            # Configuração do Tailwind CSS
├── tsconfig.json                 # Configuração do TypeScript
├── package.json                  # Dependências e scripts
└── README.md                     # Documentação
```

---

## 🗺 Rotas e Páginas

### Públicas

| Rota | Descrição |
|------|-----------|
| `/` | Página inicial com apresentação do sistema |
| `/login` | Login de usuários de empresas |
| `/register` | Registro de novas empresas (multi-step) |
| `/forgot-password` | Recuperação de senha |
| `/reset-password` | Redefinição de senha com token |
| `/super-admin/login` | Login do Super Admin |

### Protegidas (Requerem Autenticação)

| Rota | Descrição |
|------|-----------|
| `/dashboard` | Dashboard da empresa |
| `/plans` | Listagem de planos disponíveis |
| `/checkout` | Processo de checkout para assinatura |
| `/subscription` | Gerenciamento da assinatura ativa |
| `/invoices` | Histórico de faturas |
| `/profile` | Perfil do usuário logado |

### Administrativas (Super Admin)

| Rota | Descrição |
|------|-----------|
| `/super-admin/dashboard` | Dashboard administrativo com métricas globais |
| `/super-admin/companies` | Listagem e gestão de empresas |
| `/super-admin/companies/new` | Criação de nova empresa |
| `/super-admin/companies/[id]` | Detalhes de uma empresa |
| `/super-admin/companies/[id]/edit` | Edição de empresa |
| `/super-admin/subscriptions` | Gestão de assinaturas |
| `/super-admin/invoices` | Gestão de faturas |
| `/super-admin/reports` | Relatórios de receita e churn |

---

## 🔐 Autenticação

### Fluxo de Autenticação

1. **Login**: Usuário envia `email/cpf` e `password` para `/company-auth/login`
2. **Token JWT**: Backend retorna `accessToken` e dados do `user`
3. **Armazenamento**: Token é salvo no `localStorage`
4. **Requisições**: Token é enviado no header `Authorization: Bearer <token>`
5. **Validação**: Middleware no backend valida o token em rotas protegidas
6. **Logout**: Token é removido do `localStorage`

### Contextos de Autenticação

#### `AuthContext` (Usuários de Empresas)

```typescript
import { useAuth } from '@/lib/auth-context';

function MyComponent() {
  const { user, token, login, logout, loading } = useAuth();

  const handleLogin = async () => {
    await login('usuario@empresa.com', 'senha123');
  };

  return <div>{user?.name}</div>;
}
```

#### `SuperAdminContext` (Super Admin)

```typescript
import { useSuperAdmin } from '@/lib/super-admin-context';

function AdminComponent() {
  const { superAdmin, token, login, logout, loading } = useSuperAdmin();

  return <div>{superAdmin?.name}</div>;
}
```

### Proteção de Rotas

#### Hook `useRequireAuth`

```typescript
import { useRequireAuth } from '@/lib/use-require-auth';

function ProtectedPage() {
  const { user, token, loading } = useRequireAuth();

  if (loading) return <div>Loading...</div>;

  return <div>Olá, {user?.name}</div>;
}
```

#### Hook `useRequireSuperAdmin`

```typescript
import { useRequireSuperAdmin } from '@/lib/use-require-super-admin';

function AdminPage() {
  const { superAdmin, token, loading } = useRequireSuperAdmin();

  if (loading) return <div>Loading...</div>;

  return <div>Olá, Admin {superAdmin?.name}</div>;
}
```

---

## 🌐 API e Integração com Backend

Todas as chamadas à API são centralizadas em **`src/lib/api.ts`**.

### Estrutura das Funções de API

```typescript
// Autenticação
export async function loginCompany(emailOrCpf: string, password: string): Promise<LoginResponse>
export async function loginSuperAdmin(email: string, password: string): Promise<SuperAdminLoginResponse>
export async function registerCompany(payload: RegisterInput): Promise<{ message: string }>
export async function companyProfile(token: string): Promise<{ user: CompanyUser | null }>

// Planos
export async function listPlans(token: string): Promise<Plan[]>

// Assinaturas
export async function checkoutSubscription(planId: string, token: string): Promise<Subscription>
export async function currentSubscription(token: string): Promise<Subscription | null>
export async function cancelSubscription(token: string, cancelAtPeriodEnd: boolean): Promise<{ message: string }>

// Faturas
export async function listInvoices(token: string): Promise<Invoice[]>

// Super Admin - Empresas
export async function listCompanies(token: string): Promise<CompanySummary[]>
export async function getCompanyDetails(id: string, token: string): Promise<CompanyDetails>
export async function createCompany(data: CreateCompanyInput, token: string): Promise<CreateCompanyResponse>
export async function updateCompany(id: string, data: UpdateCompanyInput, token: string): Promise<{ company: CompanySummary; message: string }>
export async function deleteCompany(id: string, token: string): Promise<{ message: string }>

// Super Admin - Métricas
export async function getDashboardMetrics(token: string): Promise<DashboardMetrics>
```

### Exemplo de Uso

```typescript
import { listPlans, checkoutSubscription } from '@/lib/api';

async function handleCheckout(planId: string) {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const subscription = await checkoutSubscription(planId, token);
    console.log('Assinatura criada:', subscription);
  } catch (error) {
    console.error('Erro no checkout:', error);
  }
}
```

---

## 🧩 Componentes

### Componentes Principais

#### `ThemeToggle`
Toggle para alternar entre Dark/Light Mode.

```tsx
import { ThemeToggle } from '@/components/theme-toggle';

<ThemeToggle />
```

#### `Toast`
Componente de notificação.

```tsx
import { Toast } from '@/components/toast';

const [toast, setToast] = useState<{ message: string; kind: 'success' | 'error' | 'info' } | null>(null);

{toast && <Toast message={toast.message} kind={toast.kind} onClose={() => setToast(null)} />}
```

#### `MetricCard`
Card de métrica para dashboards.

```tsx
import { MetricCard } from '@/components/metric-card';

<MetricCard
  title="Total de Empresas"
  value={metrics.companies.total}
  icon="🏢"
/>
```

#### `DeleteModal`
Modal de confirmação para exclusão.

```tsx
import { DeleteModal } from '@/components/delete-modal';

<DeleteModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onConfirm={handleDelete}
  title="Excluir Empresa"
  message="Tem certeza de que deseja excluir esta empresa?"
/>
```

### Componentes de Formulário

- **`CompanyStep`**: Formulário de dados da empresa
- **`AddressStep`**: Formulário de endereço
- **`UserStep`**: Formulário de dados do usuário
- **`MultiStepForm`**: Wrapper para formulários multi-step

---

## ✅ Validação e Formatação

### Validação com Zod

Todos os schemas de validação estão em **`src/lib/validators.ts`**.

```typescript
import { z } from 'zod';

export const LoginSchema = z.object({
  emailOrCpf: z.string().min(3, 'Email ou CPF é obrigatório'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

export const RegisterSchema = z.object({
  business: z.object({
    name: z.string().min(2, 'Nome da empresa é obrigatório'),
    email: z.string().email('Email inválido'),
    phone: z.string().min(10, 'Telefone deve ter no mínimo 10 dígitos'),
    cnpj: z.string().optional(),
    description: z.string().optional(),
  }),
  address: z.object({
    street: z.string().min(3, 'Rua é obrigatória'),
    number: z.string().min(1, 'Número é obrigatório'),
    neighborhood: z.string().min(2, 'Bairro é obrigatório'),
    city: z.string().min(2, 'Cidade é obrigatória'),
    state: z.string().length(2, 'Estado deve ter 2 caracteres'),
    zipCode: z.string().length(8, 'CEP deve ter 8 dígitos'),
  }),
  user: z.object({
    name: z.string().min(2, 'Nome é obrigatório'),
    email: z.string().email('Email inválido'),
    cpf: z.string().length(11, 'CPF deve ter 11 dígitos'),
    phone: z.string().min(10, 'Telefone deve ter no mínimo 10 dígitos'),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  }),
});
```

### Formatação de Dados

Funções de formatação estão em **`src/lib/formatters.ts`**.

```typescript
import { formatPhone, formatCnpj, formatCep, formatCurrency, digitsOnly } from '@/lib/formatters';

// Formatar telefone: 11999999999 → (11) 99999-9999
const phoneFormatted = formatPhone('11999999999');

// Formatar CNPJ: 12345678000190 → 12.345.678/0001-90
const cnpjFormatted = formatCnpj('12345678000190');

// Formatar CEP: 12345678 → 12345-678
const cepFormatted = formatCep('12345678');

// Formatar moeda: 5000 → R$ 50,00
const priceFormatted = formatCurrency(5000);

// Remover formatação: (11) 99999-9999 → 11999999999
const phoneDigits = digitsOnly('(11) 99999-9999');
```

---

## 🎨 Temas (Dark/Light Mode)

O sistema suporta Dark Mode usando **`ThemeContext`**.

### Configuração

```typescript
import { useTheme } from '@/lib/theme-context';

function MyComponent() {
  const { theme, setTheme } = useTheme();

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
```

### Cores

As cores principais são definidas no **`tailwind.config.ts`**:

- **Light Mode**: `bg-ink-50`, `text-ink-900`
- **Dark Mode**: `bg-slate-900`, `text-slate-100`

---

## 📝 Boas Práticas

1. **Tipagem Forte**: Use TypeScript em todos os arquivos
2. **Validação**: Sempre valide inputs com Zod antes de enviar ao backend
3. **Error Handling**: Use try/catch e exiba mensagens amigáveis ao usuário
4. **Loading States**: Sempre mostre feedback visual durante requisições
5. **Formatação**: Use as funções de `formatters.ts` para exibir dados
6. **Acessibilidade**: Use ARIA labels e navegação por teclado
7. **Componentização**: Crie componentes reutilizáveis e pequenos
8. **Nomes Semânticos**: Use nomes descritivos para variáveis e funções

---

## 📜 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera build de produção |
| `npm run start` | Inicia o servidor de produção |
| `npm run lint` | Executa o ESLint |
| `npm run typecheck` | Verifica erros de tipagem TypeScript |

---

## 🐛 Troubleshooting

### Problema: "Token não recebido"

**Causa**: O backend está retornando `access_token` em vez de `accessToken`.

**Solução**: Verifique se o backend está retornando o token no formato camelCase:

```typescript
// Backend deve retornar:
{
  accessToken: 'jwt-token-here',
  user: { ... }
}
```

### Problema: "401 Unauthorized" ao acessar planos

**Causa**: O token não está sendo enviado no header `Authorization`.

**Solução**: Verifique se o token está salvo no `localStorage` e sendo enviado nas requisições:

```typescript
const token = localStorage.getItem('token');
await listPlans(token);
```

### Problema: Página em branco após build

**Causa**: Erro de hidratação ou problema com SSR.

**Solução**: Use `'use client'` no topo dos componentes que usam hooks do React:

```typescript
'use client';

import { useState } from 'react';
```

### Problema: Dark Mode não funciona

**Causa**: Configuração incorreta do Tailwind CSS.

**Solução**: Verifique se o `darkMode: 'class'` está configurado no `tailwind.config.ts` e se o `suppressHydrationWarning` está no `<html>`.

---

## 📚 Recursos Adicionais

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zod Documentation](https://zod.dev)
- [React Hook Form Documentation](https://react-hook-form.com)

---

## 👥 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

