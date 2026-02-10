'use client'

import { useState } from 'react'
import { RiskMetricCard } from '@/components/stitch/dashboard/brand-safety/RiskMetricCard'
import { IncidentList, Incident } from '@/components/stitch/dashboard/brand-safety/IncidentList'
import { SentimentGauge } from '@/components/stitch/dashboard/brand-safety/SentimentGauge'
import { RiskTimeline, TimelineEvent } from '@/components/stitch/dashboard/brand-safety/RiskTimeline'
import { SafetyActionPanel } from '@/components/stitch/dashboard/brand-safety/SafetyActionPanel'
import { Button } from '@/components/ui/button'
import { RefreshCw, Settings } from 'lucide-react'
import { CampaignSelector } from '@/components/stitch/dashboard/CampaignSelector'
import { useDashboardCampaign } from '@/lib/hooks/use-dashboard-campaign'
import { useBrandSafety } from '@/lib/hooks/use-campaigns'

function mapConfidenceToSeverity(score: number | null): 'critical' | 'warning' | 'safe' {
  if (score === null) return 'warning'
  if (score < 0.5) return 'critical'
  if (score < 0.7) return 'warning'
  return 'safe'
}

function mapConfidenceToTimelineSeverity(score: number | null): 'critical' | 'warning' | 'info' {
  if (score === null) return 'warning'
  if (score < 0.5) return 'critical'
  if (score < 0.7) return 'warning'
  return 'info'
}

