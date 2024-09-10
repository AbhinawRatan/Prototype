import axios from 'axios';
import { logger } from '../utils/logger';

async function getCoinGeckoPrice(token: string): Promise<number | null> {
  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${token}&vs_currencies=usd`);
    return response.data[token].usd;
  } catch (error) {
    logger.error(`Error fetching price from CoinGecko for ${token}:`, error);
    return null;
  }
}

export async function getPriceFromMultipleSources(token: string): Promise<number | null> {
  // For now, we'll just use CoinGecko. In the future, we can add more sources.
  return getCoinGeckoPrice(token);
}