import { useState, useEffect } from 'react';
import { fetchCurrencyData } from '../services/currencyService';
import { CurrencyResponse, CurrencyItem } from '../types/currency';

export const useCurrencyData = (league: string = 'Standard') => {
  const [currencies, setCurrencies] = useState<CurrencyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Loading currencies for league:', league);
        const data: CurrencyResponse = await fetchCurrencyData(league);

        console.log('Received data:', data);

        if (data && data.items) {
          console.log('Setting currencies:', data.items);
          setCurrencies(data.items);
        } else {
          console.error('No items found in response:', data);
          setError('Invalid data format received');
        }
      } catch (err) {
        console.error('Error in loadCurrencies:', err);
        setError('Failed to load currency data');
      } finally {
        setLoading(false);
      }
    };

    loadCurrencies();
  }, [league]);

  console.log('Hook state - currencies:', currencies.length, 'loading:', loading, 'error:', error);

  return { currencies, loading, error };
};