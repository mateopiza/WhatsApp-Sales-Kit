import { Product, WhatsAppInquiryParams } from '../types/catalog';
import { formatPrice } from './formatters';

export const DEFAULT_WHATSAPP_PHONE = '573001234567';

/**
 * Generates an inquiry WhatsApp link for a single jewelry item.
 */
export function generateWhatsAppLink(params: WhatsAppInquiryParams): string {
  const phone = (params.phoneNumber || DEFAULT_WHATSAPP_PHONE).replace(/\D/g, '');
  
  const priceDisplay = params.price ? ` (${formatPrice(params.price, (params.currency as any) || 'USD')})` : '';
  const urlDisplay = params.productUrl ? `\nEnlace: ${params.productUrl}` : '';
  const noteDisplay = params.customNote ? `\n\nNota: ${params.customNote}` : '';

  const message = `Hola Empires Jewelry, estoy interesado/a en la pieza *${params.productName}* — Ref. *${params.reference}*${priceDisplay}.

Me gustaría recibir asesoría personalizada y confirmar disponibilidad.${urlDisplay}${noteDisplay}`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates an inquiry WhatsApp link for multiple favorited jewelry items.
 */
export function generateBulkWhatsAppLink(
  products: Product[],
  baseUrl = typeof window !== 'undefined' ? window.location.origin : '',
  phoneNumber = DEFAULT_WHATSAPP_PHONE
): string {
  const phone = phoneNumber.replace(/\D/g, '');

  if (!products || products.length === 0) {
    const defaultMsg = 'Hola Empires Jewelry, me gustaría solicitar asesoría personalizada sobre su catálogo de alta joyería.';
    return `https://wa.me/${phone}?text=${encodeURIComponent(defaultMsg)}`;
  }

  const itemsList = products
    .map((p, idx) => {
      const link = baseUrl ? ` (${baseUrl}/#${p.slug})` : '';
      return `${idx + 1}. *${p.name}* (Ref: ${p.reference}) — ${formatPrice(p.price, p.currency)}${link}`;
    })
    .join('\n');

  const totalPrice = products.reduce((acc, p) => acc + p.price, 0);
  const formattedTotal = formatPrice(totalPrice, 'USD');

  const message = `Hola Empires Jewelry, he seleccionado las siguientes piezas de su catálogo para una consulta privada:

${itemsList}

Total estimado: ${formattedTotal} (${products.length} ${products.length === 1 ? 'pieza' : 'piezas'})

¿Podrían brindarme asesoría sobre la disponibilidad y opciones de estas piezas?`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generates a WhatsApp URL with a custom consultation message.
 */
export function generateWhatsAppConsultationUrl(
  message: string,
  phoneNumber = DEFAULT_WHATSAPP_PHONE
): string {
  const phone = phoneNumber.replace(/\D/g, '');
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}


