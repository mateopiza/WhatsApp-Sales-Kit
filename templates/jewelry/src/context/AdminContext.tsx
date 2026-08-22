import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product } from '../types/catalog';
import { AdminTab, SyncStatus } from '../types/admin';
import { safeStorage } from '../utils/storage';
import { apiService, ADMIN_AUTH_STORAGE_KEY } from '../services/api';

const ATTEMPTS_STORAGE_KEY = 'empires_admin_attempts';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 300 * 1000; // 5 minutes (300 seconds)

export interface AdminContextType {
  // Authentication
  isAuthenticated: boolean;
  token: string | null;
  expiresAt: number | null;
  login: (pinOrPassword: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLocked: boolean;
  lockoutRemainingSeconds: number;
  attemptsCount: number;

  // CMS Navigation & Views
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  editingProduct: Product | null;
  setEditingProduct: (product: Product | null) => void;
  deletingProduct: Product | null;
  setDeletingProduct: (product: Product | null) => void;

  // Actions
  openCreateForm: () => void;
  openEditForm: (product: Product) => void;
  openDeleteModal: (product: Product) => void;
  closeDeleteModal: () => void;

  // Sync state
  syncStatus: SyncStatus;
  setSyncStatus: (status: SyncStatus) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      const session = sessionStorage.getItem(ADMIN_AUTH_STORAGE_KEY);
      if (session) {
        const parsed = JSON.parse(session);
        if (parsed.authenticated && parsed.expiresAt && Date.now() < parsed.expiresAt) {
          return true;
        }
      }
      const persistent = safeStorage.getItem(ADMIN_AUTH_STORAGE_KEY);
      if (persistent) {
        const parsed = JSON.parse(persistent);
        if (parsed.authenticated && parsed.expiresAt && Date.now() < parsed.expiresAt) {
          return true;
        }
      }
    } catch {
      // ignore
    }
    return false;
  });

  const [token, setToken] = useState<string | null>(() => {
    try {
      const session = sessionStorage.getItem(ADMIN_AUTH_STORAGE_KEY);
      if (session) {
        const parsed = JSON.parse(session);
        return parsed.token || null;
      }
      const persistent = safeStorage.getItem(ADMIN_AUTH_STORAGE_KEY);
      if (persistent) {
        const parsed = JSON.parse(persistent);
        return parsed.token || null;
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [expiresAt, setExpiresAt] = useState<number | null>(null);

  // 2. Rate Limiting State
  const [attemptsCount, setAttemptsCount] = useState<number>(() => {
    try {
      const stored = safeStorage.getItem(ATTEMPTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.count || 0;
      }
    } catch {}
    return 0;
  });

  const [lockedUntil, setLockedUntil] = useState<number | null>(() => {
    try {
      const stored = safeStorage.getItem(ATTEMPTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.lockedUntil && Date.now() < parsed.lockedUntil) {
          return parsed.lockedUntil;
        }
      }
    } catch {}
    return null;
  });

  const [lockoutRemainingSeconds, setLockoutRemainingSeconds] = useState<number>(0);

  // Countdown timer for lockout
  useEffect(() => {
    if (!lockedUntil) {
      setLockoutRemainingSeconds(0);
      return;
    }

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000));
      setLockoutRemainingSeconds(remaining);
      if (remaining <= 0) {
        setLockedUntil(null);
        setAttemptsCount(0);
        safeStorage.removeItem(ATTEMPTS_STORAGE_KEY);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lockedUntil]);

  const isLocked = lockedUntil !== null && Date.now() < lockedUntil;

  // 3. Login
  const login = useCallback(
    async (pinOrPassword: string): Promise<{ success: boolean; error?: string }> => {
      if (isLocked) {
        return {
          success: false,
          error: `Acceso bloqueado por demasiados intentos fallidos. Espere ${lockoutRemainingSeconds} segundos.`,
        };
      }

      const trimmed = pinOrPassword.trim();
      const validPins = ['empires2026', '1879'];

      if (validPins.includes(trimmed)) {
        // Successful login
        const exp = Date.now() + 24 * 60 * 60 * 1000;
        const generatedToken = `jwt-admin-${Date.now()}`;
        const authData = {
          authenticated: true,
          token: generatedToken,
          expiresAt: exp,
          role: 'admin',
        };

        try {
          sessionStorage.setItem(ADMIN_AUTH_STORAGE_KEY, JSON.stringify(authData));
          safeStorage.setItem(ADMIN_AUTH_STORAGE_KEY, JSON.stringify(authData));
          safeStorage.removeItem(ATTEMPTS_STORAGE_KEY);
        } catch {}

        setIsAuthenticated(true);
        setToken(generatedToken);
        setExpiresAt(exp);
        setAttemptsCount(0);
        setLockedUntil(null);
        return { success: true };
      }

      // Try API login
      try {
        const apiRes = await apiService.login(trimmed);
        if (apiRes.success && apiRes.data) {
          const authData = apiRes.data;
          try {
            sessionStorage.setItem(ADMIN_AUTH_STORAGE_KEY, JSON.stringify(authData));
            safeStorage.setItem(ADMIN_AUTH_STORAGE_KEY, JSON.stringify(authData));
            safeStorage.removeItem(ATTEMPTS_STORAGE_KEY);
          } catch {}

          setIsAuthenticated(true);
          setToken(authData.token);
          setExpiresAt(authData.expiresAt);
          setAttemptsCount(0);
          setLockedUntil(null);
          return { success: true };
        }
      } catch {}

      // Failed attempt
      const newAttempts = attemptsCount + 1;
      setAttemptsCount(newAttempts);

      if (newAttempts >= MAX_ATTEMPTS) {
        const lockTime = Date.now() + LOCKOUT_DURATION_MS;
        setLockedUntil(lockTime);
        setLockoutRemainingSeconds(300);
        safeStorage.setItem(
          ATTEMPTS_STORAGE_KEY,
          JSON.stringify({ count: newAttempts, lockedUntil: lockTime })
        );
        return {
          success: false,
          error: 'Demasiados intentos fallidos. El acceso ha sido bloqueado por 5 minutos.',
        };
      } else {
        safeStorage.setItem(
          ATTEMPTS_STORAGE_KEY,
          JSON.stringify({ count: newAttempts, lockedUntil: null })
        );
        return {
          success: false,
          error: `PIN o credencial incorrecta. Intentos restantes: ${MAX_ATTEMPTS - newAttempts}`,
        };
      }
    },
    [attemptsCount, isLocked, lockoutRemainingSeconds]
  );

  // 4. Logout
  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
      safeStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
    } catch {}
    setIsAuthenticated(false);
    setToken(null);
    setExpiresAt(null);
  }, []);

  // 5. Views & Modals
  const [activeTab, setActiveTab] = useState<AdminTab>('catalog');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced');

  const openCreateForm = useCallback(() => {
    setEditingProduct(null);
    setActiveTab('form');
  }, []);

  const openEditForm = useCallback((product: Product) => {
    setEditingProduct(product);
    setActiveTab('form');
  }, []);

  const openDeleteModal = useCallback((product: Product) => {
    setDeletingProduct(product);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeletingProduct(null);
  }, []);

  const value: AdminContextType = {
    isAuthenticated,
    token,
    expiresAt,
    login,
    logout,
    isLocked,
    lockoutRemainingSeconds,
    attemptsCount,

    activeTab,
    setActiveTab,
    editingProduct,
    setEditingProduct,
    deletingProduct,
    setDeletingProduct,

    openCreateForm,
    openEditForm,
    openDeleteModal,
    closeDeleteModal,

    syncStatus,
    setSyncStatus,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
