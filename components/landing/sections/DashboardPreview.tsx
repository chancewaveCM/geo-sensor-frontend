import { Activity } from 'lucide-react'
import { BrowserFrame } from '@/components/landing/sections/BrowserFrame'
import { MiniDashboard } from '@/components/landing/sections/MiniDashboard'

export function DashboardPreview() {
  return (
    <section className="px-4 py-16 md:px-6 md:py-20">
      <div className="mx-auto w-full max-w-[1200px]">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-navy">Dashboard Preview</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          실무자가 매일 보는 운영 화면
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
          주간 추세, 모델별 점유율, 우선 실행 항목을 한 곳에 모아서 팀이 같은 결정을 하도록 돕습니다.
        </p>

        <div className="mt-8 rounded-3xl border border-border bg-gradient-to-br from-brand-navy/[0.08] via-transparent to-brand-orange/[0.1] p-4 md:p-6">
          <div className="mx-auto max-w-5xl lg:[transform:perspective(1400px)_rotateX(3deg)]">
            <BrowserFrame>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Strategic GEO Overview</p>
                  <p className="mt-1 text-lg font-semibold text-foreground">이번 주 Citation Share +11.2%</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600">
                  <Activity className="h-3.5 w-3.5" />
                  Live
                </span>
              </div>
              <MiniDashboard />
            </BrowserFrame>
          </div>
        </div>
      </div>
    </section>
  )
}
