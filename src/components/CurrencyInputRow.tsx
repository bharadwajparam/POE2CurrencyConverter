import React from 'react';
import { CurrencyInput } from './CurrencyInput';
import { Currency, CurrencyItem } from '../types/currency';
import { XCircle, ChevronDown } from 'lucide-react';

interface CurrencyInputRowProps {
  id: string;
  selectedCurrency: CurrencyItem | null;
  amount: string;
  onCurrencySelect: (currency: CurrencyItem) => void;
  onAmountChange: (amount: string) => void;
  onRemove: (id: string) => void;
  onOpenCurrencySelector: (inputId: string) => void; // New prop to open the selector
  label: string;
  isRemovable: boolean;
}

export const CurrencyInputRow: React.FC<CurrencyInputRowProps> = ({
  id,
  selectedCurrency,
  amount,
  onCurrencySelect, // This will now be called by App.tsx after selection
  onAmountChange,
  onRemove,
  onOpenCurrencySelector, // Use this to trigger the selector
  label,
  isRemovable,
}) => {
  return (
    <div className="flex items-end space-x-2 mb-4">
      <div className="flex-grow">
        <label className="block text-sm font-semibold text-light-gray-200 mb-2">
          {label}
        </label>
        <button
          type="button"
          className="w-full bg-dark-gray-800 border-2 border-dark-gray-600 rounded-xl px-4 py-3 text-left shadow-sm hover:border-dark-gray-600 focus:border-dark-gray-600 focus:ring-2 focus:ring-dark-gray-600 transition-all duration-200"
          onClick={() => onOpenCurrencySelector(id)}
        >
          <div className="flex items-center justify-between">
            {selectedCurrency ? (
              <div className="flex items-center space-x-3">
                <img src={selectedCurrency.itemMetadata?.icon || selectedCurrency.iconUrl} alt={selectedCurrency.itemMetadata?.name || selectedCurrency.text} className="w-6 h-6" />
                <span className="font-medium text-light-gray-200">{selectedCurrency.itemMetadata?.name || selectedCurrency.text}</span>
              </div>
            ) : (
              <span className="text-light-gray-200">Select currency</span>
            )}
            <ChevronDown className="w-5 h-5 text-light-gray-200" />
          </div>
        </button>
      </div>
      <div className="flex-grow">
        <CurrencyInput
          value={amount}
          onChange={onAmountChange}
          label="Amount"
          placeholder="Enter amount"
        />
      </div>
      {isRemovable && (
        <button
          onClick={() => onRemove(id)}
          className="p-2 text-red-500 hover:text-red-600 transition-colors"
          aria-label="Remove currency"
        >
          <XCircle className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};