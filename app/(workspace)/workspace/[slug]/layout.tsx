'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useWorkspaces } from '@/lib/hooks/use-workspaces'
import { WorkspaceSidebar } from '@/components/workspace/WorkspaceSidebar'

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams()
  const slug = params.slug as string
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  const { data: workspaces, isLoading, isError } = useWorkspaces()
  const workspace = workspaces?.find((w) => w.slug === slug)

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-orange border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading workspace...</p>
        </div>
      </div>
    )
  }

  if (isError || !workspace) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="rounded-full bg-destructive/10 p-4">
            <svg
              className="h-8 w-8 text-destructive"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-foreground">Workspace not found</h2>
          <p className="text-sm text-muted-foreground">
            The workspace &quot;{slug}&quot; does not exist or you don&apos;t have access.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <WorkspaceSidebar
        slug={slug}
        workspaceName={workspace.name}
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className={cn('flex-1', 'md:pl-64')}>
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-foreground">
              {workspace.name}
            </h2>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-6">
          <div className="animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  )
}
