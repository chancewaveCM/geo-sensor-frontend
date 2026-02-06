import type { LLMResponse, QueryLabResult } from '@/types/query-lab'

export const mockGeminiResponse: LLMResponse = {
  provider: 'gemini',
  query: '2024년 스마트폰 추천해줘',
  response:
    'Samsung Galaxy S24 Ultra, iPhone 15 Pro Max, Google Pixel 8 Pro를 추천합니다. 종합 추천은 Samsung Galaxy S24 Ultra입니다.',
  brandMentions: [
    {
      brandId: 1,
      brandName: 'Samsung',
      matchedText: 'Samsung Galaxy S24 Ultra',
      matchType: 'exact',
      positionStart: 0,
      positionEnd: 24,
      confidence: 1.0,
    },
    {
      brandId: 2,
      brandName: 'Apple',
      matchedText: 'iPhone 15 Pro Max',
      matchType: 'exact',
      positionStart: 26,
      positionEnd: 42,
      confidence: 1.0,
    },
    {
      brandId: 3,
      brandName: 'Google',
      matchedText: 'Google Pixel 8 Pro',
      matchType: 'exact',
      positionStart: 44,
      positionEnd: 61,
      confidence: 1.0,
    },
  ],
  citations: [
    {
      brandId: 1,
      brandName: 'Samsung',
      citationType: 'recommendation',
      sentiment: 'positive',
      context: 'flagship recommendation',
    },
    {
      brandId: 2,
      brandName: 'Apple',
      citationType: 'comparison',
      sentiment: 'positive',
      context: 'iOS ecosystem stability',
    },
    {
      brandId: 3,
      brandName: 'Google',
      citationType: 'mention',
      sentiment: 'positive',
      context: 'camera quality',
    },
  ],
  sentiment: { overall: 'positive', score: 0.8 },
  citationShare: { Samsung: 50, Apple: 25, Google: 25 },
  processingTimeMs: 1250,
}

export const mockOpenAIResponse: LLMResponse = {
  provider: 'openai',
  query: '2024년 스마트폰 추천해줘',
  response:
    'iPhone 15 Pro Max와 Samsung Galaxy S24+를 우선 추천하며, 가성비로 OnePlus 12도 고려할 수 있습니다.',
  brandMentions: [
    {
      brandId: 2,
      brandName: 'Apple',
      matchedText: 'iPhone 15 Pro Max',
      matchType: 'exact',
      positionStart: 0,
      positionEnd: 16,
      confidence: 1.0,
    },
    {
      brandId: 1,
      brandName: 'Samsung',
      matchedText: 'Samsung Galaxy S24+',
      matchType: 'exact',
      positionStart: 20,
      positionEnd: 39,
      confidence: 1.0,
    },
    {
      brandId: 4,
      brandName: 'OnePlus',
      matchedText: 'OnePlus 12',
      matchType: 'exact',
      positionStart: 52,
      positionEnd: 62,
      confidence: 1.0,
    },
  ],
  citations: [
    {
      brandId: 2,
      brandName: 'Apple',
      citationType: 'recommendation',
      sentiment: 'positive',
      context: 'premium recommendation',
    },
    {
      brandId: 1,
      brandName: 'Samsung',
      citationType: 'recommendation',
      sentiment: 'positive',
      context: 'android flagship',
    },
    {
      brandId: 4,
      brandName: 'OnePlus',
      citationType: 'mention',
      sentiment: 'positive',
      context: 'value for money',
    },
  ],
  sentiment: { overall: 'positive', score: 0.75 },
  citationShare: { Apple: 45, Samsung: 35, OnePlus: 20 },
  processingTimeMs: 980,
}

export const mockQueryResult: QueryLabResult = {
  id: 'mock-result-001',
  query: '2024년 스마트폰 추천해줘',
  timestamp: new Date().toISOString(),
  responses: [mockGeminiResponse, mockOpenAIResponse],
}

export function generateComparisonSummary(result: QueryLabResult) {
  const allBrands = new Set<string>()
  const brandsByProvider: Record<string, Set<string>> = {}

  for (const response of result.responses) {
    brandsByProvider[response.provider] = new Set(response.brandMentions.map((m) => m.brandName))
    response.brandMentions.forEach((m) => allBrands.add(m.brandName))
  }

  const providers = result.responses.map((r) => r.provider)
  const brandSets = Object.values(brandsByProvider)

  const commonBrands = Array.from(allBrands).filter((brand) => brandSets.every((set) => set.has(brand)))
  const uniqueBrands = Array.from(allBrands).filter(
    (brand) => brandSets.filter((set) => set.has(brand)).length === 1
  )

  return {
    query: result.query,
    providers,
    citationShareComparison: Array.from(allBrands).map((brandName) => ({
      brandName,
      ...Object.fromEntries(result.responses.map((r) => [r.provider, r.citationShare[brandName] || 0])),
    })),
    sentimentComparison: result.responses.map((r) => ({
      provider: r.provider,
      sentiment: r.sentiment.overall,
      score: r.sentiment.score,
    })),
    uniqueBrands,
    commonBrands,
  }
}
