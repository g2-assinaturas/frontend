"use client";
import React from 'react';

type Variant = 'solid' | 'outline' | 'ghost' | 'danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export default function Button({
  children,
  variant = 'solid',
  className = '',
  disabled,
  ...rest
}: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-[.97] disabled:opacity-60 disabled:cursor-not-allowed';
  const styles: Record<Variant, string> = {
    solid: 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] focus-visible:outline-[var(--accent-ring)]',
    outline: 'border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-100 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-700 focus-visible:outline-[var(--accent-ring)]',
    ghost: 'text-zinc-700 dark:text-zinc-100 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-700 focus-visible:outline-[var(--accent-ring)]',
    danger: 'bg-red-600 text-white hover:bg-red-500 focus-visible:outline-red-600',
  };
  const disabledExtra = disabled ? ' opacity-70 ' : '';
  return (
    <button
      className={`${base} ${styles[variant]} ${disabledExtra} ${className}`}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
}
