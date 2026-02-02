// lib/mock-query-data.ts
import type { LLMResponse, QueryLabResult } from '@/types/query-lab';

export const mockGeminiResponse: LLMResponse = {
  provider: 'gemini',
  query: '2024년 최고의 스마트폰을 추천해주세요',
  response: `2024년 최고의 스마트폰을 추천해드리겠습니다.

1. **Samsung Galaxy S24 Ultra** - 가장 뛰어난 카메라 성능과 S펜 지원으로 생산성이 높습니다. AI 기능이 탁월합니다.

2. **iPhone 15 Pro Max** - 안정적인 iOS 생태계와 뛰어난 영상 촬영 능력을 제공합니다.

3. **Google Pixel 8 Pro** - 순정 안드로이드 경험과 최고의 컴퓨테이셔널 포토그래피를 자랑합니다.

종합적으로 **Samsung Galaxy S24 Ultra**를 가장 추천드립니다.`,
  brandMentions: [
    { brandId: 1, brandName: 'Samsung', matchedText: 'Samsung Galaxy S24 Ultra', matchType: 'exact', positionStart: 45, positionEnd: 69, confidence: 1.0 },
    { brandId: 2, brandName: 'Apple', matchedText: 'iPhone 15 Pro Max', matchType: 'exact', positionStart: 150, positionEnd: 167, confidence: 1.0 },
    { brandId: 3, brandName: 'Google', matchedText: 'Google Pixel 8 Pro', matchType: 'exact', positionStart: 250, positionEnd: 268, confidence: 1.0 },
  ],
  citations: [
    { brandId: 1, brandName: 'Samsung', citationType: 'recommendation', sentiment: 'positive', context: '가장 뛰어난 카메라 성능' },
    { brandId: 2, brandName: 'Apple', citationType: 'comparison', sentiment: 'positive', context: '안정적인 iOS 생태계' },
    { brandId: 3, brandName: 'Google', citationType: 'mention', sentiment: 'positive', context: '최고의 컴퓨테이셔널 포토그래피' },
  ],
  sentiment: { overall: 'positive', score: 0.8 },
  citationShare: { 'Samsung': 50, 'Apple': 25, 'Google': 25 },
  processingTimeMs: 1250,
};

export const mockGPT4Response: LLMResponse = {
  provider: 'gpt-4',
  query: '2024년 최고의 스마트폰을 추천해주세요',
  response: `2024년 스마트폰 추천 목록입니다:

**프리미엄 추천:**
- **iPhone 15 Pro Max**: Apple의 최신 플래그십으로, A17 Pro 칩과 뛰어난 카메라 시스템을 갖추고 있습니다.

**안드로이드 추천:**
- **Samsung Galaxy S24+**: 훌륭한 디스플레이와 강력한 성능을 제공합니다.
- **OnePlus 12**: 가성비가 뛰어나며 빠른 충전이 장점입니다.

전반적으로 iOS를 선호하시면 **iPhone 15 Pro Max**, 안드로이드를 원하시면 **Samsung Galaxy S24+**를 추천합니다.`,
  brandMentions: [
    { brandId: 2, brandName: 'Apple', matchedText: 'iPhone 15 Pro Max', matchType: 'exact', positionStart: 35, positionEnd: 52, confidence: 1.0 },
    { brandId: 1, brandName: 'Samsung', matchedText: 'Samsung Galaxy S24+', matchType: 'exact', positionStart: 180, positionEnd: 199, confidence: 1.0 },
    { brandId: 4, brandName: 'OnePlus', matchedText: 'OnePlus 12', matchType: 'exact', positionStart: 250, positionEnd: 260, confidence: 1.0 },
  ],
  citations: [
    { brandId: 2, brandName: 'Apple', citationType: 'recommendation', sentiment: 'positive', context: '최신 플래그십, A17 Pro 칩' },
    { brandId: 1, brandName: 'Samsung', citationType: 'recommendation', sentiment: 'positive', context: '훌륭한 디스플레이와 강력한 성능' },
    { brandId: 4, brandName: 'OnePlus', citationType: 'mention', sentiment: 'positive', context: '가성비, 빠른 충전' },
  ],
  sentiment: { overall: 'positive', score: 0.75 },
  citationShare: { 'Apple': 45, 'Samsung': 35, 'OnePlus': 20 },
  processingTimeMs: 980,
};

export const mockQueryResult: QueryLabResult = {
  id: 'mock-result-001',
  query: '2024년 최고의 스마트폰을 추천해주세요',
  timestamp: new Date().toISOString(),
  responses: [mockGeminiResponse, mockGPT4Response],
};

export function generateComparisonSummary(result: QueryLabResult) {
  const allBrands = new Set<string>();
  const brandsByProvider: Record<string, Set<string>> = {};

  for (const response of result.responses) {
    brandsByProvider[response.provider] = new Set(
      response.brandMentions.map(m => m.brandName)
    );
    response.brandMentions.forEach(m => allBrands.add(m.brandName));
  }

  const providers = result.responses.map(r => r.provider);
  const brandSets = Object.values(brandsByProvider);

  const commonBrands = Array.from(allBrands).filter(brand =>
    brandSets.every(set => set.has(brand))
  );

  const uniqueBrands = Array.from(allBrands).filter(brand =>
    brandSets.filter(set => set.has(brand)).length === 1
  );

  return {
    query: result.query,
    providers,
    citationShareComparison: Array.from(allBrands).map(brandName => ({
      brandName,
      ...Object.fromEntries(
        result.responses.map(r => [
          r.provider,
          r.citationShare[brandName] || 0
        ])
      ),
    })),
    sentimentComparison: result.responses.map(r => ({
      provider: r.provider,
      sentiment: r.sentiment.overall,
      score: r.sentiment.score,
    })),
    uniqueBrands,
    commonBrands,
  };
}
