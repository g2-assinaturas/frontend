# Consolidação Frontend (Duplicações Removidas)

## Objetivo
Reduzir código duplicado (formatação, autenticação, subscrição) e preparar base única para evolução.

## Alterações Realizadas
- `lib/format.ts`: Centraliza `formatMoney`, `formatDate`, `intervalLabel`.
- Componentes (`PlanCard`, `SubscriptionStatus`, `InvoiceList`, `InvoiceDetailModal`): Usam util compartilhada.
- `AuthContext` substitui lógica duplicada de login na página `/login` (remove uso direto de `lib/api login`).
- `apiFetch` agora injeta header `Authorization` se houver token via `getAccessToken()`.
- Helper `register` marcado como deprecated (usar `registerFull`).
- Hook `useAuth` marcado como deprecated em favor de contexto.

## Duplicações Remanescentes (Baixa Prioridade)
- Hooks `useSubscription`, `usePlans`, `useInvoices` ainda repetem padrão de cache/inflight (podem migrar para contextos ou SWR/React Query).
- Páginas continuam a chamar `getPlans/getCurrentSubscription` diretamente; pode trocar por contextos.
- Mensagens de erro ainda não padronizadas via `mapApiError` em todos os locais.

## Próximos Passos Sugeridos
1. Unificar subscription/invoices em contextos ou introduzir React Query.
2. Aplicar `mapApiError` globalmente em páginas/serviços.
3. Criar componente `PlanCheckoutGate` reutilizável.
4. Remover helper `register` quando backend estiver alinhado.

## Testes Necessários
- Reexecutar specs existentes (PlanCard, SubscriptionStatus) para garantir import estável.
- Adicionar testes para `format.ts` (unit) e login com AuthContext (mock).

## Riscos
- Uso simultâneo de hooks antigos + contextos pode gerar estados divergentes se ambos usados na mesma árvore.

---
Gerado automaticamente para documentação de handoff.
