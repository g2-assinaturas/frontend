'use client';
import React from 'react';

type Plan = {
  id: string;
  name: string;
  description?: string;
  price: number; 
  currency?: string;
  interval?: string;
};

export default function PlanCard({ plan, onChoose }: { plan: Plan; onChoose: (id: string) => void }) {
  return (
    <div className="border rounded-md p-4 shadow-sm">
      <h3 className="text-xl font-semibold">{plan.name}</h3>
      <p className="text-sm text-zinc-600 my-2">{plan.description}</p>
      <div className="flex items-center justify-between mt-4">
        <div className="text-lg font-medium">
          {(plan.price / 100).toFixed(2)} {plan.currency ?? 'BRL'}
        </div>
        <button
          onClick={() => onChoose(plan.id)}
          className="px-4 py-2 bg-black text-white rounded hover:opacity-90"
        >
          Escolher
        </button>
      </div>
    </div>
  );
}