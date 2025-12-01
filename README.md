# Frontend Assinaturas – Documentação

## Overview
Aplicação Next.js (App Router) em React + TypeScript + Tailwind para fluxo de subscrições:
- Registo multi-etapas (empresa, endereço, utilizador)
- Autenticação via `AuthContext` (token em `localStorage` + cookies httpOnly futuros)
- Listagem de planos e identificação do plano atual
- Gestão de subscrição (estado, cancelamento ao fim do ciclo)
- Checkout com polling para estado `PENDING` e redireciono ao `ACTIVE`
- Faturas (lista + detalhe modal)
- Tema claro/escuro, toasts globais, skeleton loaders
- Suspense aplicado no checkout para `useSearchParams`

## Stack & Convenções
- Next.js 16 / React 19
- Tailwind CSS 4 + algumas variáveis (ex: background) para tema
- Context: `AuthContext` em `contexts/` incluído via `Providers`
- Hooks com cache em memória (variáveis módulo + `useState`) e inflight deduplicado
- Polling exponencial apenas para subscrição `PENDING`
- Código em Português (pt-BR/pt-PT misto) – manter consistência futura

## Estrutura
```
app/
  login/ register/ plans/ dashboard/
  subscription/ (manage/ checkout/ success/)
  invoices/
components/
  subscription/ (PlanCard, SubscriptionStatus, InvoiceList, InvoiceDetailModal)
  forms/ (MultiStepRegisterForm)
  toast/ (ToastProvider)
  Button, Card, Badge, Header, Skeleton, ThemeToggle
contexts/ (AuthContext.tsx)
hooks/ (useAuth, usePlans, useSubscription, useInvoices)
lib/ (api.ts, auth.ts, format.ts, stripe.ts)
```

## Endpoints Consumidos
| Endpoint | Método | Uso | Request Body |
|----------|--------|-----|--------------|
| `/auth/login` | POST | Login | `{ emailOrCpf, password }` |
| `/auth/register` | POST | Registo | `{ business, address, user }` |
| `/auth/logout` | POST | Logout | - |
| `/users/profile` | GET | Perfil atual | - |
| `/plans` | GET | Planos | - |
| `/subscriptions/checkout` | POST | Iniciar/alterar subscrição | `{ planId }` |
| `/subscriptions/current` | GET | Subscrição atual | - |
| `/subscriptions/invoices` | GET | Faturas | - |
| `/subscriptions/cancel` | POST | Cancelamento ao fim do ciclo | - |

## Fluxos
### Registo
MultiStepRegisterForm → `/auth/register` → feedback / navegação.

### Login
Validação email ou CPF (11 dígitos) → `/auth/login` → redireciono.

### Subscrição / Upgrade
Seleção de plano → `/subscriptions/checkout` → polling `PENDING` → `ACTIVE` → `/subscription/success`.

### Cancelamento
`/subscriptions/cancel` agenda cancelamento fim de período.

### Faturas
`useInvoices` obtém lista; modal mostra detalhe disponível.

## Hooks
| Hook | Função | Notas |
|------|--------|-------|
| `useAuth` | Perfil + logout + refresh | Cache global simples |
| `usePlans` | Lista de planos | Cache até refresh |
| `useSubscription` | Estado + polling | Backoff configurável |
| `useInvoices` | Faturas | Cache array |

## Polling `PENDING`
Incrementa intervalo por `backoffFactor` até `maxIntervalMs`; cessa em estado final ou após `maxAttempts`.

## Componentes Principais
| Componente | Propósito |
|------------|-----------|
| Button | Ações UI |
| Card | Contêiner estilizado |
| PlanCard | Exibir plano e acções |
| SubscriptionStatus | Mostrar estado atual |
| InvoiceList / InvoiceDetailModal | Lista + detalhes de faturas |
| MultiStepRegisterForm | Registo multi-etapas |
| Skeleton | Placeholder carregamento |
| ToastProvider | Feedback global |
| Header / ThemeToggle | Navegação + tema |

## Arquitetura
`Providers` empacota `ErrorBoundary`, `AuthProvider` e `ToastProvider` garantindo contexto de autenticação e toasts. Hooks usam padrão de cache em variáveis de módulo + promessa inflight para evitar chamadas duplicadas.

## Variáveis de Ambiente
| Nome | Descrição | Exemplo |
|------|-----------|---------|
| `NEXT_PUBLIC_API_URL` | Base da API | `http://localhost:3000` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Chave pública Stripe (placeholder) | `pk_test_xxx` |

## Scripts
```bash
npm run dev        # Desenvolvimento
npm run build      # Build produção
npm start          # Servir build
npm run lint       # Lint
npm test           # Jest (passa sem testes se vazio)
npm run e2e        # Playwright
```

## Debug Rápido
| Sintoma | Possível causa | Ação |
|---------|----------------|------|
| Failed to fetch | API offline / CORS | Ver backend / headers |
| PENDING não muda | Falta processo backend | Conferir jobs / reduzir intervalo |
| Sem toast | Falta `Providers` no layout | Incluir `Providers` |
| Dark mode não aplica | Classe `dark` ausente | Ver `ThemeToggle` |

## Segurança (Foco Frontend)
- Token atualmente em `localStorage` (migrar para cookies httpOnly conforme backend)
- Sem lógica sensível de faturação no cliente

## Próximos Passos / Roadmap
- Interfaces TypeScript para User/Plan/Subscription/Invoice
- Webhooks / SSE para substituir polling
- Testes adicionais (unit + e2e fluxos principais)
- i18n e padronização pt-BR vs pt-PT

---
README alinhado ao estado atual do código. Atualizar se arquitetura ou endpoints mudarem.
