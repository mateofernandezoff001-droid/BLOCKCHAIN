import { CryptoPrice } from '../types';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export async function fetchTopCryptos(): Promise<CryptoPrice[]> {
  try {
    const response = await fetch(`${COINGECKO_API}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false`);
    if (!response.ok) throw new Error('Failed to fetch crypto prices');
    return await response.json();
  } catch (error) {
    console.error('Error fetching cryptos:', error);
    return [];
  }
}

export async function fetchExchangeRate(): Promise<{ usd_to_eur: number }> {
    try {
        // Simple fallback or a real API
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
        const data = await response.json();
        return { usd_to_eur: data.rates.EUR };
    } catch (e) {
        console.warn("Exchange rate API failed, using fallback 0.92");
        return { usd_to_eur: 0.92 };
    }
}
