'use client'

import { useMemo } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { useGalleryResponses } from '@/lib/hooks/use-gallery'
import { useWorkspaces } from '@/lib/hooks/use-workspaces'
import { GalleryFilters } from '@/components/gallery/GalleryFilters'
import { GalleryCard } from '@/components/gallery/GalleryCard'
import { Skeleton } from '@/components/ui/skeleton'
import type { GalleryFilters as GalleryFiltersType } from '@/types'

export default function GalleryPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const slug = params.slug as string
  const campaignId = Number(params.campaignId)

  const { data: workspaces } = useWorkspaces()
  const workspace = workspaces?.find((w) => w.slug === slug)
  const workspaceId = workspace?.id

  const filters = useMemo<GalleryFiltersType>(() => {
    return {
      campaign_id: campaignId,
      run_id: searchParams.get('run_id') ? Number(searchParams.get('run_id')) : undefined,
      llm_provider: searchParams.get('llm_provider') || undefined,
      query_type: searchParams.get('query_type') || undefined,
      cluster_id: searchParams.get('cluster_id')
        ? Number(searchParams.get('cluster_id'))
        : undefined,
    }
  }, [campaignId, searchParams])

  const { data, isLoading } = useGalleryResponses(workspaceId, filters)

  const handleFiltersChange = (newFilters: GalleryFiltersType) => {
    const params = new URLSearchParams()
    if (newFilters.run_id) params.set('run_id', newFilters.run_id.toString())
    if (newFilters.llm_provider) params.set('llm_provider', newFilters.llm_provider)
    if (newFilters.query_type) params.set('query_type', newFilters.query_type)
    if (newFilters.cluster_id) params.set('cluster_id', newFilters.cluster_id.toString())

    router.push(`?${params.toString()}`)
  }

  if (!workspaceId) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">워크스페이스 로딩 중...</p>
      </div>
    )
  }

  const responses = data ?? []

  return (
    <div className="p-8 space-y-6">
      <GalleryFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        workspaceId={workspaceId}
        campaignId={campaignId}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      ) : responses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {responses.map((response) => (
            <GalleryCard
              key={response.id}
              response={response}
              workspaceSlug={slug}
              campaignId={campaignId}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">응답이 없습니다</p>
          <p className="text-sm text-muted-foreground mt-1">
            필터를 조정하거나 캠페인을 실행하여 응답을 생성하세요
          </p>
        </div>
      )}
    </div>
  )
}
