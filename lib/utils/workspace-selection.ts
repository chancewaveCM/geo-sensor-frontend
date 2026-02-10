const DASHBOARD_SELECTION_KEY = 'geo-dashboard-campaign'
const LEGACY_WORKSPACE_KEY = 'current_workspace_id'

export interface DashboardSelection {
  workspaceId?: number
  campaignId?: number
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0
}

function parseLegacyWorkspaceId(value: string | null): number | undefined {
  if (!value) return undefined
  const parsed = Number.parseInt(value, 10)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined
}

export function readDashboardSelection(): DashboardSelection {
  if (typeof window === 'undefined') return {}

  let workspaceId: number | undefined
  let campaignId: number | undefined

  const raw = localStorage.getItem(DASHBOARD_SELECTION_KEY)
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Record<string, unknown>
      if (isPositiveInteger(parsed.workspaceId)) {
        workspaceId = parsed.workspaceId
      }
      if (isPositiveInteger(parsed.campaignId)) {
        campaignId = parsed.campaignId
      }
    } catch {
      // Ignore malformed dashboard selection payloads.
    }
  }

  if (!workspaceId) {
    workspaceId = parseLegacyWorkspaceId(localStorage.getItem(LEGACY_WORKSPACE_KEY))
  }

  return { workspaceId, campaignId }
}

export function writeDashboardSelection(selection: DashboardSelection): void {
  if (typeof window === 'undefined') return

  const normalized: DashboardSelection = {}
  if (isPositiveInteger(selection.workspaceId)) {
    normalized.workspaceId = selection.workspaceId
  }
  if (isPositiveInteger(selection.campaignId)) {
    normalized.campaignId = selection.campaignId
  }

  localStorage.setItem(DASHBOARD_SELECTION_KEY, JSON.stringify(normalized))

  if (normalized.workspaceId) {
    localStorage.setItem(LEGACY_WORKSPACE_KEY, String(normalized.workspaceId))
  } else {
    localStorage.removeItem(LEGACY_WORKSPACE_KEY)
  }
}

export function getSelectedWorkspaceId(): number | null {
  return readDashboardSelection().workspaceId ?? null
}
