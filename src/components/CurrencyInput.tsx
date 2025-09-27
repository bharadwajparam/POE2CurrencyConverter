import React from 'react';

interface CurrencyInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  readOnly?: boolean;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  value,
  onChange,
  label,
  placeholder = "0.00",
  readOnly = false
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow empty string
    if (inputValue === '') {
      onChange('');
      return;
    }
    
    // Allow only numbers and decimal point
    if (!/^\d*\.?\d*$/.test(inputValue)) {
      return;
    }
    
    onChange(inputValue);
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-light-gray-200 mb-2">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`w-full px-4 py-3 border-2 border-dark-gray-600 rounded-xl text-lg font-medium shadow-sm transition-all duration-200 ${
          readOnly
            ? 'bg-dark-gray-800 text-light-gray-200 cursor-not-allowed'
            : 'bg-dark-gray-800 hover:border-dark-gray-600 focus:border-dark-gray-600 focus:ring-2 focus:ring-dark-gray-600 focus:outline-none text-light-gray-200'
        }`}
      />
    </div>
  );
};