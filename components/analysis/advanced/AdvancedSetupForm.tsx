'use client'

import { useState } from 'react'
import { ProfileSelector } from '@/components/analysis/shared/ProfileSelector'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Settings2, Play, Loader2 } from 'lucide-react'
import { startAdvancedAnalysis } from '@/lib/api/analysis'
import { cn } from '@/lib/utils'

interface AdvancedSetupFormProps {
  onStart: (jobId: number) => void
  className?: string
}

export function AdvancedSetupForm({ onStart, className }: AdvancedSetupFormProps) {
  const [companyId, setCompanyId] = useState<number | undefined>()
  const [categoryCount, setCategoryCount] = useState(10)
  const [queriesPerCategory, setQueriesPerCategory] = useState(10)
  const [providers, setProviders] = useState<{ gemini: boolean; openai: boolean }>({
    gemini: true,
    openai: false,
  })
  const [isStarting, setIsStarting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const expectedQueries = categoryCount * queriesPerCategory
  const hasProvider = providers.gemini || providers.openai

  const handleProviderToggle = (provider: 'gemini' | 'openai') => {
    setProviders(prev => ({ ...prev, [provider]: !prev[provider] }))
  }

  const handleStart = async () => {
    if (!companyId) {
      setError('회사 프로필을 선택해주세요')
      return
    }

    if (!hasProvider) {
      setError('최소 1개의 LLM Provider를 선택해주세요')
      return
    }

    if (categoryCount < 1 || categoryCount > 20) {
      setError('카테고리 수는 1-20 사이여야 합니다')
      return
    }

    if (queriesPerCategory < 1 || queriesPerCategory > 20) {
      setError('카테고리당 질문 수는 1-20 사이여야 합니다')
      return
    }

    setError(null)
    setIsStarting(true)

    try {
      const llmProviders: ('gemini' | 'openai')[] = []
      if (providers.gemini) llmProviders.push('gemini')
      if (providers.openai) llmProviders.push('openai')

      const response = await startAdvancedAnalysis({
        companyProfileId: companyId,
        categoryCount,
        queriesPerCategory,
        llmProviders,
      })

      onStart(response.job_id)
    } catch (err) {
      setError(err instanceof Error ? err.message : '분석 시작 실패')
    } finally {
      setIsStarting(false)
    }
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* Profile Selection */}
      <ProfileSelector
        selectedProfileId={companyId ?? null}
        onSelect={setCompanyId}
      />

      {/* Configuration Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings2 className="h-5 w-5" />
            <CardTitle>분석 설정</CardTitle>
          </div>
          <CardDescription>
            카테고리 수와 질문 수를 조정하여 분석 범위를 설정하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Category Count */}
          <div className="space-y-2">
            <Label htmlFor="categoryCount">카테고리 수</Label>
            <Input
              id="categoryCount"
              type="number"
              min={1}
              max={20}
              value={categoryCount}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10)
                setCategoryCount(isNaN(val) ? 1 : Math.min(20, Math.max(1, val)))
              }}
              className="max-w-xs"
            />
            <p className="text-sm text-muted-foreground">
              1-20개 사이 (기본값: 10)
            </p>
          </div>

          {/* Queries Per Category */}
          <div className="space-y-2">
            <Label htmlFor="queriesPerCategory">카테고리당 질문 수</Label>
            <Input
              id="queriesPerCategory"
              type="number"
              min={1}
              max={20}
              value={queriesPerCategory}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10)
                setQueriesPerCategory(isNaN(val) ? 1 : Math.min(20, Math.max(1, val)))
              }}
              className="max-w-xs"
            />
            <p className="text-sm text-muted-foreground">
              1-20개 사이 (기본값: 10)
            </p>
          </div>

          {/* Provider Selection */}
          <div className="space-y-3">
            <Label>LLM Provider</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="provider-gemini"
                  checked={providers.gemini}
                  onCheckedChange={() => handleProviderToggle('gemini')}
                />
                <label
                  htmlFor="provider-gemini"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Gemini
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="provider-openai"
                  checked={providers.openai}
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
            {!hasProvider && (
              <p className="text-sm text-destructive">
                최소 1개의 Provider를 선택해주세요
              </p>
            )}
          </div>

          {/* Summary */}
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">예상 쿼리 수</span>
              <Badge variant="secondary" className="text-base">
                {expectedQueries}개
              </Badge>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {categoryCount}개 카테고리 × {queriesPerCategory}개 질문
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Start Button */}
          <Button
            onClick={handleStart}
            disabled={!companyId || !hasProvider || isStarting}
            className="w-full"
            size="lg"
          >
            {isStarting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                시작 중...
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" />
                고급 분석 시작
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
