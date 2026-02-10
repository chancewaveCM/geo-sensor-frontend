export type ProviderTrend = 'up' | 'down' | 'neutral'

export interface ProviderRadarMetric {
  authority: number
  freshness: number
  structure: number
  trust: number
  actionability: number
}

export interface LLMProvider {
  id: string
  name: string
  shortName: string
  citationShare: number
  avgResponseTime: string
  trend: ProviderTrend
  colorClass: string
  strengths: string[]
  radar: ProviderRadarMetric
}

export const LLM_PROVIDERS: LLMProvider[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    shortName: 'GPT',
    citationShare: 74.0,
    avgResponseTime: '1.2s',
    trend: 'up',
    colorClass: 'text-emerald-400',
    strengths: ['브랜드 인용 문맥 안정성', '실행 가능한 요약 응답'],
    radar: { authority: 88, freshness: 74, structure: 92, trust: 85, actionability: 86 },
  },
  {
    id: 'gemini',
    name: 'Gemini',
    shortName: 'Gemini',
    citationShare: 61.2,
    avgResponseTime: '0.9s',
    trend: 'up',
    colorClass: 'text-blue-400',
    strengths: ['빠른 응답 속도', '비교형 질문 대응'],
    radar: { authority: 76, freshness: 80, structure: 78, trust: 74, actionability: 79 },
  },
  {
    id: 'claude',
    name: 'Claude',
    shortName: 'Claude',
    citationShare: 58.4,
    avgResponseTime: '1.4s',
    trend: 'up',
    colorClass: 'text-orange-300',
    strengths: ['긴 문맥 유지', '근거 설명 품질'],
    radar: { authority: 79, freshness: 66, structure: 84, trust: 82, actionability: 73 },
  },
  {
    id: 'copilot',
    name: 'Copilot',
    shortName: 'Copilot',
    citationShare: 45.8,
    avgResponseTime: '1.1s',
    trend: 'neutral',
    colorClass: 'text-sky-400',
    strengths: ['업무형 질의 대응', '생태계 연결성'],
    radar: { authority: 65, freshness: 70, structure: 73, trust: 67, actionability: 72 },
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    shortName: 'Pplx',
    citationShare: 52.1,
    avgResponseTime: '1.8s',
    trend: 'up',
    colorClass: 'text-teal-400',
    strengths: ['출처 명시 습관', '탐색형 질문 강점'],
    radar: { authority: 71, freshness: 89, structure: 68, trust: 72, actionability: 70 },
  },
  {
    id: 'grok',
    name: 'Grok',
    shortName: 'Grok',
    citationShare: 33.6,
    avgResponseTime: '0.8s',
    trend: 'down',
    colorClass: 'text-rose-400',
    strengths: ['실시간성', '짧은 응답 속도'],
    radar: { authority: 49, freshness: 86, structure: 52, trust: 44, actionability: 58 },
  },
]

export const RADAR_METRIC_LABELS = [
  { key: 'authority', label: '권위성' },
  { key: 'freshness', label: '신선도' },
  { key: 'structure', label: '구조화' },
  { key: 'trust', label: '신뢰도' },
  { key: 'actionability', label: '실행가능성' },
] as const
