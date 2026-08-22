import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { useApp } from '../../context/AppContext';
import { Trash2, X, AlertTriangle } from 'lucide-react';
import { formatPrice } from '../../utils/formatters';

export const DeleteConfirmModal: React.FC = () => {
  const { deletingProduct, closeDeleteModal } = useAdmin();
  const { deleteProduct } = useApp();

  if (!deletingProduct) return null;

  const handleConfirmDelete = async () => {
    if (deletingProduct) {
      await deleteProduct(deletingProduct.id);
      closeDeleteModal();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm animate-fade-in"
    >
      <div
        className="w-full max-w-md bg-cream rounded-sm border border-taupe/25 shadow-luxury-modal p-6 relative animate-modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeDeleteModal}
          aria-label="Cerrar confirmación"
          className="absolute top-4 right-4 p-1.5 text-ink hover:text-taupe transition-colors rounded-full"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title & Icon */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-status-error/10 border border-status-error/20 flex items-center justify-center text-status-error shrink-0">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h3 id="delete-dialog-title" className="font-display text-lg text-ink font-semibold uppercase tracking-wide">
              Eliminar Pieza
            </h3>
            <p className="text-xs text-taupe-contrast">Confirmación de remoción de catálogo</p>
          </div>
        </div>

        {/* Product Preview Card */}
        <div className="flex items-center gap-3 p-3 bg-cream-200/70 rounded-sm border border-taupe/15 mb-4">
          <img
            src={deletingProduct.cover_image}
            alt={deletingProduct.name}
            className="w-14 h-14 object-cover rounded-sm bg-stone/20"
          />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-mono text-taupe-contrast uppercase tracking-wider">
              {deletingProduct.reference}
            </p>
            <h4 className="font-display text-sm font-medium text-ink truncate">
              {deletingProduct.name}
            </h4>
            <p className="text-xs font-semibold text-ink">
              {formatPrice(deletingProduct.price, deletingProduct.currency)}
            </p>
          </div>
        </div>

        {/* Warning Callout */}
        <div className="flex items-start gap-2 p-3 bg-status-error/5 border-l-2 border-status-error text-[11px] text-taupe-contrast leading-relaxed mb-6">
          <AlertTriangle className="w-4 h-4 text-status-error shrink-0 mt-0.5" />
          <span>
            Esta acción eliminará la pieza inmediatamente de la tienda pública y sincronizará la baja en la base de datos de Cloudflare.
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={closeDeleteModal}
            className="px-4 py-2 text-xs uppercase tracking-wider text-taupe-contrast hover:text-ink font-medium transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleConfirmDelete}
            className="px-5 py-2.5 bg-status-error text-cream text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-status-error/90 transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Eliminar Definitivamente
          </button>
        </div>
      </div>
    </div>
  );
};
