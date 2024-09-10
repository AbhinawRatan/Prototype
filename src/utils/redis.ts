import Redis from 'ioredis';
import { config } from '../config';
import { logger } from '../utils/logger';

class RedisService {
  private client: Redis;

  constructor() {
    this.client = new Redis(config.REDIS_URL, {
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
    });

    this.client.on('error', (error) => {
      logger.error('Redis error:', error);
    });

    this.client.on('connect', () => {
      logger.info('Connected to Redis');
    });

    this.client.on('ready', () => {
      logger.info('Redis is ready');
    });

    this.client.on('close', () => {
      logger.warn('Redis connection closed');
    });

    this.client.on('reconnecting', () => {
      logger.info('Reconnecting to Redis');
    });
  }

  async get(key: string): Promise<string | null> {
    try {
      const value = await this.client.get(key);
      return value;
    } catch (error) {
      logger.error('Redis GET error:', error);
      throw error;
    }
  }

  async set(key: string, value: string, p0: string, expireInSeconds?: number): Promise<void> {
    try {
      if (expireInSeconds) {
        await this.client.set(key, value, 'EX', expireInSeconds);
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      logger.error('Redis SET error:', error);
      throw error;
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      logger.error('Redis DEL error:', error);
      throw error;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      logger.error('Redis EXISTS error:', error);
      throw error;
    }
  }

  async incr(key: string): Promise<number> {
    try {
      const result = await this.client.incr(key);
      return result;
    } catch (error) {
      logger.error('Redis INCR error:', error);
      throw error;
    }
  }

  async zadd(key: string, score: number, member: string): Promise<number> {
    try {
      const result = await this.client.zadd(key, score, member);
      return result;
    } catch (error) {
      logger.error('Redis ZADD error:', error);
      throw error;
    }
  }

  async zrange(key: string, start: number, stop: number, withScores: boolean = false): Promise<string[]> {
    try {
      if (withScores) {
        const result = await this.client.zrange(key, start, stop, 'WITHSCORES');
        return result;
      } else {
        const result = await this.client.zrange(key, start, stop);
        return result;
      }
    } catch (error) {
      logger.error('Redis ZRANGE error:', error);
      throw error;
    }
  }

  async hset(key: string, field: string, value: string): Promise<number> {
    try {
      const result = await this.client.hset(key, field, value);
      return result;
    } catch (error) {
      logger.error('Redis HSET error:', error);
      throw error;
    }
  }

  async hget(key: string, field: string): Promise<string | null> {
    try {
      const result = await this.client.hget(key, field);
      return result;
    } catch (error) {
      logger.error('Redis HGET error:', error);
      throw error;
    }
  }

  async hgetall(key: string): Promise<Record<string, string>> {
    try {
      const result = await this.client.hgetall(key);
      return result;
    } catch (error) {
      logger.error('Redis HGETALL error:', error);
      throw error;
    }
  }

  async flushall(): Promise<void> {
    try {
      await this.client.flushall();
      logger.info('Redis flushed');
    } catch (error) {
      logger.error('Redis FLUSHALL error:', error);
      throw error;
    }
  }

  async quit(): Promise<void> {
    try {
      await this.client.quit();
      logger.info('Redis connection closed');
    } catch (error) {
      logger.error('Redis QUIT error:', error);
      throw error;
    }
  }
}

export const redisService = new RedisService();