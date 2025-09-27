import React from 'react';
import { CurrencyItem } from '../types/currency';

interface CurrencySelectorGridProps {
  currencies: CurrencyItem[];
  selectedCurrencyId: string | null;
  onSelect: (currency: CurrencyItem) => void;
}

export const CurrencySelectorGrid: React.FC<CurrencySelectorGridProps> = ({
  currencies,
  selectedCurrencyId,
  onSelect,
}) => {
  return (
    <div className="p-4 bg-dark-gray-800 rounded-2xl shadow-xl h-full overflow-y-auto">
      <h3 className="text-lg font-bold text-light-gray-200 mb-4">Convert to</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {currencies.map((currency) => (
          <button
            key={currency.id}
            className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200
              ${selectedCurrencyId === currency.apiId ? 'bg-dark-gray-600 border-2 border-dark-gray-600' : 'hover:bg-dark-gray-600 border-2 border-transparent'}`}
            onClick={() => onSelect(currency)}
            title={currency.itemMetadata?.description || currency.itemMetadata?.name || currency.text}
          >
            <img src={currency.itemMetadata?.icon || currency.iconUrl} alt={currency.itemMetadata?.name || currency.text} className="w-10 h-10 mb-1" />
            <span className="text-xs text-center font-medium text-light-gray-200">{currency.itemMetadata?.name || currency.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};