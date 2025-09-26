import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Currency } from '../types/currency';

interface CurrencySelectProps {
  currencies: Currency[];
  selectedCurrency: Currency | null;
  onSelect: (currency: Currency) => void;
  label: string;
  placeholder?: string;
}

export const CurrencySelect: React.FC<CurrencySelectProps> = ({
  currencies,
  selectedCurrency,
  onSelect,
  label,
  placeholder = "Select currency"
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredAndSortedCurrencies = currencies
    .filter(currency =>
      currency.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-left shadow-sm hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center justify-between">
            {selectedCurrency ? (
              <div className="flex items-center space-x-3">
                <img src={selectedCurrency.icon} alt={selectedCurrency.name} className="w-6 h-6" />
                <span className="font-medium text-gray-900">{selectedCurrency.name}</span>
              </div>
            ) : (
              <span className="text-gray-500">{placeholder}</span>
            )}
            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto">
            <div className="p-2">
              <input
                type="text"
                placeholder="Search currency..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing when clicking search input
              />
            </div>
            {filteredAndSortedCurrencies.map((currency) => (
              <button
                key={currency.id}
                type="button"
                className="w-full px-4 py-3 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none flex items-center space-x-3 transition-colors"
                onClick={() => {
                  onSelect(currency);
                  setIsOpen(false);
                  setSearchTerm(''); // Clear search term on select
                }}
              >
                <img src={currency.icon} alt={currency.name} className="w-6 h-6" />
                <span className="font-medium text-gray-900">{currency.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};