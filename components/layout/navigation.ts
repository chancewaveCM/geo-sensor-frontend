import {
  Home,
  LayoutDashboard,
  BarChart3,
  Shield,
  GitBranch,
  DollarSign,
  LineChart,
  FlaskConical,
  Settings,
} from 'lucide-react'
import type { NavSection, BreadcrumbItem } from './types'

export const navigationSections: NavSection[] = [
  {
    title: 'OVERVIEW',
    items: [
      { title: '홈', href: '/', icon: Home },
      { title: '대시보드', href: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'ANALYSIS',
    items: [
      { title: 'Strategic Analysis', href: '/dashboard/strategic', icon: BarChart3 },
      { title: 'Brand Safety', href: '/dashboard/brand-safety', icon: Shield },
      { title: 'Pipeline', href: '/dashboard/pipeline', icon: GitBranch, badge: '3' },
      { title: 'ROI Hub', href: '/dashboard/roi', icon: DollarSign },
    ],
  },
  {
    title: 'TOOLS',
    items: [
      { title: '분석', href: '/analysis', icon: LineChart },
      { title: '쿼리 랩', href: '/query-lab', icon: FlaskConical },
    ],
  },
  {
    title: 'SETTINGS',
    items: [
      { title: '설정', href: '/settings', icon: Settings },
    ],
  },
]

/** Route-based configuration for title and breadcrumbs */
export const routeConfig: Record<string, { title: string; breadcrumbs: BreadcrumbItem[] }> = {
  '/dashboard': {
    title: '대시보드',
    breadcrumbs: [{ label: 'Overview' }, { label: '대시보드' }],
  },
  '/dashboard/strategic': {
    title: 'Strategic GEO Performance Analysis',
    breadcrumbs: [{ label: 'Analysis' }, { label: 'Strategic' }],
  },
  '/dashboard/brand-safety': {
    title: 'Brand Safety & Risk Control Center',
    breadcrumbs: [{ label: 'Analysis' }, { label: 'Brand Safety' }],
  },
  '/dashboard/pipeline': {
    title: 'Global GEO Pipeline & Approval Workflow',
    breadcrumbs: [{ label: 'Analysis' }, { label: 'Pipeline' }],
  },
  '/dashboard/roi': {
    title: 'Enterprise ROI & Settlement Hub',
    breadcrumbs: [{ label: 'Analysis' }, { label: 'ROI Hub' }],
  },
  '/analysis': {
    title: '분석',
    breadcrumbs: [{ label: 'Tools' }, { label: '분석' }],
  },
  '/query-lab': {
    title: '쿼리 랩',
    breadcrumbs: [{ label: 'Tools' }, { label: '쿼리 랩' }],
  },
  '/settings': {
    title: '설정',
    breadcrumbs: [{ label: 'Settings' }],
  },
}
