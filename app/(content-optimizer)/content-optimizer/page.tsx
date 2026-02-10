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
  compareContent,
  suggestImprovements,
  type CompareResult,
  type ContentAnalysisRequest,
  type DiagnosisItem,
  type DiagnosisResult,
  type SuggestResult,
} from '@/lib/api/content-optimizer'

type Phase = 'input' | 'analyzing' | 'results'

type Grade = 'A' | 'B' | 'C' | 'D' | 'F'

interface ScoreCategory {
  name: string
  score: number
  maxScore: number
  description: string
}

interface SentenceScore {
  text: string
  score: number
  issues: string[]
  suggestions: string[]
}

interface UISuggestion {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  category: string
  impact?: string
}

function getGrade(score: number): Grade {
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'
  return 'F'
}

function toScoreCategories(result: DiagnosisResult): ScoreCategory[] {
  const score = result.citation_score
  return [
    {
      name: '브랜드 언급',
      score: score.brand_mention_score,
      maxScore: 100,
      description: '콘텐츠에서 브랜드가 명확히 드러나는 정도',
    },
    {
      name: '신뢰도/권위',
      score: score.authority_score,
      maxScore: 100,
      description: '근거 데이터, 출처, 전문성의 충실도',
    },
    {
      name: '구조화',
      score: score.structure_score,
      maxScore: 100,
      description: 'AI가 파싱하기 쉬운 문서 구조와 맥락',
    },
    {
      name: '최신성',
      score: score.freshness_score,
      maxScore: 100,
      description: '최신 정보 반영 및 시의성',
    },
  ]
}

function toPriority(severity: DiagnosisItem['severity']): 'high' | 'medium' | 'low' {
  if (severity === 'critical') return 'high'
  if (severity === 'warning') return 'medium'
  return 'low'
}

function toUISuggestions(
  diagnosis: DiagnosisResult,
  suggestResult: SuggestResult | null
): UISuggestion[] {
  if (suggestResult && suggestResult.suggestions.length > 0) {
    const perSuggestionImpact = suggestResult.estimated_score_improvement > 0
      ? Math.max(1, Math.round(suggestResult.estimated_score_improvement / suggestResult.suggestions.length))
      : 0

    return suggestResult.suggestions.map((item, index) => ({
      id: `suggest-${index + 1}`,
      title: item.title,
      description: item.description,
      priority: item.priority,
      category: item.category,
      impact: perSuggestionImpact > 0 ? `예상 +${perSuggestionImpact}점` : undefined,
    }))
  }

  return diagnosis.findings.map((finding, index) => ({
    id: `finding-${index + 1}`,
    title: finding.title,
    description: `${finding.description} ${finding.recommendation}`.trim(),
    priority: toPriority(finding.severity),
    category: finding.category,
  }))
}

function toSentenceScores(
  text: string,
  diagnosis: DiagnosisResult
): SentenceScore[] {
  const rawSentences = text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 0)
    .slice(0, 20)

  if (rawSentences.length === 0) {
    return []
  }

  const findings = diagnosis.findings
  const baseScore = diagnosis.citation_score.overall_score

  return rawSentences.map((sentence, index) => {
    const finding = findings.length > 0 ? findings[index % findings.length] : null
    const severityPenalty =
      finding?.severity === 'critical'
        ? 20
        : finding?.severity === 'warning'
          ? 10
          : finding?.severity === 'info'
            ? 4
            : 0

    const variation = ((index % 3) - 1) * 3
    const score = Math.max(0, Math.min(100, Math.round(baseScore - severityPenalty + variation)))

    return {
      text: sentence,
      score,
      issues: finding ? [finding.title] : [],
      suggestions: finding ? [finding.recommendation] : [],
    }
  })
}

function pickImprovedContent(
  originalText: string,
  suggestResult: SuggestResult | null
): string | null {
  if (!suggestResult) return null
  const firstCandidate = suggestResult.suggestions.find(
    (item) => item.example_after && item.example_after.trim().length >= 50
  )
  if (!firstCandidate?.example_after) return null
  const optimized = firstCandidate.example_after.trim()
  return optimized !== originalText.trim() ? optimized : null
}

export default function ContentOptimizerPage() {
  const [phase, setPhase] = useState<Phase>('input')
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null)
  const [comparison, setComparison] = useState<CompareResult | null>(null)
  const [suggestions, setSuggestions] = useState<UISuggestion[]>([])
  const [sentenceScores, setSentenceScores] = useState<SentenceScore[]>([])
  const [improvedContent, setImprovedContent] = useState<string | null>(null)
  const [contentType, setContentType] = useState<'text' | 'url'>('text')
  const [originalContent, setOriginalContent] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async (request: ContentAnalysisRequest) => {
    setOriginalContent(request.content)
    setContentType(request.contentType)
    setPhase('analyzing')
    setError(null)

    try {
      const diagnosisResult = await analyzeContent(request)
      setDiagnosis(diagnosisResult)
      setSentenceScores(
        request.contentType === 'text'
          ? toSentenceScores(request.content, diagnosisResult)
          : []
      )

      if (request.contentType !== 'text') {
        setSuggestions(toUISuggestions(diagnosisResult, null))
        setComparison(null)
        setImprovedContent(null)
        setPhase('results')
        return
      }

      let suggestResult: SuggestResult | null = null
      try {
        suggestResult = await suggestImprovements({
          text: request.content,
          brandName: request.brandName,
          llmProvider: request.llmProvider,
        })
      } catch {
        // Suggestion generation is best-effort. Keep diagnosis result.
      }

      setSuggestions(toUISuggestions(diagnosisResult, suggestResult))

      const optimizedText = pickImprovedContent(request.content, suggestResult)
      setImprovedContent(optimizedText)

      if (optimizedText) {
        try {
          const compareResult = await compareContent({
            originalText: request.content,
            optimizedText,
            brandName: request.brandName,
            llmProvider: request.llmProvider,
          })
          setComparison(compareResult)
        } catch {
          setComparison(null)
        }
      } else {
        setComparison(null)
      }

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
    setComparison(null)
    setSuggestions([])
    setSentenceScores([])
    setImprovedContent(null)
    setOriginalContent('')
    setError(null)
  }

  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="콘텐츠 최적화"
        description="AI 응답에 더 잘 인용되도록 콘텐츠를 개선하세요"
      />

      {error && (
        <Alert variant="destructive">
          <AlertTitle>오류</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {phase === 'input' && <ContentInput onSubmit={handleAnalyze} />}

      {phase === 'analyzing' && (
        <Card className="p-8">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <div className="text-center">
              <p className="text-lg font-semibold">콘텐츠를 분석하고 있습니다...</p>
              <p className="text-sm text-muted-foreground">
                진단, 개선 제안, 점수 비교를 순차적으로 실행합니다.
              </p>
            </div>
            <Progress className="w-full max-w-md" value={undefined} />
          </div>
        </Card>
      )}

      {phase === 'results' && diagnosis && (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <DiagnosisCard
              score={diagnosis.citation_score.overall_score}
              grade={getGrade(diagnosis.citation_score.overall_score)}
            />
            <ScoreBreakdown categories={toScoreCategories(diagnosis)} />
          </div>

          {contentType === 'text' && sentenceScores.length > 0 && (
            <SentenceHighlighter sentences={sentenceScores} />
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <SuggestionList suggestions={suggestions} />
            {comparison && improvedContent && (
              <BeforeAfterCompare
                originalContent={originalContent}
                improvedContent={improvedContent}
                originalScore={comparison.original_score.overall_score}
                improvedScore={comparison.optimized_score.overall_score}
              />
            )}
          </div>

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
