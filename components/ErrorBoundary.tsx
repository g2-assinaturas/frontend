"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Card from './Card';
import Button from './Button';

interface State { hasError: boolean; error?: Error }

export default class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(): void {
    // Error captured and displayed in render
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="app-container py-10">
          <Card className="p-6 flex flex-col gap-4">
            <h1 className="text-xl font-semibold text-red-600 dark:text-red-400">Ocorreu um erro</h1>
            <p className="text-sm text-zinc-700 dark:text-zinc-300">{this.state.error?.message || 'Erro inesperado.'}</p>
            <div className="flex gap-2">
              <Button onClick={() => window.location.reload()}>Recarregar</Button>
              <Button onClick={this.handleReset} className="bg-zinc-200 text-zinc-800 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-600">Tentar novamente</Button>
            </div>
          </Card>
        </div>
      );
    }
    return this.props.children;
  }
}
