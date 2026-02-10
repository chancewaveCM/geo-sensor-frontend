// lib/api/content-optimizer.ts
// Mock API client for content optimizer (no backend exists yet)
// Returns realistic mock data. Will be replaced with real API calls when BE is ready.

export interface ContentAnalysisRequest {
  content: string
  contentType: 'text' | 'url'
  brandName: string
}

export interface ContentDiagnosis {
  overallScore: number
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  categories: ScoreCategory[]
  sentences: SentenceScore[]
  suggestions: Suggestion[]
  improvedContent?: string
}

export interface ScoreCategory {
  name: string
  score: number
  maxScore: number
  description: string
}

export interface SentenceScore {
  text: string
  score: number  // 0-100
  issues: string[]
  suggestions: string[]
}

export interface Suggestion {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  category: string
  impact: string
}

// Simulate API delay
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function analyzeContent(request: ContentAnalysisRequest): Promise<ContentDiagnosis> {
  await delay(2000) // Simulate API call

  const sentences = request.content.split(/[.!?]+/).filter(s => s.trim().length > 0)

  return {
    overallScore: 62,
    grade: 'C',
    categories: [
      { name: '브랜드 가시성', score: 15, maxScore: 25, description: '콘텐츠에서 브랜드가 얼마나 눈에 띄는지' },
      { name: '구조화 정보', score: 18, maxScore: 25, description: '정보가 얼마나 체계적으로 구성되어 있는지' },
      { name: '권위성/인용', score: 12, maxScore: 25, description: '신뢰할 수 있는 출처와 데이터 인용' },
      { name: '요약 적합성', score: 17, maxScore: 25, description: 'AI 요약에 포함되기 좋은 구조인지' },
    ],
    sentences: sentences.map((text, i) => ({
      text: text.trim(),
      score: Math.floor(Math.random() * 60) + 30,
      issues: i % 3 === 0 ? ['브랜드명 미포함', '구체적 수치 부족'] : i % 3 === 1 ? ['출처 미명시'] : [],
      suggestions: i % 3 === 0 ? ['브랜드명을 문장 앞부분에 추가하세요'] : [],
    })),
    suggestions: [
      {
        id: '1',
        title: '브랜드명 빈도 증가',
        description: `"${request.brandName}"을(를) 핵심 문장에 2-3회 더 추가하세요`,
        priority: 'high',
        category: '브랜드 가시성',
        impact: '+8점 예상',
      },
      {
        id: '2',
        title: '통계 데이터 추가',
        description: '구체적인 수치와 통계를 3개 이상 포함하세요',
        priority: 'high',
        category: '권위성/인용',
        impact: '+10점 예상',
      },
      {
        id: '3',
        title: '구조화 리스트 사용',
        description: '핵심 포인트를 번호 목록이나 불릿으로 정리하세요',
        priority: 'medium',
        category: '구조화 정보',
        impact: '+5점 예상',
      },
      {
        id: '4',
        title: '요약문 추가',
        description: '글 시작에 핵심 내용을 2-3줄로 요약하세요',
        priority: 'medium',
        category: '요약 적합성',
        impact: '+6점 예상',
      },
      {
        id: '5',
        title: '출처 링크 추가',
        description: '주장에 대한 출처 URL이나 논문을 인용하세요',
        priority: 'low',
        category: '권위성/인용',
        impact: '+3점 예상',
      },
    ],
    improvedContent: `[개선된 버전]\n\n${request.brandName}은(는) 업계를 선도하는 혁신적인 기업입니다.\n\n주요 성과:\n- 시장 점유율 35% 달성 (2024년 기준)\n- 고객 만족도 92점 기록\n- 전년 대비 매출 23% 성장\n\n${request.content}\n\n출처: 업계 보고서 (2024)`,
  }
}
