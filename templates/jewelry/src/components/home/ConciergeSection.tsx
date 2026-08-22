import React from 'react';
import { MessageCircle, Clock, MapPin } from 'lucide-react';
import { DEFAULT_WHATSAPP_PHONE } from '../../utils/whatsapp';

export const ConciergeSection: React.FC = () => {
  const whatsappUrl = `https://wa.me/${DEFAULT_WHATSAPP_PHONE}?text=${encodeURIComponent(
    'Hola Empires Jewelry, me gustaría solicitar una cita o consulta personalizada con un asesor experto.'
  )}`;

  return (
    <section id="contacto-section" className="py-16 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="bg-ink text-cream rounded-sm p-6 sm:p-12 overflow-hidden relative shadow-xl border border-gold/30">
        {/* Background Subtle Gemstone Watermark */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-gold/5 blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-pill bg-gold/20 text-gold border border-gold/40 text-xs tracking-wider uppercase mb-4">
              <MessageCircle className="w-3.5 h-3.5" />
              Concierge Exclusivo
            </div>

            <h2 className="font-display text-2xl sm:text-4xl text-cream font-normal tracking-wide leading-tight mb-4">
              Asesoría Personalizada & Citas Privadas
            </h2>

            <p className="font-body text-xs sm:text-sm text-cream/80 leading-relaxed font-light mb-8 max-w-lg">
              Nuestro equipo de maestros gemólogos y asesores de alta joyería está a tu disposición para orientarte en la selección de alianzas, solitarios o piezas a medida.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs uppercase font-medium text-cream">Horario de Atención</p>
                  <p className="text-xs text-cream/70 font-light">Lunes a Sábado · 9:00 AM - 7:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs uppercase font-medium text-cream">Atención Boutique</p>
                  <p className="text-xs text-cream/70 font-light">Citas privadas en showroom</p>
                </div>
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 bg-gold text-ink text-xs uppercase tracking-wider font-semibold rounded-sm hover:bg-gold-light transition-all shadow-md active:scale-98"
            >
              <MessageCircle className="w-4 h-4" />
              Contactar por WhatsApp
            </a>
          </div>

          {/* Business Cards Visual */}
          <div className="relative">
            <div className="rounded-sm overflow-hidden border border-gold/30 shadow-2xl bg-cream/10">
              <img
                src="/assets/imagery/business-cards.png"
                alt="Empires Jewelry Business Cards"
                loading="lazy"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="mt-3 text-center">
              <p className="text-xs tracking-wider uppercase text-gold font-light">
                @empires.jewerly · +57 300 123 4567
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
