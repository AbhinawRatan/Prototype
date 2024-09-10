import OpenAI from 'openai';
import { config } from '../config';
import { logger } from '../utils/logger';
import { MarketDataService } from './marketData';
import { VectorStore } from './vectorStore';
import { redisService }from '../utils/redis';

const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY,
});

const marketDataService = new MarketDataService();
const vectorStore = new VectorStore();

export async function generateAnalysis(token: string, currentPrice: number, targetPrice: number): Promise<string> {
  try {
    const cacheKey = `analysis:${token}:${currentPrice}:${targetPrice}`;
    const cachedAnalysis = await redisService.get(cacheKey);

    if (cachedAnalysis) {
      logger.info('Returning cached analysis');
      return cachedAnalysis;
    }

    const marketData = await marketDataService.getMarketData(token);
    
    // Retrieve relevant context from the vector store
    const relevantContext = await vectorStore.query(token, 3); // Get top 3 relevant documents

    const systemPrompt = `You are an AI assistant specialized in cryptocurrency market analysis. Provide concise, accurate analyses based on the given data and context.`;
    
    const userPrompt = `
Analyze ${token} (current: $${currentPrice}, target: $${targetPrice}).
Market data: ${JSON.stringify(marketData)}

Relevant context:
${relevantContext.join('\n')}

Respond with:
1. Market overview (1 sentence)
2. Recommendation (Buy/Sell/Hold)
3. Explanation (1-2 sentences)
4. Confidence (Low/Medium/High)
`;

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-16k", // Using a model with larger context window
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      max_tokens: 200,
      temperature: 0.3,
    });

    const analysis = chatCompletion.choices[0]?.message?.content?.trim() ?? 'No analysis generated.';
    
    // Cache the result
    await redisService.set(cacheKey, analysis, 'EX', 300); // Cache for 5 minutes

    // Update the vector store with the new analysis
    await vectorStore.add(token, analysis);

    logger.info('Generated new analysis', { token, currentPrice, targetPrice });

    return analysis;
  } catch (error) {
    logger.error('Error generating analysis:', error);
    return 'Unable to generate analysis at this time. Please try again later.';
  }
}