import OpenAI from 'openai';
import { config } from '../config';
import { logger } from '../utils/logger';

const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY,
});

export async function generateAnalysis(token: string, currentPrice: number, targetPrice: number): Promise<string> {
  try {
    const prompt = `
Analyze the current market situation for ${token} with a price of $${currentPrice} compared to the target price of $${targetPrice}.

Consider the following factors:
1. The difference between the current price and the target price
2. General market trends

Based on this simple analysis, provide a brief recommendation on whether the user should buy, sell, or hold the token. Give a short explanation for your recommendation.

Your response should be structured as follows:
1. Brief market overview (1 sentence)
2. Recommendation (Buy/Sell/Hold)
3. Short explanation (1-2 sentences)
`;

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
      n: 1,
      temperature: 0.7,
    });

    return chatCompletion.choices[0]?.message?.content?.trim() ?? 'No analysis generated.';
  } catch (error) {
    logger.error('Error generating analysis:', error);
    return 'Unable to generate analysis at this time. Please try again later.';
  }
}