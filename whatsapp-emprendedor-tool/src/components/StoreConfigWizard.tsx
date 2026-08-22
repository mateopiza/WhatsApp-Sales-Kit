import React from 'react';
import { StoreConfig, NicheType } from '../types/msp';
import { 
  Building2, 
  Sparkles, 
  Gem, 
  Shirt, 
  Phone, 
  Globe, 
  KeyRound, 
  Coins, 
  Tag, 
  Image as ImageIcon,
  Rocket,
  ShieldCheck,
  Check
} from 'lucide-react';

interface StoreConfigWizardProps {
  config: StoreConfig;
  onChangeConfig: (newConfig: StoreConfig) => void;
  onLaunchDeploy: () => void;
  isDeploying: boolean;
}

export const StoreConfigWizard: React.FC<StoreConfigWizardProps> = ({
  config,
  onChangeConfig,
  onLaunchDeploy,
  isDeploying,
}) => {
  const handleNameChange = (name: string) => {
    const autoSlug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 30);

    onChangeConfig({
      ...config,
      storeName: name,
      slug: autoSlug || config.slug,
    });
  };

  const handleNicheChange = (niche: NicheType) => {
    onChangeConfig({
      ...config,
      niche,
      tagline: niche === 'jewelry' 
        ? 'Orfebrería & Joyería de Autor' 
        : 'Moda Urbana & Tendencia',
    });
  };

  const cleanPhone = config.whatsappPhone.replace(/[^0-9]/g, '');
  const isValidPhone = cleanPhone.length >= 10;
  const isFormValid = config.storeName.trim().length >= 2 && config.slug.trim().length >= 2 && isValidPhone && config.adminPin.length >= 4;

  return (
    <div className="space-y-6">
      {/* 1. Niche Selector Cards */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">1. Selecciona el Tipo de Catálogo</h3>
            <p className="text-xs text-slate-400">Plantilla optimizada para el modelo de negocio</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Jewelry Option */}
          <button
            type="button"
            onClick={() => handleNicheChange('jewelry')}
            className={`p-4 rounded-xl border flex items-start gap-3.5 text-left transition-all relative overflow-hidden ${
              config.niche === 'jewelry'
                ? 'bg-amber-400/10 border-amber-400/80 ring-1 ring-amber-400/50 shadow-lg'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
            }`}
          >
            <div className={`p-3 rounded-xl ${config.niche === 'jewelry' ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-amber-300'}`}>
              <Gem className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-white">Joyería &amp; Accesorios de Lujo</h4>
                {config.niche === 'jewelry' && (
                  <span className="p-0.5 rounded-full bg-amber-400 text-slate-950">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Anillos, collares, aretes, orfebrería fina, vista editorial y cierre directo por WhatsApp.
              </p>
            </div>
          </button>

          {/* Clothing Option */}
          <button
            type="button"
            onClick={() => handleNicheChange('clothing')}
            className={`p-4 rounded-xl border flex items-start gap-3.5 text-left transition-all relative overflow-hidden ${
              config.niche === 'clothing'
                ? 'bg-indigo-500/10 border-indigo-400/80 ring-1 ring-indigo-400/50 shadow-lg'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
            }`}
          >
            <div className={`p-3 rounded-xl ${config.niche === 'clothing' ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-indigo-300'}`}>
              <Shirt className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-sm text-white">Ropa, Calzado &amp; Boutique</h4>
                {config.niche === 'clothing' && (
                  <span className="p-0.5 rounded-full bg-indigo-500 text-white">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Blazers, vestidos, streetwear, catálogo de prendas, selector de tallas y pedidos 1-click.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Brand & Contact Information */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl backdrop-blur-md space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">2. Datos de la Marca &amp; WhatsApp</h3>
            <p className="text-xs text-slate-400">Información para contacto, cotizaciones y pedidos</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Store Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-indigo-400" />
              Nombre de la Marca
            </label>
            <input
              type="text"
              value={config.storeName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Ej: Joyería Aurelia, Streetwear Bogotá"
              className="w-full bg-slate-950 border border-slate-700 text-white text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Subdomain / Slug */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              Subdominio Asignado
            </label>
            <div className="flex items-center rounded-xl bg-slate-950 border border-slate-700 overflow-hidden focus-within:border-indigo-500 transition-colors">
              <input
                type="text"
                value={config.slug}
                onChange={(e) => onChangeConfig({ ...config, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                placeholder="aurelia-joyas"
                className="w-full bg-transparent text-white text-sm px-3 py-2.5 focus:outline-none font-mono"
              />
              <span className="bg-slate-900 text-slate-400 text-xs px-3 py-2.5 border-l border-slate-800 shrink-0 font-mono">
                .{config.rootDomain}
              </span>
            </div>
          </div>

          {/* WhatsApp Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              WhatsApp de Ventas (Con código de país)
            </label>
            <input
              type="text"
              value={config.whatsappPhone}
              onChange={(e) => onChangeConfig({ ...config, whatsappPhone: e.target.value })}
              placeholder="Ej: 573001234567 o +525512345678"
              className="w-full bg-slate-950 border border-slate-700 text-white text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors font-mono"
            />
          </div>

          {/* Currency */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              Moneda del Catálogo
            </label>
            <select
              value={config.currency}
              onChange={(e) => onChangeConfig({ ...config, currency: e.target.value as any })}
              className="w-full bg-slate-950 border border-slate-700 text-white text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-500 transition-colors"
            >
              <option value="COP">COP — Peso Colombiano ($)</option>
              <option value="USD">USD — Dólar Estadounidense ($)</option>
              <option value="MXN">MXN — Peso Mexicano ($)</option>
              <option value="EUR">EUR — Euro (€)</option>
              <option value="PEN">PEN — Sol Peruano (S/)</option>
              <option value="CLP">CLP — Peso Chileno ($)</option>
            </select>
          </div>

          {/* Admin PIN */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-rose-400" />
              PIN de Acceso al Panel Admin (/admin)
            </label>
            <input
              type="password"
              value={config.adminPin}
              onChange={(e) => onChangeConfig({ ...config, adminPin: e.target.value })}
              placeholder="Mínimo 4 caracteres (ej: 1879)"
              className="w-full bg-slate-950 border border-slate-700 text-white text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-rose-500 transition-colors font-mono"
            />
          </div>

          {/* Tagline */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Eslogan / Frase de Marca
            </label>
            <input
              type="text"
              value={config.tagline}
              onChange={(e) => onChangeConfig({ ...config, tagline: e.target.value })}
              placeholder="Ej: Joyería de Alta Distinción"
              className="w-full bg-slate-950 border border-slate-700 text-white text-sm px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* 3. Launch & Deployment Action Card */}
      <div className="bg-gradient-to-r from-emerald-900/60 to-indigo-950/80 border border-emerald-500/30 rounded-2xl p-5 shadow-2xl backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <h3 className="text-base font-bold text-white">Despliegue Autónomo en Dokploy</h3>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Se aprovisionará el subdominio <strong className="text-emerald-400 font-mono">https://{config.slug || 'tu-tienda'}.{config.rootDomain}</strong> con certificado SSL Let&apos;s Encrypt.
          </p>
        </div>

        <button
          type="button"
          disabled={!isFormValid || isDeploying}
          onClick={onLaunchDeploy}
          className={`flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm shadow-xl transition-all ${
            isFormValid && !isDeploying
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-emerald-500/25 hover:scale-[1.02]'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
          }`}
        >
          <Rocket className={`w-4 h-4 ${isDeploying ? 'animate-spin' : ''}`} />
          <span>{isDeploying ? 'Aprovisionando...' : '🚀 Desplegar Tienda en Dokploy'}</span>
        </button>
      </div>
    </div>
  );
};
