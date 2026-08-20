import React from 'react';
import { useApp } from '../../context/AppContext';

export const CurrencySelector: React.FC = () => {
  const { currency, setCurrency } = useApp();

  return (
    <div className="inline-flex items-center rounded-sm bg-cream-200 border border-taupe/20 p-0.5 text-[10px] uppercase font-semibold">
      <button
        onClick={() => setCurrency('USD')}
        className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer ${
          currency === 'USD' ? 'bg-ink text-gold shadow-xs' : 'text-taupe-contrast hover:text-ink'
        }`}
        title="Dólar Estadounidense (USD)"
      >
        USD ($)
      </button>
      <button
        onClick={() => setCurrency('COP')}
        className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer ${
          currency === 'COP' ? 'bg-ink text-gold shadow-xs' : 'text-taupe-contrast hover:text-ink'
        }`}
        title="Peso Colombiano (COP)"
      >
        COP ($)
      </button>
      <button
        onClick={() => setCurrency('EUR')}
        className={`px-2 py-0.5 rounded-xs transition-colors cursor-pointer ${
          currency === 'EUR' ? 'bg-ink text-gold shadow-xs' : 'text-taupe-contrast hover:text-ink'
        }`}
        title="Euro (€)"
      >
        EUR (€)
      </button>
    </div>
  );
};
