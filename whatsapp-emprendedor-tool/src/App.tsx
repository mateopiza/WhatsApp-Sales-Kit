import React, { useState } from 'react';
import { MessageSquare, Send, Copy, Plus, Trash2, Check, Sparkles, CreditCard, Truck, UserCheck } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export const App: React.FC = () => {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentInfo, setPaymentInfo] = useState('Nequi / Daviplata: 300 000 0000');
  const [shippingCost, setShippingCost] = useState<number>(10000);
  const [copied, setCopied] = useState(false);

  const [items, setItems] = useState<CartItem[]>([
    { id: '1', name: 'Producto / Prenda 1', price: 45000, quantity: 1 },
  ]);

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now().toString(), name: 'Nuevo Producto', price: 30000, quantity: 1 },
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
    <div className="min-h-screen bg-slate-100 text-slate-800 p-4 sm:p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <header className="bg-emerald-700 text-white p-6 rounded-xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-600 rounded-lg">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                WhatsApp Emprendedor Tool
              </h1>
              <p className="text-xs text-emerald-200">
                Generador de Cotizaciones, Mensajes de Venta &amp; Cierre Rápido 1-Click
              </p>
            </div>
          </div>
        </header>

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Customer & Products Form */}
          <div className="lg:col-span-7 space-y-6">
            {/* Customer Box */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                1. Datos del Cliente
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Nombre del Cliente</label>
                  <input
                    type="text"
                    placeholder="Ej. María Paula"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Celular WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="300 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Products & Quote Builder */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  2. Cotizador de Productos
                </h2>
                <button
                  onClick={addItem}
                  className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Agregar Item
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div key={item.id} className="flex items-center gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    <span className="text-xs font-bold text-slate-400 w-5">{idx + 1}.</span>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                      placeholder="Nombre del producto"
                      className="flex-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', Math.max(1, Number(e.target.value)))}
                      className="w-14 px-2 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-center font-bold"
                    />
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => updateItem(item.id, 'price', Number(e.target.value))}
                      className="w-24 px-2.5 py-1.5 bg-white border border-slate-300 rounded-md text-xs text-right font-mono"
                    />
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-md transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-600 block mb-1">Costo de Envío ($ COP)</label>
                  <input
                    type="number"
                    value={shippingCost}
                    onChange={(e) => setShippingCost(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs"
                  />
                </div>

                <div className="text-right flex flex-col justify-end">
                  <span className="text-slate-500 font-medium">TOTAL ESTIMADO</span>
                  <span className="text-xl font-bold text-emerald-700 font-mono">
                    ${grandTotal.toLocaleString()} COP
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Cuentas / Datos de Pago</label>
                <input
                  type="text"
                  value={paymentInfo}
                  onChange={(e) => setPaymentInfo(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Preview & 1-Click Send */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                3. Seleccionar Plantilla
              </h2>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setActiveTemplate('quote')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                    activeTemplate === 'quote'
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Cotización
                </button>
                <button
                  onClick={() => setActiveTemplate('payment')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                    activeTemplate === 'payment'
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Pago Recibido
                </button>
                <button
                  onClick={() => setActiveTemplate('shipping')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                    activeTemplate === 'shipping'
                      ? 'bg-emerald-700 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Despacho 🚚
                </button>
              </div>

              {/* Message Box */}
              <div className="relative">
                <textarea
                  readOnly
                  rows={10}
                  value={activeMessage}
                  className="w-full p-4 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs font-sans text-slate-800 leading-relaxed resize-none focus:outline-none"
                />
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <Send className="w-4 h-4" />
                  Enviar a WhatsApp (1-Click)
                </a>

                <button
                  onClick={handleCopy}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      ¡Mensaje Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copiar Texto al Portapapeles
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
