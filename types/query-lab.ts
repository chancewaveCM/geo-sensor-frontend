// types/query-lab.ts

export type LLMProvider = 'gemini' | 'openai';

export type SentimentType = 'positive' | 'negative' | 'neutral';

export type MatchType = 'exact' | 'alias' | 'fuzzy' | 'keyword';

export interface BrandMention {
  brandId: number;
  brandName: string;
  matchedText: string;
  matchType: MatchType;
  positionStart: number;
  positionEnd: number;
  confidence: number;
}

export interface Citation {
  brandId: number;
  brandName: string;
  citationType: 'recommendation' | 'comparison' | 'mention' | 'negative';
  sentiment: SentimentType;
  context: string;
}

export interface LLMResponse {
  provider: LLMProvider;
  query: string;
  response: string;
  brandMentions: BrandMention[];
  citations: Citation[];
  sentiment: {
    overall: SentimentType;
    score: number;
  };
  citationShare: {
    [brandName: string]: number;
  };
  processingTimeMs: number;
}

export interface QueryLabResult {
  id: string;
  query: string;
  timestamp: string;
  responses: LLMResponse[];
}

export interface ComparisonSummary {
  query: string;
  providers: LLMProvider[];
  citationShareComparison: {
    brandName: string;
    [provider: string]: number | string;
  }[];
  sentimentComparison: {
    provider: LLMProvider;
    sentiment: SentimentType;
    score: number;
  }[];
  uniqueBrands: string[];
  commonBrands: string[];
}
