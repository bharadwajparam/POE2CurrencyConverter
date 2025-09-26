import React, { useState, useEffect } from 'react';
import { ArrowUpDown, Coins, RefreshCw, AlertCircle } from 'lucide-react';
import { CurrencySelect } from './components/CurrencySelect';
import { CurrencyInput } from './components/CurrencyInput';
import { LoadingSpinner } from './components/LoadingSpinner';
import { useCurrencyData } from './hooks/useCurrencyData';
import { convertCurrency } from './utils/currencyConverter';
import { Currency, League, CurrencyItem } from './types/currency';

function App() {
  const { currencies, leagues, selectedLeague, setSelectedLeague, loading, error } = useCurrencyData();
  const [fromCurrency, setFromCurrency] = useState<CurrencyItem | null>(null);
  const [toCurrency, setToCurrency] = useState<CurrencyItem | null>(null);
  const [fromAmount, setFromAmount] = useState<string>('1');
  const [toAmount, setToAmount] = useState<string>('0');
  const [baseCurrency, setBaseCurrency] = useState<'chaos' | 'exalted' | 'divine'>('chaos');

  // Map CurrencyItem to Currency for CurrencySelect component
  const mappedCurrencies: Currency[] = currencies.map(item => ({
    id: item.apiId, // Assuming apiId is unique and suitable for id
    name: item.itemMetadata?.name || item.text,
    icon: item.itemMetadata?.icon || item.iconUrl,
  }));

  // Set default currencies when data loads
  useEffect(() => {
    console.log('Setting default currencies, currencies length:', mappedCurrencies.length);
    if (mappedCurrencies.length > 0 && !fromCurrency) {
      const chaos = mappedCurrencies.find(c => c.name.toLowerCase().includes('chaos'));
      const exalted = mappedCurrencies.find(c => c.name.toLowerCase().includes('exalted'));

      console.log('Found chaos:', chaos, 'Found exalted:', exalted);

      if (chaos) {
        const fullChaosCurrency = currencies.find(c => (c.itemMetadata?.name || c.text).toLowerCase().includes('chaos'));
        setFromCurrency(fullChaosCurrency || null);
      }
      if (exalted) {
        const fullExaltedCurrency = currencies.find(c => (c.itemMetadata?.name || c.text).toLowerCase().includes('exalted'));
        setToCurrency(fullExaltedCurrency || null);
      }
    }
  }, [mappedCurrencies, fromCurrency, currencies]);

  // Convert currency when values change
  useEffect(() => {
    if (fromCurrency && toCurrency && fromAmount) {
      const amount = parseFloat(fromAmount) || 0;
      const converted = convertCurrency(amount, fromCurrency, toCurrency, baseCurrency);
      setToAmount(converted.toString());
    }
  }, [fromAmount, fromCurrency, toCurrency, baseCurrency]);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
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
          <div className="mb-6">
            <label htmlFor="league-select" className="block text-sm font-semibold text-gray-700 mb-3">
              Select League
            </label>
            <select
              id="league-select"
              value={selectedLeague}
              onChange={(e) => setSelectedLeague(e.target.value)}
              className="block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {leagues.map((league: League) => (
                <option key={league.id} value={league.id}>
                  {league.text}
                </option>
              ))}
            </select>
          </div>

          {/* Base Currency Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Base Currency for Conversion
            </label>
            <div className="flex space-x-2">
              {['chaos', 'exalted', 'divine'].map((base) => (
                <button
                  key={base}
                  onClick={() => setBaseCurrency(base as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    baseCurrency === base
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {base.charAt(0).toUpperCase() + base.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {/* From Currency */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CurrencySelect
                currencies={mappedCurrencies}
                selectedCurrency={fromCurrency ? { id: fromCurrency.apiId, name: fromCurrency.itemMetadata?.name || fromCurrency.text, icon: fromCurrency.itemMetadata?.icon || fromCurrency.iconUrl } : null}
                onSelect={(currency: Currency) => {
                  const fullCurrencyItem = currencies.find(item => item.apiId === currency.id);
                  setFromCurrency(fullCurrencyItem || null);
                }}
                label="From"
                placeholder="Select source currency"
              />
              <CurrencyInput
                value={fromAmount}
                onChange={setFromAmount}
                label="Amount"
                placeholder="Enter amount"
              />
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <button
                onClick={handleSwapCurrencies}
                disabled={!fromCurrency || !toCurrency}
                className="bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed p-3 rounded-full transition-all hover:scale-105"
              >
                <ArrowUpDown className="w-6 h-6 text-gray-600" />
              </button>
            </div>

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
            {fromCurrency && toCurrency && fromAmount && (
              <div className="bg-blue-50 rounded-xl p-4 mt-6">
                <div className="text-center">
                  <p className="text-sm text-blue-600 font-medium mb-1">Exchange Rate</p>
                  <p className="text-lg font-bold text-blue-900">
                    1 {fromCurrency.itemMetadata?.name || fromCurrency.text} = {convertCurrency(1, fromCurrency, toCurrency, baseCurrency)} {toCurrency.itemMetadata?.name || toCurrency.text}
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