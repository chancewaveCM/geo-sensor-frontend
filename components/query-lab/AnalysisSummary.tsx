'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LLMResponse, ComparisonSummary, SentimentType, LLMProvider } from '@/types/query-lab';

interface AnalysisSummaryProps {
  summary: ComparisonSummary;
  responses: LLMResponse[];
}

const sentimentConfig: Record<SentimentType, { label: string; color: string; bg: string; border: string }> = {
  positive: { label: 'Positive', color: 'text-green-700', bg: 'bg-green-100', border: 'border-green-200' },
  negative: { label: 'Negative', color: 'text-red-700', bg: 'bg-red-100', border: 'border-red-200' },
  neutral: { label: 'Neutral', color: 'text-gray-700', bg: 'bg-gray-100', border: 'border-gray-200' },
};

const providerColors: Record<LLMProvider, string> = {
  'gemini': 'bg-blue-500',
  'gpt-4': 'bg-emerald-500',
};

const providerNames: Record<LLMProvider, string> = {
  'gemini': 'Gemini',
  'gpt-4': 'GPT-4',
};

export function AnalysisSummary({ summary }: AnalysisSummaryProps) {
  const maxShare = Math.max(
    ...summary.citationShareComparison.flatMap(item =>
      summary.providers.map(p => (item[p] as number) || 0)
    ),
    1
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Analysis Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Citation Share Comparison</h3>
          <div className="space-y-3">
            {summary.citationShareComparison
              .sort((a, b) => {
                const totalA = summary.providers.reduce((sum, p) => sum + ((a[p] as number) || 0), 0);
                const totalB = summary.providers.reduce((sum, p) => sum + ((b[p] as number) || 0), 0);
                return totalB - totalA;
              })
              .map((item) => (
                <div key={item.brandName} className="space-y-1">
                  <span className="text-sm font-medium text-gray-900">{item.brandName}</span>
                  <div className="flex gap-2">
                    {summary.providers.map((provider) => {
                      const share = (item[provider] as number) || 0;
                      return (
                        <div key={provider} className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 w-12">{providerNames[provider]}</span>
                            <div className="flex-1 h-4 bg-gray-100 rounded overflow-hidden">
                              <div
                                className={`h-full ${providerColors[provider]} transition-all duration-300`}
                                style={{ width: `${(share / maxShare) * 100}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-gray-700 w-10 text-right">
                              {share.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
          </div>

          <div className="flex gap-4 mt-4 pt-3 border-t border-gray-100">
            {summary.providers.map((provider) => (
              <div key={provider} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded ${providerColors[provider]}`} />
                <span className="text-xs text-gray-600">{providerNames[provider]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Sentiment Analysis</h3>
          <div className="grid grid-cols-2 gap-4">
            {summary.sentimentComparison.map((item) => {
              const sentiment = sentimentConfig[item.sentiment];
              return (
                <div
                  key={item.provider}
                  className={`p-4 rounded-lg border ${sentiment.border} ${sentiment.bg}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {providerNames[item.provider]}
                    </span>
                    <span className={`text-sm font-semibold ${sentiment.color}`}>
                      {sentiment.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-white/50 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          item.score > 0 ? 'bg-green-500' : item.score < 0 ? 'bg-red-500' : 'bg-gray-400'
                        }`}
                        style={{ width: `${Math.abs(item.score) * 50 + 50}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600">
                      {item.score > 0 ? '+' : ''}{item.score.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Brand Mentions Analysis</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-blue-800">
                  Common Brands ({summary.commonBrands.length})
                </span>
              </div>
              <p className="text-xs text-blue-600 mb-2">Mentioned by all providers</p>
              <div className="flex flex-wrap gap-1">
                {summary.commonBrands.length > 0 ? (
                  summary.commonBrands.map((brand) => (
                    <span
                      key={brand}
                      className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                    >
                      {brand}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-blue-500 italic">No common brands</span>
                )}
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-amber-800">
                  Unique Brands ({summary.uniqueBrands.length})
                </span>
              </div>
              <p className="text-xs text-amber-600 mb-2">Mentioned by only one provider</p>
              <div className="flex flex-wrap gap-1">
                {summary.uniqueBrands.length > 0 ? (
                  summary.uniqueBrands.map((brand) => (
                    <span
                      key={brand}
                      className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium"
                    >
                      {brand}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-amber-500 italic">No unique brands</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {summary.citationShareComparison.length}
              </p>
              <p className="text-xs text-gray-500">Total Brands</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {summary.commonBrands.length}
              </p>
              <p className="text-xs text-gray-500">Common</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">
                {summary.uniqueBrands.length}
              </p>
              <p className="text-xs text-gray-500">Unique</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