export default function BrandSafetyPage() {
  const [activeTab, setActiveTab] = useState<'realtime' | 'flagged' | 'history'>('realtime')
  const [safetySettings, setSafetySettings] = useState({ shieldActive: true })

  const { workspaceId, campaignId } = useDashboardCampaign()
  const { data: brandSafety, isLoading, isError } = useBrandSafety(workspaceId, campaignId)

  const handleAction = (action: 'refresh' | 'config') => {
    // Action handled
  }

  const handleRefresh = () => {
    // Refresh data
  }

  const handleConfig = () => {
    // Open configuration
  }

  // Map data for IncidentList
  const incidents: Incident[] = (brandSafety?.recent_incidents ?? []).map(citation => ({
    id: String(citation.citation_id),
    severity: mapConfidenceToSeverity(citation.confidence_score),
    title: citation.cited_brand,
    description: citation.citation_span || 'No description available',
    source: citation.llm_provider,
    timestamp: new Date(citation.created_at).toLocaleString(),
  }))

  // Map data for RiskTimeline
  const timelineEvents: TimelineEvent[] = (brandSafety?.recent_incidents ?? []).slice(0, 10).map(citation => ({
    id: String(citation.citation_id),
    timestamp: new Date(citation.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    datetime: citation.created_at,
    severity: mapConfidenceToTimelineSeverity(citation.confidence_score),
    title: citation.cited_brand,
    description: citation.llm_provider || 'Unknown provider',
  }))

  // Show empty state when no campaign
  if (!campaignId) {
    return (
      <div className="min-h-screen bg-background">
        <div className="px-6 pt-6">
          <CampaignSelector />
        </div>
        <div className="flex items-center justify-center h-64 text-muted-foreground">
          Select a campaign above to view brand safety data.
        </div>
      </div>
    )
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="px-6 pt-6">
          <CampaignSelector />
        </div>
        <div className="space-y-6 p-6">
          <div className="h-16 rounded-lg bg-muted animate-pulse" />
          <div className="flex gap-6">
            <div className="flex-[0.7] h-96 rounded-lg bg-muted animate-pulse" />
            <div className="flex-[0.3] space-y-6">
              <div className="h-48 rounded-lg bg-muted animate-pulse" />
              <div className="h-48 rounded-lg bg-muted animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background">
        <div className="px-6 pt-6">
          <CampaignSelector />
        </div>
        <div className="flex items-center justify-center h-64 text-destructive">
          Failed to load brand safety data. Please try again later.
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Campaign Selector */}
      <div className="px-6 pt-6">
        <CampaignSelector />
      </div>

      {/* Alert Summary Bar */}
      <div className="bg-gray-900 text-white px-6 py-4" role="status" aria-live="polite">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4 items-center flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-2">
              System Status:
            </span>
            <RiskMetricCard level="critical" count={brandSafety?.critical_count ?? 0} description="critical incidents" />
            <RiskMetricCard level="warning" count={brandSafety?.warning_count ?? 0} description="warnings" />
            <RiskMetricCard level="safe" count={brandSafety?.safe_count ?? 0} description="safe responses" />
            <div className="flex items-center gap-2 bg-gray-700 border border-gray-600 px-3 py-1 rounded-full ml-2">
              <span className="text-xs font-bold text-gray-300">TOTAL: {(brandSafety?.total_citations ?? 0).toLocaleString()}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              className="bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold border-0"
              onClick={handleRefresh}
              aria-label="Refresh data"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              REFRESH
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold border-0"
              onClick={handleConfig}
              aria-label="Open configuration"
            >
              <Settings className="h-3 w-3 mr-1" />
              CONFIG
            </Button>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <main className="flex gap-6 px-6 py-6 overflow-hidden">
        {/* Left Panel: Live Monitor (70%) */}
        <section className="flex-[0.7] flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-foreground">Live AI Response Monitor</h2>
            <div className="flex gap-2">
              <span className="text-xs font-medium text-muted-foreground bg-card px-2 py-1 rounded border border-border">
                Active Filters: All Risk Levels
              </span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg flex flex-col overflow-hidden">
            {/* Monitor Tabs */}
            <div className="flex border-b border-border px-4" role="tablist">
              <button
                className={`px-4 py-3 text-sm font-bold transition-colors ${
                  activeTab === 'realtime'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                role="tab"
                aria-selected={activeTab === 'realtime'}
                onClick={() => setActiveTab('realtime')}
              >
                Real-time Feed
              </button>
              <button
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'flagged'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                role="tab"
                aria-selected={activeTab === 'flagged'}
                onClick={() => setActiveTab('flagged')}
              >
                Flagged Responses
              </button>
              <button
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'history'
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                role="tab"
                aria-selected={activeTab === 'history'}
                onClick={() => setActiveTab('history')}
              >
                Corrected History
              </button>
            </div>

            {/* Feed Content */}
            <div className="flex-1 overflow-y-auto p-4 max-h-[calc(100vh-320px)]">
              <IncidentList incidents={incidents} />
            </div>
          </div>
        </section>

        {/* Right Panel: Side Stats (30%) */}
        <aside className="flex-[0.3] flex flex-col gap-6">
          {/* Sentiment Gauge */}
          <SentimentGauge
            positive={brandSafety?.safe_count ?? 0}
            neutral={(brandSafety?.warning_count ?? 0) + (brandSafety?.unknown_count ?? 0)}
            negative={brandSafety?.critical_count ?? 0}
          />

          {/* Official Source Status Card */}
          <section className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-border/50 flex justify-between items-center bg-muted/50">
              <h3 className="font-bold text-foreground text-sm">Official Source Status</h3>
              <button className="p-1 hover:bg-accent rounded transition-colors">
                <span className="text-muted-foreground text-sm">ⓘ</span>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded bg-info/10 text-info flex items-center justify-center flex-shrink-0">
                    🌐
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">Corporate Website</p>
                    <p className="text-[10px] text-muted-foreground">Sync: 12 min ago</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-success/10 text-success text-[10px] font-bold rounded">
                  SYNCED
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded bg-muted text-muted-foreground flex items-center justify-center flex-shrink-0">
                    📄
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">SEC Filings Feed</p>
                    <p className="text-[10px] text-muted-foreground">Sync: 1 day ago</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-warning/10 text-warning text-[10px] font-bold rounded">
                  OUTDATED
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded bg-destructive/10 text-destructive flex items-center justify-center flex-shrink-0">
                    🔗
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">PR Newswire API</p>
                    <p className="text-[10px] text-muted-foreground">Last attempt: Failed</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-destructive/10 text-destructive text-[10px] font-bold rounded">
                  ERROR
                </span>
              </div>
              <button className="w-full py-2 border-2 border-dashed border-border rounded-lg text-xs font-bold text-muted-foreground hover:border-primary hover:text-primary transition-all">
                + Add Source
              </button>
            </div>
          </section>

          {/* Threat Detection Timeline */}
          <RiskTimeline events={timelineEvents} />

          {/* Quick Shield Toggle */}
          <SafetyActionPanel
            onAction={handleAction}
            settings={safetySettings}
            onSettingsChange={setSafetySettings}
          />
        </aside>
      </main>
    </div>
  )
}
