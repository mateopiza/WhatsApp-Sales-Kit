import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AdminProvider } from './context/AdminContext';
import { MagazineShell } from './components/layout/MagazineShell';
import { EditorialHero } from './components/home/EditorialHero';
import { CategoryGrid } from './components/home/CategoryGrid';
import { FeaturedLookbook } from './components/home/FeaturedLookbook';
import { BrandStory } from './components/home/BrandStory';
import { ConciergeSection } from './components/home/ConciergeSection';
import { ProductViewer } from './components/product/ProductViewer';
import { SearchDrawer } from './components/search/SearchDrawer';
import { FavoritesDrawer } from './components/favorites/FavoritesDrawer';
import { AdminModal } from './components/admin/AdminModal';

const AppContent: React.FC = () => {
  const { activeTab } = useApp();

  // Scroll to relevant section when tab changes
  useEffect(() => {
    if (activeTab === 'colecciones') {
      const section = document.getElementById('catalog-section');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    } else if (activeTab === 'contacto') {
      const section = document.getElementById('contacto-section');
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeTab]);

  return (
    <MagazineShell>
      {/* Editorial Hero Cover (Shown on Inicio) */}
      <EditorialHero />

      {/* Main Category Selection */}
      <CategoryGrid />

      {/* Interactive Catalog & Lookbook */}
      <FeaturedLookbook />

      {/* Brand Craftsmanship Narrative & Pillars */}
      <BrandStory />

      {/* VIP Concierge WhatsApp Section */}
      <ConciergeSection />

      {/* Fullscreen Product Viewer Modal (65-75% VH photo + gestures) */}
      <ProductViewer />

      {/* Instant Search & Multi-Filter Drawer */}
      <SearchDrawer />

      {/* Favorites & Bulk Inquiry Drawer */}
      <FavoritesDrawer />

      {/* Admin CMS Portal View / Modal */}
      <AdminModal />
    </MagazineShell>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <AdminProvider>
        <AppContent />
      </AdminProvider>
    </AppProvider>
  );
};

export default App;
