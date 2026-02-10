'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const FAQ_ITEMS = [
  {
    q: 'Citation Share는 어떤 기준으로 계산되나요?',
    a: '동일한 질문셋을 여러 AI 모델에 실행한 뒤, 브랜드가 언급된 응답 비율을 집계합니다.',
  },
  {
    q: '기존 SEO 도구와 무엇이 다른가요?',
    a: 'SEO 도구는 검색 결과 중심, GEO Sensor는 AI 응답 내 인용과 맥락을 직접 측정합니다.',
  },
  {
    q: '어떤 팀이 가장 먼저 도입하면 좋나요?',
    a: 'Growth, SEO/GEO, 콘텐츠 팀이 함께 운영할 때 개선 루프가 가장 빠르게 만들어집니다.',
  },
  {
    q: '분석 주기는 보통 어떻게 가져가나요?',
    a: '주 1회 배치 실행과 월간 전략 리뷰를 기본으로 권장합니다.',
  },
  {
    q: '모델은 몇 개까지 지원하나요?',
    a: '기본 플랜에서 ChatGPT, Gemini, Claude, Copilot, Perplexity, Grok까지 6개 모델을 지원합니다.',
  },
  {
    q: '데이터 내보내기가 가능한가요?',
    a: 'CSV 내보내기와 API 연동을 통해 사내 BI 대시보드와 연결할 수 있습니다.',
  },
  {
    q: '온보딩은 얼마나 걸리나요?',
    a: '기본 설정은 30분 내 완료되며, 첫 주부터 Action Queue 운영이 가능합니다.',
  },
  {
    q: '경쟁사 비교도 가능한가요?',
    a: '카테고리별 경쟁 브랜드를 등록하면 인용 점유율을 동일 지표로 비교할 수 있습니다.',
  },
  {
    q: '보안/권한 관리는 어떻게 되나요?',
    a: '워크스페이스 기반 권한과 역할별 접근 제어를 제공합니다.',
  },
  {
    q: '무료 체험 범위는 어떻게 되나요?',
    a: '초기 질문셋 분석과 핵심 대시보드 기능을 체험할 수 있습니다.',
  },
]

export function FAQSection() {
  return (
    <section id="faq" className="scroll-mt-24 px-4 py-16 md:px-6 md:py-20">
      <div className="mx-auto w-full max-w-[760px]">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-brand-navy">FAQ</p>
        <h2 className="mt-3 text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          자주 묻는 질문
        </h2>
        <Accordion type="single" collapsible className="mt-8 rounded-2xl border border-border bg-card px-5 shadow-sm">
          {FAQ_ITEMS.map((item, index) => (
            <AccordionItem key={item.q} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-sm font-semibold text-foreground hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
