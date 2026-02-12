'use client'

import { useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { useReviewOperation, useCancelOperation } from '@/lib/hooks/use-gallery'
import type { OperationLog } from '@/types'

interface OperationsLogProps {
  operations: OperationLog[]
  workspaceId: number
  isAdmin?: boolean
}

export function OperationsLog({ operations, workspaceId, isAdmin = false }: OperationsLogProps) {
  const reviewMutation = useReviewOperation(workspaceId)
  const cancelMutation = useCancelOperation(workspaceId)
  const [reviewDialog, setReviewDialog] = useState<{
    operationId: number
    action: 'approved' | 'rejected'
  } | null>(null)
  const [reviewComment, setReviewComment] = useState('')

  const handleReview = () => {
    if (reviewDialog) {
      reviewMutation.mutate(
        {
          operationId: reviewDialog.operationId,
          status: reviewDialog.action,
          review_comment: reviewComment || undefined,
        },
        {
          onSuccess: () => {
            setReviewDialog(null)
            setReviewComment('')
          },
        }
      )
    }
  }

  const getTypeBadge = (type: string) => {
    const variants: Record<string, { color: string; label: string }> = {
      promote_to_anchor: { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400', label: 'Promote' },
      anchor_change_request: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400', label: 'Change Request' },
      parser_issue: { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400', label: 'Parser Issue' },
      archive: { color: 'bg-muted text-muted-foreground', label: 'Archive' },
      export: { color: 'bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400', label: 'Export' },
      label_action: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', label: 'Label Action' },
    }
    const variant = variants[type] || { color: 'bg-muted text-muted-foreground', label: type }
    return <Badge className={variant.color}>{variant.label}</Badge>
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; label: string }> = {
      pending: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400', label: 'Pending' },
      approved: { color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400', label: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400', label: 'Rejected' },
      cancelled: { color: 'bg-muted text-muted-foreground', label: 'Cancelled' },
    }
    const variant = variants[status] || { color: 'bg-muted text-muted-foreground', label: status }
    return <Badge className={variant.color}>{variant.label}</Badge>
  }

  const formatPayload = (payload: string | null): string => {
    if (!payload) return 'N/A'
    try {
      const parsed = JSON.parse(payload)
      return typeof parsed === 'object' ? JSON.stringify(parsed, null, 0) : String(parsed)
    } catch {
      return payload
    }
  }

  if (operations.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <p className="text-sm text-muted-foreground">No operations found</p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Payload</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {operations.map((op) => (
              <TableRow key={op.id}>
                <TableCell>{getTypeBadge(op.operation_type)}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    {op.target_type && (
                      <div className="font-medium">{op.target_type}</div>
                    )}
                    {op.target_id != null && (
                      <div className="text-muted-foreground">ID: {op.target_id}</div>
                    )}
                    {!op.target_type && op.target_id == null && (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <p className="max-w-md truncate text-sm">{formatPayload(op.payload)}</p>
                </TableCell>
                <TableCell>{getStatusBadge(op.status)}</TableCell>
                <TableCell>
                  <p className="text-sm text-muted-foreground">
                    {new Date(op.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {isAdmin && op.status === 'pending' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setReviewDialog({ operationId: op.id, action: 'approved' })}
                          disabled={reviewMutation.isPending}
                        >
                          <CheckCircle className="mr-1 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setReviewDialog({ operationId: op.id, action: 'rejected' })}
                          disabled={reviewMutation.isPending}
                        >
                          <XCircle className="mr-1 h-4 w-4" />
                          Reject
                        </Button>
                      </>
                    )}
                    {!isAdmin && op.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => cancelMutation.mutate(op.id)}
                        disabled={cancelMutation.isPending}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={reviewDialog !== null} onOpenChange={() => setReviewDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewDialog?.action === 'approved' ? 'Approve Operation' : 'Reject Operation'}
            </DialogTitle>
            <DialogDescription>
              Add a comment to explain your decision (optional)
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="Enter review comment..."
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialog(null)}>
              Cancel
            </Button>
            <Button onClick={handleReview} disabled={reviewMutation.isPending}>
              {reviewDialog?.action === 'approved' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
