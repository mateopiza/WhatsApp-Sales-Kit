import React from 'react';
import { ThemePalette, VisualEffects } from '../types/msp';
import { THEME_PALETTES } from '../data/palettes';
import { 
  Palette, 
  Sparkles, 
  Layers, 
  Type, 
  Eye, 
  Sliders, 
  Check, 
  Sun, 
  Moon,
  Zap,
  ShieldCheck
} from 'lucide-react';

interface ThemeCustomizerProps {
  selectedPaletteId: string;
  onSelectPalette: (palette: ThemePalette) => void;
  effects: VisualEffects;
  onChangeEffects: (effects: VisualEffects) => void;
  activePalette: ThemePalette;
  onUpdateCustomColor: (field: keyof ThemePalette, value: string) => void;
}

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  selectedPaletteId,
  onSelectPalette,
  effects,
  onChangeEffects,
  activePalette,
  onUpdateCustomColor,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Curated Color Palettes */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Paletas de Colores Curadas</h3>
              <p className="text-xs text-slate-400">Diseñadas para maximizar conversión y elegancia de marca</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full border border-slate-700">
            {THEME_PALETTES.length} Presets
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {THEME_PALETTES.map((pal) => {
            const isSelected = selectedPaletteId === pal.id;
            return (
              <button
                key={pal.id}
                type="button"
                onClick={() => onSelectPalette(pal)}
                className={`flex flex-col text-left p-3.5 rounded-xl border transition-all relative overflow-hidden group ${
                  isSelected
                    ? 'border-amber-400 bg-amber-400/10 shadow-lg ring-1 ring-amber-400/50'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-950'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="font-bold text-sm text-white">{pal.name}</span>
                  {isSelected && (
                    <span className="p-1 rounded-full bg-amber-400 text-slate-950">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </span>
                  )}
                </div>

                {/* Color Swatch Dots */}
                <div className="flex items-center gap-1.5 mb-2.5">
                  <div 
                    className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                    style={{ backgroundColor: pal.primary }}
                    title={`Primario: ${pal.primary}`}
                  />
                  <div 
                    className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                    style={{ backgroundColor: pal.accent }}
                    title={`Acento: ${pal.accent}`}
                  />
                  <div 
                    className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                    style={{ backgroundColor: pal.background }}
                    title={`Fondo: ${pal.background}`}
                  />
                  <div 
                    className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                    style={{ backgroundColor: pal.surface }}
                    title={`Superficie: ${pal.surface}`}
                  />
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {pal.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Custom Hex Pickers */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Ajuste Fino de Colores</h3>
            <p className="text-xs text-slate-400">Personaliza libremente los códigos hexadecimales de tu tienda</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Primary */}
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">Color Primario</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={activePalette.primary}
                onChange={(e) => onUpdateCustomColor('primary', e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={activePalette.primary}
                onChange={(e) => onUpdateCustomColor('primary', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white text-xs font-mono px-2 py-1.5 rounded-lg focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Accent */}
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">Color Acento</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={activePalette.accent}
                onChange={(e) => onUpdateCustomColor('accent', e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={activePalette.accent}
                onChange={(e) => onUpdateCustomColor('accent', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white text-xs font-mono px-2 py-1.5 rounded-lg focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Background */}
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">Fondo Principal</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={activePalette.background}
                onChange={(e) => onUpdateCustomColor('background', e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={activePalette.background}
                onChange={(e) => onUpdateCustomColor('background', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white text-xs font-mono px-2 py-1.5 rounded-lg focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Text */}
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">Color de Texto</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={activePalette.text}
                onChange={(e) => onUpdateCustomColor('text', e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={activePalette.text}
                onChange={(e) => onUpdateCustomColor('text', e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white text-xs font-mono px-2 py-1.5 rounded-lg focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Visual Effects & Interface Controls */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Efectos Visuales e Interfaz Dinámica</h3>
            <p className="text-xs text-slate-400">Micro-interacciones, efectos de cristal y sensaciones táctiles</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Glassmorphism Toggle */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-white">Efecto Glassmorphism</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  Moderno
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Translucidez y desenfoque (blur) en barras y modales</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={effects.glassmorphism}
                onChange={(e) => onChangeEffects({ ...effects, glassmorphism: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          {/* Hover Zoom Toggle */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-white">Micro-Zoom en Productos</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                  Interactivo
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">Efecto suave de escala 1.05x al posar el cursor</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={effects.hoverZoom}
                onChange={(e) => onChangeEffects({ ...effects, hoverZoom: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          {/* Border Radius Presets */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
            <label className="font-semibold text-sm text-white block">Estilo de Bordes y Esquinas</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'none', label: 'Recto (0px)' },
                { id: 'sm', label: 'Suave (4px)' },
                { id: 'md', label: 'Redondo (12px)' },
                { id: 'lg', label: 'Pill (20px)' },
              ].map((radius) => {
                const isActive = effects.borderRadius === radius.id;
                return (
                  <button
                    key={radius.id}
                    type="button"
                    onClick={() => onChangeEffects({ ...effects, borderRadius: radius.id as any })}
                    className={`py-2 px-1 text-xs font-semibold rounded-lg border transition-all ${
                      isActive 
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow' 
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {radius.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Elevation & Shadows */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
            <label className="font-semibold text-sm text-white block">Elevación &amp; Sombras de Tarjetas</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'flat', label: 'Plano Minimal' },
                { id: 'floating', label: 'Flotante 3D' },
                { id: 'luxury-glow', label: 'Brillo Lujo' },
              ].map((elev) => {
                const isActive = effects.cardElevation === elev.id;
                return (
                  <button
                    key={elev.id}
                    type="button"
                    onClick={() => onChangeEffects({ ...effects, cardElevation: elev.id as any })}
                    className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-all ${
                      isActive 
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md font-bold' 
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {elev.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Typography Style */}
          <div className="md:col-span-2 p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2">
            <label className="font-semibold text-sm text-white block">Estilo Tipográfico</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'editorial-cinzel', name: 'Editorial Cinzel & Serif', desc: 'Joyería fina, alta gama y distinción' },
                { id: 'modern-sans', name: 'Modern Sans (Montserrat)', desc: 'Streetwear, ropa urbana y claridad' },
                { id: 'luxury-serif', name: 'Luxury Playfair', desc: 'Boutique nupcial y piezas de autor' },
              ].map((typo) => {
                const isActive = effects.typographyStyle === typo.id;
                return (
                  <button
                    key={typo.id}
                    type="button"
                    onClick={() => onChangeEffects({ ...effects, typographyStyle: typo.id as any })}
                    className={`p-3 text-left rounded-xl border transition-all ${
                      isActive
                        ? 'bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500/50'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="font-bold text-xs text-white mb-0.5">{typo.name}</div>
                    <div className="text-[11px] opacity-75">{typo.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
