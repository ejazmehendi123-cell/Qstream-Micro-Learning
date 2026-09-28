import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.OPENAI_API_KEY || '';

export const isOpenAIConfigured = Boolean(
  apiKey &&
  !apiKey.includes('your-openai') &&
  apiKey.startsWith('sk-')
);

export const openai = isOpenAIConfigured
  ? new OpenAI({ apiKey })
  : null;

export const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
