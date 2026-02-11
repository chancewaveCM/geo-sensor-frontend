'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Loader2, RotateCw, Youtube, Linkedin, Twitter, Instagram } from 'lucide-react'
import { usePublications, useRetryPublication } from '@/lib/hooks/use-publishing'
import { getSelectedWorkspaceId } from '@/lib/utils/workspace-selection'
import { useToast } from '@/hooks/use-toast'

const PLATFORM_ICONS = {
  youtube: Youtube,
  linkedin: Linkedin,
  twitter: Twitter,
  instagram: Instagram,
}

export function PublishHistory() {
  const workspaceId = getSelectedWorkspaceId() ?? undefined
  const { data: pubData, isLoading, isError } = usePublications(workspaceId)
  const retryMutation = useRetryPublication(workspaceId)
  const { toast } = useToast()

  const publications = pubData?.publications ?? []

  const handleRetry = async (publicationId: number) => {
    try {
      await retryMutation.mutateAsync(publicationId)
      toast({
        title: '재시도 중',
        description: '게시를 다시 시도하고 있습니다.',
      })
    } catch {
      toast({
        title: '오류',
        description: '재시도에 실패했습니다.',
        variant: 'destructive',
      })
    }
  }

  const isRetrying = (id: number) =>
    retryMutation.isPending && retryMutation.variables === id

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="success">게시됨</Badge>
      case 'failed':
        return <Badge variant="destructive">실패</Badge>
      case 'pending':
        return <Badge variant="outline">대기중</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
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
          <CardTitle>게시 내역</CardTitle>
          <CardDescription>플랫폼별 게시 현황을 확인합니다.</CardDescription>
        </CardHeader>
        <CardContent className="py-8 text-center text-destructive">
          게시 내역을 불러오는데 실패했습니다.
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>게시 내역</CardTitle>
          <CardDescription>플랫폼별 게시 현황을 확인합니다.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>게시 내역</CardTitle>
        <CardDescription>플랫폼별 게시 현황을 확인합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        {publications && publications.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>플랫폼</TableHead>
                <TableHead>콘텐츠</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>게시일</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {publications.map((pub) => {
                const PlatformIcon = PLATFORM_ICONS[pub.platform as keyof typeof PLATFORM_ICONS]
                return (
                  <TableRow key={pub.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {PlatformIcon && <PlatformIcon className="h-4 w-4" />}
                        <span className="capitalize">{pub.platform}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <p className="line-clamp-2 text-sm">{pub.content}</p>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(pub.status)}
                      {pub.error_message && (
                        <p className="mt-1 text-xs text-destructive">{pub.error_message}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      {pub.published_at
                        ? new Date(pub.published_at).toLocaleString('ko-KR')
                        : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {pub.status === 'failed' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRetry(pub.id)}
                          disabled={isRetrying(pub.id)}
                          aria-label="게시 재시도"
                        >
                          {isRetrying(pub.id) ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RotateCw className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            게시 내역이 없습니다.
          </div>
        )}
      </CardContent>
    </Card>
  )
}
