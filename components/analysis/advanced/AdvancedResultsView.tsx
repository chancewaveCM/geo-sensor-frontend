'use client'

import { useEffect, useState } from 'react'
import { ResultsBrowser } from '@/components/analysis/shared/ResultsBrowser'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Play, Loader2 } from 'lucide-react'
import { getJobCategories } from '@/lib/api/analysis'
import type { PipelineCategory } from '@/types/pipeline'
import { cn } from '@/lib/utils'

interface AdvancedResultsViewProps {
  jobId: number
  onBack: () => void
  onNewAnalysis: () => void
  className?: string
}

export function AdvancedResultsView({
  jobId,
  onBack,
  onNewAnalysis,
  className,
}: AdvancedResultsViewProps) {
  const [categories, setCategories] = useState<PipelineCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true)
        const { categories } = await getJobCategories(jobId)
        setCategories(categories)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : '카테고리를 불러오는데 실패했습니다')
      } finally {
        setIsLoading(false)
      }
    }

    loadCategories()
  }, [jobId])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <ResultsBrowser
        jobId={jobId}
        categories={categories}
      />

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={onBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          뒤로
        </Button>

        <Button
          onClick={onNewAnalysis}
        >
          <Play className="mr-2 h-4 w-4" />
          새 분석 시작
        </Button>
      </div>
    </div>
  )
}
