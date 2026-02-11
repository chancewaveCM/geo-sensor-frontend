'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { LLMProvider } from '@/types/pipeline'

interface LLMSelectorProps {
  selectedProviders: LLMProvider[]
  onChange: (providers: LLMProvider[]) => void
  className?: string
  title?: string
  description?: string
  showValidation?: boolean
}

const AVAILABLE_PROVIDERS: Array<{ value: LLMProvider; label: string }> = [
  { value: 'gemini', label: 'Google Gemini' },
  { value: 'openai', label: 'OpenAI' },
]

export function LLMSelector({
  selectedProviders,
  onChange,
  className,
  title = 'LLM 제공자 선택',
  description = '분석에 사용할 LLM을 선택하세요 (복수 선택 가능)',
  showValidation = true,
}: LLMSelectorProps) {
  const hasNoSelection = selectedProviders.length === 0

  const handleToggle = (provider: LLMProvider) => {
    const updated = selectedProviders.includes(provider)
      ? selectedProviders.filter((p) => p !== provider)
      : [...selectedProviders, provider]
    onChange(updated)
  }

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {AVAILABLE_PROVIDERS.map(({ value, label }) => (
            <div key={value} className="flex items-center space-x-2">
              <Checkbox
                id={`provider-${value}`}
                checked={selectedProviders.includes(value)}
                onCheckedChange={() => handleToggle(value)}
              />
              <Label
                htmlFor={`provider-${value}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {label}
              </Label>
            </div>
          ))}
          {showValidation && hasNoSelection && (
            <p className="text-sm text-destructive">
              최소 1개 이상 선택해야 합니다
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
