"use client"

import { useEffect, useState } from "react"
import { AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getCompanyProfiles, type CompanyProfileListResponse } from "@/lib/api/company-profiles"
import { PROVIDERS } from "@/lib/constants/query-lab-config"
import type { CompanyProfile } from "@/types/analysis"
import type { LLMProvider } from "@/types/query-lab"
import type { PipelineConfig } from "@/types/pipeline"

interface PipelineSetupFormProps {
  onSubmit: (config: PipelineConfig) => void
  isLoading: boolean
  disabled?: boolean
}

export function PipelineSetupForm({ onSubmit, isLoading, disabled }: PipelineSetupFormProps) {
  const [profiles, setProfiles] = useState<CompanyProfile[]>([])
  const [profilesLoading, setProfilesLoading] = useState(true)
  const [profilesError, setProfilesError] = useState<string | null>(null)
  const [config, setConfig] = useState<PipelineConfig>({
    companyProfileId: null,
    categoryCount: 10,
    queriesPerCategory: 10,
    llmProviders: ["gemini", "openai"],
  })

  useEffect(() => {
    let isMounted = true

    getCompanyProfiles()
      .then((data: CompanyProfileListResponse) => {
        if (isMounted) setProfiles(data.items)
      })
      .catch((error: unknown) => {
        if (isMounted) {
          console.error(error)
          setProfilesError("기업 프로필을 불러오는데 실패했습니다")
        }
      })
      .finally(() => {
        if (isMounted) setProfilesLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const handleProviderToggle = (provider: LLMProvider) => {
    setConfig((prev) => ({
      ...prev,
      llmProviders: prev.llmProviders.includes(provider)
        ? prev.llmProviders.filter((p) => p !== provider)
        : [...prev.llmProviders, provider],
    }))
  }

  const estimatedQueries = config.categoryCount * config.queriesPerCategory * config.llmProviders.length

  const isValid =
    config.companyProfileId !== null &&
    config.categoryCount >= 1 &&
    config.categoryCount <= 20 &&
    config.queriesPerCategory >= 1 &&
    config.queriesPerCategory <= 20 &&
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
          {profilesError && (
            <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{profilesError}</span>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="company">기업 프로필</Label>
            <select
              id="company"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={config.companyProfileId ?? ""}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  companyProfileId: e.target.value ? Number(e.target.value) : null,
                }))
              }
              disabled={disabled || profilesLoading}
            >
              <option value="">기업을 선택하세요</option>
              {profiles.map((profile) => (
                <option key={profile.id} value={profile.id}>
                  {profile.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="categories">카테고리 수 (1-20)</Label>
            <Input
              id="categories"
              type="number"
              min={1}
              max={20}
              value={config.categoryCount}
              onChange={(e) => {
                const value = Number(e.target.value)
                if (!Number.isNaN(value)) {
                  setConfig((prev) => ({ ...prev, categoryCount: value }))
                }
              }}
              disabled={disabled}
            />
          </div>

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
                if (!Number.isNaN(value)) {
                  setConfig((prev) => ({ ...prev, queriesPerCategory: value }))
                }
              }}
              disabled={disabled}
            />
          </div>

          <div className="space-y-2">
            <Label>LLM 제공자</Label>
            <div className="flex flex-wrap gap-3">
              {PROVIDERS.map((provider) => {
                const selected = config.llmProviders.includes(provider.id)
                return (
                  <button
                    key={provider.id}
                    type="button"
                    onClick={() => handleProviderToggle(provider.id)}
                    disabled={disabled}
                    className={`flex items-center gap-2 rounded-lg border-2 px-4 py-2 transition-all ${
                      selected
                        ? "border-brand-orange bg-brand-orange/10 text-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-brand-orange/50"
                    } ${disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
                  >
                    <span className="text-lg">{provider.icon}</span>
                    <span className="font-medium">{provider.name}</span>
                    {selected && (
                      <svg className="h-5 w-5 text-brand-orange" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="rounded-md bg-muted p-3 text-sm">
            예상 쿼리 수 <strong>{estimatedQueries}</strong>개
            <span className="text-muted-foreground">
              {" "}
              ({config.categoryCount} x {config.queriesPerCategory} x {config.llmProviders.length})
            </span>
          </div>

          <Button type="submit" className="w-full" disabled={!isValid || isLoading || disabled}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                파이프라인 시작 중...
              </>
            ) : (
              "파이프라인 시작"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
