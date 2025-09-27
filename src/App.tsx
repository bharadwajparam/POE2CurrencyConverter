import React, { useState, useEffect } from 'react';
import { ArrowUpDown, Coins, RefreshCw, AlertCircle, PlusCircle } from 'lucide-react';
import { CurrencyInput } from './components/CurrencyInput';
import { CurrencyInputRow } from './components/CurrencyInputRow';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useCurrencyData } from './hooks/useCurrencyData';
import { convertCurrency } from './utils/currencyConverter';
import { Currency, League, CurrencyItem, InputCurrency } from './types/currency';
import { CurrencySelectorGrid } from './components/CurrencySelectorGrid'; // Import the new component

function App() {
  const { currencies, leagues, selectedLeague, setSelectedLeague, loading, error } = useCurrencyData();
  const [pendingSelectedLeague, setPendingSelectedLeague] = useState<string>(selectedLeague);
  const [inputCurrencies, setInputCurrencies] = useState<InputCurrency[]>([]);
  const [toCurrency, setToCurrency] = useState<CurrencyItem | null>(null);
  const [toAmount, setToAmount] = useState<string>('0');
  const [nextId, setNextId] = useState(0);

  // State for managing the currency selector modal for input rows
  const [isInputRowSelectorOpen, setIsInputRowSelectorOpen] = useState(false);
  const [currentInputRowId, setCurrentInputRowId] = useState<string | null>(null);

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
      const exalted = currencies.find(c => (c.itemMetadata?.name || c.text).toLowerCase() === 'exalted orb');

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

  const handleOpenInputRowCurrencySelector = (inputId: string) => {
    setCurrentInputRowId(inputId);
    setIsInputRowSelectorOpen(true);
  };

  const handleCurrencySelectForInputRow = (currency: Currency) => {
    if (currentInputRowId) {
      const fullCurrencyItem = currencies.find(item => item.apiId === currency.id);
      setInputCurrencies(prevInputs =>
        prevInputs.map(item =>
          item.id === currentInputRowId ? { ...item, currency: fullCurrencyItem || null } : item
        )
      );
      setIsInputRowSelectorOpen(false);
      setCurrentInputRowId(null);
    }
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
      <div className="max-w-6xl mx-auto py-8">
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

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Currency Selector Grid (Left Panel) - for "To" currency */}
          <div className="lg:w-1/3">
            <CurrencySelectorGrid
              currencies={mappedCurrencies}
              selectedCurrencyId={toCurrency?.apiId || null}
              onSelect={(currency: Currency) => {
                const fullCurrencyItem = currencies.find(item => item.apiId === currency.id);
                setToCurrency(fullCurrencyItem || null);
              }}
            />
          </div>

          {/* Main Converter (Right Panel) */}
          <div className="lg:w-2/3 bg-white rounded-2xl shadow-xl p-8">
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
                  selectedCurrency={input.currency}
                  amount={input.amount}
                  onCurrencySelect={handleCurrencySelectForInputRow} // This will be handled by the modal
                  onAmountChange={(amount: string) => {
                    setInputCurrencies(prevInputs =>
                      prevInputs.map(item =>
                        item.id === input.id ? { ...item, amount } : item
                      )
                    );
                  }}
                  onRemove={handleRemoveCurrencyInput}
                  onOpenCurrencySelector={handleOpenInputRowCurrencySelector} // New prop
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

              {/* To Currency Input */}
              <div className="grid grid-cols-1 gap-4">
                <CurrencyInput
                  value={toAmount}
                  onChange={() => {}} // Read-only
                  label="Converted Amount"
                  placeholder="0.00"
                  readOnly
                />
              </div>

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
        </div>

        {/* Currency Selector Modal for Input Rows */}
        {isInputRowSelectorOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
              <button
                onClick={() => setIsInputRowSelectorOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                &times;
              </button>
              <CurrencySelectorGrid
                currencies={mappedCurrencies}
                selectedCurrencyId={inputCurrencies.find(input => input.id === currentInputRowId)?.currency?.apiId || null}
                onSelect={handleCurrencySelectForInputRow}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Data provided by poe2scout.com</p>
        </div>
      </div>
    </div>
  );
}

export default App;