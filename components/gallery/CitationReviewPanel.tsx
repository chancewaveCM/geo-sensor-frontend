'use client'

import { useCreateCitationReview, useVerifyCitation } from '@/lib/hooks/use-gallery'
import type { RunCitation } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { CheckCircle2, XCircle, AlertCircle, Check } from 'lucide-react'
import { toast } from 'sonner'

interface CitationReviewPanelProps {
  citations: RunCitation[]
  workspaceId: number
}

const reviewColors: Record<string, string> = {
  false_positive: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20',
  false_negative: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20',
  correct: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
}

export function CitationReviewPanel({ citations, workspaceId }: CitationReviewPanelProps) {
  const createReview = useCreateCitationReview(workspaceId)
  const verifyCitation = useVerifyCitation(workspaceId)

  const handleReview = (citationId: number, reviewType: string) => {
    createReview.mutate(
      {
        run_citation_id: citationId,
        review_type: reviewType,
      },
      {
        onError: () => {
          toast.error('Failed to submit citation review')
        },
      }
    )
  }

  const handleVerify = (citationId: number) => {
    verifyCitation.mutate(citationId, {
      onError: () => {
        toast.error('Failed to verify citation')
      },
    })
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">Citations ({citations.length})</h3>

      {citations.length === 0 ? (
        <p className="text-sm text-muted-foreground">No citations found</p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Target</TableHead>
                <TableHead className="w-20 text-center">Conf.</TableHead>
                <TableHead className="w-32">Status</TableHead>
                <TableHead className="w-40 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {citations.map((citation) => (
                <TableRow key={citation.id}>
                  <TableCell className="font-medium text-muted-foreground">
                    {citation.position_in_response}
                  </TableCell>
                  <TableCell className="font-medium text-orange-500">
                    {citation.cited_brand}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {citation.is_target_brand ? 'Yes' : 'No'}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-xs font-medium">
                      {(citation.confidence_score * 100).toFixed(0)}%
                    </span>
                  </TableCell>
                  <TableCell>
                    {citation.is_verified && (
                      <Badge
                        className={cn(
                          'text-xs border',
                          'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20'
                        )}
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-xs"
                        onClick={() => handleReview(citation.id, 'false_positive')}
                        disabled={createReview.isPending}
                        title="Mark as False Positive"
                      >
                        <XCircle className="h-3 w-3 text-red-500" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-xs"
                        onClick={() => handleReview(citation.id, 'false_negative')}
                        disabled={createReview.isPending}
                        title="Mark as False Negative"
                      >
                        <AlertCircle className="h-3 w-3 text-orange-500" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-xs"
                        onClick={() => handleReview(citation.id, 'correct')}
                        disabled={createReview.isPending}
                        title="Confirm"
                      >
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                      </Button>
                      {!citation.is_verified && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-2 text-xs ml-1"
                          onClick={() => handleVerify(citation.id)}
                          disabled={verifyCitation.isPending}
                        >
                          Verify
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
