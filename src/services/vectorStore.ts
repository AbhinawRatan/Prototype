import { Pinecone, PineconeRecord } from '@pinecone-database/pinecone';
import { OpenAI } from 'openai';
import { config } from '../config';
import { logger } from '../utils/logger';

interface VectorMetadata {
  [key: string]: string | number; // This makes it compatible with RecordMetadata
  text: string;
  token: string;
  timestamp: number;
}

export class VectorStore {
  private client: Pinecone;
  private openai: OpenAI;
  private indexName: string;

  constructor() {
    this.client = new Pinecone({
      apiKey: config.PINECONE_API_KEY,
    });
    this.openai = new OpenAI({ apiKey: config.OPENAI_API_KEY });
    this.indexName = config.PINECONE_INDEX;
  }

  async initialize(): Promise<void> {
    logger.info('VectorStore initialized');
  }

  private async createEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: text,
      });
      return response.data[0].embedding;
    } catch (error) {
      logger.error('Error creating embedding:', error);
      throw new Error('Failed to create embedding');
    }
  }

  async query(token: string, topK: number): Promise<string[]> {
    try {
      const queryEmbedding = await this.createEmbedding(token);
      const index = this.client.Index(this.indexName);
      
      const queryResponse = await index.query({
        vector: queryEmbedding,
        topK,
        includeMetadata: true,
      });

      return this.processQueryResponse(queryResponse);
    } catch (error) {
      logger.error('Error querying vector store:', error);
      throw new Error('Failed to query vector store');
    }
  }

  private processQueryResponse(queryResponse: any): string[] {
    return queryResponse.matches
      .filter((match: { metadata: any; }) => match.metadata)
      .map((match: { metadata: VectorMetadata; }) => match.metadata.text);
  }

  async add(token: string, text: string): Promise<void> {
    try {
      const embedding = await this.createEmbedding(text);
      const index = this.client.Index(this.indexName);
      
      await index.upsert([{
        id: `${token}-${Date.now()}`,
        values: embedding,
        metadata: { text, token, timestamp: Date.now() } as VectorMetadata,
      }]);

      logger.info('Added new vector to store', { token });
    } catch (error) {
      logger.error('Error adding to vector store:', error);
      throw new Error('Failed to add to vector store');
    }
  }

  async batchAdd(items: { token: string; text: string }[]): Promise<void> {
    try {
      const vectors: PineconeRecord[] = [];

      for (const item of items) {
        const embedding = await this.createEmbedding(item.text);
        vectors.push({
          id: `${item.token}-${Date.now()}`,
          values: embedding,
          metadata: { text: item.text, token: item.token, timestamp: Date.now() } as VectorMetadata,
        });
      }

      const index = this.client.Index(this.indexName);
      
      // Split vectors into chunks of 100 (Pinecone's limit)
      const chunks = this.chunkArray(vectors, 100);

      for (const chunk of chunks) {
        await index.upsert(chunk);
      }

      logger.info('Batch added vectors to store', { count: vectors.length });
    } catch (error) {
      logger.error('Error batch adding to vector store:', error);
      throw new Error('Failed to batch add to vector store');
    }
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
      array.slice(i * size, i * size + size)
    );
  }

  async deleteOldVectors(token: string, olderThanDays: number): Promise<void> {
    try {
      const index = this.client.Index(this.indexName);
      const timestamp = Date.now() - olderThanDays * 24 * 60 * 60 * 1000;

      await index.deleteMany({
        filter: {
          token: { $eq: token },
          timestamp: { $lt: timestamp },
        },
      });

      logger.info('Deleted old vectors', { token, olderThanDays });
    } catch (error) {
      logger.error('Error deleting old vectors:', error);
      throw new Error('Failed to delete old vectors');
    }
  }
}