'use client'

import { useState, useMemo } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { useGalleryResponses } from '@/lib/hooks/use-gallery'
import { useWorkspaces } from '@/lib/hooks/use-workspaces'
import { GalleryFilters } from '@/components/gallery/GalleryFilters'
import { GalleryCard } from '@/components/gallery/GalleryCard'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { GalleryFilters as GalleryFiltersType } from '@/lib/types'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function GalleryPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const slug = params.slug as string
  const campaignId = Number(params.campaignId)

  const { data: workspaces } = useWorkspaces()
  const workspace = workspaces?.find((w) => w.slug === slug)
  const workspaceId = workspace?.id || 0

  const filters = useMemo<GalleryFiltersType>(() => {
    return {
      campaign_id: campaignId,
      run_id: searchParams.get('run_id') ? Number(searchParams.get('run_id')) : undefined,
      llm_provider: searchParams.get('llm_provider') || undefined,
      query_type: searchParams.get('query_type') || undefined,
      cluster_id: searchParams.get('cluster_id')
        ? Number(searchParams.get('cluster_id'))
        : undefined,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      page_size: searchParams.get('page_size') ? Number(searchParams.get('page_size')) : 25,
    }
  }, [campaignId, searchParams])

  const { data, isLoading } = useGalleryResponses(workspaceId, filters)

  const handleFiltersChange = (newFilters: GalleryFiltersType) => {
    const params = new URLSearchParams()
    if (newFilters.run_id) params.set('run_id', newFilters.run_id.toString())
    if (newFilters.llm_provider) params.set('llm_provider', newFilters.llm_provider)
    if (newFilters.query_type) params.set('query_type', newFilters.query_type)
    if (newFilters.cluster_id) params.set('cluster_id', newFilters.cluster_id.toString())
    if (newFilters.page) params.set('page', newFilters.page.toString())
    if (newFilters.page_size) params.set('page_size', newFilters.page_size.toString())

    router.push(`?${params.toString()}`)
  }

  const totalPages = data ? Math.ceil(data.total / (filters.page_size || 25)) : 0
  const currentPage = filters.page || 1

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handleFiltersChange({ ...filters, page: currentPage - 1 })
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handleFiltersChange({ ...filters, page: currentPage + 1 })
    }
  }

  if (!workspaceId) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Loading workspace...</p>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gallery</h1>
          {data && (
            <p className="text-muted-foreground mt-1">
              {data.total} response{data.total !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>

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
      ) : data && data.items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.items.map((response) => (
              <GalleryCard
                key={response.id}
                response={response}
                workspaceSlug={slug}
                campaignId={campaignId}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">No responses found</p>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your filters or run a campaign to generate responses
          </p>
        </div>
      )}
    </div>
  )
}
