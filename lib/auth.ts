
export function clearClientAuth() {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  } catch {}
}

export function clientLogoutCleanup() {
  clearClientAuth();
}
