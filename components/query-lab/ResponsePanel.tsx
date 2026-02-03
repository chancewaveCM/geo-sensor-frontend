'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PROVIDER_CONFIG, SENTIMENT_CONFIG } from '@/lib/constants/query-lab-config';
import { highlightBrandMentions } from '@/lib/utils/text-highlighter';
import type { LLMResponse, SentimentType } from '@/types/query-lab';

interface ResponsePanelProps {
  response: LLMResponse;
}

export function ResponsePanel({ response }: ResponsePanelProps) {
  const provider = PROVIDER_CONFIG[response.provider];
  const sentiment = SENTIMENT_CONFIG[response.sentiment.overall];

  const uniqueBrands = useMemo(() => {
    const brands = new Map<string, { count: number; sentiment: SentimentType }>();

    for (const mention of response.brandMentions) {
      const existing = brands.get(mention.brandName);
      if (existing) {
        existing.count++;
      } else {
        const citation = response.citations.find(c => c.brandName === mention.brandName);
        brands.set(mention.brandName, {
          count: 1,
          sentiment: citation?.sentiment || 'neutral',
        });
      }
    }

    return Array.from(brands.entries()).map(([name, data]) => ({
      name,
      ...data,
    }));
  }, [response]);

  const highlightedText = useMemo(
    () => highlightBrandMentions(response.response, response.brandMentions),
    [response.response, response.brandMentions]
  );

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{provider.icon}</span>
            <CardTitle className="text-base font-medium">{provider.name}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${sentiment.bg} ${sentiment.color}`}>
              {sentiment.label}
            </span>
            <span className="text-xs text-gray-500">
              {response.processingTimeMs}ms
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
          {highlightedText}
        </div>

        {uniqueBrands.length > 0 && (
          <div className="pt-3 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-500 mb-2">Brand Mentions</p>
            <div className="flex flex-wrap gap-2">
              {uniqueBrands.map((brand) => {
                const sentimentStyle = SENTIMENT_CONFIG[brand.sentiment];
                return (
                  <span
                    key={brand.name}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${sentimentStyle.bg} ${sentimentStyle.color}`}
                  >
                    {brand.name}
                    {brand.count > 1 && (
                      <span className="ml-1 px-1.5 py-0.5 bg-white/50 rounded-full text-xs">
                        {brand.count}
                      </span>
                    )}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <div className="pt-3 border-t border-gray-100">
          <p className="text-xs font-medium text-gray-500 mb-2">Citation Share</p>
          <div className="space-y-2">
            {Object.entries(response.citationShare)
              .sort(([, a], [, b]) => b - a)
              .map(([brand, share]) => (
                <div key={brand} className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 w-20 truncate">{brand}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${share}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-700 w-10 text-right">
                    {share}%
                  </span>
                </div>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
