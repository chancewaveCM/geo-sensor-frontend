import { CaseStudyCard } from '@/components/landing/sections/CaseStudyCard'

const CASE_STUDIES = [
  {
    industry: 'B2B SaaS',
    title: '프로젝트 협업툴 브랜드',
    before: '12.4%',
    after: '26.1%',
    summary: '질문셋 재구성과 비교형 랜딩 개선으로 8주 만에 인용률을 2배 이상 높였습니다.',
  },
  {
    industry: 'Education',
    title: '온라인 교육 플랫폼',
    before: '9.8%',
    after: '19.6%',
    summary: '모델별 저성과 주제를 선별해 FAQ와 코스 소개 페이지를 재작성했습니다.',
  },
  {
    industry: 'Fintech',
    title: '중소기업 금융 솔루션',
    before: '15.1%',
    after: '28.7%',
    summary: '신뢰도 관련 콘텐츠를 보강하고 비교 질문 대응 카피를 표준화했습니다.',
  },
]

export function CaseStudies() {
  return (
    <section id="case-studies" className="scroll-mt-24 px-4 py-16 md:px-6 md:py-20">
      <div className="mx-auto w-full max-w-[1200px]">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-navy">Case Studies</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          작은 개선이 큰 인용률 차이를 만듭니다
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
          업종은 다르지만 공통점은 같습니다. 측정하고, 우선순위를 정하고, 실행한 팀이 먼저 올라갑니다.
        </p>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {CASE_STUDIES.map((study) => (
            <CaseStudyCard key={study.title} {...study} />
          ))}
        </div>
      </div>
    </section>
  )
}
