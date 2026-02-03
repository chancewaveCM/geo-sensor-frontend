// lib/constants/query-lab-config.ts
import type { LLMProvider, SentimentType } from '@/types/query-lab';

/**
 * Provider configuration - single source of truth for all provider UI elements
 */
export const PROVIDER_CONFIG: Record<LLMProvider, {
  id: LLMProvider;
  name: string;
  icon: string;
  color: string;
}> = {
  'gemini': { id: 'gemini', name: 'Google Gemini', icon: '✨', color: 'bg-blue-500' },
  'gpt-4': { id: 'gpt-4', name: 'OpenAI GPT-4', icon: '🤖', color: 'bg-emerald-500' },
};

/**
 * Get all providers as array for iteration
 */
export const PROVIDERS = Object.values(PROVIDER_CONFIG);

/**
 * Sentiment configuration - single source of truth for sentiment UI styles
 */
export const SENTIMENT_CONFIG: Record<SentimentType, {
  label: string;
  color: string;
  bg: string;
  border: string;
}> = {
  positive: { label: 'Positive', color: 'text-green-700', bg: 'bg-green-100', border: 'border-green-200' },
  negative: { label: 'Negative', color: 'text-red-700', bg: 'bg-red-100', border: 'border-red-200' },
  neutral: { label: 'Neutral', color: 'text-gray-700', bg: 'bg-gray-100', border: 'border-gray-200' },
};

/**
 * Highlight color for brand mentions
 */
export const BRAND_HIGHLIGHT_COLOR = '#FEF3C7';
