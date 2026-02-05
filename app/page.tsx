'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  BarChart3,
  Shield,
  GitBranch,
  DollarSign,
  LineChart,
  FlaskConical,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Activity,
  Target,
} from 'lucide-react'
import { StitchSidebar } from '@/components/stitch/StitchSidebar'
import { StitchHeader } from '@/components/stitch/StitchHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Feature card data
const featureCards = [
  {
    title: 'Strategic Analysis',
    description: 'AI 인용 점유율 분석 및 경쟁사 벤치마킹',
    href: '/dashboard/strategic',
    icon: BarChart3,
    gradient: 'from-blue-500 to-indigo-600',
    bgGlow: 'bg-blue-500/10',
  },
  {
    title: 'Brand Safety',
    description: '브랜드 리스크 모니터링 및 감성 분석',
    href: '/dashboard/brand-safety',
    icon: Shield,
    gradient: 'from-emerald-500 to-teal-600',
    bgGlow: 'bg-emerald-500/10',
  },
  {
    title: 'Pipeline',
    description: '글로벌 GEO 파이프라인 및 승인 워크플로우',
    href: '/dashboard/pipeline',
    icon: GitBranch,
    gradient: 'from-violet-500 to-purple-600',
    bgGlow: 'bg-violet-500/10',
  },
  {
    title: 'ROI Hub',
    description: '투자 대비 성과 분석 및 정산 관리',
    href: '/dashboard/roi',
    icon: DollarSign,
    gradient: 'from-amber-500 to-orange-600',
    bgGlow: 'bg-amber-500/10',
  },
  {
    title: '분석 시작',
    description: '새로운 브랜드 분석 세션 시작하기',
    href: '/analysis',
    icon: LineChart,
    gradient: 'from-rose-500 to-pink-600',
    bgGlow: 'bg-rose-500/10',
  },
  {
    title: '쿼리 랩',
    description: 'AI 쿼리 테스트 및 최적화 실험실',
    href: '/query-lab',
    icon: FlaskConical,
    gradient: 'from-cyan-500 to-blue-600',
    bgGlow: 'bg-cyan-500/10',
  },
]

// Mock metrics data
const mockMetrics = {
  totalAnalyses: 247,
  citationShareAvg: 34.8,
  activeProjects: 12,
}

// Mock recent activity data
const mockRecentActivity = [
  {
    id: 1,
    action: 'Strategic Analysis 완료',
    target: 'Tech Brand A',
    timestamp: '5분 전',
    status: 'completed',
  },
  {
    id: 2,
    action: '새 쿼리 생성',
    target: '클라우드 서비스 비교',
    timestamp: '23분 전',
    status: 'completed',
  },
  {
    id: 3,
    action: 'Brand Safety 알림',
    target: '부정 인용 감지',
    timestamp: '1시간 전',
    status: 'warning',
  },
  {
    id: 4,
    action: 'Pipeline 승인 대기',
    target: 'Q1 캠페인 분석',
    timestamp: '2시간 전',
    status: 'pending',
  },
]

