'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AnalysisStep } from '@/types/analysis'

interface AnalysisStepsProps {
  currentStep: AnalysisStep
  onStepClick: (step: AnalysisStep) => void
}

const steps = [
  { id: 1 as const, title: '기업 정보', description: '분석할 기업 정보 입력' },
  { id: 2 as const, title: '질문 생성', description: 'AI가 30개 질문 생성' },
  { id: 3 as const, title: '질문 편집', description: '질문 검토 및 수정' },
]

export function AnalysisSteps({ currentStep, onStepClick }: AnalysisStepsProps) {
  return (
    <div className="flex items-center justify-center space-x-4">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <button
            onClick={() => step.id < currentStep && onStepClick(step.id)}
            disabled={step.id > currentStep}
            className={cn(
              'flex items-center gap-2 rounded-lg px-4 py-2 transition-colors',
              step.id === currentStep && 'bg-primary text-primary-foreground',
              step.id < currentStep && 'bg-green-100 text-green-700 hover:bg-green-200',
              step.id > currentStep && 'bg-muted text-muted-foreground cursor-not-allowed'
            )}
          >
            <div className={cn(
              'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
              step.id === currentStep && 'bg-primary-foreground text-primary',
              step.id < currentStep && 'bg-green-600 text-white',
              step.id > currentStep && 'bg-muted-foreground/30 text-muted-foreground'
            )}>
              {step.id < currentStep ? <Check className="h-4 w-4" /> : step.id}
            </div>
            <div className="text-left">
              <div className="text-sm font-medium">{step.title}</div>
              <div className="text-xs opacity-70">{step.description}</div>
            </div>
          </button>
          {index < steps.length - 1 && (
            <div className={cn(
              'mx-2 h-px w-8',
              step.id < currentStep ? 'bg-green-500' : 'bg-muted'
            )} />
          )}
        </div>
      ))}
    </div>
  )
}
