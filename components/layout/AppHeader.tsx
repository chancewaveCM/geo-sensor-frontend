'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bell, Calendar, LogOut, Menu, Settings, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { Breadcrumbs } from './Breadcrumbs'
import type { AppHeaderProps, TimeRange } from './types'

export function AppHeader({
  title,
  breadcrumbs = [],
  showTimeFilter = false,
  onTimeRangeChange,
  notificationCount = 0,
  onMobileMenuToggle,
  variant = 'default',
}: AppHeaderProps) {
  const [activeRange, setActiveRange] = useState<TimeRange>('30d')

  if (variant === 'none') return null

  const handleRangeChange = (range: TimeRange) => {
    setActiveRange(range)
    onTimeRangeChange?.(range)
  }

  const showBreadcrumbs = variant === 'default' && breadcrumbs.length > 0

  return (
    <header className="sticky top-0 z-10 h-16 border-b bg-card/80 backdrop-blur-md supports-[backdrop-filter]:bg-card/80">
      <div className="flex h-full items-center justify-between px-4 md:px-8">
        {/* Left: Mobile menu + Title with breadcrumb */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            onClick={onMobileMenuToggle}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/50 md:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Title and breadcrumb */}
          <div>
            {showBreadcrumbs && <Breadcrumbs items={breadcrumbs} />}
            {title && (
              <h1 className="text-lg font-bold tracking-tight text-foreground md:text-xl">
                {title}
              </h1>
            )}
          </div>
        </div>

        {/* Right: Time filter + Notifications + User menu */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Time range filter - segmented buttons */}
          {showTimeFilter && variant === 'default' && (
            <div className="hidden rounded-lg bg-muted p-1 sm:flex">
              {(['7d', '30d', '90d'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => handleRangeChange(range)}
                  className={cn(
                    'rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 md:px-4',
                    activeRange === range
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-card/50 hover:text-foreground'
                  )}
                  aria-label={`${range.replace('d', '')} day view`}
                  aria-pressed={activeRange === range}
                >
                  {range.toUpperCase()}
                </button>
              ))}
              <button
                onClick={() => handleRangeChange('custom')}
                className={cn(
                  'flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 md:px-4',
                  activeRange === 'custom'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-card/50 hover:text-foreground'
                )}
                aria-label="Custom date range"
                aria-pressed={activeRange === 'custom'}
              >
                Custom <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>
          )}

          {/* Notifications */}
          <button
            className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-error text-[10px] font-bold text-white">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>

          {/* User menu dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center gap-2 rounded-full border bg-card px-2 py-1.5 transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label="User menu"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-navy to-brand-orange text-white">
                  <User className="h-4 w-4" />
                </div>
                <div className="hidden text-left lg:block">
                  <p className="text-sm font-medium leading-tight">Alex Strategist</p>
                  <p className="text-xs text-muted-foreground leading-tight">Pro Account</p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>내 계정</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>프로필</span>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>설정</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>로그아웃</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
