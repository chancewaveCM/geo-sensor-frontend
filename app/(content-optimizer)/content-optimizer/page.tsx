'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { PageHeader } from '@/components/shared/PageHeader'
import { ContentInput } from '@/components/content-optimizer/ContentInput'
import { DiagnosisCard } from '@/components/content-optimizer/DiagnosisCard'
import { ScoreBreakdown } from '@/components/content-optimizer/ScoreBreakdown'
import { SentenceHighlighter } from '@/components/content-optimizer/SentenceHighlighter'
import { SuggestionList } from '@/components/content-optimizer/SuggestionList'
import { BeforeAfterCompare } from '@/components/content-optimizer/BeforeAfterCompare'
import {
  analyzeContent,
  type ContentDiagnosis,
  type ContentAnalysisRequest,
} from '@/lib/api/content-optimizer'

type Phase = 'input' | 'analyzing' | 'results'

export default function ContentOptimizerPage() {
  const [phase, setPhase] = useState<Phase>('input')
  const [diagnosis, setDiagnosis] = useState<ContentDiagnosis | null>(null)
  const [originalContent, setOriginalContent] = useState('')
  const [brandName, setBrandName] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async (request: ContentAnalysisRequest) => {
    setOriginalContent(request.content)
    setBrandName(request.brandName)
    setPhase('analyzing')
    setError(null)

    try {
      const result = await analyzeContent(request)
      setDiagnosis(result)
      setPhase('results')
    } catch (err) {
      setError(
        err instanceof Error ? err.message : '콘텐츠 분석 중 오류가 발생했습니다.'
      )
      setPhase('input')
    }
  }

  const handleReset = () => {
    setPhase('input')
    setDiagnosis(null)
    setOriginalContent('')
    setBrandName('')
    setError(null)
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <PageHeader
        title="콘텐츠 최적화"
        description="AI 응답에 더 잘 인용되도록 콘텐츠를 개선하세요"
      />

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTitle>오류</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Phase: Input */}
      {phase === 'input' && <ContentInput onSubmit={handleAnalyze} />}

      {/* Phase: Analyzing */}
      {phase === 'analyzing' && (
        <Card className="p-8">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <div className="text-center">
              <p className="text-lg font-semibold">
                콘텐츠를 분석하고 있습니다...
              </p>
              <p className="text-sm text-muted-foreground">
                AI가 인용 가능성을 평가하고 개선 방안을 찾고 있습니다.
              </p>
            </div>
            <Progress className="w-full max-w-md" value={undefined} />
          </div>
        </Card>
      )}

      {/* Phase: Results */}
      {phase === 'results' && diagnosis && (
        <div className="space-y-6">
          {/* Top Row: Diagnosis + Score Breakdown */}
          <div className="grid gap-6 md:grid-cols-2">
            <DiagnosisCard
              score={diagnosis.overallScore}
              grade={diagnosis.grade}
            />
            <ScoreBreakdown categories={diagnosis.categories} />
          </div>

          {/* Middle: Sentence Highlighter */}
          <SentenceHighlighter
            sentences={diagnosis.sentences}
          />

          {/* Bottom Row: Suggestions + Before/After */}
          <div className="grid gap-6 md:grid-cols-2">
            <SuggestionList suggestions={diagnosis.suggestions} />
            {diagnosis.improvedContent && (
              <BeforeAfterCompare
                originalContent={originalContent}
                improvedContent={diagnosis.improvedContent}
                originalScore={diagnosis.overallScore}
                improvedScore={Math.min(100, diagnosis.overallScore + 15)}
              />
            )}
          </div>

          {/* Reset Button */}
          <div className="flex justify-center">
            <Button onClick={handleReset} variant="outline" size="lg">
              다시 분석하기
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
