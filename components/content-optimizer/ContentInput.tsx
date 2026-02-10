'use client'

import { useState } from 'react'
import { FileText, Link, Send, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import type { ContentAnalysisRequest } from '@/lib/api/content-optimizer'

interface ContentInputProps {
  onSubmit: (request: ContentAnalysisRequest) => void
  isLoading?: boolean
  className?: string
}

export function ContentInput({ onSubmit, isLoading = false, className }: ContentInputProps) {
  const [contentType, setContentType] = useState<'text' | 'url'>('text')
  const [textContent, setTextContent] = useState('')
  const [urlContent, setUrlContent] = useState('')
  const [brandName, setBrandName] = useState('')
  const [errors, setErrors] = useState<{ content?: string; brandName?: string; url?: string }>({})

  const MIN_TEXT_LENGTH = 50
  const MAX_TEXT_LENGTH = 10000

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {}

    // Brand name validation
    if (!brandName.trim()) {
      newErrors.brandName = '브랜드명을 입력해주세요'
    }

    // Content validation
    if (contentType === 'text') {
      if (!textContent.trim()) {
        newErrors.content = '분석할 텍스트를 입력해주세요'
      } else if (textContent.length < MIN_TEXT_LENGTH) {
        newErrors.content = `최소 ${MIN_TEXT_LENGTH}자 이상 입력해주세요`
      } else if (textContent.length > MAX_TEXT_LENGTH) {
        newErrors.content = `최대 ${MAX_TEXT_LENGTH}자까지 입력 가능합니다`
      }
    } else {
      if (!urlContent.trim()) {
        newErrors.url = 'URL을 입력해주세요'
      } else {
        try {
          new URL(urlContent)
        } catch {
          newErrors.url = '올바른 URL 형식이 아닙니다'
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) return

    const request: ContentAnalysisRequest = {
      content: contentType === 'text' ? textContent : urlContent,
      contentType,
      brandName: brandName.trim(),
    }

    onSubmit(request)
  }

  const isFormValid = () => {
    if (!brandName.trim()) return false
    if (contentType === 'text') {
      return textContent.length >= MIN_TEXT_LENGTH && textContent.length <= MAX_TEXT_LENGTH
    }
    return urlContent.trim().length > 0
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle>콘텐츠 분석</CardTitle>
        <CardDescription>
          AI 응답 최적화를 위한 콘텐츠 진단을 시작하세요
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Brand Name Input */}
        <div className="space-y-2">
          <Label htmlFor="brand-name">브랜드명</Label>
          <Input
            id="brand-name"
            placeholder="예: 삼성전자, 네이버, 카카오"
            value={brandName}
            onChange={(e) => {
              setBrandName(e.target.value)
              if (errors.brandName) {
                setErrors({ ...errors, brandName: undefined })
              }
            }}
            disabled={isLoading}
          />
          {errors.brandName && (
            <div className="flex items-center gap-1 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{errors.brandName}</span>
            </div>
          )}
        </div>

        {/* Content Type Tabs */}
        <Tabs
          value={contentType}
          onValueChange={(value) => {
            setContentType(value as 'text' | 'url')
            setErrors({})
          }}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text" disabled={isLoading}>
              <FileText className="mr-2 h-4 w-4" />
              텍스트 입력
            </TabsTrigger>
            <TabsTrigger value="url" disabled={isLoading}>
              <Link className="mr-2 h-4 w-4" />
              URL 입력
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-2">
            <Label htmlFor="text-content">분석할 텍스트</Label>
            <Textarea
              id="text-content"
              placeholder="분석하고 싶은 콘텐츠를 입력하세요&#x0A;(최소 50자 이상)"
              className="min-h-[200px] resize-y"
              value={textContent}
              onChange={(e) => {
                setTextContent(e.target.value)
                if (errors.content) {
                  setErrors({ ...errors, content: undefined })
                }
              }}
              disabled={isLoading}
              maxLength={MAX_TEXT_LENGTH}
            />
            <div className="flex items-center justify-between text-sm">
              <div>
                {errors.content && (
                  <div className="flex items-center gap-1 text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span>{errors.content}</span>
                  </div>
                )}
              </div>
              <span
                className={cn(
                  'text-muted-foreground',
                  textContent.length < MIN_TEXT_LENGTH && 'text-destructive',
                  textContent.length > MAX_TEXT_LENGTH && 'text-destructive'
                )}
              >
                {textContent.length.toLocaleString()} / {MAX_TEXT_LENGTH.toLocaleString()}자
              </span>
            </div>
          </TabsContent>

          <TabsContent value="url" className="space-y-2">
            <Label htmlFor="url-content">웹페이지 URL</Label>
            <Input
              id="url-content"
              type="url"
              placeholder="https://example.com/article"
              value={urlContent}
              onChange={(e) => {
                setUrlContent(e.target.value)
                if (errors.url) {
                  setErrors({ ...errors, url: undefined })
                }
              }}
              disabled={isLoading}
            />
            {errors.url && (
              <div className="flex items-center gap-1 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.url}</span>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid() || isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
              분석 중...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              콘텐츠 분석하기
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
