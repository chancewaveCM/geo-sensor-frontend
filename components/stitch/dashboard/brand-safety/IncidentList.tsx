'use client'

import { useState } from 'react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Bot,
  Sparkles,
  Cloud,
  ChevronDown,
  ChevronUp,
  CheckCircle
} from 'lucide-react'

export interface Incident {
  id: string
  severity: 'critical' | 'warning' | 'safe'
  title: string
  description: string
  source: string
  timestamp: string
  quote?: string
}

export interface IncidentListProps {
  incidents: Incident[]
  className?: string
}

const severityConfig = {
  critical: {
    borderColor: 'border-l-destructive',
    bgColor: 'bg-destructive/5',
    badgeBg: 'bg-destructive/10',
    badgeText: 'text-destructive',
    label: 'CRITICAL'
  },
  warning: {
    borderColor: 'border-l-warning',
    bgColor: 'bg-warning/5',
    badgeBg: 'bg-warning/10',
    badgeText: 'text-warning',
    label: 'WARNING'
  },
  safe: {
    borderColor: 'border-l-success',
    bgColor: 'bg-card',
    badgeBg: 'bg-success/10',
    badgeText: 'text-success',
    label: 'SAFE'
  }
}

const sourceIcons: Record<string, React.ReactNode> = {
  'ChatGPT-4': <Bot className="h-4 w-4" />,
  'Perplexity': <Sparkles className="h-4 w-4" />,
  'Anthropic Claude': <Cloud className="h-4 w-4" />,
  'Safe': <CheckCircle className="h-4 w-4" />
}

function IncidentCard({ incident }: { incident: Incident }) {
  const [expanded, setExpanded] = useState(false)
  const config = severityConfig[incident.severity]

  return (
    <article
      className={cn(
        "rounded-lg border border-l-4 p-6 shadow-sm transition-all hover:shadow-md",
        config.borderColor,
        config.bgColor
      )}
      role="alert"
      aria-labelledby={`incident-${incident.id}-title`}
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className={cn(
              "px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest",
              config.badgeBg,
              config.badgeText
            )}
            aria-label={`${config.label} severity`}
          >
            {config.label}
          </span>
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
            {sourceIcons[incident.source] || <Bot className="h-4 w-4" />}
            <span>{incident.source}</span>
          </div>
          <div className="w-1 h-1 bg-border rounded-full" aria-hidden="true" />
          <time className="text-xs text-muted-foreground/70" dateTime={incident.timestamp}>
            {incident.timestamp}
          </time>
        </div>
        <span className="text-xs text-muted-foreground/70">ID: {incident.id}</span>
      </div>

      <div className="space-y-2 mt-3">
        <h3 id={`incident-${incident.id}-title`} className="font-bold text-foreground">
          {incident.title}
        </h3>
        {incident.quote ? (
          <blockquote className="text-sm text-muted-foreground leading-relaxed italic border-l-2 border-border pl-3 line-clamp-2">
            {incident.quote}
          </blockquote>
        ) : (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {incident.description}
          </p>
        )}
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-border animate-in fade-in duration-200">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {incident.description}
          </p>
        </div>
      )}

      <div className="flex justify-end gap-2 mt-3">
        <Button
          variant="outline"
          size="sm"
          className="text-xs font-bold"
          onClick={() => setExpanded(!expanded)}
          aria-label={expanded ? `Collapse details for ${incident.id}` : `View details for ${incident.id}`}
        >
          {expanded ? (
            <>
              <ChevronUp className="h-3 w-3 mr-1" />
              Hide Details
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3 mr-1" />
              View Details
            </>
          )}
        </Button>
        {incident.severity !== 'safe' && (
          <Button
            size="sm"
            className="text-xs font-bold bg-primary text-white hover:bg-primary/90"
            aria-label={`Suggest correction for ${incident.id}`}
          >
            Suggest Correction
          </Button>
        )}
      </div>
    </article>
  )
}

export function IncidentList({ incidents, className }: IncidentListProps) {
  return (
    <div className={cn("space-y-4", className)} role="feed" aria-live="polite">
      {incidents.map((incident) => (
        <IncidentCard key={incident.id} incident={incident} />
      ))}
    </div>
  )
}
