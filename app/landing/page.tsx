import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  Bot,
  CheckCircle2,
  Compass,
  LineChart,
  SearchCheck,
  Sparkles,
} from 'lucide-react'

const featureItems = [
  {
    icon: PieIcon,
    title: 'Citation Share 분석',
    description: 'AI 응답에서 브랜드 인용 비율을 정량화해 점유율 변화를 한눈에 파악합니다.',
  },
  {
    icon: Bot,
    title: 'Multi-LLM 비교',
    description: 'ChatGPT, Gemini를 같은 질문으로 동시 분석해 모델별 가시성 격차를 추적합니다.',
  },
  {
    icon: Compass,
    title: 'GEO 최적화 점수',
    description: 'AI 친화적 콘텐츠 개선 우선순위를 제안해 브랜드 노출 가능성을 높입니다.',
  },
]

const steps = [
  {
    number: '01',
    title: '브랜드 프로필 등록',
    description: '핵심 제품, 경쟁사, 타깃 시장을 입력해 분석 기준을 만듭니다.',
  },
  {
    number: '02',
    title: 'AI에게 질문 실행',
    description: '구매 여정 기반 질문 세트를 자동 생성하고 다중 LLM에 동시에 실행합니다.',
  },
  {
    number: '03',
    title: '인용 분석 리포트 확인',
    description: '브랜드 점유율, 감성, 추천 문맥을 종합한 리포트를 확인하고 액션을 설정합니다.',
  },
]

