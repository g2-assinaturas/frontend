"use client";

import MultiStepRegisterForm from '../../components/forms/MultiStepRegisterForm';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

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
      {/* Main container with left padding to align center-left */}
      <div className="relative z-10 flex items-center w-full" style={{ paddingLeft: '15%' }}>
        <MultiStepRegisterForm onSuccess={() => router.push('/login')} />
      </div>
    </div>
  );
}