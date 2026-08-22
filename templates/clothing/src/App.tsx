import React, { useState } from 'react';
import { GARMENTS as INITIAL_GARMENTS, URBAN_CATEGORIES } from './data/products';
import { UrbanGarment, UrbanSize } from './types/catalog';
import { storeConfig } from './config/storeConfig';
import { EditorialHero } from './components/home/EditorialHero';
import { ProductViewerModal } from './components/product/ProductViewerModal';
import { FitGuideModal } from './components/product/FitGuideModal';
import { OutfitStudioModal } from './components/outfit/OutfitStudioModal';
import { AdminGarmentModal } from './components/admin/AdminGarmentModal';
import { FavoritesDrawer } from './components/favorites/FavoritesDrawer';
import { BottomNav } from './components/layout/BottomNav';
import { Layers, Ruler, Heart, Sparkles, Send, Upload, Eye, Plus, Flame } from 'lucide-react';

export const App: React.FC = () => {
  const [garmentList, setGarmentList] = useState<UrbanGarment[]>(INITIAL_GARMENTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [selectedSize, setSelectedSize] = useState<UrbanSize>('L');
  const [activeGarmentModal, setActiveGarmentModal] = useState<UrbanGarment | null>(null);
  const [isFitGuideOpen, setIsFitGuideOpen] = useState<boolean>(false);
  const [isOutfitStudioOpen, setIsOutfitStudioOpen] = useState<boolean>(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('inicio');
  const [favorites, setFavorites] = useState<string[]>([]);

  const favoriteGarments = garmentList.filter((g) => favorites.includes(g.id));

  const filteredGarments = selectedCategory === 'todos'
    ? garmentList
    : garmentList.filter((g) => g.category === selectedCategory);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleAddGarment = (newGarment: UrbanGarment) => {
    setGarmentList((prev) => [newGarment, ...prev]);
  };

  const scrollToCatalog = () => {
    setActiveTab('catalogo');
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenWhatsAppVIP = () => {
    const text = `Hola ${storeConfig.name}, deseo comunicarme con un Asesor VIP de Moda Urbana.`;
    window.open(`https://wa.me/${storeConfig.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleWhatsAppConsultation = (garment: UrbanGarment, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const text = `Hola ${storeConfig.name}, deseo consultar la disponibilidad del siguiente drop:\n\n*${garment.name}*\nRef: ${garment.reference}\nTalla: ${selectedSize}\nDensidad: ${garment.gsm || garment.fit_type}\nPrecio: $${garment.price} USD\n\n¿Realizan envíos a mi ciudad?`;
    window.open(`https://wa.me/${storeConfig.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#090B0E] text-slate-100 flex flex-col font-body selection:bg-yellow-500/30 selection:text-yellow-400 pb-20 md:pb-8">
      {/* ── Premium Glassmorphic Header ── */}
      <header className="sticky top-0 z-30 w-full glass-premium border-b border-yellow-500/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 text-[10px] tracking-widest uppercase font-extrabold shadow-sm flex items-center gap-1">
              <Flame className="w-3 h-3 text-yellow-400 animate-pulse" />
              URBAN DROP 2026
            </span>
          </div>

          <div className="text-center">
            <h1 className="font-display text-lg sm:text-2xl tracking-widest font-black uppercase shimmer-gold-text">
              EMPIRES URBAN LUXURY
            </h1>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 text-xs">
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-200 font-bold hover:border-yellow-400 hover:text-yellow-400 transition-all cursor-pointer flex items-center gap-1.5 shadow-md hover:gold-glow"
              title="Aprovisionar Prenda / Subir Producto"
            >
              <Upload className="w-3.5 h-3.5 text-yellow-400" />
              <span className="hidden sm:inline">Subir Prenda</span>
            </button>

            <button
              onClick={() => setIsFitGuideOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700 text-slate-200 font-bold hover:border-yellow-400 transition-all cursor-pointer flex items-center gap-1.5 shadow-md"
            >
              <Ruler className="w-3.5 h-3.5 text-yellow-400" />
              <span className="hidden sm:inline">Guía de Tallas</span>
            </button>

            <div
              className="relative cursor-pointer p-1"
              onClick={() => setIsFavoritesOpen(true)}
              aria-label={`Ver selección guardada (${favorites.length} prendas)`}
            >
              <Heart className="w-5 h-5 text-white hover:text-yellow-400 transition-colors" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 text-slate-950 text-[10px] font-black rounded-full flex items-center justify-center gold-glow">
                  {favorites.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Editorial Hero Banner ── */}
      <EditorialHero
        onExplore={scrollToCatalog}
        onOpenOutfitStudio={() => setIsOutfitStudioOpen(true)}
      />

      {/* ── Main Catalog Grid ── */}
      <main id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 py-12 flex-1 space-y-10">
        {/* Category Pills Bar (NO SCROLLBAR) */}
        <div className="relative max-w-full">
          <div className="flex items-center justify-start sm:justify-center gap-2.5 overflow-x-auto no-scrollbar py-2 px-1 scroll-smooth">
            <button
              onClick={() => setSelectedCategory('todos')}
              className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-extrabold transition-all cursor-pointer shrink-0 ${
                selectedCategory === 'todos'
                  ? 'bg-yellow-500 text-slate-950 gold-glow scale-105 border border-yellow-400'
                  : 'glass-pill text-slate-300 hover:text-yellow-400 border border-slate-800 hover:border-yellow-500/40'
              }`}
            >
              Todos ({garmentList.length})
            </button>
            {URBAN_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs uppercase tracking-widest font-extrabold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-yellow-500 text-slate-950 gold-glow scale-105 border border-yellow-400'
                    : 'glass-pill text-slate-300 hover:text-yellow-400 border border-slate-800 hover:border-yellow-500/40'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Premium Garment Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGarments.map((garment) => {
            const isFav = favorites.includes(garment.id);

            return (
              <article
                key={garment.id}
                onClick={() => setActiveGarmentModal(garment)}
                className="bg-slate-900/90 border border-slate-800/80 rounded-xl overflow-hidden flex flex-col justify-between card-premium-hover group cursor-pointer shadow-xl relative"
              >
                {/* Ambient Card Backlight */}
                <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                <div>
                  {/* Photo Stage */}
                  <div className="relative aspect-[4/5] bg-slate-950 overflow-hidden">
                    <img
                      src={garment.cover_image}
                      alt={garment.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    />

                    {/* Glassmorphic Quick View Overlay */}
                    <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <span className="px-5 py-2.5 rounded-full bg-slate-950/90 text-yellow-400 text-xs font-black uppercase tracking-wider border border-yellow-500/50 flex items-center gap-2 shadow-2xl backdrop-blur-md gold-glow">
                        <Eye className="w-4 h-4" />
                        Ver Detalle Completo
                      </span>
                    </div>

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
                      <span className="px-3 py-1 rounded-full bg-slate-950/80 text-yellow-400 text-[10px] uppercase tracking-wider font-extrabold border border-yellow-500/40 backdrop-blur-md shadow-md">
                        {garment.badge || garment.gsm || 'Edición Especial'}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(garment.id);
                        }}
                        className="p-2.5 rounded-full bg-slate-950/80 text-white hover:text-yellow-400 transition-all border border-slate-700/80 hover:border-yellow-400 backdrop-blur-md shadow-md"
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'text-yellow-400 fill-yellow-400' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Garment Details */}
                  <div className="p-6 space-y-3.5">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase tracking-widest font-mono font-bold">
                      <span>{garment.reference}</span>
                      <span className="text-yellow-400 px-2 py-0.5 bg-yellow-500/10 rounded border border-yellow-500/20">{garment.fit_type}</span>
                    </div>

                    <h3 className="font-display text-xl text-white font-bold uppercase tracking-wide group-hover:text-yellow-400 transition-colors">
                      {garment.name}
                    </h3>

                    <p className="text-xs text-slate-400 font-light leading-relaxed line-clamp-2">
                      {garment.short_description}
                    </p>

                    {/* Sizes selection */}
                    <div className="space-y-2 pt-1" onClick={(e) => e.stopPropagation()}>
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest font-extrabold block">
                        Talla Preferida:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {garment.available_sizes.map((s) => (
                          <button
                            key={s}
                            onClick={() => setSelectedSize(s)}
                            className={`px-3 py-1 rounded text-[10px] uppercase font-black transition-all cursor-pointer ${
                              selectedSize === s
                                ? 'bg-yellow-500 text-slate-950 font-black gold-glow border border-yellow-400'
                                : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Price & Action */}
                <div className="p-5 border-t border-slate-800/80 bg-slate-950/80 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[9px] text-slate-400 uppercase block font-bold">Precio Drop</span>
                    <span className="font-display text-xl font-black text-white font-mono text-shadow-sm">
                      ${garment.price} USD
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsOutfitStudioOpen(true);
                      }}
                      className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-yellow-400 transition-colors cursor-pointer border border-slate-700 hover:border-yellow-400"
                      title="Combinar esta prenda en el estudio de outfits"
                    >
                      <Layers className="w-4 h-4" />
                    </button>

                    <button
                      onClick={(e) => handleWhatsAppConsultation(garment, e)}
                      className="px-4 py-2.5 bg-yellow-500 text-slate-950 text-[11px] uppercase tracking-widest font-black rounded-lg hover:bg-yellow-400 transition-all flex items-center gap-1.5 cursor-pointer gold-glow hover:scale-102"
                    >
                      <Send className="w-3.5 h-3.5 text-slate-950" />
                      Pedir Drop
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-[#060709] text-slate-400 py-10 px-6 text-center text-xs border-t border-slate-800/80 space-y-3">
        <p className="font-display text-base tracking-widest text-yellow-400 uppercase font-black shimmer-gold-text">
          EMPIRES URBAN LUXURY — HAUTE STREETWEAR 2026
        </p>
        <p className="text-slate-500 font-light text-[11px] max-w-md mx-auto">
          Atención al Cliente VIP WhatsApp: +57 (300) 123-4567 | Envíos Express Asegurados a Nivel Internacional
        </p>
      </footer>

      {/* ── Sticky Mobile Bottom Navigation Bar (md:hidden) ── */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        favoritesCount={favorites.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenOutfitStudio={() => setIsOutfitStudioOpen(true)}
        onOpenWhatsApp={handleOpenWhatsAppVIP}
      />

      {/* Modals & Slide-over Drawers */}
      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favoriteGarments}
        onRemoveFavorite={toggleFavorite}
        onClearAll={() => setFavorites([])}
        onOpenGarmentModal={(g) => setActiveGarmentModal(g)}
        onOpenOutfitStudio={() => setIsOutfitStudioOpen(true)}
      />
      <ProductViewerModal
        garment={activeGarmentModal}
        allGarments={garmentList}
        onClose={() => setActiveGarmentModal(null)}
        onSelectGarment={(g) => setActiveGarmentModal(g)}
        onOpenOutfitStudio={() => setIsOutfitStudioOpen(true)}
        onToggleFavorite={toggleFavorite}
        isFavorite={activeGarmentModal ? favorites.includes(activeGarmentModal.id) : false}
      />
      <FitGuideModal isOpen={isFitGuideOpen} onClose={() => setIsFitGuideOpen(false)} />
      <OutfitStudioModal isOpen={isOutfitStudioOpen} onClose={() => setIsOutfitStudioOpen(false)} />
      <AdminGarmentModal isOpen={isAdminModalOpen} onClose={() => setIsAdminModalOpen(false)} onAddGarment={handleAddGarment} />
    </div>
  );
};

export default App;
