export interface PriceLog {
  price: number;
  time: string;
  quantity: number;
}

export interface ItemMetadata {
  name: string;
  base_type: string;
  icon: string;
  stack_size: number;
  max_stack_size: number;
  description: string;
  effect: string[];
}

export interface Currency {
  id: string;
  name: string;
  icon: string;
}

export interface CurrencyItem {
  id: number;
  itemId: number;
  currencyCategoryId: number;
  apiId: string;
  text: string;
  categoryApiId: string;
  iconUrl: string;
  itemMetadata: ItemMetadata;
  priceLogs: PriceLog[];
  currentPrice: number;
  chaosValue: number;
  exaltedValue: number;
  divineValue: number;
}

export interface CurrencyResponse {
  currentPage: number;
  pages: number;
  total: number;
  items: CurrencyItem[];
}

export interface League {
  id: string;
  text: string;
}

export interface InputCurrency {
  id: string;
  currency: CurrencyItem | null;
  amount: string;
}
