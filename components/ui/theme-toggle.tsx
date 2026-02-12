'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button
        className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/50"
        aria-label="Toggle theme"
        disabled
      >
        <Monitor className="h-5 w-5" />
      </button>
    )
  }

  const cycleTheme = () => {
    if (theme === 'system') {
      setTheme('light')
    } else if (theme === 'light') {
      setTheme('dark')
    } else {
      setTheme('system')
    }
  }

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-5 w-5" />
      case 'dark':
        return <Moon className="h-5 w-5" />
      default:
        return <Monitor className="h-5 w-5" />
    }
  }

  const getTitle = () => {
    switch (theme) {
      case 'light':
        return 'Light mode (click for dark)'
      case 'dark':
        return 'Dark mode (click for system)'
      default:
        return 'System theme (click for light)'
    }
  }

  return (
    <button
      onClick={cycleTheme}
      className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/50"
      aria-label="Toggle theme"
      title={getTitle()}
    >
      {getIcon()}
    </button>
  )
}
