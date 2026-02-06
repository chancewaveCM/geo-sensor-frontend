'use client'

import { useState } from 'react'
import { RiskMetricCard } from '@/components/stitch/dashboard/brand-safety/RiskMetricCard'
import { IncidentList, Incident } from '@/components/stitch/dashboard/brand-safety/IncidentList'
import { SentimentGauge } from '@/components/stitch/dashboard/brand-safety/SentimentGauge'
import { RiskTimeline, TimelineEvent } from '@/components/stitch/dashboard/brand-safety/RiskTimeline'
import { SafetyActionPanel } from '@/components/stitch/dashboard/brand-safety/SafetyActionPanel'
import { Button } from '@/components/ui/button'
import { RefreshCw, Settings } from 'lucide-react'

// Mock data
const mockIncidents: Incident[] = [
  {
    id: '#AI-9482',
    severity: 'critical',
    title: 'Hallucination: Bankruptcy Claim Detected',
    description: 'AI is fabricating bankruptcy claims about the company without factual basis.',
    source: 'ChatGPT-4',
    timestamp: '2 mins ago',
    quote: '"According to recent reports, the GEO Corp parent company filed for Chapter 11 bankruptcy in early 2024 following its failed acquisition..."'
  },
  {
    id: '#AI-9467',
    severity: 'warning',
    title: 'Misinformation: Outdated Product Pricing',
    description: 'AI is citing the 2022 Enterprise subscription rates ($499/mo) instead of the current 2024 rates ($649/mo).',
    source: 'Perplexity',
    timestamp: '14 mins ago'
  },
  {
    id: '#AI-9431',
    severity: 'safe',
    title: 'Verified: Quarterly Earnings Report',
    description: 'AI accurately cited Q3 earnings with correct figures and sources.',
    source: 'Anthropic Claude',
    timestamp: '45 mins ago',
    quote: '"GEO Sensor Platform announced its Q3 earnings today, showing a 15% increase in year-over-year revenue..."'
  }
]

const mockTimelineEvents: TimelineEvent[] = [
  {
    id: '1',
    timestamp: '10:42 AM',
    datetime: '2024-01-01T10:42:00',
    severity: 'critical',
    title: 'Negative citation spike',
    description: 'Social Media & News Feed'
  },
  {
    id: '2',
    timestamp: '09:15 AM',
    datetime: '2024-01-01T09:15:00',
    severity: 'warning',
    title: 'Sentiment deviation detected',
    description: 'Reddit r/technology'
  },
  {
    id: '3',
    timestamp: '08:30 AM',
    datetime: '2024-01-01T08:30:00',
    severity: 'info',
    title: 'New AI crawler detected',
    description: 'Corporate Domain Index'
  }
]

export default function BrandSafetyPage() {
  const [activeTab, setActiveTab] = useState<'realtime' | 'flagged' | 'history'>('realtime')
  const [safetySettings, setSafetySettings] = useState({ shieldActive: true })

  const handleAction = (action: 'refresh' | 'config') => {
    console.log(`Action triggered: ${action}`)
  }

  const handleRefresh = () => {
    console.log('Refreshing data...')
  }

  const handleConfig = () => {
    console.log('Opening configuration...')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Alert Summary Bar */}
      <div className="bg-gray-900 text-white px-6 py-4" role="status" aria-live="polite">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex gap-4 items-center flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-2">
              System Status:
            </span>
            <RiskMetricCard level="critical" count={12} description="critical incidents" />
            <RiskMetricCard level="warning" count={45} description="warnings" />
            <RiskMetricCard level="safe" count={1240} description="safe responses" />
            <div className="flex items-center gap-2 bg-gray-700 border border-gray-600 px-3 py-1 rounded-full ml-2">
              <span className="text-xs font-bold text-gray-300">TOTAL: 1,297</span>
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
              <IncidentList incidents={mockIncidents} />
            </div>
          </div>
        </section>

        {/* Right Panel: Side Stats (30%) */}
        <aside className="flex-[0.3] flex flex-col gap-6">
          {/* Sentiment Gauge */}
          <SentimentGauge positive={856} neutral={384} negative={57} />

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
          <RiskTimeline events={mockTimelineEvents} />

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
