import { bot } from './bot';
import { config } from './config';
import { logger } from './utils/logger';

bot.launch().then(() => {
  logger.info('Bot is running');
}).catch((error) => {
  logger.error('Error starting the bot:', error);
});

process.on('SIGINT', () => {
  bot.stop('SIGINT');
  process.exit();
});

process.on('SIGTERM', () => {
  bot.stop('SIGTERM');
  process.exit();
});