// Getting started steps
const gettingStartedSteps = [
  { step: 1, title: '프로필 생성', description: '브랜드 정보 입력' },
  { step: 2, title: '쿼리 생성', description: 'AI 검색 쿼리 설정' },
  { step: 3, title: '결과 분석', description: '인용 데이터 확인' },
]

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <StitchSidebar />

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64">
        {/* Header */}
        <StitchHeader
          title="GEO Sensor"
          showTimeFilter={false}
          onMobileMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {/* Page Content */}
        <main className="p-4 md:p-6 space-y-6">
          {/* Hero Section */}
          <section
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-orange via-orange-500 to-brand-navy p-8 md:p-10 text-white animate-fade-in"
            style={{ animationDelay: '0ms' }}
          >
            {/* Background decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-navy/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
            <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

            <div className="relative z-10">
              {/* Logo and Title */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm border border-white/20 shadow-lg">
                  <svg
                    className="h-8 w-8 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 2L2 7l10 5 10-5-10-5z" />
                    <path d="M2 17l10 5 10-5" />
                    <path d="M2 12l10 5 10-5" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                    GEO Sensor
                  </h1>
                  <p className="text-white/80 text-lg mt-1">
                    AI 응답 분석으로 브랜드 가시성 최적화
                  </p>
                </div>
              </div>

              {/* Key Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                <MetricCard
                  label="Total Analyses"
                  value={mockMetrics.totalAnalyses.toLocaleString()}
                  icon={Activity}
                  trend="+12%"
                />
                <MetricCard
                  label="Citation Share Avg"
                  value={`${mockMetrics.citationShareAvg}%`}
                  icon={Target}
                  trend="+5.2%"
                />
                <MetricCard
                  label="Active Projects"
                  value={mockMetrics.activeProjects.toString()}
                  icon={Sparkles}
                  trend="+3"
                />
              </div>
            </div>
          </section>

          {/* Quick Actions Grid */}
          <section className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Quick Actions</h2>
              <Link
                href={"/dashboard" as any}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                전체 보기
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {featureCards.map((feature, index) => (
                <FeatureCard key={feature.href} feature={feature} index={index} />
              ))}
            </div>
          </section>

          {/* Two Column Layout: Activity + Getting Started */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Recent Activity */}
            <section
              className="lg:col-span-3 animate-fade-in"
              style={{ animationDelay: '200ms' }}
            >
              <Card className="h-full">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    Recent Activity
                  </CardTitle>
                  <Link
                    href={"/activity" as any}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    더보기
                  </Link>
                </CardHeader>
                <CardContent className="space-y-3">
                  {mockRecentActivity.map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))}
                </CardContent>
              </Card>
            </section>

            {/* Getting Started CTA */}
            <section
              className="lg:col-span-2 animate-fade-in"
              style={{ animationDelay: '300ms' }}
            >
              <Card className="h-full bg-gradient-to-br from-muted/50 to-muted border-dashed">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-brand-orange" />
                    Getting Started
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Steps */}
                  <div className="space-y-4">
                    {gettingStartedSteps.map((step, index) => (
                      <div key={step.step} className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-orange/10 text-brand-orange font-bold text-sm">
                          {step.step}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{step.title}</p>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button
                    className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white font-semibold shadow-lg shadow-brand-orange/20"
                    onClick={() => router.push('/analysis')}
                  >
                    첫 분석 시작하기
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}

// Sub-components

interface MetricCardProps {
  label: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  trend: string
}

function MetricCard({ label, value, icon: Icon, trend }: MetricCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <div className="flex items-center justify-between mb-2">
        <Icon className="h-5 w-5 text-white/70" aria-hidden="true" />
        <span className="text-xs font-semibold text-green-300 bg-green-500/20 px-2 py-0.5 rounded-full">
          {trend}
        </span>
      </div>
      <p className="text-2xl md:text-3xl font-bold">{value}</p>
      <p className="text-sm text-white/70 mt-1">{label}</p>
    </div>
  )
}

interface FeatureCardProps {
  feature: (typeof featureCards)[0]
  index: number
}

function FeatureCard({ feature, index }: FeatureCardProps) {
  const Icon = feature.icon

  return (
    <Link
      href={feature.href as any}
      className="group relative overflow-hidden rounded-xl border bg-card p-5 transition-all duration-300 hover:shadow-lg hover:shadow-black/5 hover:-translate-y-1 hover:border-brand-orange/30"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Background glow on hover */}
      <div
        className={cn(
          'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
          feature.bgGlow
        )}
      />

      <div className="relative z-10">
        {/* Icon */}
        <div
          className={cn(
            'inline-flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br text-white mb-4 shadow-lg',
            feature.gradient
          )}
        >
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>

        {/* Content */}
        <h3 className="font-semibold text-foreground group-hover:text-brand-orange transition-colors">
          {feature.title}
        </h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
          {feature.description}
        </p>

        {/* Arrow indicator */}
        <div className="flex items-center gap-1 mt-3 text-sm font-medium text-muted-foreground group-hover:text-brand-orange transition-colors">
          <span>시작하기</span>
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  )
}

interface ActivityItemProps {
  activity: (typeof mockRecentActivity)[0]
}

function ActivityItem({ activity }: ActivityItemProps) {
  const statusConfig = {
    completed: {
      icon: CheckCircle2,
      color: 'text-green-500',
      bg: 'bg-green-500/10',
    },
    warning: {
      icon: AlertCircle,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
    pending: {
      icon: Clock,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
  }

  const config = statusConfig[activity.status as keyof typeof statusConfig]
  const StatusIcon = config.icon

  return (
    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className={cn('p-2 rounded-lg', config.bg)}>
        <StatusIcon className={cn('h-4 w-4', config.color)} aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {activity.action}
        </p>
        <p className="text-xs text-muted-foreground truncate">{activity.target}</p>
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {activity.timestamp}
      </span>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar placeholder - fixed position like StitchSidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:left-0 md:z-50 md:block md:w-64 border-r bg-card" />

      {/* Main content skeleton - same margin as main content */}
      <div className="flex-1 md:ml-64">
        {/* Header skeleton */}
        <div className="h-16 border-b bg-card" />

        {/* Content skeleton */}
        <div className="p-4 md:p-6 space-y-6">
          {/* Hero skeleton */}
          <div className="h-72 rounded-2xl bg-muted animate-pulse" />

          {/* Grid skeleton */}
          <div className="space-y-4">
            <div className="h-6 w-32 bg-muted animate-pulse rounded" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-40 rounded-xl bg-muted animate-pulse" />
              ))}
            </div>
          </div>

          {/* Two column skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 h-64 rounded-lg bg-muted animate-pulse" />
            <div className="lg:col-span-2 h-64 rounded-lg bg-muted animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
