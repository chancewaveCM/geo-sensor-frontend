'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bell, Calendar, ChevronRight, LogOut, Menu, Settings, User } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

type TimeRange = '7d' | '30d' | '90d' | 'custom'

interface Breadcrumb {
  label: string
  href?: string
}

interface StitchHeaderProps {
  title: string
  breadcrumb?: Breadcrumb[]
  showTimeFilter?: boolean
  onTimeRangeChange?: (range: TimeRange) => void
  onMobileMenuClick?: () => void
  notificationCount?: number
  userName?: string
  userRole?: string
}

export function StitchHeader({
  title,
  breadcrumb,
  showTimeFilter = true,
  onTimeRangeChange,
  onMobileMenuClick,
  notificationCount = 0,
  userName = 'Alex Strategist',
  userRole = 'Pro Account',
}: StitchHeaderProps) {
  const [activeRange, setActiveRange] = useState<TimeRange>('30d')

  const handleRangeChange = (range: TimeRange) => {
    setActiveRange(range)
    onTimeRangeChange?.(range)
  }

  return (
    <header className="sticky top-0 z-10 h-16 border-b bg-card/80 backdrop-blur-md supports-[backdrop-filter]:bg-card/80">
      <div className="flex h-full items-center justify-between px-4 md:px-8">
        {/* Left: Mobile menu + Title with breadcrumb */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <button
            onClick={onMobileMenuClick}
            className="md:hidden rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Title and breadcrumb */}
          <div>
            {breadcrumb && breadcrumb.length > 0 && (
              <nav aria-label="Breadcrumb" className="mb-1">
                <ol className="flex items-center gap-1 text-xs text-muted-foreground">
                  {breadcrumb.map((item, index) => (
                    <li key={index} className="flex items-center gap-1">
                      {item.href ? (
                        <Link
                          href={item.href as any}
                          className="transition-colors hover:text-foreground"
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <span>{item.label}</span>
                      )}
                      {index < breadcrumb.length - 1 && (
                        <ChevronRight className="h-3 w-3" aria-hidden="true" />
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            )}
            <h1 className="text-lg font-bold tracking-tight text-foreground md:text-xl">
              {title}
            </h1>
          </div>
        </div>

        {/* Right: Time filter + Notifications + User menu */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Time range filter - segmented buttons */}
          {showTimeFilter && (
            <div className="hidden rounded-lg bg-muted p-1 sm:flex">
              <button
                onClick={() => handleRangeChange('7d')}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 md:px-4',
                  activeRange === '7d'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-card/50 hover:text-foreground'
                )}
                aria-label="7 day view"
                aria-pressed={activeRange === '7d'}
              >
                7D
              </button>
              <button
                onClick={() => handleRangeChange('30d')}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 md:px-4',
                  activeRange === '30d'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-card/50 hover:text-foreground'
                )}
                aria-label="30 day view"
                aria-pressed={activeRange === '30d'}
              >
                30D
              </button>
              <button
                onClick={() => handleRangeChange('90d')}
                className={cn(
                  'rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 md:px-4',
                  activeRange === '90d'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-card/50 hover:text-foreground'
                )}
                aria-label="90 day view"
                aria-pressed={activeRange === '90d'}
              >
                90D
              </button>
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
                  <p className="text-sm font-medium leading-tight">{userName}</p>
                  <p className="text-xs text-muted-foreground leading-tight">{userRole}</p>
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
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>설정</span>
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
