'use client';

import { AuthProvider } from '@/lib/auth-context';
import { SuperAdminProvider } from '@/lib/super-admin-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SuperAdminProvider>
      <AuthProvider>{children}</AuthProvider>
    </SuperAdminProvider>
  );
}
