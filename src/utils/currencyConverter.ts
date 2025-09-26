import { CurrencyItem } from '../types/currency';

export const convertCurrency = (
  amount: number,
  fromCurrency: CurrencyItem,
  toCurrency: CurrencyItem,
): number => {
  if (!amount || amount <= 0) return 0;

  const amountInChaos = amount * fromCurrency.chaosValue;
  const result = amountInChaos / toCurrency.chaosValue;

  return Math.round(result * 100) / 100;
};