'use client'

import { useState } from 'react'
import { Check, Edit2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { CategoryBadge } from './CategoryBadge'
import { put } from '@/lib/api-client'
import { cn } from '@/lib/utils'
import type { GeneratedQuery } from '@/types/analysis'

interface QueryItemProps {
  query: GeneratedQuery
  onUpdate: (query: GeneratedQuery) => void
}

export function QueryItem({ query, onUpdate }: QueryItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(query.text)

  const handleToggleSelect = async () => {
    const updated = await put<GeneratedQuery>(`/api/v1/generated-queries/${query.id}`, {
      is_selected: !query.is_selected,
    })
    onUpdate(updated)
  }

  const handleSaveEdit = async () => {
    if (editText.trim() === query.text) {
      setIsEditing(false)
      return
    }

    const updated = await put<GeneratedQuery>(`/api/v1/generated-queries/${query.id}`, {
      text: editText.trim(),
    })
    onUpdate(updated)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditText(query.text)
    setIsEditing(false)
  }

  return (
    <div className={cn(
      'flex items-start gap-3 p-3 rounded-lg border transition-colors',
      query.is_selected ? 'bg-background' : 'bg-muted/50 opacity-60'
    )}>
      <Checkbox
        checked={query.is_selected}
        onCheckedChange={handleToggleSelect}
        className="mt-1"
      />

      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            #{query.order_index}
          </span>
          <CategoryBadge category={query.category} />
          {query.status === 'edited' && (
            <span className="text-xs text-brand-orange">(수정됨)</span>
          )}
        </div>

        {isEditing ? (
          <div className="flex items-center gap-2">
            <Input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="flex-1"
              autoFocus
            />
            <Button size="icon" variant="ghost" onClick={handleSaveEdit}>
              <Check className="h-4 w-4 text-success" />
            </Button>
            <Button size="icon" variant="ghost" onClick={handleCancelEdit}>
              <X className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ) : (
          <p className="text-sm">{query.text}</p>
        )}
      </div>

      {!isEditing && (
        <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)}>
          <Edit2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
