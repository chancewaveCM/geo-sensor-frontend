'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useGalleryResponse } from '@/lib/hooks/use-gallery'
import { useWorkspaces } from '@/lib/hooks/use-workspaces'
import { CitationHighlight } from '@/components/gallery/CitationHighlight'
import { LabelManager } from '@/components/gallery/LabelManager'
import { CitationReviewPanel } from '@/components/gallery/CitationReviewPanel'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { ChevronLeft, GitCompare } from 'lucide-react'

const providerColors: Record<string, string> = {
  openai: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
  gemini: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
  anthropic: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
}

export default function GalleryDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const campaignId = Number(params.campaignId)
  const responseId = Number(params.responseId)

  const { data: workspaces } = useWorkspaces()
  const workspace = workspaces?.find((w) => w.slug === slug)
  const workspaceId = workspace?.id

  const { data, isLoading } = useGalleryResponse(workspaceId, responseId)

  if (!workspaceId) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Loading workspace...</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2">
            <Skeleton className="h-96" />
          </div>
          <div>
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Response not found</p>
      </div>
    )
  }

  const citations = data.citations
  const labels = data.labels
  const providerColor =
    providerColors[data.llm_provider.toLowerCase()] ||
    'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20'

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link
              href={`/workspace/${slug}/campaigns/${campaignId}/gallery` as any}
              className="hover:text-foreground transition-colors"
            >
              Gallery
            </Link>
            <span>/</span>
            <span>Response #{data.id}</span>
          </div>
          <h1 className="text-3xl font-bold">Response Detail</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/workspace/${slug}/campaigns/${campaignId}/gallery` as any)}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Gallery
          </Button>
          <Button variant="outline" size="sm">
            <GitCompare className="h-4 w-4 mr-1" />
            Compare
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section - Response Text */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Response Text</CardTitle>
            </CardHeader>
            <CardContent>
              <CitationHighlight text={data.content ?? ''} citations={citations} />
            </CardContent>
          </Card>
        </div>

        {/* Right Section - Metadata & Actions */}
        <div className="space-y-6">
          {/* Metadata Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">LLM Provider</div>
                <Badge className={cn('text-sm font-medium border', providerColor)}>
                  {data.llm_provider}
                </Badge>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">Model</div>
                <div className="text-sm font-medium">{data.llm_model}</div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">Latency</div>
                <div className="text-sm font-medium">
                  {data.latency_ms != null ? `${data.latency_ms}ms` : 'N/A'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Word Count</div>
                  <div className="text-sm font-medium">{data.word_count}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Citations</div>
                  <div className="text-sm font-medium text-orange-500">
                    {data.citation_count}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm text-muted-foreground mb-1">Created</div>
                <div className="text-sm font-medium">
                  {new Date(data.created_at).toLocaleString()}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Labels */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Labels</CardTitle>
            </CardHeader>
            <CardContent>
              <LabelManager
                labels={labels}
                responseId={data.id}
                workspaceId={workspaceId}
              />
            </CardContent>
          </Card>

          {/* Citation Review */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Citation Review</CardTitle>
            </CardHeader>
            <CardContent>
              <CitationReviewPanel citations={citations} workspaceId={workspaceId} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
