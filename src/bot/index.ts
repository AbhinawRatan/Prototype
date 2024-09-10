import { Telegraf } from 'telegraf';
import { config } from '../config';
import { commands } from './commands';
import { setupManualModeHandler } from './scenes/manualMode';

const bot = new Telegraf(config.BOT_TOKEN);

// Register commands
Object.entries(commands).forEach(([command, handler]) => {
  bot.command(command, handler);
});

// Setup manual mode handler
setupManualModeHandler(bot);

export { bot };