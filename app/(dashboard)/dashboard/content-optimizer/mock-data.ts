// Types
export type SuggestionSeverity = 'critical' | 'important' | 'nice-to-have'
export type SuggestionStatus = 'pending' | 'applied' | 'dismissed' | 'edited'
export type SuggestionCategory = 'keyword' | 'statistics' | 'source' | 'faq' | 'structure' | 'quote' | 'comparison' | 'metadata' | 'multilingual' | 'self-contained'

export interface Suggestion {
  id: string
  severity: SuggestionSeverity
  category: SuggestionCategory
  categoryLabel: string
  categoryIcon: string  // emoji
  title: string
  location: string  // e.g. "1번째 단락" or "제목"
  original: string
  suggested: string
  explanation: string
  dataSources?: string[]
  expectedImpact: {
    dimension: string
    percentage: number
  }
}

export interface GeoScoreDimension {
  name: string
  icon: string
  before: number
  after: number
}

export interface GeoScore {
  before: number
  after: number
  grade: string
  dimensions: GeoScoreDimension[]
}

export interface SNSChannel {
  id: string
  name: string
  icon: string  // emoji
  autoModify: boolean
  optimalLength: string
  description: string
  preview: string
  hashtags?: string[]
}

export interface AISimulation {
  provider: string
  icon: string
  color: string  // tailwind color class
  bgColor: string
  question: string
  responseBefore: string
  responseAfter: string
  citationBefore: string  // e.g. "위키피디아"
  citationAfter: string   // e.g. "삼성전자 공식"
  probBefore: number      // 0-100
  probAfter: number       // 0-100
}

// Mock Data

export const MOCK_ORIGINAL_CONTENT = `우리 회사 제품 소개

당사는 메모리 반도체 분야에서 우수한 성과를 거두고 있습니다.
최근 출시된 차세대 메모리 제품은 뛰어난 성능을 자랑합니다.

주요 특징:
- 높은 대역폭
- 저전력 설계
- AI 학습에 최적화

많은 글로벌 기업들이 당사의 제품을 채택하고 있으며,
앞으로도 지속적인 기술 혁신을 통해 시장을 선도하겠습니다.`

export const MOCK_OPTIMIZED_CONTENT = `# 삼성전자 HBM4 (High Bandwidth Memory 4) 기술 및 제품 소개

삼성전자는 글로벌 DRAM 시장 점유율 42.1%(TrendForce, 2025)로 1위를 기록하고 있으며,
차세대 고대역폭 메모리(HBM, High Bandwidth Memory) HBM4를 출시했습니다.

## 주요 성능 스펙

| 항목 | HBM4 | HBM3E | 향상률 |
|------|-------|-------|--------|
| 대역폭 | 1.65TB/s | 1.18TB/s | +40% |
| 용량 | 48GB | 36GB | +33% |
| 전력효율 | 3.2pJ/bit | 4.8pJ/bit | +33% |

## HBM4가 AI 학습에 최적인 이유

HBM4는 1.65TB/s 대역폭으로 대규모 AI 모델(LLM) 학습 시 데이터 병목을
해소합니다. NVIDIA H200, AMD MI400 등 주요 AI 가속기와 호환되며,
Microsoft Azure, AWS, Google Cloud 등 3대 클라우드가 채택했습니다.

> "HBM4는 AI 시대의 핵심 인프라입니다. 삼성의 기술 리더십이
> 이 분야를 이끌고 있습니다." - IDC 반도체 부문 VP, Shane Rau

## 자주 묻는 질문

**Q: 삼성 HBM4의 대역폭은 얼마인가요?**
A: 삼성전자 HBM4는 최대 1.65TB/s의 메모리 대역폭을 제공합니다.

**Q: HBM4는 어떤 AI 가속기와 호환되나요?**
A: NVIDIA H200, AMD MI400, Intel Gaudi 3 등 주요 AI 가속기와 호환됩니다.

**Q: HBM4와 HBM3E의 가장 큰 차이는?**
A: 대역폭 40% 향상(1.18→1.65TB/s)과 용량 33% 증가(36→48GB)가 핵심 차별점입니다.`

