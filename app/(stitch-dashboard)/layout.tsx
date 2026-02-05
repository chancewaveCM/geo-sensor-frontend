'use client'

import { StitchSidebar, StitchHeader } from '@/components/stitch'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// Map pathname to title
const titleMap: Record<string, string> = {
  '/dashboard/strategic': 'Strategic GEO Performance Analysis',
  '/dashboard/brand-safety': 'Brand Safety & Risk Control Center',
  '/dashboard/pipeline': 'Global GEO Pipeline & Approval Workflow',
  '/dashboard/roi': 'Enterprise ROI & Settlement Hub',
}

export default function StitchDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Auth protection - redirect to login if not authenticated
  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('access_token='))
      ?.split('=')[1]

    if (!token) {
      const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}` as any
      router.push(loginUrl)
    }
  }, [pathname, router])

  const title = titleMap[pathname] || 'Dashboard'

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <StitchSidebar />

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64">
        {/* Header */}
        <StitchHeader
          title={title}
          onMobileMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {/* Page Content */}
        <main className="min-h-[calc(100vh-4rem)] p-4 md:p-6">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
