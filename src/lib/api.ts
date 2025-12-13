import type {
  CompanySummary,
  CompanyUser,
  Invoice,
  LoginResponse,
  Plan,
  Subscription,
  SuperAdminLoginResponse,
  SuperAdminUser,
} from './types';
import type { RegisterInput } from './validators';
import { digitsOnly } from './formatters';

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000').replace(/\/$/, '');

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  const contentType = res.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return (await res.json()) as T;
  }
  return undefined as T;
}

async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, init);
  return handleResponse<T>(res);
}

function withAuth(token: string, init: RequestInit = {}): RequestInit {
  return {
    ...init,
    headers: {
      ...(init.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  };
}

export async function loginCompany(emailOrCpf: string, password: string): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/company-auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emailOrCpf, password }),
  });
}

export async function registerCompany(payload: RegisterInput): Promise<{ message: string }> {
  const { business, address, user } = payload;

  const normalizedBusiness = {
    name: business.name,
    email: business.email,
    phone: digitsOnly(business.phone),
    description: business.description ?? undefined,
    cpfOrCnpj: business.cnpj ? digitsOnly(business.cnpj) : '',
  };

  const normalizedAddress = {
    ...address,
    zipCode: digitsOnly(address.zipCode),
    state: address.state?.toUpperCase(),
  };

  const normalizedUser = {
    ...user,
    phone: digitsOnly(user.phone),
    cpf: digitsOnly(user.cpf),
  };

  return apiFetch<{ message: string }>('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      business: normalizedBusiness,
      address: normalizedAddress,
      user: normalizedUser,
    }),
  });
}

export async function companyProfile(token: string): Promise<{ user: CompanyUser | null }> {
  return apiFetch<{ user: CompanyUser | null }>('/company-auth/profile', {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
}

export async function listPlans(): Promise<Plan[]> {
  return apiFetch<Plan[]>('/subscriptions/plans', { cache: 'no-store' });
}

export async function checkoutSubscription(planId: string, token: string): Promise<Subscription> {
  return apiFetch<Subscription>('/subscriptions/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ planId }),
  });
}

export async function currentSubscription(token: string): Promise<Subscription | null> {
  return apiFetch<Subscription | null>('/subscriptions/current', {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
}

export async function cancelSubscription(token: string, cancelAtPeriodEnd = true, reason?: string) {
  return apiFetch<{ message: string }>('/subscriptions/cancel', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ cancelAtPeriodEnd, reason }),
  });
}

export async function listInvoices(token: string): Promise<Invoice[]> {
  return apiFetch<Invoice[]>('/subscriptions/invoices', {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
}

export async function superAdminLogin(email: string, password: string): Promise<SuperAdminLoginResponse> {
  return apiFetch<SuperAdminLoginResponse>('/super-admin/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
}

export async function superAdminProfile(token: string): Promise<{ user: SuperAdminUser }> {
  return apiFetch<{ user: SuperAdminUser }>('/super-admin/auth/profile', withAuth(token, { cache: 'no-store' }));
}

export async function listCompanies(token: string): Promise<CompanySummary[]> {
  const response = await apiFetch<{ success: boolean; data: CompanySummary[] }>('/super-admin/companies', withAuth(token, { cache: 'no-store' }));
  return response.data;
}

export async function toggleCompanyStatus(id: string, token: string) {
  return apiFetch<{ message: string }>(`/super-admin/companies/${id}/toggle-status`, withAuth(token, { method: 'PATCH' }));
}

export async function forgotPassword(email: string): Promise<{ message: string; token?: string }> {
  return apiFetch<{ message: string; token?: string }>('/company-auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(
  token: string,
  newPassword: string,
  confirmNewPassword: string,
): Promise<{ message: string; requiresReauth: boolean }> {
  return apiFetch<{ message: string; requiresReauth: boolean }>('/company-auth/reset-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword, confirmNewPassword }),
  });
}
