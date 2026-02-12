'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { cn } from '@/lib/utils'

interface NavItem {
  id: string
  label: string
}

const NAV_ITEMS: NavItem[] = [
  { id: 'features', label: '기능' },
  { id: 'providers', label: '분석 모델' },
  { id: 'case-studies', label: '도입 효과' },
  { id: 'faq', label: 'FAQ' },
]

export function NavigationHeader() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeId, setActiveId] = useState<string>('features')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const scrollRafRef = useRef<number | null>(null)
  const mobileMenuPanelId = 'landing-mobile-nav'

  useEffect(() => {
    const updateScrolledState = () => {
      setIsScrolled(window.scrollY > 50)
    }

    const handleScroll = () => {
      if (scrollRafRef.current !== null) return
      scrollRafRef.current = window.requestAnimationFrame(() => {
        updateScrolledState()
        scrollRafRef.current = null
      })
    }

    updateScrolledState()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      if (scrollRafRef.current !== null) {
        window.cancelAnimationFrame(scrollRafRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const sectionElements = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(
      (section): section is HTMLElement => Boolean(section)
    )
    if (!sectionElements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id)
        }
      },
      { threshold: [0.2, 0.45, 0.7], rootMargin: '-80px 0px -45% 0px' }
    )

    sectionElements.forEach((section) => observer.observe(section))
    return () => {
      sectionElements.forEach((section) => observer.unobserve(section))
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!isMobileMenuOpen) return
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isMobileMenuOpen])

  const baseClass = useMemo(
    () =>
      cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        isScrolled
          ? 'border-b border-border bg-card/95 shadow-sm backdrop-blur-md'
          : 'border-b border-transparent bg-card/80 backdrop-blur-sm'
      ),
    [isScrolled]
  )

  const handleScrollTo = (id: string) => {
    const section = document.getElementById(id)
    if (!section) return
    section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setIsMobileMenuOpen(false)
  }

  return (
    <header className={baseClass}>
      <div className="mx-auto flex h-14 w-full max-w-[1440px] items-center justify-between px-4 md:h-16 md:px-6">
        <Link href="/" className="text-sm font-bold tracking-tight text-brand-navy md:text-base">
          GEO Sensor
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-current={activeId === item.id ? 'page' : undefined}
              onClick={() => handleScrollTo(item.id)}
              className={cn(
                'relative text-sm font-medium text-muted-foreground transition-colors hover:text-brand-navy',
                activeId === item.id && 'font-semibold text-brand-navy'
              )}
            >
              {item.label}
              {activeId === item.id && <span className="absolute -bottom-2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-brand-navy" />}
            </button>
          ))}
        </nav>

        <ThemeToggle />

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost" className="rounded-full text-foreground hover:text-brand-navy">
            <Link href="/login">로그인</Link>
          </Button>
          <Button
            asChild
            className="rounded-full bg-brand-orange text-white hover:bg-brand-orange-hover"
          >
            <Link href="/register">무료 시작하기</Link>
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground md:hidden"
          aria-label={isMobileMenuOpen ? '모바일 메뉴 닫기' : '모바일 메뉴 열기'}
          aria-haspopup="menu"
          aria-controls={mobileMenuPanelId}
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        >
          {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div
          id={mobileMenuPanelId}
          role="menu"
          aria-label="모바일 네비게이션 메뉴"
          className="border-t border-border bg-card/95 px-4 py-4 md:hidden"
        >
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="menuitem"
                className={cn(
                  'rounded-lg px-3 py-2 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted hover:text-brand-navy',
                  activeId === item.id && 'bg-muted text-brand-navy'
                )}
                onClick={() => handleScrollTo(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/login">로그인</Link>
            </Button>
            <Button asChild className="rounded-full bg-brand-orange text-white hover:bg-brand-orange-hover">
              <Link href="/register">무료 시작</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
