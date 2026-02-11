'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Youtube, Linkedin, Twitter, Instagram } from 'lucide-react'
import { useOAuthStatus, useConnectPlatform, useDisconnectPlatform } from '@/lib/hooks/use-publishing'
import { getSelectedWorkspaceId } from '@/lib/utils/workspace-selection'
import { useToast } from '@/hooks/use-toast'

const PLATFORM_CONFIG = {
  youtube: { icon: Youtube, name: 'YouTube', color: 'text-red-600' },
  linkedin: { icon: Linkedin, name: 'LinkedIn', color: 'text-blue-600' },
  twitter: { icon: Twitter, name: 'Twitter', color: 'text-blue-400' },
  instagram: { icon: Instagram, name: 'Instagram', color: 'text-pink-600' },
}

export function SocialConnections() {
  const workspaceId = getSelectedWorkspaceId() ?? undefined
  const { data, isLoading, isError } = useOAuthStatus(workspaceId)
  const connectMutation = useConnectPlatform(workspaceId)
  const disconnectMutation = useDisconnectPlatform(workspaceId)
  const { toast } = useToast()

  const handleConnect = async (platform: string) => {
    try {
      const result = await connectMutation.mutateAsync(platform)
      // Validate auth URL before opening
      try {
        const url = new URL(result.auth_url)
        if (url.protocol !== 'https:') {
          throw new Error('Invalid auth URL protocol')
        }
      } catch {
        toast({
          title: '오류',
          description: '유효하지 않은 인증 URL입니다.',
          variant: 'destructive',
        })
        return
      }
      // Open auth URL in new window
      window.open(result.auth_url, '_blank', 'width=600,height=700')
      toast({
        title: '연동 시작',
        description: `${PLATFORM_CONFIG[platform as keyof typeof PLATFORM_CONFIG].name} 인증 창이 열렸습니다.`,
      })
    } catch {
      toast({
        title: '오류',
        description: '연동을 시작할 수 없습니다.',
        variant: 'destructive',
      })
    }
  }

  const handleDisconnect = async (platform: string) => {
    try {
      await disconnectMutation.mutateAsync(platform)
      toast({
        title: '연결 해제',
        description: `${PLATFORM_CONFIG[platform as keyof typeof PLATFORM_CONFIG].name} 연결이 해제되었습니다.`,
      })
    } catch {
      toast({
        title: '오류',
        description: '연결 해제에 실패했습니다.',
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

  if (isError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>소셜 미디어 연동</CardTitle>
          <CardDescription>콘텐츠를 게시할 플랫폼을 연결하세요.</CardDescription>
        </CardHeader>
        <CardContent className="py-8 text-center text-destructive">
          연동 상태를 불러오는데 실패했습니다.
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>소셜 미디어 연동</CardTitle>
        <CardDescription>콘텐츠를 게시할 플랫폼을 연결하세요.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(PLATFORM_CONFIG).map(([key, config]) => {
          const platformStatus = data?.platforms.find(p => p.platform === key)
          const isConnected = platformStatus?.is_connected ?? false
          const Icon = config.icon

          return (
            <div
              key={key}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-6 w-6 ${config.color}`} />
                <div>
                  <p className="font-medium">{config.name}</p>
                  {isConnected && platformStatus?.connected_at && (
                    <p className="text-xs text-muted-foreground">
                      연결됨: {new Date(platformStatus.connected_at).toLocaleDateString('ko-KR')}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={isConnected ? 'success' : 'outline'}>
                  {isConnected ? '연결됨' : '미연결'}
                </Badge>
                {isConnected ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDisconnect(key)}
                    disabled={disconnectMutation.isPending}
                  >
                    {disconnectMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    연결 해제
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => handleConnect(key)}
                    disabled={connectMutation.isPending}
                  >
                    {connectMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    연결
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
