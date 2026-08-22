import React, { useRef, useEffect } from 'react';
import { Icon } from '../ui/Icon';
import { storeConfig } from '../../config/storeConfig';

const IMAGE_1 = '/assets/products/placeholder-1.svg';
const IMAGE_2 = '/assets/products/placeholder-2.svg';
const IMAGE_3 = '/assets/products/placeholder-3.svg';

export const BrandStory: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const pillars = [
    {
      title: 'CALIDAD',
      tagline: 'Seleccionamos lo mejor para ti.',
      description: 'Describe aquí el estándar de calidad de tus productos o servicios.',
      icon: 'diamond' as const,
    },
    {
      title: 'CONFIANZA',
      tagline: 'Seguridad en cada compra.',
      description: 'Explica tus garantías, políticas de cambio y soporte por WhatsApp.',
      icon: 'shield' as const,
    },
    {
      title: 'PASIÓN',
      tagline: 'Amamos lo que hacemos y se nota.',
      description: 'Cuenta la historia y los valores detrás de tu negocio.',
      icon: 'heart' as const,
    },
    {
      title: 'EXCLUSIVIDAD',
      tagline: 'Piezas únicas para clientes únicos.',
      description: 'Destaca lo que hace diferente a tu catálogo frente a la competencia.',
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
            {storeConfig.name}
          </p>
          <h2 className="font-display text-2xl sm:text-4xl text-ink font-normal tracking-wide leading-tight">
            Nuestros Valores
          </h2>
          <p className="font-body text-xs sm:text-sm text-taupe-contrast mt-4 leading-relaxed font-light max-w-md mx-auto">
            Reemplaza este texto con la historia de tu negocio: qué vendes, por qué lo haces y qué te diferencia.
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
                Empaque & Entrega
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-normal tracking-wide mb-4 leading-snug">
                La Experiencia<br />de tu Marca
              </h3>
              <div className="w-12 h-px bg-gold/50 mb-5" />
              <p className="text-xs sm:text-sm text-cream/70 leading-relaxed font-light mb-6 max-w-sm">
                Describe aquí cómo empacas y entregas tus productos: qué incluye, tiempos y cuidado en cada envío.
              </p>
              <ul className="space-y-3">
                {[
                  'Empaque cuidado con tu marca',
                  'Garantía y política de cambios clara',
                  'Confirmación y seguimiento del pedido',
                  'Atención personalizada por WhatsApp',
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
                  src={IMAGE_1}
                  alt={storeConfig.name}
                  loading="lazy"
                  className="w-full h-full object-cover img-luxury-zoom hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="aspect-auto overflow-hidden">
                <img
                  src={IMAGE_2}
                  alt={storeConfig.name}
                  loading="lazy"
                  className="w-full h-full object-cover img-luxury-zoom hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="aspect-auto overflow-hidden">
                <img
                  src={IMAGE_3}
                  alt={storeConfig.name}
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
