import React from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-0 inset-x-0 z-50 bg-ink text-cream px-4 py-2 text-center text-xs tracking-wider font-light flex items-center justify-center gap-2 border-b border-gold/40 shadow-sm animate-slide-down"
    >
      <WifiOff className="w-3.5 h-3.5 text-gold shrink-0" />
      <span>Modo sin conexión — Mostrando catálogo guardado</span>
    </div>
  );
};
