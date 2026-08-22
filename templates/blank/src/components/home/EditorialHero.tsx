import React, { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowDown, Gem } from 'lucide-react';
import { storeConfig } from '../../config/storeConfig';

export const EditorialHero: React.FC = () => {
  const { setActiveTab } = useApp();
  const headlineRef = useRef<HTMLHeadingElement>(null);

  const handleExplore = () => {
    const catalogSection = document.getElementById('catalog-section');
    if (catalogSection) {
      catalogSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      setActiveTab('colecciones');
    }
  };

  // Stagger headline words on mount
  useEffect(() => {
    const el = headlineRef.current;
    if (!el) return;
    const words = el.querySelectorAll<HTMLSpanElement>('.word-anim');
    words.forEach((w, i) => {
      w.style.animationDelay = `${300 + i * 90}ms`;
    });
  }, []);

  return (
    <section className="relative min-h-[90svh] flex flex-col justify-between overflow-hidden">
      {/* ── Background: Ken Burns Pan on Real Bracelet Photo ── */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/hero/hero-placeholder.svg"
          alt={storeConfig.name}
          className="w-full h-full object-cover object-center animate-ken-burns"
          fetchPriority="high"
          decoding="async"
        />
        {/* Warm cream vignette — bottom heavy */}
        <div className="absolute inset-0 hero-vignette-warm" />
        {/* Left side shadow for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-cream/60 via-cream/20 to-transparent" />
      </div>

      {/* ── Editorial Badge — Top Center ── */}
      <div className="relative z-10 pt-10 sm:pt-14 px-6 flex justify-center animate-fade-down delay-100">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill glass-cream shadow-sm">
          <Gem className="w-3 h-3 text-gold-dark" />
          <span className="text-[10px] tracking-widest uppercase font-medium text-ink">
            {storeConfig.tagline}
          </span>
        </div>
      </div>

      {/* ── Center Display Typography ── */}
      <div className="relative z-10 max-w-lg mx-auto px-6 text-left sm:text-center py-8 my-auto">
        {/* Eyebrow */}
        <p className="text-[10px] sm:text-xs uppercase tracking-widest text-taupe-contrast font-semibold mb-4 animate-fade-up delay-200">
          Catálogo Digital
        </p>

        {/* Main Headline — word-by-word stagger */}
        <h1
          ref={headlineRef}
          className="font-display text-3xl sm:text-5xl md:text-6xl text-ink font-normal tracking-wide leading-[1.12] mb-5"
        >
          {['Vende', 'Directo', 'Por', 'WhatsApp'].map((word) => (
            <span
              key={word}
              className="word-anim inline-block animate-fade-up opacity-0 mr-[0.3em]"
              style={{ animationFillMode: 'forwards' }}
            >
              {word}
            </span>
          ))}
        </h1>

        {/* Gold Divider */}
        <div className="w-16 h-px line-shimmer-gold mb-5 sm:mx-auto" />

        {/* Sub-copy */}
        <p className="font-body font-light text-sm text-ink/80 max-w-sm sm:mx-auto leading-relaxed animate-fade-up delay-600">
          Presenta tu catálogo, recibe solicitudes y cierra ventas directamente por WhatsApp.
        </p>

        {/* CTA Group */}
        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center sm:justify-center gap-3 animate-fade-up delay-700">
          <button
            onClick={handleExplore}
            aria-label="Explorar el catálogo"
            className="px-8 py-3.5 bg-ink text-cream text-[11px] tracking-widest uppercase font-medium rounded-sm border border-ink hover:bg-ink-light transition-all shadow-md btn-cta-luxury"
          >
            Explorar Catálogo
          </button>
          <button
            onClick={handleExplore}
            aria-label="Ver todas las colecciones"
            className="px-6 py-3.5 bg-transparent text-ink text-[11px] tracking-widest uppercase font-medium rounded-sm border border-ink/30 hover:border-gold hover:text-gold-dark transition-all animate-glow-pulse"
          >
            Colecciones
          </button>
        </div>
      </div>

      {/* ── Scroll Cue — Bottom ── */}
      <div className="relative z-10 pb-8 text-center animate-fade-in delay-800">
        <button
          onClick={handleExplore}
          aria-label="Desplazarse al catálogo"
          className="inline-flex flex-col items-center gap-2 text-taupe-contrast hover:text-ink transition-colors group cursor-pointer"
        >
          <span className="text-[9px] tracking-widest uppercase font-medium">Descubrir</span>
          <ArrowDown className="w-3.5 h-3.5 text-gold-dark animate-bounce-y" />
        </button>
      </div>
    </section>
  );
};
