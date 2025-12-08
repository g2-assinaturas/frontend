"use client";

import MultiStepRegisterForm from '../../components/forms/MultiStepRegisterForm';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[var(--background)] flex items-center justify-center p-4">
      <div className=" max-w-md">
        <MultiStepRegisterForm onSuccess={() => router.push('/login')} />
      </div>
    </div>
  );
}