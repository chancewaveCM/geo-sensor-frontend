'use client'

import { useIntentClusters, useCampaignRuns } from '@/lib/hooks/use-campaigns'
import type { GalleryFilters as GalleryFiltersType } from '@/types'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface GalleryFiltersProps {
  filters: GalleryFiltersType
  onFiltersChange: (filters: GalleryFiltersType) => void
  workspaceId: number
  campaignId: number
}

export function GalleryFilters({
  filters,
  onFiltersChange,
  workspaceId,
  campaignId,
}: GalleryFiltersProps) {
  const { data: clusters } = useIntentClusters(workspaceId, campaignId)
  const { data: runs } = useCampaignRuns(workspaceId, campaignId)

  const handleReset = () => {
    onFiltersChange({
      campaign_id: campaignId,
      page: 1,
      page_size: 25,
    })
  }

  return (
    <div className="bg-muted/50 rounded-lg p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* LLM Provider */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-muted-foreground">Provider</label>
          <Select
            value={filters.llm_provider || 'all'}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                llm_provider: value === 'all' ? undefined : value,
                page: 1,
              })
            }
          >
            <SelectTrigger className="w-[140px] bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Providers</SelectItem>
              <SelectItem value="openai">OpenAI</SelectItem>
              <SelectItem value="gemini">Gemini</SelectItem>
              <SelectItem value="anthropic">Anthropic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Query Type */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-muted-foreground">Type</label>
          <Select
            value={filters.query_type || 'all'}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                query_type: value === 'all' ? undefined : value,
                page: 1,
              })
            }
          >
            <SelectTrigger className="w-[140px] bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="anchor">Anchor</SelectItem>
              <SelectItem value="exploration">Exploration</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Intent Cluster */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-muted-foreground">Cluster</label>
          <Select
            value={filters.cluster_id?.toString() || 'all'}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                cluster_id: value === 'all' ? undefined : Number(value),
                page: 1,
              })
            }
          >
            <SelectTrigger className="w-[180px] bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Clusters</SelectItem>
              {clusters?.map((cluster) => (
                <SelectItem key={cluster.id} value={cluster.id.toString()}>
                  {cluster.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Run */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-muted-foreground">Run</label>
          <Select
            value={filters.run_id?.toString() || 'all'}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                run_id: value === 'all' ? undefined : Number(value),
                page: 1,
              })
            }
          >
            <SelectTrigger className="w-[180px] bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Runs</SelectItem>
              {runs?.map((run) => (
                <SelectItem key={run.id} value={run.id.toString()}>
                  Run #{run.id} - {new Date(run.created_at).toLocaleDateString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Page Size */}
        <div className="flex items-center gap-2 ml-auto">
          <label className="text-sm font-medium text-muted-foreground">Per page</label>
          <Select
            value={filters.page_size?.toString() || '25'}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                page_size: Number(value),
                page: 1,
              })
            }
          >
            <SelectTrigger className="w-[100px] bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reset Button */}
        <Button variant="outline" size="sm" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </div>
  )
}
