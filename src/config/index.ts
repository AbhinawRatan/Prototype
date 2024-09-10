import dotenv from 'dotenv';

dotenv.config();

export const config = {
  BOT_TOKEN: process.env.BOT_TOKEN!,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
  PORT: process.env.PORT || 3000,
};