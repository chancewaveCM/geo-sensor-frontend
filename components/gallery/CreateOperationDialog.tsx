'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useCreateOperation } from '@/lib/hooks/use-gallery'
import type { OperationLogCreate } from '@/lib/types'

interface CreateOperationDialogProps {
  workspaceId: number
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultValues?: Partial<OperationLogCreate>
}

export function CreateOperationDialog({
  workspaceId,
  open,
  onOpenChange,
  defaultValues,
}: CreateOperationDialogProps) {
  const createMutation = useCreateOperation(workspaceId)
  const [formData, setFormData] = useState<OperationLogCreate>({
    operation_type: defaultValues?.operation_type || 'promote_to_anchor',
    target_type: defaultValues?.target_type || 'query',
    target_id: defaultValues?.target_id || 0,
    payload: defaultValues?.payload || {},
  })
  const [payloadText, setPayloadText] = useState(
    defaultValues?.payload ? JSON.stringify(defaultValues.payload, null, 2) : ''
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let parsedPayload: Record<string, unknown> = {}
    if (payloadText.trim()) {
      try {
        parsedPayload = JSON.parse(payloadText)
      } catch {
        parsedPayload = { description: payloadText }
      }
    }
    createMutation.mutate(
      { ...formData, payload: parsedPayload },
      {
        onSuccess: () => {
          onOpenChange(false)
          setFormData({
            operation_type: 'promote_to_anchor',
            target_type: 'query',
            target_id: 0,
            payload: {},
          })
          setPayloadText('')
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Operation</DialogTitle>
            <DialogDescription>
              Submit a new operation request for review
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Operation Type</label>
              <Select
                value={formData.operation_type}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, operation_type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="promote_to_anchor">Promote to Anchor</SelectItem>
                  <SelectItem value="anchor_change_request">Anchor Change Request</SelectItem>
                  <SelectItem value="parser_issue">Parser Issue</SelectItem>
                  <SelectItem value="archive">Archive</SelectItem>
                  <SelectItem value="export">Export</SelectItem>
                  <SelectItem value="label_action">Label Action</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Target Type (optional)</label>
              <Select
                value={formData.target_type || ''}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, target_type: value || undefined }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select target type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="query">Query</SelectItem>
                  <SelectItem value="citation">Citation</SelectItem>
                  <SelectItem value="response">Response</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Target ID (optional)</label>
              <Input
                type="number"
                value={formData.target_id ?? ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    target_id: e.target.value ? parseInt(e.target.value) : undefined,
                  }))
                }
                placeholder="Enter target ID"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Details</label>
              <Textarea
                value={payloadText}
                onChange={(e) => setPayloadText(e.target.value)}
                placeholder="Describe the operation or enter JSON payload..."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
