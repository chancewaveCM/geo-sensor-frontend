'use client'

import { useState } from 'react'
import { useCreateLabel, useDeleteLabel, useResolveLabel } from '@/lib/hooks/use-gallery'
import type { ResponseLabel } from '@/lib/types'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { Plus, X } from 'lucide-react'

interface LabelManagerProps {
  labels: ResponseLabel[]
  responseId: number
  workspaceId: number
}

const labelColors: Record<string, string> = {
  anomaly: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
  quality_issue: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
  notable: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20',
  flagged: 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20',
}

export function LabelManager({ labels, responseId, workspaceId }: LabelManagerProps) {
  const [open, setOpen] = useState(false)
  const [labelType, setLabelType] = useState('anomaly')
  const [labelValue, setLabelValue] = useState('')
  const [notes, setNotes] = useState('')

  const createLabel = useCreateLabel(workspaceId)
  const deleteLabel = useDeleteLabel(workspaceId)
  const resolveLabel = useResolveLabel(workspaceId)

  const handleCreate = () => {
    if (!labelValue.trim()) return

    createLabel.mutate(
      {
        run_response_id: responseId,
        label_type: labelType,
        label_value: labelValue.trim(),
        notes: notes.trim() || undefined,
      },
      {
        onSuccess: () => {
          setLabelValue('')
          setNotes('')
          setOpen(false)
        },
      }
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Labels</h3>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button size="sm" variant="outline" className="h-8">
              <Plus className="h-3 w-3 mr-1" />
              Add Label
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select value={labelType} onValueChange={setLabelType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="anomaly">Anomaly</SelectItem>
                    <SelectItem value="quality_issue">Quality Issue</SelectItem>
                    <SelectItem value="notable">Notable</SelectItem>
                    <SelectItem value="flagged">Flagged</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Value</label>
                <Input
                  value={labelValue}
                  onChange={(e) => setLabelValue(e.target.value)}
                  placeholder="Enter label value"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Notes (optional)</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleCreate}
                  disabled={!labelValue.trim() || createLabel.isPending}
                >
                  {createLabel.isPending ? 'Creating...' : 'Create'}
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-wrap gap-2">
        {labels.length === 0 && (
          <p className="text-sm text-muted-foreground">No labels yet</p>
        )}
        {labels.map((label) => {
          const color = labelColors[label.label_type] || labelColors.flagged
          const isResolved = !!label.resolved_at

          return (
            <div
              key={label.id}
              className={cn(
                'inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium',
                color,
                isResolved && 'opacity-50'
              )}
            >
              <span>
                {label.label_value}
                {isResolved && ' (Resolved)'}
              </span>
              <div className="flex items-center gap-1">
                {!isResolved && (
                  <button
                    onClick={() => resolveLabel.mutate(label.id)}
                    disabled={resolveLabel.isPending}
                    className="hover:opacity-70 transition-opacity text-xs underline"
                  >
                    Resolve
                  </button>
                )}
                <button
                  onClick={() => deleteLabel.mutate(label.id)}
                  disabled={deleteLabel.isPending}
                  className="hover:opacity-70 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