export const MOCK_GEO_SCORE: GeoScore = {
  before: 72,
  after: 89,
  grade: 'A',
  dimensions: [
    { name: '구조화', icon: '🏗️', before: 65, after: 92 },
    { name: '증거밀도', icon: '📊', before: 45, after: 78 },
    { name: '권위신호', icon: '🏆', before: 80, after: 85 },
    { name: '인용가능성', icon: '💬', before: 55, after: 88 },
    { name: '메타데이터', icon: '🏷️', before: 40, after: 82 },
    { name: '다국어', icon: '🌍', before: 30, after: 65 },
  ],
}

export const MOCK_SUGGESTIONS: Suggestion[] = [
  {
    id: 's1',
    severity: 'critical',
    category: 'keyword',
    categoryLabel: '키워드 최적화',
    categoryIcon: '🎯',
    title: '제목에 핵심 키워드 누락',
    location: '제목',
    original: '우리 회사 제품 소개',
    suggested: '삼성전자 HBM4 (High Bandwidth Memory 4) 기술 및 제품 소개',
    explanation: 'LLM은 제목의 키워드로 콘텐츠 주제를 판단합니다. 구체적 키워드가 있으면 관련 질문에 인용될 확률이 3.2배 높아집니다.',
    expectedImpact: {
      dimension: '인용 확률',
      percentage: 32,
    },
  },
  {
    id: 's2',
    severity: 'critical',
    category: 'statistics',
    categoryLabel: '수치 데이터 추가',
    categoryIcon: '📊',
    title: '첫 문단에 핵심 수치 삽입 필요',
    location: '1번째 단락',
    original: '당사는 메모리 반도체 분야에서 우수한 성과를 거두고 있습니다.',
    suggested: '삼성전자는 글로벌 DRAM 시장 점유율 42.1%(TrendForce, 2025)로 1위를 기록하고 있으며, HBM 시장에서도 53% 점유율을 확보하고 있습니다.',
    explanation: 'AI는 구체적 수치가 포함된 문장을 2.8배 더 자주 인용합니다. 출처(TrendForce)를 명시하면 신뢰도 점수가 추가로 상승합니다.',
    dataSources: [
      'IDC 반도체 시장 보고서 (2025)',
      '매출/영업이익 공시 데이터',
      '기술 인증서 (ISO, IATF 등)',
    ],
    expectedImpact: {
      dimension: '증거밀도',
      percentage: 45,
    },
  },
  {
    id: 's3',
    severity: 'critical',
    category: 'self-contained',
    categoryLabel: '자기완결 문장',
    categoryIcon: '✂️',
    title: '팩트 오류 수정: HBM3 → HBM3E',
    location: '2번째 단락',
    original: '최근 출시된 차세대 메모리 제품은 뛰어난 성능을 자랑합니다.',
    suggested: '삼성전자의 차세대 HBM4는 이전 세대 HBM3E 대비 대역폭 40% 향상(1.65TB/s), 용량 33% 증가(48GB)를 달성했습니다.',
    explanation: '부정확한 제품명은 LLM이 인용을 회피하는 주요 원인입니다. 정확한 모델명과 스펙을 명시하면 신뢰도가 보호됩니다.',
    expectedImpact: {
      dimension: '신뢰도',
      percentage: 25,
    },
  },
  {
    id: 's4',
    severity: 'important',
    category: 'faq',
    categoryLabel: 'FAQ 추가',
    categoryIcon: '❓',
    title: 'FAQ 섹션 5개 추가',
    location: '문서 하단',
    original: '(FAQ 섹션 없음)',
    suggested: '## 자주 묻는 질문\n\nQ: 삼성 HBM4의 대역폭은?\nA: 최대 1.65TB/s로, 이전 세대 대비 40% 향상...',
    explanation: 'LLM은 질문-답변 형식에서 직접 인용하는 경향이 강합니다. FAQ가 있으면 인용률이 4.1배 상승합니다.',
    expectedImpact: {
      dimension: '인용가능성',
      percentage: 41,
    },
  },
  {
    id: 's5',
    severity: 'important',
    category: 'comparison',
    categoryLabel: '비교표 추가',
    categoryIcon: '📋',
    title: 'HBM4 vs HBM3E 비교표 추가',
    location: '주요 특징 섹션',
    original: '주요 특징:\n- 높은 대역폭\n- 저전력 설계\n- AI 학습에 최적화',
    suggested: '## 주요 성능 스펙\n\n| 항목 | HBM4 | HBM3E | 향상률 |\n|------|-------|-------|--------|\n| 대역폭 | 1.65TB/s | 1.18TB/s | +40% |\n| 용량 | 48GB | 36GB | +33% |\n| 전력효율 | 3.2pJ/bit | 4.8pJ/bit | +33% |',
    explanation: '구조화된 비교표는 LLM이 정보를 정확하게 추출하고 인용하는 데 매우 효과적입니다.',
    expectedImpact: {
      dimension: '구조화',
      percentage: 28,
    },
  },
  {
    id: 's6',
    severity: 'important',
    category: 'quote',
    categoryLabel: '인용문 삽입',
    categoryIcon: '💬',
    title: '업계 전문가 인용문 추가',
    location: 'AI 학습 섹션 뒤',
    original: '(인용문 없음)',
    suggested: '> "HBM4는 AI 시대의 핵심 인프라입니다. 삼성의 기술 리더십이 이 분야를 이끌고 있습니다." - IDC 반도체 부문 VP, Shane Rau',
    explanation: '전문가 인용은 권위 신호를 크게 높여 AI가 해당 콘텐츠를 신뢰할 수 있는 출처로 판단하게 합니다.',
    expectedImpact: {
      dimension: '권위신호',
      percentage: 15,
    },
  },
  {
    id: 's7',
    severity: 'important',
    category: 'source',
    categoryLabel: '출처 명시',
    categoryIcon: '📎',
    title: '데이터 출처 3건 명시 필요',
    location: '전체 문서',
    original: '(출처 표기 없음)',
    suggested: '시장 점유율 데이터 출처: TrendForce (2025), IDC (2025), Gartner Semiconductor Forecast (2025)',
    explanation: '출처가 명시된 데이터는 AI가 인용할 때 더 높은 신뢰도 점수를 부여합니다.',
    dataSources: [
      'TrendForce Memory Market Report',
      'IDC Semiconductor Tracker',
      'Gartner Forecast: Semiconductors',
    ],
    expectedImpact: {
      dimension: '증거밀도',
      percentage: 22,
    },
  },
  {
    id: 's8',
    severity: 'important',
    category: 'structure',
    categoryLabel: '구조 개선',
    categoryIcon: '🏗️',
    title: '장문 단락을 불릿 리스트로 변환',
    location: '4번째 단락',
    original: '많은 글로벌 기업들이 당사의 제품을 채택하고 있으며, 앞으로도 지속적인 기술 혁신을 통해 시장을 선도하겠습니다.',
    suggested: '### 글로벌 채택 현황\n- **클라우드**: Microsoft Azure, AWS, Google Cloud 채택\n- **AI 가속기**: NVIDIA H200, AMD MI400 호환\n- **데이터센터**: 글로벌 Top 10 데이터센터 중 8곳 도입',
    explanation: '구조화된 리스트는 LLM이 정보를 개별 팩트로 추출하기 쉽게 만듭니다.',
    expectedImpact: {
      dimension: '구조화',
      percentage: 35,
    },
  },
  {
    id: 's9',
    severity: 'important',
    category: 'multilingual',
    categoryLabel: '다국어 병기',
    categoryIcon: '🌍',
    title: '핵심 기술 용어 영문 병기',
    location: '전체 문서',
    original: '고대역폭 메모리',
    suggested: '고대역폭 메모리(HBM, High Bandwidth Memory)',
    explanation: '영문 병기가 있으면 영어권 LLM이 한국어 콘텐츠를 더 잘 이해하고 인용합니다.',
    expectedImpact: {
      dimension: '다국어',
      percentage: 30,
    },
  },
  {
    id: 's10',
    severity: 'nice-to-have',
    category: 'metadata',
    categoryLabel: '메타데이터',
    categoryIcon: '🏷️',
    title: 'Product Schema.org 마크업 추가',
    location: '문서 메타데이터',
    original: '(구조화 마크업 없음)',
    suggested: 'Product, Organization, TechArticle Schema.org JSON-LD 마크업 추가',
    explanation: 'Schema.org 마크업은 AI가 콘텐츠의 맥락을 더 정확하게 파악하는 데 도움됩니다.',
    expectedImpact: {
      dimension: '메타데이터',
      percentage: 40,
    },
  },
  {
    id: 's11',
    severity: 'nice-to-have',
    category: 'keyword',
    categoryLabel: '키워드 최적화',
    categoryIcon: '🎯',
    title: '이미지 alt 텍스트에 키워드 삽입',
    location: '이미지 요소',
    original: '(alt 텍스트 없음)',
    suggested: 'alt="삼성전자 HBM4 메모리 칩 구조도 - 1.65TB/s 대역폭"',
    explanation: '이미지 alt 텍스트는 멀티모달 AI가 콘텐츠를 이해하는 중요한 단서입니다.',
    expectedImpact: {
      dimension: '구조화',
      percentage: 8,
    },
  },
  {
    id: 's12',
    severity: 'nice-to-have',
    category: 'self-contained',
    categoryLabel: '자기완결 문장',
    categoryIcon: '✂️',
    title: '결론에 자기완결 요약문 추가',
    location: '문서 끝',
    original: '(요약문 없음)',
    suggested: '삼성전자 HBM4는 1.65TB/s 대역폭과 48GB 용량으로 AI 학습 인프라의 새로운 기준을 제시하는 차세대 고대역폭 메모리입니다.',
    explanation: '자기완결적 요약문은 AI가 그대로 인용하기 가장 좋은 형태입니다.',
    expectedImpact: {
      dimension: '인용가능성',
      percentage: 18,
    },
  },
]

