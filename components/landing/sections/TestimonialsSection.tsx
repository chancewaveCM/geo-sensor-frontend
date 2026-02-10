import { TestimonialCard } from '@/components/landing/sections/TestimonialCard'

const TESTIMONIALS = [
  {
    quote: '브랜드가 AI 추천 리스트에 들어가기 시작한 시점을 데이터로 확인할 수 있었습니다.',
    name: '김지수',
    role: 'Growth Marketer · SaaS',
  },
  {
    quote: 'SEO 리포트와 GEO 리포트를 분리하지 않아도 되어 팀 의사결정 속도가 빨라졌습니다.',
    name: '박현우',
    role: 'SEO/GEO Specialist · Commerce',
  },
  {
    quote: '모델별로 어떤 질문군에서 약한지 명확해져서 액션 큐의 품질이 올랐습니다.',
    name: '이수민',
    role: 'Data Analyst · B2B Platform',
  },
  {
    quote: '실험 결과가 바로 온보딩 문서와 캠페인 운영 규칙으로 연결되어 재현성이 생겼습니다.',
    name: '최유진',
    role: 'PM · MarTech',
  },
  {
    quote: '브랜드 카피를 손본 뒤 실제 Citation Share가 오르는 걸 확인하고 확신을 얻었습니다.',
    name: '정도윤',
    role: 'Brand Lead · Fintech',
  },
  {
    quote: '콘텐츠 팀이 어떤 문서를 우선 수정해야 하는지 합의가 쉬워졌습니다.',
    name: '한세아',
    role: 'Content Lead · EdTech',
  },
]

export function TestimonialsSection() {
  return (
    <section className="bg-muted/30 px-4 py-16 md:px-6 md:py-20">
      <div className="mx-auto w-full max-w-[1200px]">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-navy">Testimonials</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          실무 팀이 직접 말하는 변화
        </h2>
        <div className="mt-8 flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:overflow-visible lg:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <TestimonialCard key={testimonial.name} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
}
