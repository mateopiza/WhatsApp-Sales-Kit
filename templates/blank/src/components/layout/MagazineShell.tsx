import React from 'react';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { NavigationDrawer } from './NavigationDrawer';
import { OfflineBanner } from '../ui/OfflineBanner';
import { Toast } from '../ui/Toast';

export const MagazineShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-cream text-ink flex flex-col antialiased selection:bg-gold/20 selection:text-ink">
      <OfflineBanner />
      <Header />
      <main className="flex-1 pb-24 md:pb-12">{children}</main>
      <BottomNav />
      <NavigationDrawer />
      <Toast />
    </div>
  );
};
