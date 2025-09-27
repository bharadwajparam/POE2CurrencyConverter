import React from 'react';
import { Currency } from '../types/currency';

interface CurrencySelectorGridProps {
  currencies: Currency[];
  selectedCurrencyId: string | null;
  onSelect: (currency: Currency) => void;
}

export const CurrencySelectorGrid: React.FC<CurrencySelectorGridProps> = ({
  currencies,
  selectedCurrencyId,
  onSelect,
}) => {
  return (
    <div className="p-4 bg-white rounded-2xl shadow-xl h-full overflow-y-auto">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Convert to</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {currencies.map((currency) => (
          <button
            key={currency.id}
            className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200
              ${selectedCurrencyId === currency.id ? 'bg-blue-100 border-2 border-blue-500' : 'hover:bg-gray-100 border-2 border-transparent'}`}
            onClick={() => onSelect(currency)}
          >
            <img src={currency.icon} alt={currency.name} className="w-10 h-10 mb-1" />
            <span className="text-xs text-center font-medium text-gray-700">{currency.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};