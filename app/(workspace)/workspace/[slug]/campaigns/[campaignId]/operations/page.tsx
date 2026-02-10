'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { OperationsLog } from '@/components/gallery/OperationsLog'
import { CreateOperationDialog } from '@/components/gallery/CreateOperationDialog'
import { useOperations } from '@/lib/hooks/use-gallery'
import { useWorkspaces } from '@/lib/hooks/use-workspaces'

export default function OperationsPage() {
  const params = useParams()
  const slug = params.slug as string

  const { data: workspaces } = useWorkspaces()
  const workspace = workspaces?.find((w) => w.slug === slug)
  const workspaceId = workspace?.id

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const { data: operationsData, isLoading } = useOperations(workspaceId)

  const operations = operationsData ?? []

  // Stats from ALL operations (unfiltered)
  const stats = {
    pending: operations.filter((op) => op.status === 'pending').length,
    approved: operations.filter((op) => op.status === 'approved').length,
    rejected: operations.filter((op) => op.status === 'rejected').length,
  }

  // Filter for display only
  const filteredOperations = statusFilter === 'all'
    ? operations
    : operations.filter((op) => op.status === statusFilter)

  if (!workspaceId) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">Loading workspace...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Operations</h1>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Operation
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Pending</div>
          <div className="text-2xl font-bold">{stats.pending}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Approved</div>
          <div className="text-2xl font-bold">{stats.approved}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground">Rejected</div>
          <div className="text-2xl font-bold">{stats.rejected}</div>
        </Card>
      </div>

      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={statusFilter} className="mt-4">
          {isLoading ? (
            <div className="rounded-lg border p-8 text-center">
              <p className="text-sm text-muted-foreground">Loading operations...</p>
            </div>
          ) : (
            <OperationsLog
              operations={filteredOperations}
              workspaceId={workspaceId}
              isAdmin={(workspace?.my_role ?? workspace?.user_role) === 'admin'}
            />
          )}
        </TabsContent>
      </Tabs>

      <CreateOperationDialog
        workspaceId={workspaceId}
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  )
}
