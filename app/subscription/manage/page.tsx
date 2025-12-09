"use client";
import React, { useState } from 'react';
/* eslint-disable @typescript-eslint/no-explicit-any */
import SubscriptionStatus from '../../../components/subscription/SubscriptionStatus';
import Button from '../../../components/Button';
import Card from '../../../components/Card';
import Skeleton from '../../../components/Skeleton';
import { useToast } from '../../../components/toast/ToastProvider';
import { useSubscription } from '../../../hooks/useSubscription';
import { usePlans } from '../../../hooks/usePlans';
import { cancelSubscription, checkoutSubscription } from '../../../lib/api';
import { useRouter } from 'next/navigation';
interface SimplePlan { id: string; name: string; description?: string; price: number; currency?: string }

export default function ManageSubscriptionPage() {
  const { subscription, loading, error, refresh } = useSubscription({ auto: true });
  const { plans, loading: loadingPlans } = usePlans({ auto: true });
  const router = useRouter();
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [upgradeLoadingId, setUpgradeLoadingId] = useState<string | null>(null);
  const [upgradeError, setUpgradeError] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const { addToast } = useToast();

  async function handleCancel(cancelAtPeriodEnd: boolean) {
    setActionError(null); setSuccessMsg(null);
    setActionLoading(true);
    setShowCancelModal(false);
    try {
      await cancelSubscription(cancelAtPeriodEnd);
      const msg = cancelAtPeriodEnd 
        ? 'Cancelamento agendado no fim do período.' 
        : 'Subscrição cancelada imediatamente.';
      setSuccessMsg(msg);
      addToast({ type: 'success', message: msg });
      await refresh();
    } catch (err: any) {
      const msg = err?.message || 'Falha ao cancelar';
      setActionError(msg);
      addToast({ type: 'error', message: msg });
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)] transition-colors">
      <main className="app-container py-10 space-y-8">
        <h1 className="text-2xl font-semibold mb-2">Gerir Subscrição</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">Visualize o plano atual e cancele ao fim do período. Reativação futura dependerá do endpoint backend.</p>

        <section>
          {loading && <div className="space-y-4"><Skeleton className="h-24" /><Skeleton className="h-40" /></div>}
          {!loading && !subscription && <Card><p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">Sem subscrição ativa.</p></Card>}
          {subscription && (
            <div className="space-y-4">
              <SubscriptionStatus subscription={subscription} />
              <Card className="flex flex-col gap-4">
                <div>
                  <div className="text-sm text-zinc-500">Plano Atual</div>
                  <div className="text-lg font-semibold text-zinc-800 dark:text-zinc-100">{subscription.plan?.name}</div>
                </div>
                <div className="text-sm text-zinc-500 flex flex-col gap-1">
                  <span>Status: <span className="font-medium">{subscription.status}</span></span>
                  <span>Cancelamento ao fim do período: <span className="font-medium">{subscription.cancelAtPeriodEnd ? 'Sim' : 'Não'}</span></span>
                </div>
                {actionError && <div className="rounded-md bg-red-50 p-3 text-xs text-red-700 dark:bg-red-900/40 dark:text-red-300" role="alert">{actionError}</div>}
                {successMsg && <div className="rounded-md bg-green-50 p-3 text-xs text-green-700 dark:bg-green-900/40 dark:text-green-300" role="alert">{successMsg}</div>}
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="danger"
                    onClick={() => setShowCancelModal(true)}
                    disabled={actionLoading || subscription.cancelAtPeriodEnd}
                    aria-label="Cancelar subscrição"
                  >
                    {subscription.cancelAtPeriodEnd ? 'Cancelamento Agendado' : 'Cancelar Subscrição'}
                  </Button>
                  <Button
                    variant="outline"
                    disabled
                    aria-label="Reativar subscrição (desativado)"
                  >
                    Reativar (aguarda endpoint)
                  </Button>
                </div>
                <div className="pt-4 border-t border-[var(--border)] dark:border-zinc-700">
                  <div className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">Upgrade / Downgrade</div>
                  {loadingPlans && <p className="text-xs text-zinc-500">A carregar planos...</p>}
                  {!loadingPlans && plans && (
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {(plans as SimplePlan[]).filter((p: SimplePlan) => p.id !== subscription.plan?.id).map((p: SimplePlan) => (
                        <Card key={p.id} className="p-4 flex flex-col gap-2">
                          <div className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">{p.name}</div>
                          <div className="text-xs text-zinc-500 dark:text-zinc-400">{p.description || 'Plano'}</div>
                          <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{(p.price/100).toFixed(2)} {p.currency || 'BRL'}</div>
                          <Button
                            className="mt-1"
                            variant="outline"
                            disabled={!!upgradeLoadingId}
                            aria-label={`Selecionar plano ${p.name}`}
                            onClick={async () => {
                              setUpgradeError(null);
                              setUpgradeLoadingId(p.id);
                              try {
                                await checkoutSubscription(p.id);
                                router.push(`/subscription/checkout?plan=${p.id}`);
                              } catch (err: any) {
                                setUpgradeError(err?.message || 'Falha no checkout');
                              } finally {
                                setUpgradeLoadingId(null);
                              }
                            }}
                          >
                            {upgradeLoadingId === p.id ? '...' : 'Selecionar'}
                          </Button>
                        </Card>
                      ))}
                      {(plans as SimplePlan[]).filter((p: SimplePlan) => p.id !== subscription.plan?.id).length === 0 && (
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Não há outros planos para trocar.</p>
                      )}
                    </div>
                  )}
                  {upgradeError && <p className="mt-2 text-xs text-red-600 dark:text-red-400" role="alert">{upgradeError}</p>}
                </div>
              </Card>
            </div>
          )}
          {error && <p className="mt-4 text-xs text-red-600 dark:text-red-400" role="alert">{error}</p>}
        </section>

        {/* Modal de Confirmação de Cancelamento */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full">
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-zinc-100 mb-4">
                Como deseja cancelar?
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                Escolha quando o cancelamento deve entrar em vigor:
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="p-4 border-2 border-zinc-200 dark:border-zinc-700 rounded-lg">
                  <h4 className="font-medium text-zinc-800 dark:text-zinc-100 mb-1">
                    Cancelar no fim do período
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Você continuará tendo acesso até {subscription?.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString('pt-BR') : 'o fim do período atual'}
                  </p>
                </div>
                
                <div className="p-4 border-2 border-red-200 dark:border-red-800 rounded-lg bg-red-50 dark:bg-red-900/10">
                  <h4 className="font-medium text-red-800 dark:text-red-300 mb-1">
                    Cancelar imediatamente
                  </h4>
                  <p className="text-xs text-red-600 dark:text-red-400">
                    Seu acesso será revogado agora. Sem reembolso.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowCancelModal(false)}
                  disabled={actionLoading}
                  className="flex-1"
                >
                  Voltar
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleCancel(true)}
                  disabled={actionLoading}
                  className="flex-1"
                >
                  {actionLoading ? '...' : 'Fim do Período'}
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleCancel(false)}
                  disabled={actionLoading}
                  className="flex-1"
                >
                  {actionLoading ? '...' : 'Agora'}
                </Button>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
