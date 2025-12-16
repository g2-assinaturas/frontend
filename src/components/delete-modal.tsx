'use client';

interface DeleteModalProps {
  /** Título do item sendo eliminado (ex: nome da empresa) */
  itemName: string;
  /** Título customizado do modal (padrão: "Confirmar eliminação") */
  title?: string;
  /** Descrição customizada (padrão usa itemName) */
  description?: string;
  /** Callback quando usuário confirma eliminação */
  onConfirm: () => void;
  /** Callback quando usuário cancela */
  onCancel: () => void;
  /** Se a eliminação está em progresso */
  loading: boolean;
  /** Texto do botão de confirmar (padrão: "Eliminar") */
  confirmText?: string;
  /** Texto exibido durante loading (padrão: "A eliminar...") */
  loadingText?: string;
}

/**
 * Componente reutilizável de modal de confirmação de eliminação
 */
export function DeleteModal({
  itemName,
  title = 'Confirmar eliminação',
  description,
  onConfirm,
  onCancel,
  loading,
  confirmText = 'Eliminar',
  loadingText = 'A eliminar...',
}: DeleteModalProps) {
  const defaultDescription = `Tem a certeza que deseja eliminar permanentemente <strong>${itemName}</strong>? Esta ação não pode ser desfeita e todos os dados serão perdidos.`;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-800">
        <h3 className="text-lg font-semibold text-ink-900 dark:text-white">{title}</h3>
        <p 
          className="mt-2 text-sm text-ink-600 dark:text-slate-300"
          dangerouslySetInnerHTML={{ __html: description || defaultDescription }}
        />
        <div className="mt-6 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-xl border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-ink-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? loadingText : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
