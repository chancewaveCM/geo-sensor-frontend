'use client'

import { useState } from 'react'
import { Plus, Trash2, Check } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface EditableQuery {
  id: string
  text: string
  categoryName: string
  isSelected: boolean
}

interface QueryEditorProps {
  queries: EditableQuery[]
  onUpdate: (queries: EditableQuery[]) => void
  className?: string
}

export function QueryEditor({ queries, onUpdate, className }: QueryEditorProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  // Group queries by category
  const categorizedQueries = queries.reduce((acc, query) => {
    if (!acc[query.categoryName]) {
      acc[query.categoryName] = []
    }
    acc[query.categoryName].push(query)
    return acc
  }, {} as Record<string, EditableQuery[]>)

  const selectedCount = queries.filter(q => q.isSelected).length
  const totalCount = queries.length

  const handleToggleSelect = (queryId: string) => {
    onUpdate(queries.map(q =>
      q.id === queryId ? { ...q, isSelected: !q.isSelected } : q
    ))
  }

  const handleUpdateText = (queryId: string, newText: string) => {
    onUpdate(queries.map(q =>
      q.id === queryId ? { ...q, text: newText } : q
    ))
  }

  const handleAddQuery = (categoryName: string) => {
    const newQuery: EditableQuery = {
      id: `new-${crypto.randomUUID()}`,
      text: '',
      categoryName,
      isSelected: true
    }
    onUpdate([...queries, newQuery])
  }

  const handleDeleteQuery = (queryId: string) => {
    onUpdate(queries.filter(q => q.id !== queryId))
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            선택됨: {selectedCount} / 전체: {totalCount}
          </Badge>
        </div>
      </div>

      {Object.entries(categorizedQueries).map(([categoryName, categoryQueries]) => (
        <Card key={categoryName}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base">
              <span>{categoryName}</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {categoryQueries.filter(q => q.isSelected).length} / {categoryQueries.length}
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleAddQuery(categoryName)}
                >
                  <Plus className="h-4 w-4" />
                  추가
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {categoryQueries.map((query) => (
              <div key={query.id} className="flex items-start gap-2">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={query.isSelected}
                  onClick={() => handleToggleSelect(query.id)}
                  className={cn(
                    'mt-2 h-5 w-5 shrink-0 rounded border',
                    'flex items-center justify-center transition-colors',
                    query.isSelected
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-input hover:border-primary'
                  )}
                >
                  {query.isSelected && <Check className="h-3 w-3" />}
                </button>
                <Input
                  value={query.text}
                  onChange={(e) => handleUpdateText(query.id, e.target.value)}
                  placeholder="쿼리 입력..."
                  className="flex-1"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDeleteQuery(query.id)}
                  className="mt-1 shrink-0"
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
