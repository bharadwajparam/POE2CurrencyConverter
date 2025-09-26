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
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-lg font-medium shadow-sm transition-all duration-200 ${
          readOnly 
            ? 'bg-gray-50 text-gray-600 cursor-not-allowed' 
            : 'bg-white hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none'
        }`}
      />
    </div>
  );
};