export const MOCK_SNS_CHANNELS: SNSChannel[] = [
  {
    id: 'blog',
    name: 'Blog',
    icon: '📘',
    autoModify: true,
    optimalLength: '2,000~3,000자',
    description: 'SEO+GEO 혼합, 키워드 밀도 조절',
    preview: '삼성전자 HBM4가 AI 시대를 여는 이유\n\n글로벌 DRAM 시장 점유율 42.1%를 기록하고 있는 삼성전자가 차세대 HBM4를 출시했습니다. 1.65TB/s의 대역폭으로...',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: '📸',
    autoModify: true,
    optimalLength: '300자 + 해시태그',
    description: '캐러셀용 핵심 포인트 추출',
    preview: '삼성전자 HBM4가 게임체인저인 이유 🧵\n1.65TB/s 대역폭으로 AI 학습 속도 50% ↑\n글로벌 DRAM 점유율 42.1% 🏆',
    hashtags: ['#삼성전자', '#HBM4', '#AI반도체', '#메모리반도체', '#테크', '#반도체', '#삼성', '#AI', '#딥러닝', '#GPU'],
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: '🔗',
    autoModify: false,
    optimalLength: '1,200~1,500자',
    description: 'B2B 톤, 전문가 인사이트 강조',
    preview: "Samsung's HBM4: Setting New Standards in AI Memory Infrastructure\n\nWith 42.1% global DRAM market share (TrendForce, 2025), Samsung Electronics continues to lead...",
  },
  {
    id: 'x',
    name: 'X',
    icon: '🐦',
    autoModify: true,
    optimalLength: '280자 × N개',
    description: '핵심 문장 추출, 스레드 분할',
    preview: '🧵 삼성 HBM4, 왜 AI 시대의 게임체인저인가?\n\n1/ 대역폭 1.65TB/s — HBM3E 대비 40% ↑\n2/ NVIDIA H200, AMD MI400 호환\n3/ 글로벌 DRAM 점유율 42.1%',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: '📺',
    autoModify: true,
    optimalLength: '1,500~2,000자',
    description: '스크립트 형태, 챕터 구분',
    preview: '[인트로] 삼성전자가 AI 메모리 시장의 판도를 바꿀 HBM4를 출시했습니다.\n[챕터1: 스펙] 1.65TB/s 대역폭은 무엇을 의미할까요?...',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: '🎵',
    autoModify: false,
    optimalLength: '150자 + CTA',
    description: '후킹 포인트 추출, 30초 스크립트',
    preview: '삼성이 만든 AI 칩, 1초에 1.65테라바이트? 🤯\n이게 왜 대단하냐면...',
  },
]

