'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import { usePublishContent, useOAuthStatus } from '@/lib/hooks/use-publishing'
import { getSelectedWorkspaceId } from '@/lib/utils/workspace-selection'
import { useToast } from '@/hooks/use-toast'

interface PublishDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialContent?: string
}

export function PublishDialog({ open, onOpenChange, initialContent = '' }: PublishDialogProps) {
  const workspaceId = getSelectedWorkspaceId() ?? undefined
  const [content, setContent] = useState(initialContent)
  const [selectedPlatform, setSelectedPlatform] = useState<string>('')
  const { data: oauthStatus } = useOAuthStatus(workspaceId)
  const publishMutation = usePublishContent(workspaceId)
  const { toast } = useToast()

  const connectedPlatforms = oauthStatus?.platforms.filter(p => p.is_connected) ?? []

  const handlePublish = async () => {
    if (!selectedPlatform || !content.trim()) {
      toast({
        title: '입력 필요',
        description: '플랫폼과 콘텐츠를 선택해주세요.',
        variant: 'destructive',
      })
      return
    }

    try {
      await publishMutation.mutateAsync({
        content,
        platform: selectedPlatform,
      })
      toast({
        title: '게시 성공',
        description: `${selectedPlatform}에 콘텐츠가 게시되었습니다.`,
      })
      onOpenChange(false)
      setContent('')
      setSelectedPlatform('')
    } catch {
      toast({
        title: '게시 실패',
        description: '콘텐츠 게시에 실패했습니다.',
        variant: 'destructive',
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>콘텐츠 게시</DialogTitle>
          <DialogDescription>
            연결된 플랫폼에 콘텐츠를 게시합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>플랫폼 선택</Label>
            <div className="grid grid-cols-2 gap-2">
              {connectedPlatforms.length === 0 ? (
                <p className="col-span-2 text-sm text-muted-foreground">
                  연결된 플랫폼이 없습니다. 설정에서 먼저 플랫폼을 연결하세요.
                </p>
              ) : (
                connectedPlatforms.map((platform) => (
                  <Button
                    key={platform.platform}
                    variant={selectedPlatform === platform.platform ? 'default' : 'outline'}
                    onClick={() => setSelectedPlatform(platform.platform)}
                    className="justify-start"
                  >
                    {platform.platform}
                  </Button>
                ))
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="publish-content">콘텐츠</Label>
            <Textarea
              id="publish-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="게시할 콘텐츠를 입력하세요..."
              rows={8}
            />
            <p className="text-xs text-muted-foreground">
              {content.length} 자
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button
            onClick={handlePublish}
            disabled={publishMutation.isPending || !selectedPlatform || !content.trim()}
          >
            {publishMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            게시하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
