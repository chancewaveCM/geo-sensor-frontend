import Link from 'next/link'
import { ArrowRight, Bot, CheckCircle2, Compass, LineChart, Settings2, Sparkles } from 'lucide-react'

const queueItems = ['회사 프로필 등록', '질문 세트 자동 생성', 'LLM 응답 비교 분석']

export function BentoLanding() {
  return (
    <div
      className="min-h-screen bg-background-subtle text-foreground [font-family:Pretendard,Inter,system-ui,sans-serif]"
      style={{
        backgroundImage:
          'radial-gradient(circle at 8% 8%, hsl(var(--brand-orange) / 0.08), transparent 26%), radial-gradient(circle at 92% 16%, hsl(var(--brand-navy) / 0.08), transparent 28%)',
      }}
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col px-5 pb-4 pt-4 lg:h-screen lg:overflow-hidden lg:px-6">
        <header className="mb-3 flex h-14 items-center justify-between rounded-2xl border border-border/80 bg-card/90 px-5 shadow-sm backdrop-blur">
          <a href="/" className="text-sm font-bold tracking-tight text-brand-navy">
            GEO Sensor
          </a>
          <div className="flex items-center gap-5">
            <nav className="hidden items-center gap-5 text-xs font-semibold text-muted-foreground md:flex">
              <a href="#feature" className="transition-colors hover:text-brand-navy">
                기능
              </a>
              <a href="#proof" className="transition-colors hover:text-brand-navy">
                도입효과
              </a>
              <a href="#cta" className="transition-colors hover:text-brand-navy">
                신청
              </a>
            </nav>
            <Link
              href="/login"
              className="rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 transition-colors hover:border-brand-navy hover:text-brand-navy"
            >
              로그인
            </Link>
          </div>
        </header>

        <main className="grid flex-1 grid-cols-12 grid-rows-[1fr_1fr_1fr] gap-3">
          <article className="col-span-12 row-span-1 rounded-2xl border border-border bg-card p-7 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md lg:col-span-7">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              <Sparkles className="h-3 w-3 text-brand-orange" />
              AI Brand Citation Analytics
            </p>
            <h1 className="text-[clamp(2rem,3vw,3rem)] font-bold leading-[1.06] tracking-tight text-foreground">
              AI가 당신의 브랜드를
              <br />
              어떻게 말하는지
              <br />
              알고 계신가요?
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Dashboard의 인용 점유율, Analysis의 질문 생성, Query Lab의 모델 비교, Settings의 프로필 관리까지
              하나의 흐름으로 운영합니다.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Link
                href="/register"
                className="inline-flex items-center rounded-full bg-brand-orange px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-orange-hover"
              >
                무료 체험
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center rounded-full border border-gray-300 bg-card px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-brand-navy hover:text-brand-navy"
              >
                대시보드 보기
              </Link>
            </div>
          </article>

          <article className="col-span-12 row-span-1 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Citation Share</p>
            <div className="mt-4 flex items-center justify-between gap-3">
              <Gauge percent={39.2} />
              <div className="min-w-[120px]">
                <p className="text-4xl font-bold tracking-tight text-foreground">39.2%</p>
                <p className="mt-1 inline-flex rounded-full bg-brand-orange/[0.12] px-2.5 py-1 text-xs font-bold text-brand-orange">
                  +18.4%
                </p>
              </div>
            </div>
            <div className="mt-5 h-2 rounded-full bg-gray-100">
              <div className="h-2 w-[58%] rounded-full bg-gradient-to-r from-brand-orange to-brand-navy" />
            </div>
          </article>

          <article
            id="feature"
            className="col-span-12 row-span-1 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md lg:col-span-3"
          >
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-navy text-white">
              <Bot className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">Multi-LLM + Query Lab</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              단일 질의 모드와 파이프라인 모드로 ChatGPT, Gemini 응답을 비교합니다.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-border bg-muted p-2.5">
                <p className="text-[11px] font-semibold text-muted-foreground">ChatGPT</p>
                <p className="mt-1 text-sm font-bold text-foreground">74%</p>
              </div>
              <div className="rounded-xl border border-border bg-muted p-2.5">
                <p className="text-[11px] font-semibold text-muted-foreground">Gemini</p>
                <p className="mt-1 text-sm font-bold text-foreground">61%</p>
              </div>
            </div>
          </article>

          <article className="col-span-12 row-span-1 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md lg:col-span-6">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-[0.07em] text-muted-foreground">Dashboard Preview</h2>
              <span className="rounded-full bg-brand-navy/10 px-2.5 py-1 text-[11px] font-bold text-brand-navy">
                Live
              </span>
            </div>
            <div className="grid h-[calc(100%-2rem)] grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-muted p-3">
                <p className="text-[11px] font-semibold text-muted-foreground">Brand Ranking</p>
                <div className="mt-3 space-y-2.5">
                  <MiniBar label="GEO Sensor" value={89} />
                  <MiniBar label="Competitor A" value={64} />
                  <MiniBar label="Competitor B" value={47} />
                </div>
              </div>
              <div className="rounded-xl border border-border bg-muted p-3">
                <div className="mb-2 flex items-center gap-1.5">
                  <LineChart className="h-3.5 w-3.5 text-brand-navy" />
                  <p className="text-[11px] font-semibold text-muted-foreground">Trend + Volume</p>
                </div>
                <svg viewBox="0 0 220 100" className="h-[120px] w-full" aria-label="trend line chart">
                  <path
                    d="M0,72 C30,50 50,58 72,46 C98,34 120,40 145,26 C168,13 192,18 220,6"
                    fill="none"
                    className="stroke-brand-orange"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="400"
                    strokeDashoffset="400"
                  >
                    <animate attributeName="stroke-dashoffset" from="400" to="0" dur="1.3s" fill="freeze" />
                  </path>
                  <path
                    d="M0,80 C28,68 52,70 76,62 C100,54 124,50 150,44 C170,40 194,34 220,30"
                    fill="none"
                    className="stroke-brand-navy"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="400"
                    strokeDashoffset="400"
                  >
                    <animate attributeName="stroke-dashoffset" from="400" to="0" dur="1.7s" fill="freeze" />
                  </path>
                </svg>
              </div>
            </div>
          </article>

          <article className="col-span-12 row-span-1 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md lg:col-span-3">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange text-white">
              <Compass className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">Analysis + GEO Score</h2>
            <p className="mt-2 text-sm text-muted-foreground">회사 정보 입력 후 질문 생성, 편집, 점수화까지 3단계로 진행합니다.</p>
            <div className="mt-5 rounded-xl border border-border bg-muted p-3">
              <div className="mb-2 flex items-end justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.07em] text-muted-foreground">Grade</span>
                <span className="text-2xl font-black text-brand-navy">A-</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-[11px] font-semibold text-muted-foreground">
                <span className="rounded bg-card px-2 py-1 text-center">콘텐츠 A</span>
                <span className="rounded bg-card px-2 py-1 text-center">신뢰도 A</span>
                <span className="rounded bg-card px-2 py-1 text-center">구조 B+</span>
              </div>
            </div>
          </article>

          <article className="col-span-12 row-span-1 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md lg:col-span-4">
            <h2 className="text-sm font-bold uppercase tracking-[0.07em] text-muted-foreground">Action Queue</h2>
            <div className="mt-4 space-y-2.5">
              {queueItems.map((item) => (
                <div key={item} className="flex items-start gap-2 rounded-xl border border-border bg-muted p-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-brand-orange" />
                  <p className="text-sm text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </article>

          <article
            id="proof"
            className="col-span-12 row-span-1 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md lg:col-span-4"
          >
            <h2 className="text-sm font-bold uppercase tracking-[0.07em] text-muted-foreground">Testimonial</h2>
            <div className="mt-4 flex items-start gap-3">
              <div className="h-12 w-12 rounded-full border border-border bg-gradient-to-br from-brand-navy to-brand-orange" />
              <div>
                <p className="text-lg font-bold leading-tight text-foreground">&ldquo;인용률이 2배 올랐습니다.&rdquo;</p>
                <p className="mt-2 text-sm text-muted-foreground">마케팅 리드 &middot; B2B SaaS 기업</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Dashboard의 추세 지표와 Query Lab 비교 결과를 연결해 보고, 주간 액션 큐 실행률을 안정적으로
              끌어올렸습니다.
            </p>
          </article>

          <article
            id="cta"
            className="col-span-12 row-span-1 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md lg:col-span-4"
          >
            <h2 className="text-sm font-bold uppercase tracking-[0.07em] text-muted-foreground">Early Access</h2>
            <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">200팀 한정</p>
            <p className="mt-2 text-sm text-muted-foreground">설정 페이지에서 회사 프로필을 즉시 등록하고 분석을 시작하세요.</p>
            <form className="mt-4 space-y-2.5">
              <label htmlFor="early-email" className="sr-only">
                이메일
              </label>
              <input
                id="early-email"
                type="email"
                placeholder="work@email.com"
                className="h-10 w-full rounded-full border border-gray-300 bg-card px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-brand-navy"
              />
              <Link
                href="/register"
                className="flex h-10 w-full items-center justify-center rounded-full bg-brand-orange text-sm font-semibold text-white transition-colors hover:bg-brand-orange-hover"
              >
                얼리 액세스 신청
              </Link>
            </form>
          </article>
        </main>

        <footer className="mt-3 flex h-9 items-center justify-between rounded-xl border border-border bg-card px-4 text-xs text-muted-foreground">
          <span>&copy; 2026 GEO Sensor. All rights reserved.</span>
          <Link href="/settings" className="inline-flex items-center gap-1 hover:text-foreground">
            <Settings2 className="h-3.5 w-3.5" />
            회사 프로필 설정
          </Link>
        </footer>
      </div>
    </div>
  )
}

function Gauge({ percent }: { percent: number }) {
  const radius = 46
  const circumference = 2 * Math.PI * radius
  const filled = circumference * (1 - percent / 100)

  return (
    <div className="relative h-[130px] w-[130px]">
      <svg viewBox="0 0 120 120" className="h-full w-full">
        <circle cx="60" cy="60" r={radius} fill="none" className="stroke-gray-200" strokeWidth="12" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          transform="rotate(-90 60 60)"
        >
          <animate attributeName="stroke-dashoffset" from={circumference} to={filled} dur="1.2s" fill="freeze" />
        </circle>
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" className="[stop-color:hsl(var(--brand-orange))]" />
            <stop offset="100%" className="[stop-color:hsl(var(--brand-navy))]" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-gray-700">Citation</span>
      </div>
    </div>
  )
}

function MiniBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-gray-200">
        <div className="h-2 rounded-full bg-gradient-to-r from-brand-orange to-brand-navy" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}
