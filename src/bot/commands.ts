import { Context } from 'telegraf';

export const commands = {
  start: (ctx: Context) => {
    ctx.reply('Welcome to Crypto Analysis Bot! Use /manual to analyze or /help for more info.');
  },
  help: (ctx: Context) => {
    ctx.reply('Available commands:\n/start - Start the bot\n/manual - Manual analysis\n/help - Show this help message\n\nAdditional helps:\n/faq - Frequently asked questions\n/about - Learn more about the bot\n/price - Get the current price of a token\n/analysis - Get the analysis of a token');
  },
  price: (ctx: Context) => {
    ctx.reply('Enter the token symbol to get the current price:');
  },
  analysis: (ctx: Context) => {
    ctx.reply('Enter the token symbol and target price to get the analysis:');
  },
  faq: (ctx: Context) => {
    ctx.reply('Frequently Asked Questions:\nQ: How do I use the bot?\nA: Use the /manual command to start the manual analysis mode.\nQ: What is the analysis based on?\nA: The analysis is based on the current price and the target price you provide.');
  },
  about: (ctx: Context) => {
    ctx.reply('Crypto Analysis Bot is a Telegram bot that provides analysis of cryptocurrency tokens. It uses the current price and the target price you provide to generate the analysis.');
  },
};