"use client";
import React, { useState } from 'react';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from '../Badge';
import { toggleCompanyStatus, deleteCompany } from '../../lib/api';
import { useToast } from '../toast/ToastProvider';

interface Company {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isActive: boolean;
  createdAt?: string;
}

interface CompanyTableProps {
  companies: Company[];
  onRefresh: () => void;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
}

export default function CompanyTable({ companies, onRefresh, onEdit, onView }: CompanyTableProps) {
  const { addToast } = useToast();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleToggleStatus = async (id: string) => {
    setLoadingId(id);
    try {
      await toggleCompanyStatus(id);
      addToast({ type: 'success', message: 'Status atualizado com sucesso' });
      onRefresh();
    } catch (err: any) {
      addToast({ type: 'error', message: err?.message || 'Erro ao atualizar status' });
    } finally {
      setLoadingId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja deletar a empresa "${name}"? Esta ação não pode ser desfeita.`)) {
      return;
    }
    
    setLoadingId(id);
    try {
      await deleteCompany(id);
      addToast({ type: 'success', message: 'Empresa deletada com sucesso' });
      onRefresh();
    } catch (err: any) {
      addToast({ type: 'error', message: err?.message || 'Erro ao deletar empresa' });
    } finally {
      setLoadingId(null);
    }
  };

  if (companies.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
        <p className="text-zinc-500 dark:text-zinc-400">Nenhuma empresa encontrada</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
      <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-700">
        <thead className="bg-zinc-50 dark:bg-zinc-900/50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Empresa
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Telefone
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-700">
          {companies.map((company) => (
            <tr key={company.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {company.name}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  {company.email}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  {company.phone || '—'}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge status={company.isActive ? 'ACTIVE' : 'CANCELED'} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => onView(company.id)}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
                    disabled={loadingId === company.id}
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => onEdit(company.id)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                    disabled={loadingId === company.id}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleToggleStatus(company.id)}
                    className="text-amber-600 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300"
                    disabled={loadingId === company.id}
                  >
                    {loadingId === company.id ? '...' : company.isActive ? 'Desativar' : 'Ativar'}
                  </button>
                  <button
                    onClick={() => handleDelete(company.id, company.name)}
                    className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                    disabled={loadingId === company.id}
                  >
                    Deletar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
