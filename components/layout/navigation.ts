import {
  Home,
  LayoutDashboard,
  BarChart3,
  Shield,
  GitBranch,
  LineChart,
  Settings,
  Wand2,
} from 'lucide-react'
import type { NavSection, BreadcrumbItem } from './types'

export const navigationSections: NavSection[] = [
  {
    title: '개요',
    items: [
      { title: '홈', href: '/', icon: Home },
      { title: '대시보드', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: '분석',
    items: [
      { title: '전략 분석', href: '/dashboard/strategic', icon: BarChart3 },
      { title: '브랜드 안전성', href: '/dashboard/brand-safety', icon: Shield },
      { title: '파이프라인', href: '/dashboard/pipeline', icon: GitBranch, badge: '3' },
    ],
  },
  {
    title: '도구',
    items: [
      { title: 'AI 분석', href: '/analysis', icon: LineChart },
      { title: '콘텐츠 최적화', href: '/dashboard/content-optimizer', icon: Wand2 },
    ],
  },
  {
    title: '설정',
    items: [
      { title: '설정', href: '/settings', icon: Settings },
    ],
  },
]

/** Route-based configuration for title and breadcrumbs */
export const routeConfig: Record<string, { title: string; breadcrumbs: BreadcrumbItem[] }> = {
  '/dashboard': {
    title: '대시보드',
    breadcrumbs: [{ label: '개요' }, { label: '대시보드' }],
  },
  '/dashboard/strategic': {
    title: '전략 GEO 성과 분석',
    breadcrumbs: [{ label: '분석' }, { label: '전략 분석' }],
  },
  '/dashboard/brand-safety': {
    title: '브랜드 안전성 관리',
    breadcrumbs: [{ label: '분석' }, { label: '브랜드 안전성' }],
  },
  '/dashboard/pipeline': {
    title: 'GEO 파이프라인 관리',
    breadcrumbs: [{ label: '분석' }, { label: '파이프라인' }],
  },
  '/analysis': {
    title: 'AI 분석',
    breadcrumbs: [{ label: '도구' }, { label: 'AI 분석' }],
  },
  '/dashboard/content-optimizer': {
    title: 'GEO 콘텐츠 최적화',
    breadcrumbs: [{ label: '도구' }, { label: '콘텐츠 최적화' }],
  },
  '/settings': {
    title: '설정',
    breadcrumbs: [{ label: '설정' }],
  },
}
