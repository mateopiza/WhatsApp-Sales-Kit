import React, { useRef, useEffect } from 'react';
import { Icon } from '../ui/Icon';

const BRACELET_MAIN   = '/assets/products/real/pulsera-macrame-tricolor.jpg';
const BRACELET_EDIT   = '/assets/products/real/pulsera-macrame-editorial.jpg';
const BRACELET_LIFE   = '/assets/products/real/pulsera-macrame-lifestyle.jpg';

export const BrandStory: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const pillars = [
    {
      title: 'CALIDAD',
      tagline: 'Seleccionamos lo mejor para ti.',
      description: 'Esferas facetadas en oro 18k y cordón macramé artesanal tejido a mano con fibras premium.',
      icon: 'diamond' as const,
    },
    {
      title: 'CONFIANZA',
      tagline: 'Seguridad en cada compra.',
      description: 'Garantía de autenticidad en cada pieza, soporte personalizado y vitalicio por WhatsApp.',
      icon: 'shield' as const,
    },
    {
      title: 'PASIÓN',
      tagline: 'Amamos lo que hacemos y se nota.',
      description: 'Artesanía de alta costura que celebra los momentos más memorables de tu vida.',
      icon: 'heart' as const,
    },
    {
      title: 'EXCLUSIVIDAD',
      tagline: 'Piezas únicas para personas únicas.',
      description: 'Ediciones limitadas y diseños de autor concebidos con sobriedad y maestría.',
      icon: 'sparkle' as const,
    },
  ];

  // Intersection Observer — fade pillars in staggered when visible
  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll<HTMLDivElement>('.pillar-card');
    if (!cards) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = '1';
            (entry.target as HTMLElement).style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    cards.forEach((card, i) => {
      card.style.transitionDelay = `${i * 100}ms`;
      observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 sm:py-24 bg-cream-100 border-y border-taupe/12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* ── Brand Narrative Header ── */}
        <div className="text-center max-w-xl mx-auto mb-14">
          <p className="text-[10px] tracking-widest uppercase text-gold-dark font-semibold mb-3">
            La Casa Empires
          </p>
          <h2 className="font-display text-2xl sm:text-4xl text-ink font-normal tracking-wide leading-tight">
            Valores &amp; Maestría Orfebre
          </h2>
          <p className="font-body text-xs sm:text-sm text-taupe-contrast mt-4 leading-relaxed font-light max-w-md mx-auto">
            Creamos joyas que trascienden el tiempo: una conversación íntima entre el macramé ancestral, el oro de 18 kilates y el brillo de las esferas facetadas.
          </p>
          <div className="w-20 h-px line-shimmer-gold mx-auto mt-5" />
        </div>

        {/* ── 4 Brand Pillars Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-16">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="pillar-card p-6 rounded-sm bg-cream border border-taupe/12 shadow-luxury-card card-luxury flex flex-col items-center text-center"
              style={{
                opacity: 0,
                transform: 'translateY(24px)',
                transition: 'opacity 500ms cubic-bezier(0.16, 1, 0.3, 1), transform 500ms cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              {/* Icon Ring */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 flex items-center justify-center text-gold-dark mb-4 transition-transform duration-300 group-hover:scale-110 animate-breathe">
                <Icon name={pillar.icon} size={22} />
              </div>
              <h3 className="font-display text-sm tracking-wider uppercase text-ink font-semibold mb-1">
                {pillar.title}
              </h3>
              <p className="text-[11px] font-medium text-gold-dark mb-2 italic">
                "{pillar.tagline}"
              </p>
              <p className="text-xs font-light text-taupe-contrast leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>

        {/* ── Lifestyle Editorial Strip ── */}
        <div className="rounded-sm overflow-hidden border border-taupe/15 shadow-luxury-card">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Text side */}
            <div className="p-8 sm:p-12 flex flex-col justify-center bg-ink text-cream">
              <span className="text-[10px] tracking-widest uppercase text-gold font-semibold block mb-3">
                Presentación de Lujo
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-normal tracking-wide mb-4 leading-snug">
                El Ritual del<br />Desempaque
              </h3>
              <div className="w-12 h-px bg-gold/50 mb-5" />
              <p className="text-xs sm:text-sm text-cream/70 leading-relaxed font-light mb-6 max-w-sm">
                Cada pulsera se entrega en estuche rígido con interiores de terciopelo, bolsa boutique con lazo de satén y certificado de autenticidad personalizado.
              </p>
              <ul className="space-y-3">
                {[
                  'Estuche rígido premium con sello Empires',
                  'Certificado de autenticidad y garantía 18k',
                  'Bolsa boutique con lazo de satén dorado',
                  'Tarjeta personalizada de agradecimiento',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-xs text-cream/80">
                    <span className="w-1 h-1 rounded-full bg-gold shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Image grid side */}
            <div className="grid grid-cols-3 gap-0">
              <div className="aspect-auto overflow-hidden">
                <img
                  src={BRACELET_MAIN}
                  alt="Pulsera macramé tricolor Empires"
                  loading="lazy"
                  className="w-full h-full object-cover img-luxury-zoom hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="aspect-auto overflow-hidden">
                <img
                  src={BRACELET_EDIT}
                  alt="Pulsera macramé editorial Empires"
                  loading="lazy"
                  className="w-full h-full object-cover img-luxury-zoom hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="aspect-auto overflow-hidden">
                <img
                  src={BRACELET_LIFE}
                  alt="Pulsera macramé lifestyle Empires"
                  loading="lazy"
                  className="w-full h-full object-cover img-luxury-zoom hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
