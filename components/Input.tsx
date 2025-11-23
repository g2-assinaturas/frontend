"use client";
import React from 'react';

export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  className = '',
}: {
  label?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  placeholder?: string;
  className?: string;
}) {

  const normalized = value ?? '';
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
   
    if (process.env.NODE_ENV !== 'production') {
    
      console.log('[Input change]', label, e.target.value);
    }
    onChange?.(e);
  }
  return (
    <label className="block w-full">
      {label && <div className="mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-200">{label}</div>}
      <input
        type={type}
        value={normalized}
        onChange={handleChange}
        onBlur={onBlur}
        placeholder={placeholder}
        name={label ? label.toLowerCase().replace(/[^a-z0-9]+/g, '_') : undefined}
        autoComplete="off"
        className={
          'w-full rounded-md border border-[var(--border)] bg-white text-zinc-900 px-3 py-2 text-sm placeholder:text-zinc-400 focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent-ring)] caret-[var(--accent)] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder:text-zinc-500 transition-colors ' +
          className
        }
      />
    </label>
  );
}
