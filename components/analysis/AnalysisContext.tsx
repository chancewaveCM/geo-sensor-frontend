'use client'

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

type AnalysisTab = 'quick' | 'advanced' | 'history'
type AnalysisPhase = 'setup' | 'progress' | 'results'

interface QuickState {
  phase: AnalysisPhase
  jobId: number | null
}

interface AdvancedState {
  phase: AnalysisPhase
  jobId: number | null
}

interface HistoryState {
  selectedJobId: number | null
}

interface AnalysisContextValue {
  activeTab: AnalysisTab
  setActiveTab: (tab: AnalysisTab) => void
  quickState: QuickState
  setQuickState: React.Dispatch<React.SetStateAction<QuickState>>
  advancedState: AdvancedState
  setAdvancedState: React.Dispatch<React.SetStateAction<AdvancedState>>
  historyState: HistoryState
  setHistoryState: React.Dispatch<React.SetStateAction<HistoryState>>
}

const AnalysisContext = createContext<AnalysisContextValue | undefined>(undefined)

const validTabs: AnalysisTab[] = ['quick', 'advanced', 'history']

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Read initial tab from URL, default to 'quick'
  const rawTab = searchParams.get('tab')
  const tabFromUrl: AnalysisTab = rawTab && validTabs.includes(rawTab as AnalysisTab)
    ? (rawTab as AnalysisTab)
    : 'quick'
  const [activeTab, setActiveTabState] = useState<AnalysisTab>(tabFromUrl)

  const [quickState, setQuickState] = useState<QuickState>({
    phase: 'setup',
    jobId: null,
  })

  const [advancedState, setAdvancedState] = useState<AdvancedState>({
    phase: 'setup',
    jobId: null,
  })

  const [historyState, setHistoryState] = useState<HistoryState>({
    selectedJobId: null,
  })

  // Sync activeTab with URL
  const setActiveTab = useCallback(
    (tab: AnalysisTab) => {
      setActiveTabState(tab)
      const params = new URLSearchParams(searchParams.toString())
      params.set('tab', tab)
      router.replace(`/analysis?${params.toString()}`, { scroll: false })
    },
    [router, searchParams]
  )

  // Listen to URL changes (back/forward navigation)
  useEffect(() => {
    const rawTab = searchParams.get('tab')
    const newTab: AnalysisTab = rawTab && validTabs.includes(rawTab as AnalysisTab)
      ? (rawTab as AnalysisTab)
      : 'quick'
    if (newTab !== activeTab) {
      setActiveTabState(newTab)
    }
  }, [searchParams, activeTab])

  const value = useMemo<AnalysisContextValue>(() => ({
    activeTab,
    setActiveTab,
    quickState,
    setQuickState,
    advancedState,
    setAdvancedState,
    historyState,
    setHistoryState,
  }), [activeTab, setActiveTab, quickState, advancedState, historyState])

  return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>
}

export function useAnalysis() {
  const context = useContext(AnalysisContext)
  if (!context) {
    throw new Error('useAnalysis must be used within AnalysisProvider')
  }
  return context
}
