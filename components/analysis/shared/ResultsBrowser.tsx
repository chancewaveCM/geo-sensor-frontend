'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Loader2, MessageSquare } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { getJobQueries } from '@/lib/api/pipeline'
import type { PipelineCategory, ExpandedQuery } from '@/types/pipeline'

interface ResultsBrowserProps {
  jobId: number
  categories: PipelineCategory[]
  onQuerySelect?: (queryId: number, queryText: string) => void
  className?: string
}

type ProviderFilter = 'all' | 'Gemini' | 'OpenAI'

export function ResultsBrowser({ jobId, categories, onQuerySelect, className }: ResultsBrowserProps) {
  const [filter, setFilter] = useState<ProviderFilter>('all')
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null)
  const [queries, setQueries] = useState<Record<number, ExpandedQuery[]>>({})
  const [loadingCategory, setLoadingCategory] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const filteredCategories = categories.filter(cat => {
    if (filter === 'all') return true
    return cat.llm_provider === filter
  })

  const handleToggleCategory = async (categoryId: number) => {
    setError(null)

    if (expandedCategory === categoryId) {
      setExpandedCategory(null)
      return
    }

    setExpandedCategory(categoryId)

    // Load queries if not already loaded
    if (!queries[categoryId]) {
      try {
        setLoadingCategory(categoryId)
        const data = await getJobQueries(jobId, categoryId)
        setQueries(prev => ({ ...prev, [categoryId]: data.queries }))
      } catch (err) {
        setError(err instanceof Error ? err.message : '쿼리를 불러오는데 실패했습니다')
      } finally {
        setLoadingCategory(null)
      }
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Provider Filter */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">제공자 필터:</span>
        <div className="flex gap-2">
          {(['all', 'Gemini', 'OpenAI'] as const).map((provider) => (
            <Button
              key={provider}
              size="sm"
              variant={filter === provider ? 'default' : 'outline'}
              onClick={() => setFilter(provider)}
            >
              {provider === 'all' ? '전체' : provider}
            </Button>
          ))}
        </div>
        <Badge variant="secondary" className="ml-auto">
          {filteredCategories.length}개 카테고리
        </Badge>
      </div>

      {/* Error Display */}
      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Category Grid */}
      <div className="grid gap-4">
        {filteredCategories.map((category) => {
          const isExpanded = expandedCategory === category.id
          const isLoading = loadingCategory === category.id
          const categoryQueries = queries[category.id] || []

          return (
            <Card key={category.id}>
              <CardHeader>
                <button
                  onClick={() => handleToggleCategory(category.id)}
                  className="flex w-full items-center justify-between text-left hover:opacity-80"
                  aria-expanded={isExpanded}
                >
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    <CardTitle className="text-base">{category.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{category.llm_provider}</Badge>
                    <Badge variant="secondary">{category.query_count}개 쿼리</Badge>
                  </div>
                </button>
                {category.description && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {category.description}
                  </p>
                )}
              </CardHeader>

              {isExpanded && (
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-2">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  ) : categoryQueries.length === 0 ? (
                    <div className="text-center text-sm text-muted-foreground py-4">
                      쿼리가 없습니다
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {categoryQueries.map((query) => (
                        <button
                          key={query.id}
                          onClick={() => onQuerySelect?.(query.id, query.text)}
                          className="w-full text-left p-3 rounded-lg border hover:border-primary hover:bg-accent transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="text-sm">{query.text}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">
                                  #{query.order_index + 1}
                                </Badge>
                                <Badge variant={query.status === 'completed' ? 'success' : 'secondary'} className="text-xs">
                                  {query.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <MessageSquare className="h-4 w-4" />
                              <span className="text-xs">{query.response_count}</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center text-sm text-muted-foreground py-8">
          선택한 필터에 해당하는 카테고리가 없습니다
        </div>
      )}
    </div>
  )
}
