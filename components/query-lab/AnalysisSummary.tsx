'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PROVIDER_CONFIG, SENTIMENT_CONFIG } from '@/lib/constants/query-lab-config';
import type { ComparisonSummary, LLMProvider } from '@/types/query-lab';

interface AnalysisSummaryProps {
  summary: ComparisonSummary;
}

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
        <CardTitle className="text-lg font-medium">분석 요약</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">인용률 비교</h3>
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
                            <span className="text-xs text-gray-500 w-12">{PROVIDER_CONFIG[provider].name}</span>
                            <div className="flex-1 h-4 bg-gray-100 rounded overflow-hidden">
                              <div
                                className={`h-full ${PROVIDER_CONFIG[provider].color} transition-all duration-300`}
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
                <div className={`w-3 h-3 rounded ${PROVIDER_CONFIG[provider].color}`} />
                <span className="text-xs text-gray-600">{PROVIDER_CONFIG[provider].name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">감성 분석</h3>
          <div className="grid grid-cols-2 gap-4">
            {summary.sentimentComparison.map((item) => {
              const sentiment = SENTIMENT_CONFIG[item.sentiment];
              return (
                <div
                  key={item.provider}
                  className={`p-4 rounded-lg border ${sentiment.border} ${sentiment.bg}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {PROVIDER_CONFIG[item.provider].name}
                    </span>
                    <span className={`text-sm font-semibold ${sentiment.color}`}>
                      {sentiment.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-white/50 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          item.score > 0 ? 'bg-trend-up' : item.score < 0 ? 'bg-trend-down' : 'bg-gray-400'
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
          <h3 className="text-sm font-medium text-gray-700 mb-3">브랜드 언급 분석</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-info/10 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-info">
                  공통 브랜드 ({summary.commonBrands.length})
                </span>
              </div>
              <p className="text-xs text-info/80 mb-2">모든 제공자가 언급</p>
              <div className="flex flex-wrap gap-1">
                {summary.commonBrands.length > 0 ? (
                  summary.commonBrands.map((brand) => (
                    <span
                      key={brand}
                      className="px-2 py-1 bg-info/20 text-info rounded text-xs font-medium"
                    >
                      {brand}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-info/60 italic">공통 브랜드 없음</span>
                )}
              </div>
            </div>

            <div className="p-4 bg-warning/10 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-warning">
                  고유 브랜드 ({summary.uniqueBrands.length})
                </span>
              </div>
              <p className="text-xs text-warning/80 mb-2">하나의 제공자만 언급</p>
              <div className="flex flex-wrap gap-1">
                {summary.uniqueBrands.length > 0 ? (
                  summary.uniqueBrands.map((brand) => (
                    <span
                      key={brand}
                      className="px-2 py-1 bg-warning/20 text-warning rounded text-xs font-medium"
                    >
                      {brand}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-warning/60 italic">고유 브랜드 없음</span>
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
              <p className="text-xs text-gray-500">전체 브랜드</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-info">
                {summary.commonBrands.length}
              </p>
              <p className="text-xs text-muted-foreground">공통</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-warning">
                {summary.uniqueBrands.length}
              </p>
              <p className="text-xs text-gray-500">고유</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