export default function LandingPage() {
  return (
    <div className="bg-slate-50 text-slate-900">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-20 -top-16 h-72 w-72 rounded-full bg-brand-orange/15 blur-3xl" />
        <div className="absolute right-0 top-40 h-80 w-80 rounded-full bg-brand-navy/20 blur-3xl" />
      </div>

      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href={"/landing" as any} className="flex items-center gap-2 font-semibold text-brand-navy">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-navy text-white">
              GS
            </div>
            <span>GEO Sensor</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex">
            <a href="#features" className="transition-colors hover:text-brand-navy">
              Features
            </a>
            <a href="#pricing" className="transition-colors hover:text-brand-navy">
              Pricing
            </a>
            <a href="#docs" className="transition-colors hover:text-brand-navy">
              Docs
            </a>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
            >
              로그인
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-brand-orange px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-brand-orange/25 transition-all hover:-translate-y-0.5 hover:bg-brand-orange-hover"
            >
              시작하기
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-brand-navy via-[#123f88] to-slate-950 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(224,104,32,0.36),transparent_50%)]" />
          <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
            <div className="animate-fade-in space-y-6">
              <p className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white/90">
                AI Brand Citation Intelligence
              </p>
              <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                AI가 당신의 브랜드를
                <br />
                어떻게 말하고 있는지
                <br />
                알고 계신가요?
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-white/80">
                AI 응답 속 브랜드 인용률을 실시간 추적하고 최적화하세요. GEO Sensor는 답변 문맥까지
                분석해 AI 시대의 검색 가시성을 설계합니다.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center rounded-xl bg-brand-orange px-6 py-3 text-base font-semibold text-white shadow-xl shadow-brand-orange/35 transition-all hover:-translate-y-0.5 hover:bg-brand-orange-hover"
                >
                  무료로 시작하기
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <a
                  href="#dashboard"
                  className="inline-flex items-center rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-base font-semibold text-white/95 transition-colors hover:bg-white/20"
                >
                  대시보드 보기
                </a>
              </div>
            </div>

            <div className="animate-fade-in" style={{ animationDelay: '120ms' }}>
              <HeroDashboardMock />
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-3 px-4 py-5 text-sm font-medium text-slate-700 sm:px-6 lg:px-8">
            <Sparkles className="h-4 w-4 text-brand-orange" />
            <span>150+ 브랜드가 GEO Sensor로 AI 가시성을 관리합니다</span>
          </div>
        </section>

        <section id="features" className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-orange">Features</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
              전략 실행에 바로 연결되는 GEO 분석
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {featureItems.map((item, index) => {
              const Icon = item.icon
              return (
                <article
                  key={item.title}
                  className="animate-fade-in rounded-xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200/60 backdrop-blur"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-navy text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-3 leading-relaxed text-slate-600">{item.description}</p>
                </article>
              )
            })}
          </div>
        </section>

        <section className="bg-slate-100/70 py-20">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-orange">How It Works</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
                3단계로 시작하는 AI 가시성 운영
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {steps.map((step, index) => (
                <article
                  key={step.number}
                  className="animate-fade-in rounded-xl border border-slate-200 bg-white p-6 shadow-md"
                  style={{ animationDelay: `${index * 120}ms` }}
                >
                  <p className="text-sm font-bold text-brand-orange">{step.number}</p>
                  <h3 className="mt-2 text-xl font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-3 text-slate-600">{step.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="dashboard" className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-orange">Dashboard Preview</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
              팀이 즉시 이해하는 시각화 중심 리포트
            </h2>
          </div>
          <DashboardShowcase />
        </section>

        <section id="pricing" className="bg-slate-100/70 py-20">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-orange">Pricing</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
                팀 규모에 맞게 시작하는 GEO 플랜
              </h2>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {[
                { name: 'Starter', price: '무료', desc: '소규모 팀의 기본 모니터링' },
                { name: 'Growth', price: '월 99,000원', desc: '다중 LLM 비교 및 리포트 자동화' },
                { name: 'Enterprise', price: '문의', desc: '대규모 브랜드 운영 및 워크플로우 연동' },
              ].map((plan) => (
                <article key={plan.name} className="rounded-xl border border-slate-200 bg-white p-6 shadow-md">
                  <h3 className="text-xl font-semibold text-slate-900">{plan.name}</h3>
                  <p className="mt-2 text-2xl font-bold text-brand-navy">{plan.price}</p>
                  <p className="mt-3 text-slate-600">{plan.desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="docs" className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-orange">Docs</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
              온보딩을 빠르게 하는 문서 중심 워크플로우
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-600">
              데이터 연결, 질의 템플릿, 리포트 해석 가이드를 단계별로 제공해 팀 내 도입 시간을 줄입니다.
            </p>
            <Link
              href="/login"
              className="mt-7 inline-flex items-center rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-brand-navy hover:text-brand-navy"
            >
              문서 포털 보기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </section>

        <section className="bg-brand-navy py-20 text-white">
          <div className="mx-auto w-full max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              지금 바로 AI 속 브랜드 존재감을 확인하세요
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
              질문부터 보고서까지 자동화된 흐름으로, AI 답변 안에서 당신의 브랜드 점유율을 빠르게 높이세요.
            </p>
            <Link
              href="/register"
              className="mt-8 inline-flex items-center rounded-xl bg-brand-orange px-7 py-3 text-base font-semibold text-white shadow-xl shadow-black/20 transition-all hover:-translate-y-0.5 hover:bg-brand-orange-hover"
            >
              무료로 시작하기
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-5 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <p className="text-sm text-slate-500">© 2026 GEO Sensor. All rights reserved.</p>
          <div className="flex items-center gap-5 text-sm text-slate-600">
            <a href="#pricing" className="hover:text-brand-navy">
              Pricing
            </a>
            <a href="#docs" className="hover:text-brand-navy">
              Docs
            </a>
            <Link href="/login" className="hover:text-brand-navy">
              로그인
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function HeroDashboardMock() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-md">
      <div className="rounded-xl bg-white p-4 text-slate-900 shadow-inner">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Citation Overview</p>
            <h3 className="text-lg font-bold text-brand-navy">Brand Ranking Snapshot</h3>
          </div>
          <div className="rounded-lg bg-brand-orange/10 px-3 py-1 text-sm font-semibold text-brand-orange">
            +18.4%
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-200 p-3">
            <p className="text-xs text-slate-500">Citation Share</p>
            <p className="mt-1 text-2xl font-bold">39.2%</p>
          </div>
          <div className="rounded-xl border border-slate-200 p-3">
            <p className="text-xs text-slate-500">GEO Score</p>
            <p className="mt-1 text-2xl font-bold">87</p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <MiniBar label="GEO Sensor" value={89} />
          <MiniBar label="Competitor A" value={64} />
          <MiniBar label="Competitor B" value={47} />
        </div>
      </div>
    </div>
  )
}

function DashboardShowcase() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 p-4">
          <div className="mb-4 flex items-center gap-2 text-brand-navy">
            <BarChart3 className="h-4 w-4" />
            <span className="text-sm font-semibold">Citation Share by LLM</span>
          </div>
          <div className="space-y-3">
            <MiniBar label="ChatGPT" value={74} />
            <MiniBar label="Gemini" value={61} />
            <MiniBar label="Claude" value={57} />
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <div className="mb-4 flex items-center gap-2 text-brand-navy">
            <LineChart className="h-4 w-4" />
            <span className="text-sm font-semibold">Weekly Visibility Trend</span>
          </div>
          <div className="h-36 rounded-xl bg-gradient-to-b from-brand-orange/20 to-brand-navy/10 p-3">
            <svg viewBox="0 0 220 100" className="h-full w-full" aria-label="weekly trend chart">
              <path
                d="M0,72 C30,50 50,58 72,46 C98,34 120,40 145,26 C168,13 192,18 220,6"
                fill="none"
                stroke="#E06820"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M0,80 C28,68 52,70 76,62 C100,54 124,50 150,44 C170,40 194,34 220,30"
                fill="none"
                stroke="#114BA3"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="5 6"
              />
            </svg>
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <div className="mb-4 flex items-center gap-2 text-brand-navy">
            <SearchCheck className="h-4 w-4" />
            <span className="text-sm font-semibold">Action Queue</span>
          </div>
          <div className="space-y-3">
            {[
              '제품 상세 FAQ 스키마 보강',
              '브랜드 설명 문장 길이 최적화',
              '경쟁사 비교 문맥 콘텐츠 확장',
            ].map((task) => (
              <div key={task} className="flex items-start gap-2 rounded-lg bg-slate-50 p-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-brand-orange" />
                <p className="text-sm text-slate-700">{task}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function MiniBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs font-medium text-slate-600">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-slate-200">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-brand-orange to-brand-navy"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

function PieIcon({ className }: { className?: string }) {
  return <BarChart3 className={className} />
}
