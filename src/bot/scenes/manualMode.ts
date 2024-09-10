import { Telegraf, Context } from 'telegraf';
import { getPriceFromMultipleSources } from '../../services/priceMonitor';
import { generateAnalysis } from '../../services/analysis';
import { logger } from '../../utils/logger';

export function setupManualModeHandler(bot: Telegraf) {
  bot.command('manual', async (ctx: Context) => {
    await ctx.reply('Enter the token symbol and target price (e.g., BTC 30000):');
    
    const messageHandler = async (ctx: Context) => {
      // Check if ctx.message is defined and is of type Message
      if (ctx.message && 'text' in ctx.message) {
        try {
          const [token, targetPriceStr] = ctx.message.text.split(' ');
          
          if (!token || !targetPriceStr) {
            await ctx.reply('Invalid input. Please enter the token symbol and target price.');
            return;
          }

          const targetPrice = parseFloat(targetPriceStr);
          if (isNaN(targetPrice)) {
            await ctx.reply('Invalid target price. Please enter a valid number.');
            return;
          }

          const currentPrice = await getPriceFromMultipleSources(token);
          
          if (!currentPrice) {
            await ctx.reply('Unable to fetch the current price. Please try again later.');
            return;
          }

          const analysis = await generateAnalysis(token, currentPrice, targetPrice);
          await ctx.reply(analysis);
        } catch (error) {
          logger.error('Error in manual mode handler:', error);
          await ctx.reply('An error occurred. Please try again later.');
        } finally {
          // Remove the listener after processing
        }
      }
    };

    bot.on('text', messageHandler);
  });
}