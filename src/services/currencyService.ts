import { CurrencyResponse, CurrencyItem } from '../types/currency';

const CORS_PROXY = 'https://api.allorigins.win/get?url=';
const API_BASE = 'https://poe2scout.com/api/items/currency/currency';

export const fetchCurrencyData = async (league: string = 'Rise of the Abyssal'): Promise<CurrencyResponse> => {
// export const fetchCurrencyData = async (league: string = 'Standard'): Promise<CurrencyResponse> => {
  try {
    const url = `${API_BASE}?page=1&perPage=100&league=${league}`;
    const proxiedUrl = `${CORS_PROXY}${encodeURIComponent(url)}`;

    console.log('Fetching from:', proxiedUrl);

    const response = await fetch(proxiedUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const proxyData = await response.json();
    console.log('Proxy response:', proxyData);

    // Parse the contents from the proxy response
    const actualData: CurrencyResponse = JSON.parse(proxyData.contents);
    console.log('Actual API data:', actualData);

    // Transform the data to match our expected format
    if (actualData && actualData.items) {
      const transformedData: CurrencyItem[] = actualData.items.map((item: CurrencyItem) => ({
        ...item,
        name: item.itemMetadata?.name || item.text, // Fallback to item.text if itemMetadata.name is null
        icon: item.itemMetadata?.icon || item.iconUrl, // Fallback to item.iconUrl if itemMetadata.icon is null
        chaosValue: item.currentPrice, // Assuming currentPrice is chaosValue
        exaltedValue: item.currentPrice / 170, // Placeholder conversion
        divineValue: item.currentPrice / 680 // Placeholder conversion
      }));

      console.log('Transformed data:', transformedData);

      return {
        ...actualData,
        items: transformedData
      };
    }

    throw new Error('Invalid data structure received from API');

  } catch (error) {
    console.error('Error fetching currency data:', error);

    // Return comprehensive mock data for development
    return {
      currentPage: 1,
      pages: 1,
      total: 1,
      items: [
        {
          id: 1,
          itemId: 1,
          currencyCategoryId: 1,
          apiId: "chaos",
          text: "Chaos Orb",
          categoryApiId: "currency",
          iconUrl: "https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyRerollRare.png",
          itemMetadata: {
            name: "Chaos Orb",
            base_type: "Chaos Orb",
            icon: "https://web.poecdn.com/image/Art/2DItems/Currency/CurrencyRerollRare.png",
            stack_size: 1,
            max_stack_size: 10,
            description: "Reforges a rare item with new random modifiers",
            effect: ["Reforges a rare item with new random modifiers"]
          },
          priceLogs: [],
          currentPrice: 1
        }
      ]
    };
  }
};