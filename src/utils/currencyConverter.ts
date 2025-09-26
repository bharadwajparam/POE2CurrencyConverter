interface Currency {
  chaosValue: number;
  exaltedValue: number;
  divineValue: number;
}

export const convertCurrency = (
  amount: number,
  fromCurrency: Currency,
  toCurrency: Currency,
  baseCurrency: 'chaos' | 'exalted' | 'divine' = 'chaos'
): number => {
  if (!amount || amount <= 0) return 0;
  
  let amountInBase: number;
  let result: number;
  
  switch (baseCurrency) {
    case 'chaos':
      amountInBase = amount * fromCurrency.chaosValue;
      result = amountInBase / toCurrency.chaosValue;
      break;
    case 'exalted':
      amountInBase = amount * fromCurrency.exaltedValue;
      result = amountInBase / toCurrency.exaltedValue;
      break;
    case 'divine':
      amountInBase = amount * fromCurrency.divineValue;
      result = amountInBase / toCurrency.divineValue;
      break;
    default:
      return 0;
  }
  
  return Math.round(result * 100) / 100;
};