import axios from 'axios';
import { config } from '../config';
import { logger } from '../utils/logger';
import { redisService } from '../utils/redis';

interface MarketData {
  price: number;
  volume24h: number;
  marketCap: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
}

export class MarketDataService {
  private readonly apiUrl: string;
  private readonly apiKey: string;

  constructor() {
    this.apiUrl = config.COINGECKO_API_URL;
    this.apiKey = config.COINGECKO_API_KEY;
    logger.info('MarketDataService initialized');
  }

  async getMarketData(token: string): Promise<MarketData> {
    const cacheKey = `marketData:${token}`;
    const cachedData = await redisService.get(cacheKey);

    if (cachedData) {
      logger.info('Returning cached market data', { token });
      return JSON.parse(cachedData);
    }

    try {
      const response = await axios.get(`${this.apiUrl}/coins/${token}`, {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
          sparkline: false,
        },
        headers: {
          'X-CG-Pro-API-Key': this.apiKey,
        },
      });

      const marketData: MarketData = {
        price: response.data.market_data.current_price.usd,
        volume24h: response.data.market_data.total_volume.usd,
        marketCap: response.data.market_data.market_cap.usd,
        priceChange24h: response.data.market_data.price_change_24h,
        priceChangePercentage24h: response.data.market_data.price_change_percentage_24h,
      };

      // Cache the result for 5 minutes
      await redisService.set(cacheKey, JSON.stringify(marketData), 'EX', 300);
      logger.info('Fetched new market data and cached it', { token });

      return marketData;
    } catch (error) {
      logger.error('Error fetching market data:', error);
      throw new Error('Unable to fetch market data at this time.');
    }
  }

  async getBatchMarketData(tokens: string[]): Promise<Record<string, MarketData>> {
    const batchCacheKey = `batchMarketData:${tokens.sort().join(',')}`;
    const cachedBatchData = await redisService.get(batchCacheKey);

    if (cachedBatchData) {
      logger.info('Returning cached batch market data', { tokens });
      return JSON.parse(cachedBatchData);
    }

    try {
      const response = await axios.get(`${this.apiUrl}/coins/markets`, {
        params: {
          vs_currency: 'usd',
          ids: tokens.join(','),
          order: 'market_cap_desc',
          per_page: 250,
          page: 1,
          sparkline: false,
        },
        headers: {
          'X-CG-Pro-API-Key': this.apiKey,
        },
      });

      const batchMarketData: Record<string, MarketData> = {};
      for (const coin of response.data) {
        batchMarketData[coin.id] = {
          price: coin.current_price,
          volume24h: coin.total_volume,
          marketCap: coin.market_cap,
          priceChange24h: coin.price_change_24h,
          priceChangePercentage24h: coin.price_change_percentage_24h,
        };
      }

      // Cache the result for 5 minutes
      await redisService.set(batchCacheKey, JSON.stringify(batchMarketData), 'EX', 300);
      logger.info('Fetched new batch market data and cached it', { tokens });

      return batchMarketData;
    } catch (error) {
      logger.error('Error fetching batch market data:', error);
      throw new Error('Unable to fetch batch market data at this time.');
    }
  }
}