"use client";
import React from 'react';

const colorMap: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  PENDING: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  CANCELED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  EXPIRED: 'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300',
  PAYMENT_FAILED: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  PAST_DUE: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
};

export function Badge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${colorMap[status] || 'bg-zinc-200 text-zinc-700 dark:bg-zinc-700 dark:text-zinc-200'}`}> 
      {status}
    </span>
  );
}
