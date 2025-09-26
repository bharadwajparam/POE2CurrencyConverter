import React, { useState, useEffect } from 'react';
import { ArrowUpDown, Coins, RefreshCw, AlertCircle, PlusCircle } from 'lucide-react';
import { CurrencySelect } from './components/CurrencySelect';
import { CurrencyInput } from './components/CurrencyInput';
import { CurrencyInputRow } from './components/CurrencyInputRow';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useCurrencyData } from './hooks/useCurrencyData';
import { convertCurrency } from './utils/currencyConverter';
import { Currency, League, CurrencyItem, InputCurrency } from './types/currency';

function App() {
  const { currencies, leagues, selectedLeague, setSelectedLeague, loading, error } = useCurrencyData();
  const [pendingSelectedLeague, setPendingSelectedLeague] = useState<string>(selectedLeague);
  const [inputCurrencies, setInputCurrencies] = useState<InputCurrency[]>([]);
  const [toCurrency, setToCurrency] = useState<CurrencyItem | null>(null);
  const [toAmount, setToAmount] = useState<string>('0');
  const [nextId, setNextId] = useState(0);

  // Update pendingSelectedLeague when selectedLeague changes from outside (e.g., initial load)
  useEffect(() => {
    setPendingSelectedLeague(selectedLeague);
  }, [selectedLeague]);

  // Map CurrencyItem to Currency for CurrencySelect component
  const mappedCurrencies: Currency[] = currencies.map(item => ({
    id: item.apiId, // Assuming apiId is unique and suitable for id
    name: item.itemMetadata?.name || item.text,
    icon: item.itemMetadata?.icon || item.iconUrl,
  }));

  // Set default currencies when data loads
  useEffect(() => {
    console.log('Setting default currencies, currencies length:', mappedCurrencies.length);
    if (mappedCurrencies.length > 0 && inputCurrencies.length === 0) {
      const chaos = currencies.find(c => (c.itemMetadata?.name || c.text).toLowerCase().includes('chaos'));
      const exalted = currencies.find(c => (c.itemMetadata?.name || c.text).toLowerCase().includes('exalted'));

      if (chaos) {
        setInputCurrencies([{ id: `input-${nextId}`, currency: chaos, amount: '1' }]);
        setNextId(prevId => prevId + 1);
      }
      if (exalted) {
        setToCurrency(exalted);
      }
    }
  }, [mappedCurrencies, currencies, inputCurrencies.length]);

  // Convert currency when values change
  useEffect(() => {
    if (inputCurrencies.length > 0 && toCurrency) {
      let totalChaosValue = 0;
      for (const input of inputCurrencies) {
        if (input.currency && input.amount) {
          const amount = parseFloat(input.amount) || 0;
          totalChaosValue += amount * input.currency.chaosValue;
        }
      }
      const converted = totalChaosValue / toCurrency.chaosValue;
      setToAmount((Math.round(converted * 100) / 100).toString());
    } else {
      setToAmount('0');
    }
  }, [inputCurrencies, toCurrency]);

  const handleAddCurrencyInput = () => {
    setInputCurrencies(prevInputs => [
      ...prevInputs,
      { id: `input-${nextId}`, currency: null, amount: '1' }
    ]);
    setNextId(prevId => prevId + 1);
  };

  const handleRemoveCurrencyInput = (id: string) => {
    setInputCurrencies(prevInputs => prevInputs.filter(input => input.id !== id));
  };


  const handleRefresh = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <LoadingSpinner />
          <p className="text-center text-gray-600 mt-4">Loading currency data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="flex items-center justify-center mb-4">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-center text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-center text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-2xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Coins className="w-12 h-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              PoE Currency Converter
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Convert Path of Exile currencies with real-time exchange rates
          </p>
        </div>

        {/* Main Converter */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* League Selection */}
          <div className="mb-6 flex items-end">
            <div className="flex-grow">
              <label htmlFor="league-select" className="block text-sm font-semibold text-gray-700 mb-3">
                Select League
              </label>
              <select
                id="league-select"
                value={pendingSelectedLeague}
                onChange={(e) => setPendingSelectedLeague(e.target.value)}
                className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading}
              >
                {leagues.map((league: League) => (
                  <option key={league.id} value={league.id}>
                    {league.text}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => {
                if (pendingSelectedLeague !== selectedLeague) {
                  setSelectedLeague(pendingSelectedLeague);
                }
              }}
              disabled={pendingSelectedLeague === selectedLeague || loading}
              className="ml-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirm
            </button>
          </div>

          {/* Base Currency Selection */}

          <div className="space-y-6">
            {/* From Currency */}
            {/* Input Currencies */}
            {inputCurrencies.map((input, index) => (
              <CurrencyInputRow
                key={input.id}
                id={input.id}
                currencies={mappedCurrencies}
                selectedCurrency={input.currency}
                amount={input.amount}
                onCurrencySelect={(currency: Currency) => {
                  const fullCurrencyItem = currencies.find(item => item.apiId === currency.id);
                  setInputCurrencies(prevInputs =>
                    prevInputs.map(item =>
                      item.id === input.id ? { ...item, currency: fullCurrencyItem || null } : item
                    )
                  );
                }}
                onAmountChange={(amount: string) => {
                  setInputCurrencies(prevInputs =>
                    prevInputs.map(item =>
                      item.id === input.id ? { ...item, amount } : item
                    )
                  );
                }}
                onRemove={handleRemoveCurrencyInput}
                label={`Currency ${index + 1}`}
                isRemovable={inputCurrencies.length > 1}
              />
            ))}

            {/* Add Currency Button */}
            <button
              onClick={handleAddCurrencyInput}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center space-x-2 mt-4"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Add Another Currency</span>
            </button>

            {/* To Currency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CurrencySelect
                currencies={mappedCurrencies}
                selectedCurrency={toCurrency ? { id: toCurrency.apiId, name: toCurrency.itemMetadata?.name || toCurrency.text, icon: toCurrency.itemMetadata?.icon || toCurrency.iconUrl } : null}
                onSelect={(currency: Currency) => {
                  const fullCurrencyItem = currencies.find(item => item.apiId === currency.id);
                  setToCurrency(fullCurrencyItem || null);
                }}
                label="To"
                placeholder="Select target currency"
              />
              <CurrencyInput
                value={toAmount}
                onChange={() => {}} // Read-only
                label="Converted Amount"
                placeholder="0.00"
                readOnly
              />
            </div>

            {/* Exchange Rate Display */}
            {/* Exchange Rate Display */}
            {toCurrency && inputCurrencies.some(input => input.currency && parseFloat(input.amount) > 0) && (
              <div className="bg-blue-50 rounded-xl p-4 mt-6">
                <div className="text-center">
                  <p className="text-sm text-blue-600 font-medium mb-1">Total Converted Amount</p>
                  <p className="text-lg font-bold text-blue-900">
                    {toAmount} {toCurrency.itemMetadata?.name || toCurrency.text}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Data provided by poe2scout.com • Rates update automatically</p>
        </div>
      </div>
    </div>
  );
}

export default App;