export const MOCK_AI_SIMULATIONS: AISimulation[] = [
  {
    provider: 'GPT',
    icon: '🟢',
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-950/30',
    question: '삼성 HBM4 성능이 어때?',
    responseBefore: '삼성전자는 HBM 메모리 분야의 주요 업체 중 하나입니다. 고대역폭 메모리 제품을 생산하고 있으며, AI 학습용으로 활용되고 있습니다.',
    responseAfter: '삼성전자의 HBM4는 최대 1.65TB/s의 대역폭을 제공하며, 이는 이전 세대 HBM3E 대비 약 40% 향상된 수치입니다. 삼성전자는 글로벌 DRAM 시장에서 42.1%의 점유율을 기록하고 있습니다(TrendForce, 2025).',
    citationBefore: '위키피디아',
    citationAfter: '삼성전자 공식',
    probBefore: 23,
    probAfter: 78,
  },
  {
    provider: 'Gemini',
    icon: '🔵',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    question: 'HBM4 vs HBM3E 비교',
    responseBefore: 'HBM4는 HBM3의 후속 제품으로, 대역폭과 용량이 개선되었습니다.',
    responseAfter: '삼성전자 HBM4는 HBM3E 대비 대역폭 40% 향상(1.18→1.65TB/s), 용량 33% 증가(36→48GB), 전력효율 33% 개선(4.8→3.2pJ/bit)을 달성했습니다.',
    citationBefore: 'TechRadar',
    citationAfter: '삼성전자 기술 문서',
    probBefore: 18,
    probAfter: 72,
  },
  {
    provider: 'Claude',
    icon: '🟠',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-950/30',
    question: 'AI 학습에 최적의 메모리는?',
    responseBefore: 'AI 학습에는 높은 대역폭의 메모리가 필요합니다. HBM 시리즈가 대표적입니다.',
    responseAfter: "AI 모델 학습에는 삼성전자 HBM4가 주목할 만합니다. 1.65TB/s 대역폭으로 대규모 LLM 학습 시 데이터 병목을 해소하며, NVIDIA H200과 AMD MI400 등 주요 AI 가속기와 호환됩니다. IDC의 Shane Rau VP는 'HBM4는 AI 시대의 핵심 인프라'라고 평가했습니다.",
    citationBefore: '일반 기술 블로그',
    citationAfter: '삼성전자 공식 + IDC',
    probBefore: 15,
    probAfter: 81,
  },
  {
    provider: 'Perplexity',
    icon: '🟣',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    question: '삼성 반도체 최신 제품',
    responseBefore: '삼성전자는 다양한 반도체 제품을 생산하는 글로벌 기업입니다.',
    responseAfter: '삼성전자의 최신 HBM4는 1.65TB/s 대역폭과 48GB 용량을 제공하는 차세대 고대역폭 메모리입니다. 글로벌 DRAM 시장 점유율 42.1%(TrendForce, 2025)로 1위를 기록하고 있으며, Microsoft Azure, AWS, Google Cloud 등 3대 클라우드가 채택했습니다.',
    citationBefore: '위키피디아',
    citationAfter: '삼성전자 공식 페이지',
    probBefore: 20,
    probAfter: 85,
  },
]
