"use client";
import React from 'react';
import ToastProvider from './toast/ToastProvider';
import ErrorBoundary from './ErrorBoundary';
import { AuthProvider } from '../contexts/AuthContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
