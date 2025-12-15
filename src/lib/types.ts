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
  complement?: string | null;
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

// ===== DASHBOARD METRICS TYPES =====

export interface DashboardMetrics {
  companies: {
    total: number;
    active: number;
    inactive: number;
  };
  subscriptions: {
    total: number;
    active: number;
  };
  revenue: {
    total: number;
    mrr: number;
    currency: string;
  };
  recent: {
    companies: RecentCompany[];
    subscriptions: RecentSubscription[];
  };
  timestamp: string;
}

export interface RecentCompany {
  id: string;
  name: string;
  email: string | null;
  isActive: boolean;
  createdAt: string;
  _count: {
    subscriptions: number;
    users: number;
  };
}

export interface RecentSubscription {
  id: string;
  status: string;
  createdAt: string;
  company: {
    id: string;
    name: string;
  };
  plan: {
    id: string;
    name: string;
    price: number;
    interval: string;
  };
}

// ===== COMPANY DETAILS TYPES =====

export interface CompanyDetails {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  cnpj: string | null;
  description: string | null;
  slug: string;
  webhookUrl: string | null;
  isActive: boolean;
  contractDate: string | null;
  createdAt: string;
  updatedAt: string;
  address: Address | null;
  users: CompanyUser[];
  plans: Plan[];
  customers: Array<{
    id: string;
    name: string;
    email: string;
    createdAt: string;
  }>;
  subscriptions: Array<{
    id: string;
    status: string;
    plan: Plan;
    customer: {
      id: string;
      name: string;
      email: string;
    };
  }>;
}

// ===== CREATE/UPDATE COMPANY TYPES =====

export interface CreateCompanyAddressInput {
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  complement?: string;
}

export interface CreateCompanyInput {
  name: string;
  email: string;
  phone: string;
  cnpj?: string;
  description?: string;
  webhookUrl?: string;
  address?: CreateCompanyAddressInput;
}

export interface UpdateCompanyInput {
  name?: string;
  email?: string;
  phone?: string;
  cnpj?: string;
  description?: string;
  webhookUrl?: string;
  address?: Partial<CreateCompanyAddressInput>;
}

export interface CreateCompanyResponse {
  company: CompanySummary;
  address: Address | null;
  companyUser: {
    id: string;
    email: string;
    temporaryPassword: string;
  };
  message: string;
}
