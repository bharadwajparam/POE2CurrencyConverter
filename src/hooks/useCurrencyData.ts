import { useState, useEffect, useRef } from 'react';
import { fetchCurrencyData, fetchLeagues } from '../services/currencyService';
import { CurrencyResponse, CurrencyItem, League } from '../types/currency';

export const useCurrencyData = () => {
  const [currencies, setCurrencies] = useState<CurrencyItem[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [selectedLeague, setSelectedLeague] = useState<string | undefined>(undefined); // Default league, initialized to undefined
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasFetchedInitialData, setHasFetchedInitialData] = useState(false); // State to track if initial data fetch is complete

  const initialDefaultLeagueRef = useRef<string | undefined>(undefined); // Ref to store the initial default league
  const hasRunEffect = useRef(false); // Ref to track if the initial effect has run

  useEffect(() => {
    if (hasRunEffect.current) {
      return; // Skip if effect has already run
    }
    hasRunEffect.current = true; // Mark effect as run

    const loadLeaguesAndCurrencies = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch leagues
        const fetchedLeagues = await fetchLeagues();
        console.log("List of leagues", fetchedLeagues);
        if (fetchedLeagues.length > 0) {
          setLeagues(fetchedLeagues);
          const defaultLeague = fetchedLeagues.find(l => l.text === 'Rise of the Abyssal') ||
                                fetchedLeagues.find(l => l.id === 'Standard') ||
                                fetchedLeagues[0];
          setSelectedLeague(defaultLeague.id);
          initialDefaultLeagueRef.current = defaultLeague.id; // Store the initial default league
          console.log('Leagues loaded:', fetchedLeagues);
          console.log('Selected default league:', defaultLeague.id);

          // Fetch currency data for the default league immediately
          console.log('Loading currencies for initial league:', defaultLeague.id);
          const data: CurrencyResponse = await fetchCurrencyData(defaultLeague.id);
          if (data && data.items) {
            setCurrencies(data.items);
            setHasFetchedInitialData(true); // Mark initial fetch as complete
          } else {
            setError('Invalid currency data format received for initial load');
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
    // Only fetch if initial data has been fetched and selectedLeague is defined and has changed from the initial default
    if (!hasFetchedInitialData || selectedLeague === undefined || selectedLeague === initialDefaultLeagueRef.current) {
      setLoading(false); // Ensure loading is false if not fetching
      return;
    }

    const loadCurrenciesForSelectedLeague = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Loading currencies for selected league:', selectedLeague);
        const data: CurrencyResponse = await fetchCurrencyData(selectedLeague);

        if (data && data.items) {
          setCurrencies(data.items);
        } else {
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
  }, [selectedLeague, hasFetchedInitialData]); // Depend on selectedLeague and hasFetchedInitialData

  console.log('Hook state - currencies:', currencies.length, 'leagues:', leagues.length, 'selectedLeague:', selectedLeague, 'loading:', loading, 'error:', error);

  return { currencies, leagues, selectedLeague, setSelectedLeague, loading, error };
};