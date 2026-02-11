'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Loader2, Check, X } from 'lucide-react'
import { useGenerateRewrite, useRewrites, useApproveVariant } from '@/lib/hooks/use-publishing'
import { getSelectedWorkspaceId } from '@/lib/utils/workspace-selection'
import { useToast } from '@/hooks/use-toast'
import type { RewriteVariant } from '@/types'

export function RewritePanel() {
  const workspaceId = getSelectedWorkspaceId() ?? undefined
  const [originalContent, setOriginalContent] = useState('')
  const [suggestions, setSuggestions] = useState('')
  const { data: rewrites, isLoading } = useRewrites(workspaceId)
  const generateMutation = useGenerateRewrite(workspaceId)
  const approveMutation = useApproveVariant(workspaceId)
  const { toast } = useToast()

  const handleGenerate = async () => {
    if (!originalContent.trim()) {
      toast({
        title: '입력 필요',
        description: '원본 콘텐츠를 입력해주세요.',
        variant: 'destructive',
      })
      return
    }

    try {
      await generateMutation.mutateAsync({
        original_content: originalContent,
        suggestions: suggestions.split('\n').filter(s => s.trim()),
        num_variants: 3,
      })
      toast({
        title: '생성 완료',
        description: 'AI 리라이팅 버전이 생성되었습니다.',
      })
      setOriginalContent('')
      setSuggestions('')
    } catch {
      toast({
        title: '오류',
        description: '리라이팅 생성에 실패했습니다.',
        variant: 'destructive',
      })
    }
  }

  const handleApprove = async (rewriteId: number, variant: RewriteVariant, status: 'approved' | 'rejected') => {
    try {
      await approveMutation.mutateAsync({
        rewriteId,
        variantId: variant.id,
        status,
      })
      toast({
        title: status === 'approved' ? '승인됨' : '거부됨',
        description: `버전 ${variant.variant_number}이(가) ${status === 'approved' ? '승인' : '거부'}되었습니다.`,
      })
    } catch {
      toast({
        title: '오류',
        description: '처리에 실패했습니다.',
        variant: 'destructive',
      })
    }
  }

  if (!workspaceId) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          워크스페이스를 선택해주세요.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI 콘텐츠 리라이팅</CardTitle>
          <CardDescription>원본 콘텐츠를 AI로 다양하게 재작성합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="original">원본 콘텐츠</Label>
            <Textarea
              id="original"
              value={originalContent}
              onChange={(e) => setOriginalContent(e.target.value)}
              placeholder="리라이팅할 원본 텍스트를 입력하세요..."
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="suggestions">제안 사항 (선택, 각 줄마다 하나씩)</Label>
            <Textarea
              id="suggestions"
              value={suggestions}
              onChange={(e) => setSuggestions(e.target.value)}
              placeholder="더 전문적으로&#10;간결하게&#10;친근한 톤으로"
              rows={3}
            />
          </div>

          <Button
            onClick={handleGenerate}
            disabled={generateMutation.isPending || !originalContent.trim()}
          >
            {generateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            AI 리라이팅 생성
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">생성된 버전</h3>

        {isLoading ? (
          <Card>
            <CardContent className="space-y-4 pt-6">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ) : rewrites && rewrites.length > 0 ? (
          rewrites.map((rewrite) => (
            <Card key={rewrite.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">리라이팅 #{rewrite.id}</CardTitle>
                  <span className="text-xs text-muted-foreground">
                    {new Date(rewrite.created_at).toLocaleString('ko-KR')}
                  </span>
                </div>
                <CardDescription className="line-clamp-2">{rewrite.original_content}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {rewrite.variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="rounded-lg border p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">버전 {variant.variant_number}</span>
                      <Badge
                        variant={
                          variant.status === 'approved'
                            ? 'success'
                            : variant.status === 'rejected'
                            ? 'destructive'
                            : 'outline'
                        }
                      >
                        {variant.status === 'approved' ? '승인됨' : variant.status === 'rejected' ? '거부됨' : '대기중'}
                      </Badge>
                    </div>
                    <p className="text-sm">{variant.content}</p>
                    {variant.diff_summary && (
                      <p className="text-xs text-muted-foreground">변경: {variant.diff_summary}</p>
                    )}
                    {variant.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApprove(rewrite.id, variant, 'approved')}
                          disabled={approveMutation.isPending}
                        >
                          <Check className="mr-1 h-4 w-4" />
                          승인
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApprove(rewrite.id, variant, 'rejected')}
                          disabled={approveMutation.isPending}
                        >
                          <X className="mr-1 h-4 w-4" />
                          거부
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              생성된 리라이팅이 없습니다. 위에서 콘텐츠를 입력하고 생성해보세요.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
