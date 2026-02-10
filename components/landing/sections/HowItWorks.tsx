import { ClipboardCheck, FileSearch2, Rocket } from 'lucide-react'
import { StepCard } from '@/components/landing/sections/StepCard'
import { OutcomeTimeline } from '@/components/landing/sections/OutcomeTimeline'
import { ICPCards } from '@/components/landing/sections/ICPCards'

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 px-4 py-16 md:px-6 md:py-20">
      <div className="mx-auto w-full max-w-[1200px]">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-navy">How It Works</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          3단계로 GEO 운영 루프를 만듭니다
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
          설정부터 실행까지 복잡한 데이터 파이프라인 없이 시작할 수 있도록 구성했습니다.
        </p>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <StepCard
            step="STEP 1"
            title="브랜드/카테고리 설정"
            description="타겟 카테고리와 경쟁 브랜드를 등록하면 질문셋이 자동 생성됩니다."
            icon={<ClipboardCheck className="h-4 w-4" />}
          />
          <StepCard
            step="STEP 2"
            title="6개 모델 동시 분석"
            description="모델별 응답 패턴, 인용률, 경쟁사 노출을 동일 기준으로 비교합니다."
            icon={<FileSearch2 className="h-4 w-4" />}
          />
          <StepCard
            step="STEP 3"
            title="실행 큐 운영"
            description="저성과 질문군을 개선하고 결과를 주간 단위로 검증합니다."
            icon={<Rocket className="h-4 w-4" />}
          />
        </div>

        <div className="mt-6">
          <OutcomeTimeline />
        </div>

        <div className="mt-4">
          <ICPCards />
        </div>
      </div>
    </section>
  )
}
