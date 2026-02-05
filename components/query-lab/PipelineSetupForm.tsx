"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, AlertCircle } from "lucide-react"
import { getCompanyProfiles } from "@/lib/api/pipeline"
import type { CompanyProfile } from "@/types/analysis"
import type { PipelineConfig } from "@/types/pipeline"

interface PipelineSetupFormProps {
  onSubmit: (config: PipelineConfig) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function PipelineSetupForm({ onSubmit, isLoading, disabled }: PipelineSetupFormProps) {
  const [profiles, setProfiles] = useState<CompanyProfile[]>([])
  const [profilesLoading, setProfilesLoading] = useState(true)
  const [profilesError, setProfilesError] = useState<string | null>(null)
  const [config, setConfig] = useState<PipelineConfig>({
    companyProfileId: null,
    categoryCount: 10,
    queriesPerCategory: 10,
    llmProviders: ['gemini', 'openai'],
  })

  useEffect(() => {
    let isMounted = true

    getCompanyProfiles()
      .then((data) => {
        if (isMounted) setProfiles(data)
      })
      .catch((error) => {
        if (isMounted) {
          console.error(error)
          setProfilesError('기업 프로필을 불러오는데 실패했습니다')
        }
      })
      .finally(() => {
        if (isMounted) setProfilesLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const estimatedQueries = config.categoryCount * config.queriesPerCategory * config.llmProviders.length

  const handleProviderToggle = (provider: string) => {
    setConfig(prev => ({
      ...prev,
      llmProviders: prev.llmProviders.includes(provider)
        ? prev.llmProviders.filter(p => p !== provider)
        : [...prev.llmProviders, provider]
    }))
  }

  const isValid = config.companyProfileId !== null &&
                  config.categoryCount >= 2 && config.categoryCount <= 20 &&
                  config.queriesPerCategory >= 1 && config.queriesPerCategory <= 20 &&
                  config.llmProviders.length > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isValid) onSubmit(config)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>파이프라인 설정</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Error Message */}
          {profilesError && (
            <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{profilesError}</span>
            </div>
          )}

          {/* Company Profile Select */}
          <div className="space-y-2">
            <Label htmlFor="company">기업 프로필</Label>
            <select
              id="company"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={config.companyProfileId ?? ''}
              onChange={(e) => setConfig(prev => ({ ...prev, companyProfileId: e.target.value ? Number(e.target.value) : null }))}
              disabled={disabled || profilesLoading}
            >
              <option value="">기업을 선택하세요</option>
              {profiles.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          {/* Category Count */}
          <div className="space-y-2">
            <Label htmlFor="categories">카테고리 수 (2-20)</Label>
            <Input
              id="categories"
              type="number"
              min={2}
              max={20}
              value={config.categoryCount}
              onChange={(e) => {
                const value = Number(e.target.value)
                if (!isNaN(value)) {
                  setConfig(prev => ({ ...prev, categoryCount: value }))
                }
              }}
              disabled={disabled}
            />
          </div>

          {/* Queries per Category */}
          <div className="space-y-2">
            <Label htmlFor="queries">카테고리당 쿼리 수 (1-20)</Label>
            <Input
              id="queries"
              type="number"
              min={1}
              max={20}
              value={config.queriesPerCategory}
              onChange={(e) => {
                const value = Number(e.target.value)
                if (!isNaN(value)) {
                  setConfig(prev => ({ ...prev, queriesPerCategory: value }))
                }
              }}
              disabled={disabled}
            />
          </div>

          {/* LLM Providers */}
          <div className="space-y-2">
            <Label>LLM 제공자</Label>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="gemini"
                  checked={config.llmProviders.includes('gemini')}
                  onCheckedChange={() => handleProviderToggle('gemini')}
                  disabled={disabled}
                />
                <Label htmlFor="gemini" className="font-normal">Gemini</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="openai"
                  checked={config.llmProviders.includes('openai')}
                  onCheckedChange={() => handleProviderToggle('openai')}
                  disabled={disabled}
                />
                <Label htmlFor="openai" className="font-normal">OpenAI</Label>
              </div>
            </div>
          </div>

          {/* Estimated Queries */}
          <div className="rounded-md bg-muted p-3 text-sm">
            예상 쿼리 수: <strong>{estimatedQueries}</strong>개
            <span className="text-muted-foreground"> ({config.categoryCount} × {config.queriesPerCategory} × {config.llmProviders.length})</span>
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={!isValid || isLoading || disabled}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                파이프라인 시작 중...
              </>
            ) : (
              '파이프라인 시작'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
