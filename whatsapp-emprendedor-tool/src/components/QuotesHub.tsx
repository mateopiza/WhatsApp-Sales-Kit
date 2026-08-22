import React, { useState } from 'react';
import { MessageSquare, Send, Copy, Plus, Trash2, Check, Sparkles, CreditCard, Truck, UserCheck } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export const QuotesHub: React.FC = () => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentInfo, setPaymentInfo] = useState('Nequi / Daviplata: 300 000 0000');
  const [shippingCost, setShippingCost] = useState<number>(10000);
  const [copied, setCopied] = useState(false);

  const [items, setItems] = useState<CartItem[]>([
    { id: '1', name: 'Joya / Prenda de Catálogo', price: 65000, quantity: 1 },
  ]);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now().toString(), name: 'Nueva Pieza / Producto', price: 45000, quantity: 1 },
    ]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: keyof CartItem, value: any) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const grandTotal = subtotal + Number(shippingCost);

  // Message builder
  const buildMessage = (templateType: 'quote' | 'payment' | 'shipping') => {
    const greeting = customerName.trim() ? `¡Hola ${customerName.trim()}! 👋` : '¡Hola! 👋';

    if (templateType === 'quote') {
      const itemsList = items
        .map(
          (item, i) =>
            `${i + 1}. *${item.name}* (x${item.quantity}) — $${(item.price * item.quantity).toLocaleString()} COP`
        )
        .join('\n');

      return `${greeting}\n\nAquí tienes el resumen de tu cotización:\n\n${itemsList}\n\n📦 *Envío*: $${Number(shippingCost).toLocaleString()} COP\n💰 *TOTAL A PAGAR*: *$${grandTotal.toLocaleString()} COP*\n\n💳 *Medios de Pago*:\n${paymentInfo}\n\n¿Deseas que te reservemos el pedido hoy?`;
    }

    if (templateType === 'payment') {
      return `${greeting}\n\n¡Pago recibido con éxito! 🎉\n\nTu pedido de *$${grandTotal.toLocaleString()} COP* ha sido registrado y entra a preparación inmediatamente.\n\nTe notificaremos en cuanto tu paquete esté en camino. ¡Muchas gracias por tu compra!`;
    }

    return `${greeting}\n\n🚚 *¡Tu paquete va en camino!*\n\nNúmero de guía de transporte / seguimiento disponible.\n¡Esperamos que disfrutes mucho tu producto!`;
  };

  const [activeTemplate, setActiveTemplate] = useState<'quote' | 'payment' | 'shipping'>('quote');
  const activeMessage = buildMessage(activeTemplate);

  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const formattedPhone = cleanPhone.startsWith('57') ? cleanPhone : `57${cleanPhone}`;
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(activeMessage)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: Customer & Products Form */}
      <div className="lg:col-span-7 space-y-6">
        {/* Customer Data */}
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-xl backdrop-blur-md space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-400" />
            1. Datos del Cliente &amp; Contacto
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nombre del Cliente
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ej. Camila Restrepo"
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                WhatsApp del Cliente
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ej. 300 123 4567"
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-xl backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              2. Productos de la Cotización
            </h2>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-1 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Agregar Ítem
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center gap-2 bg-slate-950/70 p-3 rounded-xl border border-slate-800"
              >
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                  placeholder="Nombre de la prenda / pieza"
                  className="w-full sm:flex-1 bg-slate-900 border border-slate-700 text-white text-xs px-3 py-2 rounded-lg"
                />
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-28">
                    <span className="absolute left-2 top-2 text-xs text-slate-500">$</span>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => updateItem(item.id, 'price', Number(e.target.value))}
                      className="w-full bg-slate-900 border border-slate-700 text-white text-xs pl-5 pr-2 py-2 rounded-lg"
                    />
                  </div>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', Math.max(1, Number(e.target.value)))}
                    className="w-14 bg-slate-900 border border-slate-700 text-white text-xs px-2 py-2 rounded-lg text-center"
                  />
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Shipping and Payment info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-blue-400" />
                Costo de Envío (COP)
              </label>
              <input
                type="number"
                value={shippingCost}
                onChange={(e) => setShippingCost(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                Medios de Pago
              </label>
              <input
                type="text"
                value={paymentInfo}
                onChange={(e) => setPaymentInfo(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl px-3.5 py-2 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Instant WhatsApp Generator */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-xl backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-400" />
              Mensaje Listo para WhatsApp
            </h2>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              Total: ${grandTotal.toLocaleString()} COP
            </span>
          </div>

          {/* Template Selector Pills */}
          <div className="flex gap-2">
            {[
              { key: 'quote', label: 'Cotización' },
              { key: 'payment', label: 'Pago Confirmado' },
              { key: 'shipping', label: 'Envío Guía' },
            ].map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setActiveTemplate(t.key as any)}
                className={`flex-1 py-1.5 px-2 text-xs font-semibold rounded-lg border transition ${
                  activeTemplate === t.key
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Message Preview Box */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto">
            {activeMessage}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-2">
            <a
              href={cleanPhone ? whatsappUrl : '#'}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => {
                if (!cleanPhone) {
                  e.preventDefault();
                  alert('Por favor ingresa el número de WhatsApp del cliente');
                }
              }}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white transition-all shadow-lg ${
                cleanPhone
                  ? 'bg-[#25D366] hover:bg-[#20ba59] shadow-emerald-900/30 hover:scale-[1.02]'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              }`}
            >
              <Send className="w-4 h-4" />
              Enviar Directo a WhatsApp
            </a>

            <button
              type="button"
              onClick={handleCopy}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">¡Copiado al Portapapeles!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copiar Texto del Mensaje
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
