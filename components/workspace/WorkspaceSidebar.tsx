'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Megaphone, Settings, ChevronRight, X, Layers, Play, Search, Image, GitCompareArrows, ClipboardList } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WorkspaceSidebarProps {
  slug: string
  workspaceName: string
  isOpen?: boolean
  onClose?: () => void
}

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

interface NavSection {
  title: string
  items: NavItem[]
}

function getNavSections(slug: string, pathname: string): NavSection[] {
  const sections: NavSection[] = [
    {
      title: '워크스페이스',
      items: [
        {
          title: '개요',
          href: `/workspace/${slug}`,
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: '캠페인',
      items: [
        {
          title: '전체 캠페인',
          href: `/workspace/${slug}/campaigns`,
          icon: Megaphone,
        },
      ],
    },
  ]

  // Check if we're in a campaign route
  const campaignMatch = pathname.match(/\/workspace\/[^/]+\/campaigns\/([^/]+)/)
  if (campaignMatch) {
    const campaignId = campaignMatch[1]
    sections.push({
      title: '캠페인 상세',
      items: [
        {
          title: '대시보드',
          href: `/workspace/${slug}/campaigns/${campaignId}`,
          icon: LayoutDashboard,
        },
        {
          title: '실행',
          href: `/workspace/${slug}/campaigns/${campaignId}/runs`,
          icon: Play,
        },
        {
          title: '쿼리',
          href: `/workspace/${slug}/campaigns/${campaignId}/queries`,
          icon: Search,
        },
        {
          title: '갤러리',
          href: `/workspace/${slug}/campaigns/${campaignId}/gallery`,
          icon: Image,
        },
        {
          title: '비교',
          href: `/workspace/${slug}/campaigns/${campaignId}/gallery/compare`,
          icon: GitCompareArrows,
        },
        {
          title: '작업',
          href: `/workspace/${slug}/campaigns/${campaignId}/operations`,
          icon: ClipboardList,
        },
      ],
    })
  }

  sections.push({
    title: '도구',
    items: [
      {
        title: '설정',
        href: `/workspace/${slug}/settings`,
        icon: Settings,
      },
    ],
  })

  return sections
}

export function WorkspaceSidebar({
  slug,
  workspaceName,
  isOpen = false,
  onClose,
}: WorkspaceSidebarProps) {
  const pathname = usePathname()
  const sections = getNavSections(slug, pathname)

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen w-64 flex-shrink-0 border-r border-border bg-card transition-transform duration-300 ease-in-out md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        role="navigation"
        aria-label="워크스페이스 내비게이션"
      >
        <div className="flex h-full flex-col">
          {/* Workspace Header */}
          <div className="flex h-16 items-center gap-3 border-b border-border px-6">
            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-muted-foreground transition-colors hover:bg-accent md:hidden"
              aria-label="메뉴 닫기"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange">
              <Layers className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-base font-bold leading-tight text-foreground">
                {workspaceName}
              </h1>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                워크스페이스
              </p>
            </div>
          </div>

          {/* Navigation Sections */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            {sections.map((section, sectionIndex) => (
              <div
                key={sectionIndex}
                className={cn(sectionIndex > 0 && 'mt-6 pt-4 border-t border-border/50')}
              >
                <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                  {section.title}
                </p>
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon

                    return (
                      <Link
                        key={item.href}
                        href={item.href as any}
                        onClick={onClose}
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

          {/* Back to Home */}
          <div className="border-t border-border p-4">
            <Link
              href="/dashboard"
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <LayoutDashboard className="h-5 w-5" aria-hidden="true" />
              <span>홈으로</span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  )
}
