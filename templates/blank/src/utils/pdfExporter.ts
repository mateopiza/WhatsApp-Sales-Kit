import { Product } from '../types/catalog';
import { formatPrice, formatCOPApprox } from './formatters';
import { storeConfig } from '../config/storeConfig';

export function exportWishlistToPDF(favoriteProducts: Product[]): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Por favor permite ventanas emergentes para generar el documento PDF.');
    return;
  }

  const currentDate = new Date().toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const totalUSD = favoriteProducts.reduce((sum, p) => sum + p.price, 0);

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Catálogo Personalizado — ${storeConfig.name}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Inter:wght@300;400;500;600&display=swap');

        body {
          font-family: 'Inter', sans-serif;
          background-color: #FAF6F0;
          color: #1A1817;
          margin: 0;
          padding: 40px;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid #4338CA;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .logo {
          font-family: 'Poppins', sans-serif;
          font-size: 28px;
          letter-spacing: 4px;
          color: #1A1817;
          text-transform: uppercase;
          margin-bottom: 5px;
        }
        .subtitle {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 3px;
          color: #4338CA;
          font-weight: 600;
        }
        .meta-info {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: #6B6359;
          margin-bottom: 25px;
          border-bottom: 1px border #E5E0D8;
          padding-bottom: 10px;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        .card {
          background: #FFFFFF;
          border: 1px solid #E5E0D8;
          padding: 15px;
          border-radius: 4px;
          page-break-inside: avoid;
        }
        .card-ref {
          font-size: 10px;
          text-transform: uppercase;
          color: #4338CA;
          font-weight: 600;
          letter-spacing: 1px;
        }
        .card-title {
          font-family: 'Poppins', sans-serif;
          font-size: 16px;
          margin: 5px 0;
          color: #1A1817;
        }
        .card-material {
          font-size: 11px;
          color: #6B6359;
          margin-bottom: 10px;
        }
        .card-price {
          font-size: 14px;
          font-weight: 600;
          color: #1A1817;
        }
        .card-cop {
          font-size: 10px;
          color: #8C8479;
        }
        .summary-box {
          margin-top: 30px;
          padding: 20px;
          background: #F3ECE2;
          border: 1px solid #4338CA;
          border-radius: 4px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 10px;
          color: #8C8479;
          border-top: 1px solid #E5E0D8;
          padding-top: 15px;
        }
        @media print {
          body { padding: 20px; background: white; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="no-print" style="margin-bottom: 20px; text-align: right;">
        <button onclick="window.print()" style="padding: 10px 20px; background: #1A1817; color: white; border: none; border-radius: 4px; cursor: pointer; font-family: Inter; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
          Imprimir / Guardar como PDF
        </button>
      </div>

      <div class="header">
        <div class="logo">${storeConfig.name.toUpperCase()}</div>
        <div class="subtitle">Resumen de Selección Personalizada</div>
      </div>

      <div class="meta-info">
        <span><strong>Fecha de Emisión:</strong> ${currentDate}</span>
        <span><strong>Total de Productos Seleccionados:</strong> ${favoriteProducts.length}</span>
      </div>

      <div class="grid">
        ${favoriteProducts
          .map(
            (p) => `
          <div class="card">
            <div class="card-ref">${p.reference} — ${p.collection}</div>
            <div class="card-title">${p.name}</div>
            <div class="card-material">${p.material} | ${p.availability === 'disponible' ? 'Disponible' : 'Bajo Pedido'}</div>
            <div class="card-price">${formatPrice(p.price, p.currency)}</div>
            <div class="card-cop">~ ${formatCOPApprox(p.price)} COP</div>
          </div>
        `
          )
          .join('')}
      </div>

      <div class="summary-box">
        <div>
          <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; color: #1A1817;">Valor Estimado Total</div>
          <div style="font-size: 10px; color: #6B6359;">Cotización sujeta a verificación de disponibilidad</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 20px; font-weight: 700; color: #4338CA;">${formatPrice(totalUSD, 'USD')}</div>
          <div style="font-size: 11px; color: #6B6359;">~ ${formatCOPApprox(totalUSD)} COP</div>
        </div>
      </div>

      <div class="footer">
        <p>${storeConfig.name.toUpperCase()} — Asesoría por WhatsApp: +${storeConfig.whatsapp}</p>
        <p>Documento generado automáticamente desde el catálogo de ${storeConfig.name}.</p>
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() { window.print(); }, 500);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
