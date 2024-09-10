import { Context } from 'telegraf';

export const commands = {
  start: (ctx: Context) => {
    ctx.reply('Welcome to the Crypto Analysis Bot! Use /manual to start analyzing.');
  },
  help: (ctx: Context) => {
    ctx.reply('Available commands:\n/start - Start the bot\n/manual - Enter manual analysis mode\n/help - Show this help message');
  },
};