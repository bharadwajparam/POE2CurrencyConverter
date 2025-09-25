import React, { useState, useEffect, useCallback } from 'react';
import './App.css';

// Define currency types and their rates relative to Chaos Orb
const currencies = {
  'Chaos Orb': { rate: 1, description: 'The basic currency in Path of Exile 2.' },
  'Exalted Orb': { rate: 100, description: 'Used for high-level crafting and upgrades.' },
  'Divine Orb': { rate: 10, description: 'Rare orb for rerolling item properties.' },
  'Regal Orb': { rate: 2, description: 'Adds a Regal modifier to items.' },
  'Vaal Orb': { rate: 1.5, description: 'Corrupts items with Vaal outcomes.' },
  // Add more as needed
};

function App() {
  const [inputs, setInputs] = useState({});
  const [targetCurrency, setTargetCurrency] = useState('Chaos Orb');
  const [convertedValue, setConvertedValue] = useState(0);
  const [error, setError] = useState('');

  // Function to calculate total value in Chaos Orbs
  const calculateTotalChaos = useCallback(() => {
    let total = 0;
    for (const [currency, quantity] of Object.entries(inputs)) {
      const qty = parseFloat(quantity) || 0;
      if (qty < 0) {
        setError('Quantities cannot be negative.');
        return 0;
      }
      total += qty * currencies[currency].rate;
    }
    setError('');
    return total;
  }, [inputs]);

  // Function to convert to target currency
  const convertToTarget = useCallback((totalChaos) => {
    if (targetCurrency === 'Chaos Orb') return totalChaos;
    return totalChaos / currencies[targetCurrency].rate;
  }, [targetCurrency]);

  // Update converted value whenever inputs or target change
  useEffect(() => {
    const totalChaos = calculateTotalChaos();
    const converted = convertToTarget(totalChaos);
    setConvertedValue(converted);
  }, [calculateTotalChaos, convertToTarget]);

  // Handle input change
  const handleInputChange = (currency, value) => {
    setInputs(prev => ({ ...prev, [currency]: value }));
  };

  // Handle target change
  const handleTargetChange = (e) => {
    setTargetCurrency(e.target.value);
  };

  // Export results to JSON file
  const exportData = () => {
    const data = {
      inputs,
      targetCurrency,
      convertedValue
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'conversion-result.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="app">
      <h1>POE2 Currency Converter</h1>
      <div className="inputs">
        {Object.keys(currencies).map(currency => (
          <div key={currency} className="input-group">
            <label title={currencies[currency].description}>
              {currency}:
              <input
                type="number"
                value={inputs[currency] || ''}
                onChange={(e) => handleInputChange(currency, e.target.value)}
                min="0"
                step="0.01"
              />
            </label>
          </div>
        ))}
      </div>
      <div className="target">
        <label>
          Convert to:
          <select value={targetCurrency} onChange={handleTargetChange}>
            {Object.keys(currencies).map(currency => (
              <option key={currency} value={currency}>{currency}</option>
            ))}
          </select>
        </label>
      </div>
      {error && <div className="error">{error}</div>}
      <div className="result">
        <h2>Converted Value: {convertedValue.toFixed(2)} {targetCurrency}</h2>
      </div>
      <div className="buttons">
        <button onClick={() => {/* Refresh rates - dummy */}}>Refresh Rates</button>
        <button onClick={exportData}>Export Results</button>
      </div>
    </div>
  );
}

export default App;