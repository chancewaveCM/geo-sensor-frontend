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
    borderColor: 'border-l-red-500',
    bgColor: 'bg-red-50/50',
    badgeBg: 'bg-red-100',
    badgeText: 'text-red-600',
    label: 'CRITICAL'
  },
  warning: {
    borderColor: 'border-l-amber-500',
    bgColor: 'bg-amber-50/50',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-600',
    label: 'WARNING'
  },
  safe: {
    borderColor: 'border-l-emerald-500',
    bgColor: 'bg-white',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-600',
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
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            {sourceIcons[incident.source] || <Bot className="h-4 w-4" />}
            <span>{incident.source}</span>
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full" aria-hidden="true" />
          <time className="text-xs text-gray-400" dateTime={incident.timestamp}>
            {incident.timestamp}
          </time>
        </div>
        <span className="text-xs text-slate-400">ID: {incident.id}</span>
      </div>

      <div className="space-y-2 mt-3">
        <h3 id={`incident-${incident.id}-title`} className="font-bold text-slate-900">
          {incident.title}
        </h3>
        {incident.quote ? (
          <blockquote className="text-sm text-slate-600 leading-relaxed italic border-l-2 border-gray-200 pl-3 line-clamp-2">
            {incident.quote}
          </blockquote>
        ) : (
          <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
            {incident.description}
          </p>
        )}
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 animate-in fade-in duration-200">
          <p className="text-sm text-slate-600 leading-relaxed">
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
