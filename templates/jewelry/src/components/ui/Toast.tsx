import React from 'react';
import { useApp } from '../../context/AppContext';
import { Check, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast, hideToast } = useApp();

  if (!toast) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-20 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[90vw] animate-slide-up"
    >
      <div className="bg-ink/95 text-cream backdrop-blur-md px-4 py-3 rounded-md border border-gold/30 shadow-lg flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {toast.type === 'success' ? (
            <Check className="w-4 h-4 text-gold shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-gold shrink-0" />
          )}
          <p className="text-xs font-light tracking-wide leading-snug">{toast.message}</p>
        </div>
        <button
          onClick={hideToast}
          aria-label="Cerrar notificación"
          className="text-cream/60 hover:text-cream p-1 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
