'use client'

import { useDashboardCampaign } from '@/lib/hooks/use-dashboard-campaign'
import { useCampaigns } from '@/lib/hooks/use-campaigns'
import { useWorkspaces } from '@/lib/hooks/use-workspaces'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function CampaignSelector() {
  const { workspaceId, campaignId, setSelection, isReady } = useDashboardCampaign()
  const { data: workspaces, isLoading: wsLoading } = useWorkspaces()
  const { data: campaigns, isLoading: campLoading } = useCampaigns(workspaceId)

  if (!isReady) return null

  return (
    <div className="flex items-center gap-3 mb-6">
      {/* Workspace Selector */}
      <Select
        value={workspaceId?.toString() ?? ''}
        onValueChange={(val) => setSelection({ workspaceId: Number(val) })}
      >
        <SelectTrigger className="w-[200px]" aria-label="Select workspace">
          <SelectValue placeholder={wsLoading ? 'Loading...' : 'Select Workspace'} />
        </SelectTrigger>
        <SelectContent>
          {workspaces?.map((ws) => (
            <SelectItem key={ws.id} value={ws.id.toString()}>
              {ws.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Campaign Selector */}
      <Select
        value={campaignId?.toString() ?? ''}
        onValueChange={(val) => setSelection({ campaignId: Number(val) })}
        disabled={!workspaceId}
      >
        <SelectTrigger className="w-[240px]" aria-label="Select campaign">
          <SelectValue placeholder={
            !workspaceId ? 'Select workspace first'
            : campLoading ? 'Loading...'
            : campaigns?.length === 0 ? 'No campaigns available'
            : 'Select Campaign'
          } />
        </SelectTrigger>
        <SelectContent>
          {campaigns?.map((c) => (
            <SelectItem key={c.id} value={c.id.toString()}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
