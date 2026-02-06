'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { AppSidebar } from './AppSidebar'
import { AppHeader } from './AppHeader'
import { ProfileCheckProvider } from '@/components/profile/ProfileCheckProvider'
import { cn } from '@/lib/utils'
import { routeConfig } from './navigation'
import type { AppShellProps } from './types'

export function AppShell({
  showSidebar = true,
  showHeader = true,
  headerVariant = 'default',
  sidebarVariant = 'full',
  title,
  breadcrumbs,
  showTimeFilter = false,
  onTimeRangeChange,
  requireProfileCheck = false,
  className,
  contentPadding = 'p-4 md:p-6',
  children,
}: AppShellProps) {
  const pathname = usePathname()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // Resolve title and breadcrumbs from route config if not explicitly provided
  const config = routeConfig[pathname]
  const resolvedTitle = title ?? config?.title ?? 'GEO Sensor'
  const resolvedBreadcrumbs = breadcrumbs ?? config?.breadcrumbs ?? []

  const hasSidebar = showSidebar && sidebarVariant !== 'none'
  const hasHeader = showHeader && headerVariant !== 'none'

  const content = (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      {hasSidebar && (
        <AppSidebar
          variant={sidebarVariant}
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className={cn('flex-1', hasSidebar && 'md:pl-64')}>
        {/* Header */}
        {hasHeader && (
          <AppHeader
            variant={headerVariant}
            title={resolvedTitle}
            breadcrumbs={resolvedBreadcrumbs}
            showTimeFilter={showTimeFilter}
            onTimeRangeChange={onTimeRangeChange}
            onMobileMenuToggle={() => setIsMobileSidebarOpen((prev) => !prev)}
          />
        )}

        {/* Page Content */}
        <main className={cn(contentPadding, className)}>
          <div className="animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  )

  if (requireProfileCheck) {
    return <ProfileCheckProvider>{content}</ProfileCheckProvider>
  }

  return content
}
