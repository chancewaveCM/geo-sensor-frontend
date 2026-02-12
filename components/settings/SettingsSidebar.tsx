'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  User,
  Lock,
  Palette,
  Bell,
  Building2,
  Users,
  Briefcase,
  AlertTriangle,
  Share2,
  ArrowLeft,
} from 'lucide-react'

const settingsNav = [
  { label: '내 프로필', href: '/settings/profile', icon: User },
  { label: '비밀번호 변경', href: '/settings/password', icon: Lock },
  { label: '외관', href: '/settings/appearance', icon: Palette },
  { label: '알림', href: '/settings/notifications', icon: Bell },
  { type: 'separator' as const, label: '워크스페이스' },
  { label: '일반', href: '/settings/workspace', icon: Building2 },
  { label: '멤버', href: '/settings/members', icon: Users },
  { label: '기업 프로필', href: '/settings/company-profiles', icon: Briefcase },
  { label: '소셜 연동', href: '/settings/social', icon: Share2 },
  { type: 'separator' as const, label: '계정' },
  { label: '계정 삭제', href: '/settings/account', icon: AlertTriangle },
] as const

type NavItem = { label: string; href: string; icon: React.ElementType } | { type: 'separator'; label: string }

export function SettingsSidebar() {
  const pathname = usePathname()

  return (
    <nav className="w-56 shrink-0">
      <div className="sticky top-6 space-y-1">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 mb-4 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent/50"
        >
          <ArrowLeft className="h-4 w-4" />
          대시보드
        </Link>
        <h2 className="mb-4 text-lg font-semibold">설정</h2>
        {(settingsNav as readonly NavItem[]).map((item, index) => {
          if ('type' in item && item.type === 'separator') {
            return (
              <div key={index} className="pt-4 pb-1">
                <span className="px-3 text-xs font-medium uppercase text-muted-foreground">
                  {item.label}
                </span>
              </div>
            )
          }

          if (!('href' in item)) return null
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href as never}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-accent text-accent-foreground font-medium'
                  : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
