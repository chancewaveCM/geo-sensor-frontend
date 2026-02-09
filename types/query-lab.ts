// types/query-lab.ts

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
