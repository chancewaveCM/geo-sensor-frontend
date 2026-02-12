'use client'

import { useParams, usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Play, Search, Image, ClipboardList, Settings } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { CampaignSwitcher } from '@/components/workspace/CampaignSwitcher'
import { cn } from '@/lib/utils'

export default function CampaignDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams()
  const pathname = usePathname()
  const slug = params?.slug as string
  const campaignId = params?.campaignId as string

  const basePath = `/workspace/${slug}/campaigns/${campaignId}`

  const tabs = [
    { label: '대시보드', icon: LayoutDashboard, href: basePath, exact: true },
    { label: '실행', icon: Play, href: `${basePath}/runs` },
    { label: '쿼리', icon: Search, href: `${basePath}/queries` },
    { label: '갤러리', icon: Image, href: `${basePath}/gallery` },
    { label: '작업', icon: ClipboardList, href: `${basePath}/operations` },
    { label: '설정', icon: Settings, href: `${basePath}/settings` },
  ]

  // Active tab detection
  const isTabActive = (tab: typeof tabs[0]) => {
    if (tab.exact) return pathname === tab.href
    return pathname.startsWith(tab.href)
  }

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href={`/workspace/${slug}/campaigns`}>캠페인 목록</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <CampaignSwitcher slug={slug} campaignId={campaignId} />
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Tab Bar */}
      <div className="border-b border-border">
        <nav className="-mb-px flex space-x-1 overflow-x-auto scrollbar-hide" aria-label="캠페인 탭">
          {tabs.map((tab) => {
            const active = isTabActive(tab)
            const Icon = tab.icon
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors',
                  active
                    ? 'border-brand-orange text-brand-orange'
                    : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
                )}
                aria-current={active ? 'page' : undefined}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Page Content */}
      {children}
    </div>
  )
}
