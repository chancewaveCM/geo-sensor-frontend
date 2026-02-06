'use client'

import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { RunResponse } from '@/lib/types'
import { cn } from '@/lib/utils'

interface GalleryCardProps {
  response: RunResponse
  workspaceSlug: string
  campaignId: number
}

const providerColors: Record<string, string> = {
  openai: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
  gemini: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
  anthropic: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
}

export function GalleryCard({ response, workspaceSlug, campaignId }: GalleryCardProps) {
  const providerColor =
    providerColors[response.llm_provider.toLowerCase()] ||
    'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20'

  const contentText = response.content ?? ''
  const queryPreview =
    contentText.length > 120
      ? contentText.slice(0, 120) + '...'
      : contentText

  return (
    <Link
      href={`/workspace/${workspaceSlug}/campaigns/${campaignId}/gallery/${response.id}` as any}
      className="block"
    >
      <Card className="bg-card rounded-lg border shadow-sm hover:shadow-md transition-shadow h-full">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2 mb-2">
            <Badge className={cn('text-xs font-medium border', providerColor)}>
              {response.llm_provider}
            </Badge>
            <span className="text-xs text-muted-foreground">{response.llm_model}</span>
          </div>
          <p className="text-sm text-foreground line-clamp-2 leading-relaxed">
            {queryPreview}
          </p>
        </CardHeader>

        <CardContent className="pb-3">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div>
              <div className="text-lg font-semibold text-orange-500">
                {response.citation_count}
              </div>
              <div className="text-xs text-muted-foreground">Citations</div>
            </div>
            <div>
              <div className="text-lg font-semibold">{response.word_count}</div>
              <div className="text-xs text-muted-foreground">Words</div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-3 border-t text-xs text-muted-foreground flex items-center justify-between">
          <span>{new Date(response.created_at).toLocaleDateString()}</span>
          <span>Response #{response.id}</span>
        </CardFooter>
      </Card>
    </Link>
  )
}
