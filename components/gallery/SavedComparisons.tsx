'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { LoadingCard } from '@/components/ui/loading-card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useComparisons, useDeleteComparison } from '@/lib/hooks/use-gallery'
import type { ComparisonSnapshot } from '@/types'

interface SavedComparisonsProps {
  workspaceId: number
}

export function SavedComparisons({ workspaceId }: SavedComparisonsProps) {
  const { data: comparisons, isLoading } = useComparisons(workspaceId)
  const deleteMutation = useDeleteComparison(workspaceId)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, {
        onSuccess: () => setDeleteId(null),
      })
    }
  }

  if (isLoading) {
    return <LoadingCard type="list-item" count={2} />
  }

  if (!comparisons || comparisons.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-sm text-muted-foreground">No saved comparisons yet</p>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-2">
        {comparisons.map((comparison: ComparisonSnapshot) => (
          <Card key={comparison.id} className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{comparison.name}</h4>
                  <Badge
                    variant="outline"
                    className={
                      comparison.comparison_type === 'llm_vs_llm'
                        ? 'border-blue-500 text-blue-700'
                        : comparison.comparison_type === 'date_vs_date'
                        ? 'border-purple-500 text-purple-700'
                        : 'border-orange-500 text-orange-700'
                    }
                  >
                    {comparison.comparison_type}
                  </Badge>
                </div>
                {comparison.notes && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {comparison.notes}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  {new Date(comparison.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDeleteId(comparison.id)}
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comparison</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comparison? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
