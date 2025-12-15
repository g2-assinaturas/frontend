/**
 * API Client for SaaS Control
 * Centralized module for all backend API communication
 * Handles authentication, error handling, and response parsing
 */

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

// Base API URL configured from environment variable
const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000').replace(/\/$/, '');

/**
 * Handles API response, throwing errors for non-ok responses
 * Automatically parses JSON responses when content-type indicates JSON
 */
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

/**
 * Core fetch wrapper that constructs full URL and handles responses
 * All API calls should use this function for consistency
 */
async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, init);
  return handleResponse<T>(res);
}

/**
 * Helper to add JWT Bearer token to request headers
 * Used for all authenticated endpoints
 */
function withAuth(token: string, init: RequestInit = {}): RequestInit {
  return {
    ...init,
    headers: {
      ...(init.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  };
}

// ===== AUTHENTICATION ENDPOINTS =====

/** Authenticate company user with email/CPF and password */
export async function loginCompany(emailOrCpf: string, password: string): Promise<LoginResponse> {
  return apiFetch<LoginResponse>('/company-auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emailOrCpf, password }),
  });
}

/**
 * Register new company with business details, address, and user credentials
 * Normalizes phone numbers, CPF/CNPJ, and zip codes by removing non-digit characters
 */
export async function registerCompany(payload: RegisterInput): Promise<{ message: string }> {
  const { business, address, user } = payload;

  // Normalize business data: remove formatting from phone and CNPJ/CPF
  const normalizedBusiness = {
    name: business.name,
    email: business.email,
    phone: digitsOnly(business.phone),
    description: business.description ?? undefined,
    cpfOrCnpj: business.cnpj ? digitsOnly(business.cnpj) : '',
  };

  // Normalize address data: remove formatting from zipCode, uppercase state
  const normalizedAddress = {
    ...address,
    zipCode: digitsOnly(address.zipCode),
    state: address.state?.toUpperCase(),
  };

  // Normalize user data: remove formatting from phone and CPF
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

/** Get authenticated company user profile */
export async function companyProfile(token: string): Promise<{ user: CompanyUser | null }> {
  return apiFetch<{ user: CompanyUser | null }>('/company-auth/profile', {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
}

// ===== SUBSCRIPTION & PLAN ENDPOINTS =====

/** Fetch all available subscription plans (public endpoint) */
export async function listPlans(): Promise<Plan[]> {
  return apiFetch<Plan[]>('/subscriptions/plans', { cache: 'no-store' });
}

/** Create checkout session for a subscription plan */
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

/** Get company's current active subscription */
export async function currentSubscription(token: string): Promise<Subscription | null> {
  return apiFetch<Subscription | null>('/subscriptions/current', {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
}

/**
 * Cancel company subscription
 * @param cancelAtPeriodEnd - If true, cancels at end of billing period; if false, cancels immediately
 */
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

/** Get list of company invoices */
export async function listInvoices(token: string): Promise<Invoice[]> {
  return apiFetch<Invoice[]>('/subscriptions/invoices', {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
}

// ===== SUPER ADMIN ENDPOINTS =====

/** Authenticate super admin user */
export async function superAdminLogin(email: string, password: string): Promise<SuperAdminLoginResponse> {
  return apiFetch<SuperAdminLoginResponse>('/super-admin/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
}

/** Get authenticated super admin profile */
export async function superAdminProfile(token: string): Promise<{ user: SuperAdminUser }> {
  return apiFetch<{ user: SuperAdminUser }>('/super-admin/auth/profile', withAuth(token, { cache: 'no-store' }));
}

/** Get list of all registered companies (super admin only) */
export async function listCompanies(token: string): Promise<CompanySummary[]> {
  const response = await apiFetch<{ success: boolean; data: CompanySummary[] }>('/super-admin/companies', withAuth(token, { cache: 'no-store' }));
  return response.data;
}

/** Toggle company active/inactive status (super admin only) */
export async function toggleCompanyStatus(id: string, token: string) {
  return apiFetch<{ message: string }>(`/super-admin/companies/${id}/toggle-status`, withAuth(token, { method: 'PATCH' }));
}

// ===== PASSWORD RECOVERY ENDPOINTS =====

/**
 * Request password reset for company user
 * Sends email with reset link (in dev, also returns token for testing)
 */
export async function forgotPassword(email: string): Promise<{ message: string; token?: string }> {
  return apiFetch<{ message: string; token?: string }>('/company-auth/forgot-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
}

/**
 * Reset password using recovery token
 * Returns requiresReauth flag indicating if user needs to login again
 */
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
