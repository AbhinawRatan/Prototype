import dotenv from 'dotenv';

dotenv.config();

function requireEnv(key: string): string {
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

export const config = {
  // Server configuration
  PORT: parseInt(process.env.PORT || '3000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',

  // API Keys
  BOT_TOKEN: requireEnv('BOT_TOKEN'),
  OPENAI_API_KEY: requireEnv('OPENAI_API_KEY'),
  COINGECKO_API_KEY: requireEnv('COINGECKO_API_KEY'),
  PINECONE_API_KEY: requireEnv('PINECONE_API_KEY'),
  PINECONE_NAMESPACE: requireEnv('PINECONE_NAMESPACE'),

  // API URLs
  COINGECKO_API_URL: 'https://pro-api.coingecko.com/api/v3',
  OPENAI_API_URL: 'https://api.openai.com/v1',

  // Database configuration
  DATABASE_URL: requireEnv('DATABASE_URL'),

  // Redis configuration
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',

  // Vector store configuration
  PINECONE_ENVIRONMENT: requireEnv('PINECONE_ENVIRONMENT'),
  PINECONE_INDEX: requireEnv('PINECONE_INDEX'),

  // Logging configuration
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),

  // Analysis configuration
  ANALYSIS_CACHE_TTL: parseInt(process.env.ANALYSIS_CACHE_TTL || '300', 10), // 5 minutes

  // OpenAI configuration
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-3.5-turbo-16k',
  OPENAI_TEMPERATURE: parseFloat(process.env.OPENAI_TEMPERATURE || '0.3'),
  OPENAI_MAX_TOKENS: parseInt(process.env.OPENAI_MAX_TOKENS || '200', 10),

  // Feature flags
  ENABLE_BATCH_ANALYSIS: process.env.ENABLE_BATCH_ANALYSIS === 'true',
  ENABLE_ASYNC_PROCESSING: process.env.ENABLE_ASYNC_PROCESSING === 'true',

  // Monitoring
  SENTRY_DSN: process.env.SENTRY_DSN,
};


export type Config = typeof config;