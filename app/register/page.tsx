"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import MultiStepRegisterForm from '../../components/forms/MultiStepRegisterForm';

export default function RegisterPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[var(--background)] transition-colors">
      <main className="app-container flex flex-col items-center gap-8 py-16">
        <MultiStepRegisterForm onSuccess={() => router.push('/login')} />
      </main>
    </div>
  );
}
