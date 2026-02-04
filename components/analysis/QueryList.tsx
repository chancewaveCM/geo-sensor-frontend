'use client'

import { QueryItem } from './QueryItem'
import type { GeneratedQuery } from '@/types/analysis'

interface QueryListProps {
  queries: GeneratedQuery[]
  onQueryUpdate: (query: GeneratedQuery) => void
}

export function QueryList({ queries, onQueryUpdate }: QueryListProps) {
  return (
    <div className="space-y-2">
      {queries.map(query => (
        <QueryItem key={query.id} query={query} onUpdate={onQueryUpdate} />
      ))}
    </div>
  )
}
