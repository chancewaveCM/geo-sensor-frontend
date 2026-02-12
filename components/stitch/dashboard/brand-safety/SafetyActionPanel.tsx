'use client'

import { useState } from 'react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Shield, RefreshCw, Settings, CheckCircle } from 'lucide-react'

export interface SafetySettings {
  shieldActive: boolean
}

export interface SafetyActionPanelProps {
  onAction: (action: 'refresh' | 'config') => void
  settings: SafetySettings
  onSettingsChange: (settings: SafetySettings) => void
  className?: string
}

export function SafetyActionPanel({
  onAction,
  settings,
  onSettingsChange,
  className
}: SafetyActionPanelProps) {
  const [isToggling, setIsToggling] = useState(false)

  const handleShieldToggle = async (checked: boolean) => {
    setIsToggling(true)
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 500))
    onSettingsChange({ ...settings, shieldActive: checked })
    setIsToggling(false)
  }

  return (
    <section
      className={cn(
        "rounded-lg p-5 text-white shadow-lg",
        "bg-gradient-to-br from-brand-navy to-brand-navy-light",
        className
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-white/70" aria-hidden="true" />
          <span className="text-sm font-bold uppercase tracking-wider">Quick Shield</span>
        </div>
        <Switch
          checked={settings.shieldActive}
          onCheckedChange={handleShieldToggle}
          disabled={isToggling}
          aria-label="Toggle automatic response blocking"
          className="data-[state=checked]:bg-success"
        />
      </div>

      <p className="text-xs text-white/70 leading-relaxed mb-4">
        {settings.shieldActive ? (
          <>
            Automatic AI response blocking is <strong>ACTIVE</strong>. Hallucinations with high
            risk scores will be intercepted automatically.
          </>
        ) : (
          <>
            Automatic AI response blocking is <strong>DISABLED</strong>. Critical incidents will
            require manual review and action.
          </>
        )}
      </p>

      <div
        className={cn(
          "flex items-center gap-2 text-[10px] font-bold px-2 py-1 rounded mb-4",
          settings.shieldActive
            ? "text-success bg-success/10"
            : "text-warning bg-warning/10"
        )}
        role="status"
      >
        <CheckCircle className="h-3 w-3" aria-hidden="true" />
        {settings.shieldActive ? 'ALL SYSTEMS OPTIMAL' : 'MANUAL MONITORING MODE'}
      </div>

      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1 bg-background/10 hover:bg-background/20 text-white text-xs font-bold border-0"
          onClick={() => onAction('refresh')}
          aria-label="Refresh data"
        >
          <RefreshCw className="h-3 w-3 mr-1" aria-hidden="true" />
          REFRESH
        </Button>
        <Button
          variant="secondary"
          size="sm"
          className="flex-1 bg-background/10 hover:bg-background/20 text-white text-xs font-bold border-0"
          onClick={() => onAction('config')}
          aria-label="Open configuration"
        >
          <Settings className="h-3 w-3 mr-1" aria-hidden="true" />
          CONFIG
        </Button>
      </div>
    </section>
  )
}
