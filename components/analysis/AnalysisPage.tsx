'use client'

import React, { lazy, Suspense } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Zap, Settings2, History } from 'lucide-react'
import { AnalysisProvider, useAnalysis } from './AnalysisContext'
import { PageHeader } from '@/components/shared/PageHeader'
import { cn } from '@/lib/utils'

type AnalysisTab = 'quick' | 'advanced' | 'history'

// Lazy load tab components (they're being created in parallel)
const QuickSetupForm = lazy(() => import('./quick/QuickSetupForm').then(m => ({ default: m.QuickSetupForm })))
const QuickProgressView = lazy(() => import('./quick/QuickProgressView').then(m => ({ default: m.QuickProgressView })))
const QuickResultsView = lazy(() => import('./quick/QuickResultsView').then(m => ({ default: m.QuickResultsView })))

const AdvancedSetupForm = lazy(() => import('./advanced/AdvancedSetupForm').then(m => ({ default: m.AdvancedSetupForm })))
const AdvancedProgressView = lazy(() => import('./advanced/AdvancedProgressView').then(m => ({ default: m.AdvancedProgressView })))
const AdvancedResultsView = lazy(() => import('./advanced/AdvancedResultsView').then(m => ({ default: m.AdvancedResultsView })))

const JobTable = lazy(() => import('./history/JobTable').then(m => ({ default: m.JobTable })))
const JobDetail = lazy(() => import('./history/JobDetail').then(m => ({ default: m.JobDetail })))

function AnalysisPageContent() {
  const {
    activeTab,
    setActiveTab,
    quickState,
    setQuickState,
    advancedState,
    setAdvancedState,
    historyState,
    setHistoryState,
  } = useAnalysis()

  // Quick tab handlers
  const handleQuickStart = (jobId: number) => {
    setQuickState({ phase: 'progress', jobId })
  }

  const handleQuickComplete = () => {
    setQuickState((prev) => ({ ...prev, phase: 'results' }))
  }

  const handleQuickNewAnalysis = () => {
    setQuickState({ phase: 'setup', jobId: null })
  }

  // Advanced tab handlers
  const handleAdvancedStart = (jobId: number) => {
    setAdvancedState({ phase: 'progress', jobId })
  }

  const handleAdvancedComplete = () => {
    setAdvancedState((prev) => ({ ...prev, phase: 'results' }))
  }

  const handleAdvancedNewAnalysis = () => {
    setAdvancedState({ phase: 'setup', jobId: null })
  }

  // History tab handlers
  const handleSelectJob = (jobId: number) => {
    setHistoryState({ selectedJobId: jobId })
  }

  const handleHistoryBack = () => {
    setHistoryState({ selectedJobId: null })
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Page Header */}
      <PageHeader
        title="분석"
        description="AI 응답에서 브랜드 인용을 분석하세요"
      />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(value) => {
        const validTabs: AnalysisTab[] = ['quick', 'advanced', 'history']
        if (validTabs.includes(value as AnalysisTab)) {
          setActiveTab(value as AnalysisTab)
        }
      }}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="quick" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            간편 분석
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Settings2 className="h-4 w-4" />
            고급 분석
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            실행 기록
          </TabsTrigger>
        </TabsList>

        {/* Quick Tab */}
        <TabsContent value="quick" className="mt-6">
          <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
            {quickState.phase === 'setup' && (
              <QuickSetupForm onStart={handleQuickStart} />
            )}
            {quickState.phase === 'progress' && quickState.jobId && (
              <QuickProgressView
                jobId={quickState.jobId}
                onComplete={handleQuickComplete}
                onBack={handleQuickNewAnalysis}
              />
            )}
            {quickState.phase === 'results' && quickState.jobId && (
              <QuickResultsView
                jobId={quickState.jobId}
                onBack={handleQuickNewAnalysis}
                onNewAnalysis={handleQuickNewAnalysis}
              />
            )}
          </Suspense>
        </TabsContent>

        {/* Advanced Tab */}
        <TabsContent value="advanced" className="mt-6">
          <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
            {advancedState.phase === 'setup' && (
              <AdvancedSetupForm onStart={handleAdvancedStart} />
            )}
            {advancedState.phase === 'progress' && advancedState.jobId && (
              <AdvancedProgressView
                jobId={advancedState.jobId}
                onComplete={handleAdvancedComplete}
                onBack={handleAdvancedNewAnalysis}
              />
            )}
            {advancedState.phase === 'results' && advancedState.jobId && (
              <AdvancedResultsView
                jobId={advancedState.jobId}
                onBack={handleAdvancedNewAnalysis}
                onNewAnalysis={handleAdvancedNewAnalysis}
              />
            )}
          </Suspense>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="mt-6">
          <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
            {!historyState.selectedJobId ? (
              <JobTable onSelectJob={handleSelectJob} />
            ) : (
              <JobDetail
                jobId={historyState.selectedJobId}
                onBack={handleHistoryBack}
              />
            )}
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export function AnalysisPage() {
  return (
    <AnalysisProvider>
      <AnalysisPageContent />
    </AnalysisProvider>
  )
}
