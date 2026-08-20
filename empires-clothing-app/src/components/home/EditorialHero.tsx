import React, { useEffect, useRef } from 'react';
import { Flame, ArrowDown, Sparkles, Layers } from 'lucide-react';

interface EditorialHeroProps {
  onExplore: () => void;
  onOpenOutfitStudio: () => void;
}

export const EditorialHero: React.FC<EditorialHeroProps> = ({ onExplore, onOpenOutfitStudio }) => {
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = headlineRef.current;
    if (!el) return;
    const words = el.querySelectorAll<HTMLSpanElement>('.word-anim');
    words.forEach((w, i) => {
      w.style.animationDelay = `${250 + i * 90}ms`;
    });
  }, []);

  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex flex-col justify-between overflow-hidden bg-slate-950">
      {/* ── Background Image Banner with Ken Burns Effect ── */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/products/urban/urban_hoodie.jpg"
          alt="Empires Urban Luxury Drop"
          className="w-full h-full object-cover object-center animate-ken-burns opacity-45 scale-105"
        />
        {/* Dark Slate Vignette for crisp text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/40 to-transparent" />
      </div>

      {/* ── Top Badge ── */}
      <div className="relative z-10 pt-10 sm:pt-14 px-6 flex justify-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 border border-yellow-500/40 backdrop-blur-md shadow-lg">
          <Flame className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
          <span className="text-[10px] tracking-widest uppercase font-extrabold text-yellow-400">
            DROP EXCLUSIVO — STREETWEAR 2026
          </span>
        </div>
      </div>

      {/* ── Center Editorial Display Typography ── */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center py-8 my-auto space-y-6">
        <p className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-400 font-bold">
          High-End Streetwear &amp; Heavyweight Cotton
        </p>

        {/* Animated Staggered Words */}
        <h1
          ref={headlineRef}
          className="font-display text-4xl sm:text-6xl md:text-7xl text-white font-extrabold tracking-tight uppercase leading-[1.08]"
        >
          {['MODA', 'URBANA', 'DE', 'ALTA', 'GAMA'].map((word) => (
            <span
              key={word}
              className="word-anim inline-block opacity-0 mr-[0.25em] transition-all"
              style={{ animation: 'fadeUp 0.6s ease-out forwards' }}
            >
              {word}
            </span>
          ))}
        </h1>

        {/* Neon Gold Accent Line */}
        <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent mx-auto" />

        {/* Subtitle */}
        <p className="font-body font-light text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
          Hoodies de 500 GSM, Puffers impermeables en Nylon Ripstop 3L y Cargos tácticos de 12 bolsillos. Piezas de edición limitada numerada.
        </p>

        {/* CTA Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onExplore}
            className="w-full sm:w-auto px-8 py-3.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-xs font-extrabold uppercase tracking-widest rounded-md shadow-xl transition-all cursor-pointer border border-yellow-400"
          >
            Explorar Drops
          </button>
          <button
            onClick={onOpenOutfitStudio}
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-widest rounded-md border border-slate-700 hover:border-yellow-400 transition-all flex items-center justify-center gap-2 cursor-pointer backdrop-blur-sm"
          >
            <Layers className="w-4 h-4 text-yellow-400" />
            Estudio de Outfits (10% OFF)
          </button>
        </div>
      </div>

      {/* ── Bottom Scroll Cue ── */}
      <div className="relative z-10 pb-8 text-center">
        <button
          onClick={onExplore}
          className="inline-flex flex-col items-center gap-2 text-slate-400 hover:text-yellow-400 transition-colors cursor-pointer group"
        >
          <span className="text-[9px] tracking-widest uppercase font-bold">Descubrir Catálogo</span>
          <ArrowDown className="w-4 h-4 text-yellow-400 animate-bounce" />
        </button>
      </div>
    </section>
  );
};
