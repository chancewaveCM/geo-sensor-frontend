import Link from 'next/link'
import { ArrowRight, CheckCircle2, Medal, PlayCircle, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FloatingCard } from '@/components/landing/sections/FloatingCard'

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pb-16 pt-28 md:px-6 md:pb-20 md:pt-32 lg:pb-28">
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            'radial-gradient(circle at 12% 20%, hsl(var(--brand-orange) / 0.12), transparent 28%), radial-gradient(circle at 82% 12%, hsl(var(--brand-navy) / 0.11), transparent 34%), radial-gradient(circle at 50% 110%, hsl(var(--brand-orange) / 0.05), transparent 38%)',
        }}
      />
      <div className="mx-auto grid w-full max-w-[1440px] gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs font-semibold tracking-[0.08em] text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-brand-orange" />
            AI 브랜드 인용 분석 플랫폼
          </p>
          <h1 className="mt-5 text-[clamp(2rem,6vw,4.25rem)] font-bold leading-[1.05] tracking-tight text-foreground">
            AI가 추천하는 브랜드,
            <br />
            당신의 브랜드인가요?
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            ChatGPT, Gemini, Claude, Copilot, Perplexity, Grok까지 6개 모델에서
            브랜드가 얼마나 인용되는지 추적하세요. Citation Share를 올리면 AI가
            당신의 영업 채널이 됩니다.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild className="h-11 rounded-full bg-brand-orange px-6 text-white hover:bg-brand-orange-hover">
              <Link href="/register">
                무료로 분석 시작
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-11 rounded-full px-6">
              <a href="#how-it-works">
                <PlayCircle className="mr-2 h-4 w-4" />
                3분 데모 보기
              </a>
            </Button>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              카드 등록 없이 시작
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              187개 팀 사용 중
            </span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          <FloatingCard
            title="Citation Share"
            value="39.2%"
            delta="+18.4%"
            subtitle="최근 4주 기준"
            className="relative z-20 animate-float [animation-duration:12s] motion-reduce:animate-none"
          >
            <div className="mt-4 grid grid-cols-4 gap-1">
              <div className="h-6 rounded bg-brand-orange/25" />
              <div className="h-8 rounded bg-brand-orange/40" />
              <div className="h-10 rounded bg-brand-orange/60" />
              <div className="h-12 rounded bg-brand-orange/80" />
            </div>
          </FloatingCard>

          <FloatingCard
            title="Top Mentioned"
            value="GEO Sensor"
            subtitle="6개 모델 중 1위"
            icon={<Medal className="h-4 w-4 text-amber-500" />}
            className="relative z-10 mt-3 animate-float [animation-duration:12s] motion-reduce:animate-none lg:absolute lg:-right-4 lg:top-16 lg:mt-0 lg:w-[72%]"
          />

          <FloatingCard
            title="GEO Score"
            value="A-"
            subtitle="콘텐츠 최적화 등급"
            className="mt-3 animate-float [animation-duration:12s] motion-reduce:animate-none lg:absolute lg:-left-8 lg:top-44 lg:mt-0 lg:w-[64%]"
          />
        </div>
      </div>
    </section>
  )
}
