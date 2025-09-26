import { useState, useEffect } from 'react';
import { fetchCurrencyData, fetchLeagues } from '../services/currencyService';
import { CurrencyResponse, CurrencyItem, League } from '../types/currency';

export const useCurrencyData = () => {
  const [currencies, setCurrencies] = useState<CurrencyItem[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<string>('Standard'); // Default league
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLeaguesAndCurrencies = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch leagues
        const fetchedLeagues = await fetchLeagues();
        console.log("List of leagues", fetchLeagues);
        if (fetchedLeagues.length > 0) {
          setLeagues(fetchedLeagues);
          // Set the first league as default or find a specific one
          const defaultLeague = fetchedLeagues.find(l => l.id === 'Standard') || fetchedLeagues[0];
          setSelectedLeague(defaultLeague.id);
          console.log('Leagues loaded:', fetchedLeagues);
          console.log('Selected default league:', defaultLeague.id);

          // Fetch currency data for the default league
          console.log('Loading currencies for league:', defaultLeague.id);
          const data: CurrencyResponse = await fetchCurrencyData(defaultLeague.id);
          if (data && data.items) {
            setCurrencies(data.items);
          } else {
            setError('Invalid currency data format received');
          }
        } else {
          setError('No leagues found');
        }
      } catch (err) {
        console.error('Error in loadLeaguesAndCurrencies:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadLeaguesAndCurrencies();
  }, []); // Empty dependency array to run once on mount

  useEffect(() => {
    const loadCurrenciesForSelectedLeague = async () => {
      if (!selectedLeague) return;

      try {
        setLoading(true);
        setError(null);
        const data: CurrencyResponse = await fetchCurrencyData(selectedLeague);

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

    loadCurrenciesForSelectedLeague();
  }, [selectedLeague]);

  console.log('Hook state - currencies:', currencies.length, 'leagues:', leagues.length, 'selectedLeague:', selectedLeague, 'loading:', loading, 'error:', error);

  return { currencies, leagues, selectedLeague, setSelectedLeague, loading, error };
};