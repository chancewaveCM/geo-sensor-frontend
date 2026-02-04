'use client'

import { Bell, User } from 'lucide-react'

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex h-16 items-center justify-between px-6">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            대시보드
          </h1>
          <p className="text-sm text-muted-foreground">
            다시 오신 것을 환영합니다! 성과 개요입니다.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative rounded-full p-2 transition-colors hover:bg-accent">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              3
            </span>
          </button>

          {/* User Profile */}
          <button className="flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1.5 transition-colors hover:bg-accent">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white">
              <User className="h-4 w-4" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium">데모 사용자</p>
              <p className="text-xs text-muted-foreground">관리자</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}
