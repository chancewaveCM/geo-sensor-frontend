// === Stats with trends ===
export const mockStats = {
  totalProjects: 12,
  citationShare: 38.2,
  queriesAnalyzed: 2847,
  avgPosition: 1.8,
  trends: {
    totalProjects: { value: 3, isPositive: true },
    citationShare: { value: 5.3, isPositive: true },
    queriesAnalyzed: { value: 12.7, isPositive: true },
    avgPosition: { value: 0.4, isPositive: true },
  },
}

// === Citation Share: 8 brands with change indicators ===
export const mockCitationData = [
  { brand: '네이버', share: 38.2, color: '#03C75A', change: +5.3 },
  { brand: '구글코리아', share: 24.5, color: '#4285F4', change: -2.1 },
  { brand: '삼성전자', share: 15.8, color: '#1428A0', change: +3.7 },
  { brand: '카카오', share: 8.4, color: '#FEE500', change: -0.5 },
  { brand: '쿠팡', share: 5.2, color: '#E31837', change: +1.8 },
  { brand: 'LG전자', share: 3.1, color: '#A50034', change: +0.9 },
  { brand: '현대자동차', share: 2.6, color: '#002C5F', change: -0.3 },
  { brand: 'SK하이닉스', share: 2.2, color: '#ED1C24', change: +0.2 },
]

// === Brand Rankings: 10 entries with position changes ===
export const mockBrandRankings = [
  { rank: 1, brand: '네이버', score: 92.3, previousRank: 2, change: '▲1' },
  { rank: 2, brand: '구글코리아', score: 87.1, previousRank: 1, change: '▼1' },
  { rank: 3, brand: '삼성전자', score: 81.5, previousRank: 4, change: '▲1' },
  { rank: 4, brand: '카카오', score: 76.8, previousRank: 3, change: '▼1' },
  { rank: 5, brand: '쿠팡', score: 72.4, previousRank: 7, change: '▲2' },
  { rank: 6, brand: 'LG전자', score: 68.9, previousRank: 5, change: '▼1' },
  { rank: 7, brand: '현대자동차', score: 65.2, previousRank: 6, change: '▼1' },
  { rank: 8, brand: '토스', score: 61.7, previousRank: 9, change: '▲1' },
  { rank: 9, brand: 'SK하이닉스', score: 58.3, previousRank: 8, change: '▼1' },
  { rank: 10, brand: '아모레퍼시픽', score: 54.6, previousRank: 10, change: '-' },
]

// === GeoScore: 8 dimensions (Korean labels) ===
export const mockGeoScore = {
  overall: 85,
  grade: 'A-',
  dimensions: [
    { name: '정보 구조화', score: 92 },
    { name: '인용 가시성', score: 88 },
    { name: '콘텐츠 신선도', score: 85 },
    { name: '도메인 권위', score: 78 },
    { name: '크로스플랫폼', score: 82 },
    { name: '메타데이터', score: 90 },
    { name: '증거 밀도', score: 75 },
    { name: '다국어 대응', score: 70 },
  ],
}

