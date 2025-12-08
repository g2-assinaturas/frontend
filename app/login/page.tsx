"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../components/toast/ToastProvider';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');
  const router = useRouter();
  const { addToast } = useToast();

  function validate() {
    let valid = true;
    setEmailError('');
    setPasswordError('');
    // Accept either email pattern or CPF (11 digits)
    const digits = email.replace(/\D/g, '');
    const isEmail = /.+@.+\..+/.test(email);
    const isCpf = digits.length === 11;
    if (!email) {
      setEmailError('Campo obrigatório');
      valid = false;
    } else if (!isEmail && !isCpf) {
      setEmailError('Use email válido ou CPF (11 dígitos)');
      valid = false;
    }
    if (!password) {
      setPasswordError('Password obrigatória');
      valid = false;
    } else if (password.length < 6) {
      setPasswordError('Mínimo 6 caracteres');
      valid = false;
    }
    return valid;
  }

  const { login: authLogin, isAuthenticated } = useAuthContext();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoginError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await authLogin(email, password);
      addToast({ type: 'success', message: 'Login efetuado.' });
      router.push('/plans');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Falha no login';
      setLoginError(msg);
      addToast({ type: 'error', message: msg });
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    if (isAuthenticated) router.replace('/dashboard');
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-start p-4 relative overflow-hidden">
      {/* Background image - right half only */}
      <div
        className="absolute left-1/2 top-0 w-1/2 h-full pointer-events-none"
        style={{
          backgroundImage: 'url(/images/arranhaceus.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      {/* Main container with left padding */}
      <div
        className="relative z-10 flex items-center w-full"
        style={{ paddingLeft: '15%' }}
      >
      <Card
        className="shadow-xl w-full max-w-sm"
        style={{ marginLeft: '1.5rem', marginRight: '1.5rem', maxWidth: '24rem' }}
      >
            <h2
              className="text-2xl font-semibold text-zinc-800 dark:text-zinc-100 mb-6 pl-3"
              style={{ paddingLeft: '0.75rem' }}
            >
              Login
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4" aria-describedby={loginError ? 'login-error' : undefined}>
            <div>
              <div
                className="mb-1 flex items-center text-sm font-medium text-zinc-700 dark:text-zinc-200 pl-3"
                style={{ columnGap: '0.75rem', paddingLeft: '0.75rem' }}
              >
                <span className="inline-flex h-5 w-5 items-center justify-center">
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                    <path d="M7.3125 0L7.01367 0.193359L0 4.76367V14.625H14.625V4.76367L7.61133 0.193359L7.3125 0ZM7.3125 1.33594L13.043 5.0625L7.3125 8.77148L1.58203 5.0625L7.3125 1.33594ZM1.125 6.09961L7.01367 9.91406L7.3125 10.1074L13.5 6.09961V13.5H1.125V6.09961Z" fill="#1C1D21" />
                  </svg>
                </span>
                <span>Email</span>
              </div>
              <div className="pl-3 pr-3" style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem' }}>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => validate()}
                  placeholder="email@exemplo.com"
                  className={emailError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
                />
              </div>
              {emailError && <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{emailError}</p>}
            </div>
            <div style={{ marginTop: '0.75rem' }}>
              <div
                className="mb-1 flex items-center text-sm font-medium text-zinc-700 dark:text-zinc-200 pl-3"
                style={{ columnGap: '0.75rem', paddingLeft: '0.75rem' }}
              >
                <span className="inline-flex h-5 w-5 items-center justify-center">
                  <svg width="12" height="15" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                    <path d="M5.625 0C4.92188 0 4.26562 0.181641 3.65625 0.544922C3.05859 0.896484 2.57812 1.37695 2.21484 1.98633C1.86328 2.58398 1.6875 3.23438 1.6875 3.9375V5.625H0V14.625H11.25V5.625H9.5625V3.9375C9.5625 3.23438 9.38086 2.58398 9.01758 1.98633C8.66602 1.37695 8.18555 0.896484 7.57617 0.544922C6.97852 0.181641 6.32812 0 5.625 0ZM5.625 1.125C6.12891 1.125 6.59766 1.25391 7.03125 1.51172C7.46484 1.75781 7.80469 2.09766 8.05078 2.53125C8.30859 2.96484 8.4375 3.43359 8.4375 3.9375V5.625H2.8125V3.9375C2.8125 3.43359 2.93555 2.96484 3.18164 2.53125C3.43945 2.09766 3.78516 1.75781 4.21875 1.51172C4.65234 1.25391 5.12109 1.125 5.625 1.125ZM1.125 6.75H10.125V13.5H1.125V6.75Z" fill="#8181A5" />
                  </svg>
                </span>
                <span>Password</span>
              </div>
              <div className="pl-3 pr-3" style={{ paddingLeft: '0.75rem', paddingRight: '0.75rem' }}>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => validate()}
                  placeholder="••••••••"
                  className={passwordError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
                />
              </div>
              {passwordError && <p className="mt-1 text-xs text-red-600 dark:text-red-400" role="alert">{passwordError}</p>}
            </div>
            {loginError && (
              <div id="login-error" className="rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/40 dark:text-red-300" role="alert">
                {loginError}
              </div>
            )}
            <div className="pl-6" style={{ paddingLeft: '1.5rem', paddingTop: '0.75rem', paddingBottom: '0.75rem' }}>
              <Button
                type="submit"
                disabled={loading || !!emailError || !!passwordError || !email || !password}
                aria-busy={loading}
              >
                {loading ? 'A processar...' : 'Login'}
              </Button>
            </div>
          </form>
      </Card>
      </div>
    </div>
  );
}
