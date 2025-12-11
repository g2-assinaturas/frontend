export type PlanInterval = 'MONTHLY' | 'YEARLY' | 'BIANNUAL' | 'HALF_YEARLY';

export interface Plan {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  currency?: string;
  interval: PlanInterval;
  trialDays?: number | null;
}

export interface CompanyUser {
  id: string;
  companyId: string;
  name: string;
  email: string;
  isActive: boolean;
  role?: string;
}

export interface SuperAdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
}

export interface Subscription {
  id: string;
  planId: string;
  customerId: string;
  status: string;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

export interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: string;
  description?: string | null;
  issuedAt: string | null;
  dueAt: string | null;
}

export interface LoginResponse {
  accessToken: string;
  user: CompanyUser;
}

export interface SuperAdminLoginResponse {
  accessToken: string;
  user: SuperAdminUser;
}

export interface Address {
  id?: string;
  street?: string | null;
  number?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
}

export interface CompanySummary {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  isActive: boolean;
  address?: Address | null;
  users?: Array<Pick<CompanyUser, 'id' | 'name' | 'email' | 'isActive'>>;
  subscriptionsCount?: number;
  customersCount?: number;
  createdAt?: string;
}
