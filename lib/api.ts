const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
export const API_URL = rawApiUrl.replace(/\/+$/, '');


function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

type ApiOptions = RequestInit & { auth?: boolean };

async function parseResponse(res: Response) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export async function apiFetch(path: string, opts: ApiOptions = {}) {
  const url = `${API_URL}${path}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as Record<string, string> || {}),
  };
  const token = getAccessToken?.();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  
  const fetchOpts: RequestInit = {
    ...opts,
    headers,
    credentials: 'include',
  };

  let res: Response;
  try {
    res = await fetch(url, fetchOpts);
  } catch (err: any) {
    
    const netErr = new Error(`Network request failed for ${url}: ${err?.message || 'Failed to fetch'}`);
    (netErr as any).cause = err;
    throw netErr;
  }

  if (res.status === 401) {
    
    if (typeof window !== 'undefined') localStorage.removeItem('token');
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const body = await parseResponse(res);
    const msg = body && body.message ? body.message : res.statusText || 'Request failed';
    const errorMessage = `[API ${res.status}] ${msg} -> ${path}`;
    const err: any = new Error(errorMessage);
    err.status = res.status;
    err.body = body;
    err.path = path;
    err.url = url;
    throw err;
  }

  return parseResponse(res);
}

export async function login(email: string, password: string) {
  const res: any = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ emailOrCpf: email, password }),
    auth: false,
  });
  
  if (res?.token && typeof window !== 'undefined') {
    localStorage.setItem('token', res.token);
  }
  return res;
}


export async function register(email: string, password: string, name?: string) {
  const payload = {
    business: { name: name || 'Empresa', email },
    address: { street: '', number: '', neighborhood: '', city: '', state: '', zipCode: '' },
    user: { name: name || 'Usuário', email, cpf: '00000000000', password },
  };
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
    auth: false,
  });
}

export interface FullRegisterPayload {
  business: {
    name: string;
    email: string;
    phone?: string;
    cpf?: string; 
    cnpj?: string;
    description?: string;
  };
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    ibgeCode?: string;
    complement?: string;
  };
  user: {
    name: string;
    email: string;
    cpf: string;
    password: string;
  };
}

export async function registerFull(payload: FullRegisterPayload) {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
    auth: false,
  });
}

export async function getPlans() {
  return apiFetch('/plans');
}

export async function checkoutSubscription(planId: string) {
  return apiFetch('/subscriptions/checkout', {
    method: 'POST',
    body: JSON.stringify({ planId }),
  });
}

export async function getCurrentUser() {
  
  return apiFetch('/users/profile');
}

export async function getCurrentSubscription() {
  return apiFetch('/subscriptions/current');
}

export async function getInvoices() {
  return apiFetch('/subscriptions/invoices');
}


export async function cancelSubscription(cancelAtPeriodEnd: boolean = true) {
  return apiFetch('/subscriptions/cancel', { 
    method: 'POST',
    body: JSON.stringify({ cancelAtPeriodEnd })
  });
}

export async function logout() {
  
  try {
    return apiFetch('/auth/logout', { method: 'POST' });
  } catch (err) {
    
    return null;
  }
}

// ============================================
// SUPER ADMIN API FUNCTIONS
// ============================================

function getSuperAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('superAdminToken');
}

async function superAdminApiFetch(path: string, opts: ApiOptions = {}) {
  const url = `${API_URL}${path}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as Record<string, string> || {}),
  };
  const token = getSuperAdminToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const fetchOpts: RequestInit = {
    ...opts,
    headers,
    credentials: 'include',
  };

  let res: Response;
  try {
    res = await fetch(url, fetchOpts);
  } catch (err: any) {
    const netErr = new Error(`Network request failed for ${url}: ${err?.message || 'Failed to fetch'}`);
    (netErr as any).cause = err;
    throw netErr;
  }

  if (res.status === 401) {
    if (typeof window !== 'undefined') localStorage.removeItem('superAdminToken');
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const body = await parseResponse(res);
    const msg = body && body.message ? body.message : res.statusText || 'Request failed';
    const errorMessage = `[API ${res.status}] ${msg} -> ${path}`;
    const err: any = new Error(errorMessage);
    err.status = res.status;
    err.body = body;
    err.path = path;
    err.url = url;
    throw err;
  }

  return parseResponse(res);
}

export async function loginSuperAdmin(email: string, password: string) {
  const res: any = await superAdminApiFetch('/super-admin/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  
  if (res?.access_token && typeof window !== 'undefined') {
    localStorage.setItem('superAdminToken', res.access_token);
  }
  return res;
}

export async function getSuperAdminProfile() {
  return superAdminApiFetch('/super-admin/auth/profile');
}

export async function logoutSuperAdmin() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('superAdminToken');
  }
  return { success: true };
}

// Company Management
export interface CreateCompanyDto {
  name: string;
  email: string;
  phone: string;
  cpfOrCnpj?: string;
  description?: string;
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    complement?: string;
    ibgeCode?: string;
  };
  user: {
    name: string;
    email: string;
    cpf: string;
    password: string;
  };
}

export interface UpdateCompanyDto {
  name?: string;
  email?: string;
  phone?: string;
  cpfOrCnpj?: string;
  description?: string;
  isActive?: boolean;
}

export async function createCompany(data: CreateCompanyDto) {
  return superAdminApiFetch('/super-admin/companies', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function listCompanies() {
  return superAdminApiFetch('/super-admin/companies');
}

export async function getCompanyById(id: string) {
  return superAdminApiFetch(`/super-admin/companies/${id}`);
}

export async function updateCompany(id: string, data: UpdateCompanyDto) {
  return superAdminApiFetch(`/super-admin/companies/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function toggleCompanyStatus(id: string) {
  return superAdminApiFetch(`/super-admin/companies/${id}/toggle-status`, {
    method: 'PATCH',
  });
}

export async function deleteCompany(id: string) {
  return superAdminApiFetch(`/super-admin/companies/${id}`, {
    method: 'DELETE',
  });
}
