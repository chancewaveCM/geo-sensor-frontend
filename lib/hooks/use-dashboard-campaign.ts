'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  readDashboardSelection,
  writeDashboardSelection,
} from '@/lib/utils/workspace-selection'

interface DashboardCampaignSelection {
  workspaceId: number | undefined
  campaignId: number | undefined
}

interface UseDashboardCampaignReturn {
  workspaceId: number | undefined
  campaignId: number | undefined
  setSelection: (selection: Partial<DashboardCampaignSelection>) => void
  isReady: boolean
}

export function useDashboardCampaign(): UseDashboardCampaignReturn {
  const [selection, setSelectionState] = useState<DashboardCampaignSelection>({
    workspaceId: undefined,
    campaignId: undefined,
  })
  const [isReady, setIsReady] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const { workspaceId, campaignId } = readDashboardSelection()
    setSelectionState({ workspaceId, campaignId })
    setIsReady(true)
  }, [])

  const setSelection = useCallback((update: Partial<DashboardCampaignSelection>) => {
    setSelectionState((prev) => {
      const next = { ...prev, ...update }
      // If workspace changed, clear campaign
      if (update.workspaceId !== undefined && update.workspaceId !== prev.workspaceId) {
        next.campaignId = undefined
      }
      writeDashboardSelection(next)
      return next
    })
  }, [])

  return {
    workspaceId: selection.workspaceId,
    campaignId: selection.campaignId,
    setSelection,
    isReady,
  }
}
