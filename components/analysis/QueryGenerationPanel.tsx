'use client'

import { useEffect, useCallback, useRef } from 'react'
import { Loader2, Sparkles } from 'lucide-react'
import { post } from '@/lib/api-client'
import type { CompanyProfile, GeneratedQuery } from '@/types/analysis'

interface QueryGenerationPanelProps {
  companyProfile: CompanyProfile
  isGenerating: boolean
  setIsGenerating: (value: boolean) => void
  onComplete: (queries: GeneratedQuery[]) => void
}

export function QueryGenerationPanel({
  companyProfile,
  isGenerating,
  setIsGenerating,
  onComplete,
}: QueryGenerationPanelProps) {
  // 무한 루프 방지: ref로 한 번만 실행되도록 보장
  const hasStartedRef = useRef(false)

  // useCallback으로 콜백 함수들 안정화
  const stableSetIsGenerating = useCallback(setIsGenerating, [])
  const stableOnComplete = useCallback(onComplete, [])

  useEffect(() => {
    // 이미 시작했으면 다시 실행하지 않음
    if (hasStartedRef.current) return
    hasStartedRef.current = true

    async function generateQueries() {
      stableSetIsGenerating(true)
      try {
        const queries = await post<GeneratedQuery[]>('/api/v1/generated-queries/generate', {
          company_profile_id: companyProfile.id,
        })
        stableOnComplete(queries)
      } catch (error) {
        console.error('Failed to generate queries:', error)
        stableSetIsGenerating(false)
      }
    }

    generateQueries()
  }, [companyProfile.id, stableSetIsGenerating, stableOnComplete])

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="relative">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <Sparkles className="h-6 w-6 text-warning absolute -top-1 -right-1 animate-pulse" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">AI가 질문을 생성하고 있습니다</h3>
        <p className="text-muted-foreground">
          {companyProfile.name}에 대한 30개의 분석 질문을 생성 중입니다...
        </p>
        <p className="text-sm text-muted-foreground">
          잠시만 기다려주세요 (약 10-30초 소요)
        </p>
      </div>
    </div>
  )
}
