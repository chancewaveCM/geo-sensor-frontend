'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FolderKanban,
  FlaskConical,
  Settings,
  Menu,
  X,
  Zap,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const navItems: Array<{
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}> = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    title: 'Projects',
    href: '/projects',
    icon: FolderKanban,
  },
  {
    title: 'Query Lab',
    href: '/query-lab',
    icon: FlaskConical,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 rounded-lg bg-card p-2 shadow-lg lg:hidden"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen w-64 border-r bg-card transition-transform lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 border-b px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">GEO Sensor</h2>
              <p className="text-xs text-muted-foreground">MVP Dashboard</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href as any}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                  {isActive && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-primary-foreground" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="border-t p-4">
            <div className="rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-4">
              <p className="text-xs font-medium">Need Help?</p>
              <p className="text-xs text-muted-foreground mt-1">
                Check out our documentation
              </p>
              <button className="mt-3 w-full rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                View Docs
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
