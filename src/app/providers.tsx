'use client';

import { AuthProvider } from '@/lib/auth-context';
import { SuperAdminProvider } from '@/lib/super-admin-context';
import { ThemeProvider } from '@/lib/theme-context';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SuperAdminProvider>
        <AuthProvider>{children}</AuthProvider>
      </SuperAdminProvider>
    </ThemeProvider>
  );
}
