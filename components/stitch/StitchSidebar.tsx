'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
  Menu,
  X,
  User,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

interface NavSection {
  title?: string
  items: NavItem[]
}

const navigationSections: NavSection[] = [
  {
    title: 'OVERVIEW',
    items: [
      {
        title: '홈',
        href: '/',
        icon: Home,
      },
      {
        title: '대시보드',
        href: '/dashboard',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: 'ANALYSIS',
    items: [
      {
        title: 'Strategic Analysis',
        href: '/dashboard/strategic',
        icon: BarChart3,
      },
      {
        title: 'Brand Safety',
        href: '/dashboard/brand-safety',
        icon: Shield,
      },
      {
        title: 'Pipeline',
        href: '/dashboard/pipeline',
        icon: GitBranch,
        badge: '3',
      },
      {
        title: 'ROI Hub',
        href: '/dashboard/roi',
        icon: DollarSign,
      },
    ],
  },
  {
    title: 'TOOLS',
    items: [
      {
        title: '분석',
        href: '/analysis',
        icon: LineChart,
      },
      {
        title: '쿼리 랩',
        href: '/query-lab',
        icon: FlaskConical,
      },
    ],
  },
  {
    title: 'SETTINGS',
    items: [
      {
        title: '설정',
        href: '/settings',
        icon: Settings,
      },
    ],
  },
]

interface StitchSidebarProps {
  className?: string
}

export function StitchSidebar({ className }: StitchSidebarProps) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const closeSidebar = () => setIsOpen(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 rounded-lg bg-card p-2 shadow-lg transition-colors hover:bg-card-hover md:hidden"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-foreground" />
        ) : (
          <Menu className="h-6 w-6 text-foreground" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen w-64 flex-shrink-0 border-r border-border bg-card transition-transform duration-300 ease-in-out md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          className
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex h-full flex-col">
          {/* Logo Area */}
          <div className="flex h-16 items-center gap-3 border-b border-border px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange">
              <svg
                className="h-6 w-6 text-white"
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
              <h1 className="text-base font-bold leading-tight text-foreground">
                GEO Sensor
              </h1>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Strategic Analysis
              </p>
            </div>
          </div>

          {/* Navigation Sections */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {navigationSections.map((section, sectionIndex) => (
              <div key={sectionIndex} className={cn(sectionIndex > 0 && 'mt-6 pt-4 border-t border-border/50')}>
                {section.title && (
                  <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                    {section.title}
                  </p>
                )}
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon

                    return (
                      <Link
                        key={item.href}
                        href={item.href as any}
                        onClick={closeSidebar}
                        className={cn(
                          'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                          isActive
                            ? 'border-l-4 border-l-brand-orange bg-brand-orange/10 text-brand-orange'
                            : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                        )}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <Icon
                          className={cn(
                            'h-5 w-5 flex-shrink-0 transition-colors',
                            isActive && 'fill-current opacity-100'
                          )}
                          aria-hidden="true"
                        />
                        <span className="flex-1">{item.title}</span>
                        {item.badge && (
                          <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-brand-orange px-1.5 text-[10px] font-bold text-white">
                            {item.badge}
                          </span>
                        )}
                        {!isActive && (
                          <ChevronRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* User Profile Section */}
          <div className="border-t border-border p-4">
            <button
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="User menu"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-orange to-brand-navy">
                <User className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-semibold text-foreground">
                  Alex Strategist
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  Pro Account
                </p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
