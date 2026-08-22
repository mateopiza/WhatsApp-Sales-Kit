import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAdmin } from '../../context/AdminContext';
import { ProductTable } from './ProductTable';
import { ProductForm } from './ProductForm';
import { CategoryManager } from './CategoryManager';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { Lock, LogOut, X, Sparkles, Layers, ListOrdered, CheckCircle2, RefreshCw } from 'lucide-react';
import { storeConfig } from '../../config/storeConfig';

export const AdminModal: React.FC = () => {
  const { isAdminOpen, closeAdmin } = useApp();
  const {
    isAuthenticated,
    login,
    logout,
    isLocked,
    lockoutRemainingSeconds,
    activeTab,
    setActiveTab,
    openCreateForm,
  } = useAdmin();

  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAdminOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) return;

    setIsSubmitting(true);
    setAuthError(null);

    const result = await login(pinInput);
    setIsSubmitting(false);

    if (!result.success) {
      setAuthError(result.error || 'PIN incorrecto');
    } else {
      setPinInput('');
      setAuthError(null);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-portal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-cream-100 text-ink animate-fade-in flex flex-col min-h-screen"
    >
      {/* Top Admin Navigation Bar - Solid Executive Header */}
      <header className="sticky top-0 z-40 bg-cream border-b border-taupe/30 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-gold-dark animate-pulse shadow-glow-gold" />
            <h1 id="admin-portal-title" className="font-display text-base sm:text-xl text-ink font-semibold tracking-wider uppercase">
              {storeConfig.name} CMS
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <span className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-pill bg-cream-200 text-taupe-contrast border border-taupe/20">
              Cloudflare Pages & Workers D1
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-pill bg-gold/15 text-gold-dark font-medium border border-gold/30">
              v2.4 Pro
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {isAuthenticated && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-pill bg-status-success/10 border border-status-success/25 text-xs text-status-success font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Sincronizado en tiempo real</span>
            </div>
          )}

          {isAuthenticated && (
            <button
              onClick={logout}
              aria-label="Cerrar sesión de administrador"
              className="p-1.5 sm:px-3 sm:py-1.5 text-xs uppercase tracking-wider text-taupe-contrast hover:text-ink hover:bg-cream-200 border border-taupe/20 rounded-sm transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          )}

          <button
            onClick={closeAdmin}
            aria-label="Cerrar portal de administración"
            className="p-2 text-ink hover:text-taupe transition-colors rounded-full hover:bg-cream-200 border border-transparent hover:border-taupe/20 cursor-pointer active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8">
        {!isAuthenticated ? (
          /* Authentication Screen - Solid Executive Card */
          <div className="max-w-md mx-auto my-12 p-6 sm:p-10 bg-cream rounded-md border border-taupe/30 shadow-luxury-modal animate-modal-enter">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-gold-dark mx-auto mb-4 shadow-sm">
                <Lock className="w-7 h-7" />
              </div>
              <h2 className="font-display text-xl sm:text-2xl text-ink font-semibold tracking-wide uppercase">
                Portal Privado CMS
              </h2>
              <p className="text-xs text-taupe-contrast mt-1.5 font-light">
                Gestión segura del inventario. Ingrese el PIN de administrador.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-ink mb-1.5">
                  PIN / Clave de Acceso Master
                </label>
                <input
                  type="password"
                  value={pinInput}
                  disabled={isLocked || isSubmitting}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="••••••••"
                  autoFocus
                  className="w-full px-4 py-3.5 text-base bg-white border border-taupe/30 rounded-sm focus:outline-none focus:border-gold text-ink text-center tracking-widest font-mono shadow-inner"
                />
              </div>

              {authError && (
                <div className="p-3 bg-status-error/10 border border-status-error/30 rounded-sm text-xs text-status-error text-center font-medium">
                  {authError}
                </div>
              )}

              {isLocked && (
                <div className="p-3 bg-status-error/15 border border-status-error/30 rounded-sm text-xs text-status-error text-center font-medium">
                  Acceso bloqueado. Reintente en {lockoutRemainingSeconds} segundos.
                </div>
              )}

              <button
                type="submit"
                disabled={isLocked || isSubmitting || !pinInput.trim()}
                className="w-full py-3.5 bg-ink text-cream text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-ink-dark transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-gold" />
                    Verificando credenciales...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-gold" />
                    Acceder al Gestor
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-5 border-t border-taupe/20 text-center">
              <p className="text-[11px] text-taupe-contrast font-light">
                PIN de acceso por defecto: <span className="font-mono font-semibold text-ink bg-cream-200/80 px-2 py-0.5 rounded-sm border border-taupe/20">{storeConfig.adminPin}</span>
              </p>
            </div>
          </div>
        ) : (
          /* Authenticated CMS Dashboard - Segmented Professional Layout */
          <div className="space-y-6">
            {/* Dashboard Navigation Tabs */}
            <nav aria-label="Secciones CMS" className="flex flex-wrap items-center gap-2 border-b border-taupe/25 pb-3">
              <button
                onClick={() => setActiveTab('catalog')}
                className={`px-4 py-2.5 text-xs uppercase tracking-wider font-semibold rounded-sm transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'catalog'
                    ? 'bg-ink text-cream shadow-md border border-ink'
                    : 'bg-cream text-taupe-contrast hover:text-ink hover:bg-cream-200 border border-taupe/20'
                }`}
              >
                <ListOrdered className="w-4 h-4" />
                Gestión de Catálogo
              </button>

              <button
                onClick={openCreateForm}
                className={`px-4 py-2.5 text-xs uppercase tracking-wider font-semibold rounded-sm transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'form'
                    ? 'bg-ink text-cream shadow-md border border-ink'
                    : 'bg-cream text-taupe-contrast hover:text-ink hover:bg-cream-200 border border-taupe/20'
                }`}
              >
                <Sparkles className="w-4 h-4 text-gold" />
                Nuevo Producto
              </button>

              <button
                onClick={() => setActiveTab('categories')}
                className={`px-4 py-2.5 text-xs uppercase tracking-wider font-semibold rounded-sm transition-all flex items-center gap-2 cursor-pointer ${
                  activeTab === 'categories'
                    ? 'bg-ink text-cream shadow-md border border-ink'
                    : 'bg-cream text-taupe-contrast hover:text-ink hover:bg-cream-200 border border-taupe/20'
                }`}
              >
                <Layers className="w-4 h-4" />
                Categorías & Colecciones
              </button>
            </nav>

            {/* Active Tab View with Solid Card Boundaries */}
            <div className="w-full">
              {activeTab === 'catalog' && <ProductTable />}
              {activeTab === 'form' && <ProductForm />}
              {activeTab === 'categories' && <CategoryManager />}
            </div>

            {/* Confirmation & Action Modals */}
            <DeleteConfirmModal />
          </div>
        )}
      </main>
    </div>
  );
};
