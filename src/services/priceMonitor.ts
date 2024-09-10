import axios from 'axios';
import { logger } from '../utils/logger';

async function getCoinGeckoPrice(token: string): Promise<number | null> {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: token.toLowerCase(),
        vs_currencies: 'usd'
      }
    });

    logger.info(`CoinGecko API response for ${token}:`, JSON.stringify(response.data));

    if (response.data && response.data[token.toLowerCase()] && response.data[token.toLowerCase()].usd) {
      return response.data[token.toLowerCase()].usd;
    } else {
      logger.warn(`Invalid response structure for ${token}. Response:`, JSON.stringify(response.data));
      return null;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      logger.error(`Axios error fetching price from CoinGecko for ${token}:`, error.message);
      if (error.response) {
        logger.error('Error response:', JSON.stringify(error.response.data));
      }
    } else {
      logger.error(`Error fetching price from CoinGecko for ${token}:`, error);
    }
    return null;
  }
}

// Map common ticker symbols to CoinGecko IDs
const coinGeckoIdMap: { [key: string]: string } = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  // Add more mappings as needed
};

export async function getPriceFromMultipleSources(token: string): Promise<number | null> {
  const coinGeckoId = coinGeckoIdMap[token.toUpperCase()] || token.toLowerCase();
  
  const price = await getCoinGeckoPrice(coinGeckoId);
  
  if (price !== null) {
    return price;
  }
  
  // If CoinGecko fails, you could add fallback sources here
  
  logger.error(`Failed to get price for ${token} from any source`);
  return null;
}

export { getCoinGeckoPrice };