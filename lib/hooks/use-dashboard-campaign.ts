'use client'

import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'geo-dashboard-campaign'

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
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setSelectionState({
          workspaceId: parsed.workspaceId ?? undefined,
          campaignId: parsed.campaignId ?? undefined,
        })
      }
    } catch {
      // Ignore parse errors
    }
    setIsReady(true)
  }, [])

  const setSelection = useCallback((update: Partial<DashboardCampaignSelection>) => {
    setSelectionState((prev) => {
      const next = { ...prev, ...update }
      // If workspace changed, clear campaign
      if (update.workspaceId !== undefined && update.workspaceId !== prev.workspaceId) {
        next.campaignId = undefined
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // Ignore storage errors
      }
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
