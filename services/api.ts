/* eslint-disable @typescript-eslint/no-explicit-any */
const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

async function apiFetch<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API}${path.startsWith('/') ? path : '/' + path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`api-failed: ${res.status} - ${text}`);
  }

  // tenta devolver JSON; se não tiver body, devolve um objecto vazio
  try {
    return (await res.json()) as T;
  } catch {
    return {} as T;
  }
}

/** Tipos mínimos */
export type Plan = {
  id: string;
  name: string;
  description?: string;
  price: number; // em cêntimos
  currency?: string;
  interval?: string;
  recommended?: boolean;
  features?: string[];
};

export type CheckoutResponse = {
  checkoutUrl?: string;
} & Record<string, unknown>;


export async function getPlans(): Promise<Plan[]> {
  try {
    return await apiFetch<Plan[]>('/subscriptions/plans');
  } catch {
    // fallback temporário para desenvolvimento local
    return [
      { id: 'monthly', name: 'Mensal', description: 'Acesso básico mensal', price: 1999, currency: 'BRL', interval: 'MONTHLY' },
      { id: 'yearly', name: 'Anual', description: 'Economiza 2 meses', price: 19990, currency: 'BRL', interval: 'YEARLY' },
    ];
  }
}

export async function checkout(planId: string, token?: string): Promise<CheckoutResponse> {
  return await apiFetch<CheckoutResponse>('/subscriptions/checkout', {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ planId }),
  });
}

export async function loginUser(email: string, password: string) {
  return await apiFetch<{ token?: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function registerUser(name: string, email: string, password: string) {
  return await apiFetch<{ id?: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}