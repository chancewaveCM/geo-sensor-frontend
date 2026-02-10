'use client'

import { useState } from 'react'
import { ProfileSelector } from '@/components/analysis/shared/ProfileSelector'
import { startPipeline } from '@/lib/api/pipeline'
import type { LLMProvider } from '@/types/pipeline'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Zap, Play, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface QuickSetupFormProps {
  onStart: (jobId: number) => void
  className?: string
}

export function QuickSetupForm({ onStart, className }: QuickSetupFormProps) {
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null)
  const [selectedProviders, setSelectedProviders] = useState<LLMProvider[]>(['gemini', 'openai'])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleProviderToggle = (provider: LLMProvider) => {
    setSelectedProviders((prev) =>
      prev.includes(provider)
        ? prev.filter((p) => p !== provider)
        : [...prev, provider]
    )
  }

  const handleSubmit = async () => {
    if (!selectedProfileId) {
      setError('기업 프로필을 선택해주세요')
      return
    }

    if (selectedProviders.length === 0) {
      setError('최소 1개의 LLM 제공자를 선택해주세요')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await startPipeline({
        company_profile_id: selectedProfileId,
        category_count: 3,
        queries_per_category: 10,
        llm_providers: selectedProviders
      })
      onStart(response.job_id)
    } catch (err) {
      setError(err instanceof Error ? err.message : '분석 시작 중 오류가 발생했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Zap className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">간편 분석</h2>
          <p className="text-sm text-muted-foreground">
            빠르게 AI 응답 분석을 시작하세요
          </p>
        </div>
      </div>

      {/* Profile Selection */}
      <Card>
        <CardHeader>
          <CardTitle>기업 선택</CardTitle>
          <CardDescription>분석할 기업 프로필을 선택하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileSelector
            selectedProfileId={selectedProfileId}
            onSelect={setSelectedProfileId}
          />
        </CardContent>
      </Card>

      {/* Provider Selection */}
      <Card>
        <CardHeader>
          <CardTitle>LLM 제공자 선택</CardTitle>
          <CardDescription>분석에 사용할 LLM을 선택하세요 (복수 선택 가능)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="provider-gemini"
                checked={selectedProviders.includes('gemini')}
                onCheckedChange={() => handleProviderToggle('gemini')}
              />
              <label
                htmlFor="provider-gemini"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Google Gemini
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="provider-openai"
                checked={selectedProviders.includes('openai')}
                onCheckedChange={() => handleProviderToggle('openai')}
              />
              <label
                htmlFor="provider-openai"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                OpenAI
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50/50">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Zap className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-900">
                간편 분석 설정
              </p>
              <p className="text-sm text-blue-700">
                3개 카테고리 × 10개 질문으로 자동 생성됩니다
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={isSubmitting || !selectedProfileId || selectedProviders.length === 0}
        className="w-full"
        size="lg"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            분석 시작 중...
          </>
        ) : (
          <>
            <Play className="mr-2 h-4 w-4" />
            분석 시작
          </>
        )}
      </Button>
    </div>
  )
}
