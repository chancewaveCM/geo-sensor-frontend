'use client'

import { useState } from 'react'
import { CompanyInfoForm } from '@/components/analysis/CompanyInfoForm'
import { QueryGenerationPanel } from '@/components/analysis/QueryGenerationPanel'
import { QueryEditor } from '@/components/analysis/QueryEditor'
import { AnalysisSteps } from '@/components/analysis/AnalysisSteps'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AnalysisStep, CompanyProfile, GeneratedQuery } from '@/types/analysis'

export default function AnalysisPage() {
  const [currentStep, setCurrentStep] = useState<AnalysisStep>(1)
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null)
  const [queries, setQueries] = useState<GeneratedQuery[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const handleProfileCreated = (profile: CompanyProfile) => {
    setCompanyProfile(profile)
    setCurrentStep(2)
  }

  const handleQueriesGenerated = (generatedQueries: GeneratedQuery[]) => {
    setQueries(generatedQueries)
    setCurrentStep(3)
  }

  const handleQueryUpdate = (updatedQuery: GeneratedQuery) => {
    setQueries(prev => prev.map(q => q.id === updatedQuery.id ? updatedQuery : q))
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold">분석</h1>
        <p className="text-muted-foreground">기업 정보를 입력하고 AI 분석 질문을 생성하세요</p>
      </div>

      <AnalysisSteps currentStep={currentStep} onStepClick={setCurrentStep} />

      <Card>
        <CardHeader>
          <CardTitle>
            {currentStep === 1 && '기업 정보 입력'}
            {currentStep === 2 && '질문 생성 중'}
            {currentStep === 3 && '질문 편집'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentStep === 1 && (
            <CompanyInfoForm onSubmit={handleProfileCreated} />
          )}
          {currentStep === 2 && companyProfile && (
            <QueryGenerationPanel
              companyProfile={companyProfile}
              isGenerating={isGenerating}
              setIsGenerating={setIsGenerating}
              onComplete={handleQueriesGenerated}
            />
          )}
          {currentStep === 3 && (
            <QueryEditor
              queries={queries}
              onQueryUpdate={handleQueryUpdate}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
