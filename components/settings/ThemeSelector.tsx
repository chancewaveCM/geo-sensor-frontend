'use client'

import { useTheme } from 'next-themes'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Monitor, Moon, Sun } from 'lucide-react'

const themes = [
  { id: 'light', label: '라이트', icon: Sun, description: '밝은 테마' },
  { id: 'dark', label: '다크', icon: Moon, description: '어두운 테마' },
  { id: 'system', label: '시스템', icon: Monitor, description: '시스템 설정에 따름' },
] as const

export function ThemeSelector() {
  const { theme, setTheme } = useTheme()

  return (
    <Card>
      <CardHeader>
        <CardTitle>외관</CardTitle>
        <CardDescription>앱의 테마를 설정합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          {themes.map(({ id, label, icon: Icon, description }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTheme(id)}
              className={cn(
                'flex flex-col items-center gap-3 rounded-lg border-2 p-6 transition-all',
                theme === id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              )}
            >
              <Icon className={cn('h-8 w-8', theme === id ? 'text-primary' : 'text-muted-foreground')} />
              <div className="text-center">
                <p className="text-sm font-medium">{label}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
