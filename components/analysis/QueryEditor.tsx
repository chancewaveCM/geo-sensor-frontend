'use client'

import { useState } from 'react'
import { QueryList } from './QueryList'
import { CategoryBadge } from './CategoryBadge'
import { Button } from '@/components/ui/button'
import { post } from '@/lib/api-client'
import type { GeneratedQuery, QueryCategory } from '@/types/analysis'

interface QueryEditorProps {
  queries: GeneratedQuery[]
  onQueryUpdate: (query: GeneratedQuery) => void
}

const categories: { key: QueryCategory; label: string; range: string }[] = [
  { key: 'introductory', label: '입문형', range: '1-10' },
  { key: 'comparative', label: '비교형', range: '11-20' },
  { key: 'critical', label: '비판형', range: '21-30' },
]

export function QueryEditor({ queries, onQueryUpdate }: QueryEditorProps) {
  const [selectedCategory, setSelectedCategory] = useState<QueryCategory | 'all'>('all')

  const filteredQueries = selectedCategory === 'all'
    ? queries
    : queries.filter(q => q.category === selectedCategory)

  const selectedCount = queries.filter(q => q.is_selected).length

  const handleSelectAll = async () => {
    const queryIds = filteredQueries.map(q => q.id)
    const allSelected = filteredQueries.every(q => q.is_selected)

    await post<GeneratedQuery[]>('/api/v1/generated-queries/bulk-update', {
      query_ids: queryIds,
      is_selected: !allSelected,
    })

    // Optimistic update
    filteredQueries.forEach(q => {
      onQueryUpdate({ ...q, is_selected: !allSelected })
    })
  }

  return (
    <div className="space-y-4">
      {/* 카테고리 필터 */}
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory('all')}
        >
          전체 ({queries.length})
        </Button>
        {categories.map(cat => (
          <Button
            key={cat.key}
            variant={selectedCategory === cat.key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(cat.key)}
          >
            <CategoryBadge category={cat.key} />
            <span className="ml-2">
              ({queries.filter(q => q.category === cat.key).length})
            </span>
          </Button>
        ))}
      </div>

      {/* 선택 정보 및 액션 */}
      <div className="flex items-center justify-between bg-muted/50 p-3 rounded-lg">
        <span className="text-sm text-muted-foreground">
          {selectedCount}개 선택됨 / 총 {queries.length}개
        </span>
        <Button variant="outline" size="sm" onClick={handleSelectAll}>
          {filteredQueries.every(q => q.is_selected) ? '전체 해제' : '전체 선택'}
        </Button>
      </div>

      {/* 질문 목록 */}
      <QueryList queries={filteredQueries} onQueryUpdate={onQueryUpdate} />
    </div>
  )
}
