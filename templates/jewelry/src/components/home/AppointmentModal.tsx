import React, { useState } from 'react';
import { X, Calendar, Clock, Sparkles, CheckCircle2 } from 'lucide-react';
import { generateWhatsAppConsultationUrl } from '../../utils/whatsapp';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'presencial' | 'virtual'>('presencial');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('11:00');
  const [interest, setInterest] = useState('Anillos de Compromiso & Solitarios');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const message = `Hola Empires Jewelry, deseo agendar una cita VIP ${type.toUpperCase()}.\n\n*Nombre*: ${name || 'Cliente VIP'}\n*Fecha*: ${date || 'Por coordinar'}\n*Hora*: ${time}\n*Interés*: ${interest}\n\nQuedo atento a la confirmación de mi asesor.`;

    const whatsappUrl = generateWhatsAppConsultationUrl(message);

    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      onClose();
      setSubmitted(false);
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 bg-ink/70 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-cream rounded-sm border border-gold/30 shadow-2xl overflow-hidden flex flex-col my-8 animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-taupe/15 bg-cream-200/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-full bg-gold/15 border border-gold/30 text-gold-dark">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] tracking-widest uppercase text-gold-dark font-semibold block">
                Concierge Privado
              </span>
              <h3 className="font-display text-xl sm:text-2xl text-ink font-normal">
                Agendar Cita VIP
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-taupe-contrast hover:text-ink transition-colors rounded-full cursor-pointer"
            aria-label="Cerrar modal de citas"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4 animate-fade-in">
            <div className="w-14 h-14 bg-gold/15 border border-gold rounded-full flex items-center justify-center mx-auto text-gold-dark">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-display text-xl text-ink font-semibold">
              ¡Solicitud de Cita Enviada!
            </h4>
            <p className="text-xs text-taupe-contrast leading-relaxed max-w-sm mx-auto">
              Serás redirigido a WhatsApp para confirmar los detalles finales de tu cita privada con nuestro Gemólogo Senior.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 text-xs">
            {/* Modalidad */}
            <div>
              <label className="text-[10px] uppercase tracking-widest text-taupe-contrast font-semibold block mb-2">
                Modalidad de Asesoría
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setType('presencial')}
                  className={`py-3 px-4 rounded-sm border text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                    type === 'presencial'
                      ? 'bg-ink text-gold border-gold font-semibold shadow-md'
                      : 'bg-cream-200 text-ink border-taupe/20 hover:border-gold/40'
                  }`}
                >
                  Presencial Boutique
                </button>
                <button
                  type="button"
                  onClick={() => setType('virtual')}
                  className={`py-3 px-4 rounded-sm border text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                    type === 'virtual'
                      ? 'bg-ink text-gold border-gold font-semibold shadow-md'
                      : 'bg-cream-200 text-ink border-taupe/20 hover:border-gold/40'
                  }`}
                >
                  Asesoría Virtual 1-on-1
                </button>
              </div>
            </div>

            {/* Nombre */}
            <div>
              <label className="text-[10px] uppercase tracking-widest text-taupe-contrast font-semibold block mb-1">
                Tu Nombre Completo
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Sofía Mendoza"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-cream-200 border border-taupe/25 rounded-sm text-ink focus:outline-none focus:border-ink transition-colors"
              />
            </div>

            {/* Fecha y Hora */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-taupe-contrast font-semibold block mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-gold-dark" />
                  Fecha Preferida
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 bg-cream-200 border border-taupe/25 rounded-sm text-ink focus:outline-none focus:border-ink"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-widest text-taupe-contrast font-semibold block mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-gold-dark" />
                  Hora
                </label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 bg-cream-200 border border-taupe/25 rounded-sm text-ink focus:outline-none focus:border-ink"
                >
                  <option value="10:00">10:00 AM</option>
                  <option value="11:30">11:30 AM</option>
                  <option value="14:30">02:30 PM</option>
                  <option value="16:00">04:00 PM</option>
                  <option value="17:30">05:30 PM</option>
                </select>
              </div>
            </div>

            {/* Interés Principal */}
            <div>
              <label className="text-[10px] uppercase tracking-widest text-taupe-contrast font-semibold block mb-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-gold-dark" />
                Colección / Joya de Interés
              </label>
              <select
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                className="w-full px-3 py-2.5 bg-cream-200 border border-taupe/25 rounded-sm text-ink focus:outline-none focus:border-ink"
              >
                <option value="Anillos de Compromiso & Solitarios">Anillos de Compromiso &amp; Solitarios</option>
                <option value="Pulseras Macramé & Esferas 18k">Pulseras Macramé &amp; Esferas 18k</option>
                <option value="Alta Joyería & Esmeraldas">Alta Joyería &amp; Esmeraldas</option>
                <option value="Diseño A Medida / Bespoke">Diseño A Medida / Bespoke</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-ink text-gold text-xs uppercase tracking-widest font-semibold rounded-sm border border-gold hover:bg-ink-light transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                Confirmar Cita VIP por WhatsApp
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
