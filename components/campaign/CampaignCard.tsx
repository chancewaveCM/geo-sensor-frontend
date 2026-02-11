'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Target, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import type { Campaign } from '@/types'

interface CampaignCardProps {
  campaign: Campaign
  workspaceSlug: string
}

function getStatusVariant(status: string) {
  switch (status) {
    case 'active':
      return 'bg-green-500/10 text-green-600 border-green-500/20'
    case 'paused':
      return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
    case 'completed':
      return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
    case 'draft':
    default:
      return 'bg-gray-500/10 text-gray-600 border-gray-500/20'
  }
}

export function CampaignCard({ campaign, workspaceSlug }: CampaignCardProps) {
  return (
    <Link href={`/workspace/${workspaceSlug}/campaigns/${campaign.id}` as any}>
      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-lg font-semibold line-clamp-1 group-hover:text-brand-orange transition-colors">
              {campaign.name}
            </CardTitle>
            <Badge className={cn('text-xs shrink-0', getStatusVariant(campaign.status))}>
              {campaign.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {campaign.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {campaign.description}
            </p>
          )}

          <div className="flex items-center gap-2 text-sm">
            <Target className="h-4 w-4 text-brand-orange" />
            <span className="font-medium text-foreground">{campaign.target_brand}</span>
          </div>

          {campaign.schedule_enabled && campaign.schedule_interval_hours && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Every {campaign.schedule_interval_hours}h</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-3 border-t flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>
              {new Date(campaign.created_at).toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>
          <span className="text-brand-orange font-medium">
            View Dashboard →
          </span>
        </CardFooter>

        <div className="absolute top-0 right-0 w-24 h-24 bg-brand-orange/5 rounded-full blur-2xl -z-10 group-hover:bg-brand-orange/10 transition-colors" />
      </Card>
    </Link>
  )
}
