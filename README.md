# Frontend Subscription Module Documentation

## Overview
Este frontend (Next.js App Router + React + TypeScript + Tailwind) implementa um módulo de subscrições com:
- Registo multi-etapas (empresa, endereço, utilizador)
- Autenticação (login/logout, cookies httpOnly esperados)
- Listagem de planos + destaque do plano atual
- Estado da subscrição (status, período, cancelamento ao fim do ciclo)
- Upgrade/Downgrade via checkout placeholder + página de sucesso
- Faturas (lista + modal de detalhes)
- Hooks de dados com cache na memória e polling inteligente para status `PENDING`
- Skeleton loaders, toasts, tema claro/escuro, acessibilidade básica
- Componentização modular (Card, Button, Badge, PlanCard, SubscriptionStatus, InvoiceList, InvoiceDetailModal, MultiStepRegisterForm)
- Interface otimizada para ambientes de baixa luminosidade.

## Stack & Convenções
- Next.js 16 (App Router)
- Tailwind + CSS Variables para tema (`--background`, `--foreground`, `--accent`, etc.)
- Estado por hooks customizados com caching simples (variáveis módulo + `useState`)
- Toasts para feedback; sessão via cookies httpOnly (sem localStorage para token)
- Polling exponencial para status `PENDING` até webhooks existirem

## Estrutura Principal
```
app/
	login/ register/ plans/ dashboard/
	subscription/
		manage/ checkout/ success/
	invoices/
components/
	subscription/ (PlanCard, SubscriptionStatus, InvoiceList, InvoiceDetailModal)
	forms/MultiStepRegisterForm.tsx
	toast/, Skeleton.tsx, Button.tsx, Card.tsx, Header.tsx
hooks/ (useAuth, usePlans, useSubscription, useInvoices)
lib/ (api.ts, auth helpers)
```

## Endpoints (Consumidos – suposições de backend)
| Endpoint | Método | Descrição | Utilização | Corpo Enviado |
|----------|--------|-----------|------------|---------------|
| `/auth/login` | POST | Autenticar e definir cookie | LoginPage | `{ emailOrCpf, password }` |
| `/auth/register` | POST | Registo multi-etapas | MultiStepRegisterForm | `{ business, address, user }` |
| `/auth/logout` | POST | Limpar sessão | Header logout | `-` |
| `/users/profile` | GET | Perfil autenticado | useAuth | `-` |
| `/plans` | GET | Lista de planos | usePlans / PlansPage | `-` |
| `/subscriptions/checkout` | POST | Iniciar subscrição / mudança de plano | PlanCard / Manage | `{ planId }` |
| `/subscriptions/current` | GET | Subscrição atual | useSubscription / Dashboard / Manage / Checkout / Success | `-` |
| `/subscriptions/invoices` | GET | Faturas do utilizador | useInvoices / Dashboard / Invoices | `-` |
| `/subscriptions/cancel` | POST | Agendar cancelamento | Manage | `-` |

## Fluxos Principais
### 1. Registo
1. MultiStepRegisterForm agrega dados (3 passos + revisão)
2. POST `/auth/register`
3. Feedback + possível redirecionamento

### 2. Login
1. Validação email ou CPF (11 dígitos)
2. POST `/auth/login`
3. Redireciona para `/plans` ou `/dashboard`

### 3. Subscrição / Upgrade / Downgrade
1. Plans mostra plano atual (desabilitado)
2. Seleção chama `/subscriptions/checkout`
3. `/subscription/checkout` faz polling de `PENDING`
4. Ao ficar `ACTIVE` redireciona para `/subscription/success`

### 4. Cancelamento
POST `/subscriptions/cancel` ⇒ marca `cancelAtPeriodEnd`

### 5. Faturas
`useInvoices` carrega lista; modal mostra detalhe básico

## Hooks
### `useAuth()`
Cache de perfil, `refresh()` invalida.

### `usePlans()`
Lista de planos cacheada até refresh manual.

### `useSubscription(options)`
Opções: `pollPendingMs` (inicial), `backoffFactor`, `maxIntervalMs`, `maxAttempts`, `pollUntilStatuses`.
Backoff exponencial em `PENDING`; termina ao mudar de estado ou exceder tentativas.

### `useInvoices()`
GET simples + cache.

## Polling PENDING
Intervalo aumenta com `backoffFactor` até `maxIntervalMs`; para em estados finais ou `maxAttempts`.

## Componentes Reutilizáveis
| Componente | Propósito | Extensão |
|------------|-----------|----------|
| Button | Ações (solid/outline/ghost/danger) | Ícones, tamanhos |
| Card | Container visual | Variantes sombra |
| PlanCard | Mostrar plano | Badges promocionais |
| SubscriptionStatus | Mostrar status | Histórico / timeline |
| InvoiceList | Lista resumida | Paginação |
| InvoiceDetailModal | Detalhe fatura | Itens, download PDF |
| MultiStepRegisterForm | Onboarding | Salvar progresso local |
| Skeleton | Carregamentos | Formatos circulares |
| ToastProvider | Feedback global | Prioridade / ação de undo |

## Fluxo Upgrade/Downgrade
Manage → lista outros planos → checkout → polling → success.

## Acessibilidade
- `aria-label` em botões contextuais
- Focus visível (`focus-visible:outline-*`)
- Mensagens claras de erro/estado

## Reutilização Noutro Projeto
1. Copiar `components/`, `hooks/`, `lib/api.ts`
2. Definir `NEXT_PUBLIC_API_URL`
3. Envolver layout com `Providers`
4. Ajustar endpoints conforme backend real
5. Remover páginas não necessárias

## Futuro (Webhooks)
Substituir polling por SSE/WebSocket; remover backoff e atualizar esta secção.

## Debug Rápido
| Sintoma | Causa | Ação |
|---------|-------|------|
| Failed to fetch | Backend indisponível/CORS | Ver console backend |
| PENDING infinito | Backend sem job finalização | Aumentar maxAttempts temporariamente |
| Sem toasts | Layout sem `Providers` | Adicionar `Providers` |
| Dark mode falha | Classe `dark` não aplicada | Rever `ThemeToggle` |

## Segurança (Frontend)
- Cookies httpOnly para sessão (sem armazenar tokens expostos)
- Sem lógica de faturação crítica no cliente

## Roadmap Futuro
- Tipografia utilitária (`heading-lg`, etc.)
- i18n
- Testes (unit, integration, e2e)
- Paginação & filtros em faturas

## Scripts
```bash
npm run dev
npm run build
```

## Licença
Adicionar conforme necessidade interna.

---
Documentação gerada para facilitar integração e evolução sem alterar o backend.
