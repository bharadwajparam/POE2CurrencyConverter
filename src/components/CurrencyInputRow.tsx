import React from 'react';
import { CurrencySelect } from './CurrencySelect';
import { CurrencyInput } from './CurrencyInput';
import { Currency, CurrencyItem } from '../types/currency';
import { XCircle } from 'lucide-react';

interface CurrencyInputRowProps {
  id: string;
  selectedCurrency: CurrencyItem | null;
  amount: string;
  onCurrencySelect: (currency: Currency) => void;
  onAmountChange: (amount: string) => void;
  onRemove: (id: string) => void;
  currencies: Currency[];
  label: string;
  isRemovable: boolean;
}

export const CurrencyInputRow: React.FC<CurrencyInputRowProps> = ({
  id,
  selectedCurrency,
  amount,
  onCurrencySelect,
  onAmountChange,
  onRemove,
  currencies,
  label,
  isRemovable,
}) => {
  const mappedSelectedCurrency = selectedCurrency ? {
    id: selectedCurrency.apiId,
    name: selectedCurrency.itemMetadata?.name || selectedCurrency.text,
    icon: selectedCurrency.itemMetadata?.icon || selectedCurrency.iconUrl
  } : null;

  return (
    <div className="flex items-end space-x-2 mb-4">
      <div className="flex-grow">
        <CurrencySelect
          currencies={currencies}
          selectedCurrency={mappedSelectedCurrency}
          onSelect={onCurrencySelect}
          label={label}
          placeholder="Select currency"
        />
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
          className="p-2 text-red-500 hover:text-red-700 transition-colors"
          aria-label="Remove currency"
        >
          <XCircle className="w-6 h-6" />
        </button>
      )}
    </div>
  );
};