// === 24-week Timeseries Data ===
// Generate realistic weekly Citation Share data showing growth pattern
export function generateTimeSeriesData(): Array<{
  week: number
  date: string
  naver: number
  google: number
  samsung: number
  kakao: number
  coupang: number
  overall: number
}> {
  const data = []
  const baseDate = new Date()
  baseDate.setDate(baseDate.getDate() - 24 * 7) // 24 weeks ago

  for (let week = 1; week <= 24; week++) {
    const weekDate = new Date(baseDate)
    weekDate.setDate(weekDate.getDate() + week * 7)

    // Growth pattern with natural variation
    let naverBase: number
    if (week <= 5) naverBase = 12 + week * 1.2 // 12-18%
    else if (week <= 10) naverBase = 18 + (week - 5) * 1.5 // 18-25.5%
    else if (week <= 15) naverBase = 25 + (week - 10) * 1.8 // 25-34%
    else if (week <= 20) naverBase = 33 + (week - 15) * 1.0 // 33-38%
    else naverBase = 37 + (week - 20) * 0.5 // 37-39%

    const noise = () => (Math.random() - 0.5) * 3

    const entry = {
      week,
      date: weekDate.toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric',
      }),
      naver: Math.round((naverBase + noise()) * 10) / 10,
      google: Math.round((24 + noise()) * 10) / 10,
      samsung: Math.round((15 + noise() * 0.8) * 10) / 10,
      kakao: Math.round((9 + noise() * 0.5) * 10) / 10,
      coupang:
        Math.round(
          (5 + (week > 8 ? (week - 8) * 0.3 : 0) + noise() * 0.3) * 10
        ) / 10,
      overall: 0, // will be computed below
    }

    // Compute overall as weighted average
    entry.overall =
      Math.round(
        (entry.naver * 0.38 +
          entry.google * 0.25 +
          entry.samsung * 0.16 +
          entry.kakao * 0.09 +
          entry.coupang * 0.05) *
          10
      ) / 10

    data.push(entry)
  }

  return data
}

export const mockTimeSeriesData = generateTimeSeriesData()

// === Timeseries data formatted for CitationTrendChart component ===
interface TimeseriesDataPoint {
  run_id: number
  timestamp: string
  citation_share_overall: number
  citation_share_by_provider: Record<string, number> | null
  total_citations: number
  brand_citations: number
}

export function getMockTimeseriesForChart(): TimeseriesDataPoint[] {
  // Deterministic offsets for consistent but varied provider data
  const openaiOffsets = [1.2, -0.8, 2.1, -1.5, 0.7, 1.8, -0.3, 0.9, -1.1, 1.4, -0.6, 2.0, 0.3, -1.2, 1.6, -0.4, 0.8, -0.9, 1.3, -0.7, 1.1, -1.0, 0.5, 1.5]
  const geminiOffsets = [-0.5, 1.3, -1.2, 0.8, -0.3, 1.5, 0.6, -1.0, 1.8, -0.7, 0.4, -1.4, 1.1, 0.2, -0.9, 1.7, -0.6, 0.3, -1.3, 0.9, -0.2, 1.6, -0.8, 0.7]
  const perplexityOffsets = [2.5, -1.3, 3.2, -0.7, 1.9, -2.1, 3.5, -1.8, 2.8, -0.4, 3.1, -1.6, 2.2, -0.9, 3.8, -1.1, 2.6, -0.5, 3.4, -1.4, 2.0, -0.8, 3.0, -1.2]

  return mockTimeSeriesData.map((week, i) => {
    // Base brand share ratio
    const baseShare = week.naver / 100

    // Each provider sees the brand differently - OpenAI slightly higher, Gemini similar, Perplexity growing
    const openaiShare = baseShare + openaiOffsets[i % openaiOffsets.length] / 100
    const geminiShare = baseShare + geminiOffsets[i % geminiOffsets.length] / 100
    // Perplexity starts lower but catches up over time (growth story)
    const perplexityBase = baseShare * 0.85 + (i / 24) * 0.08
    const perplexityShare = perplexityBase + perplexityOffsets[i % perplexityOffsets.length] / 100

    return {
      run_id: i + 1,
      timestamp: new Date(
        Date.now() - (24 - week.week) * 7 * 24 * 60 * 60 * 1000
      ).toISOString(),
      citation_share_overall: baseShare,
      citation_share_by_provider: {
        openai: Math.round(openaiShare * 1000) / 1000,
        gemini: Math.round(geminiShare * 1000) / 1000,
        perplexity: Math.round(perplexityShare * 1000) / 1000,
      },
      total_citations: 200 + i * 18 + Math.round(Math.sin(i * 0.5) * 30),
      brand_citations: Math.round(((200 + i * 18) * week.naver) / 100),
    }
  })
}
