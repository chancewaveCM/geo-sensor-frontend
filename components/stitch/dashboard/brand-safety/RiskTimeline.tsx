'use client'

import { useState } from 'react'
import { cn } from "@/lib/utils"

export interface TimelineEvent {
  id: string
  timestamp: string
  datetime: string
  severity: 'critical' | 'warning' | 'info'
  title: string
  description: string
}

export interface RiskTimelineProps {
  events: TimelineEvent[]
  className?: string
}

const severityConfig = {
  critical: {
    dotColor: 'bg-destructive',
    ringColor: 'ring-destructive/10'
  },
  warning: {
    dotColor: 'bg-warning',
    ringColor: 'ring-warning/10'
  },
  info: {
    dotColor: 'bg-info',
    ringColor: 'ring-info/10'
  }
}

function TimelineEventItem({ event, onClick }: { event: TimelineEvent; onClick: () => void }) {
  const config = severityConfig[event.severity]

  return (
    <li className="flex gap-4 items-start">
      <div
        className={cn(
          "size-4 rounded-full ring-4 relative z-10 translate-y-1 flex-shrink-0",
          config.dotColor,
          config.ringColor
        )}
        aria-hidden="true"
      />
      <button
        onClick={onClick}
        className="text-left hover:bg-muted/50 rounded p-1 -m-1 transition-colors flex-1"
      >
        <p className="text-xs font-bold text-foreground">{event.title}</p>
        <p className="text-[10px] text-muted-foreground">{event.description}</p>
        <time className="text-[9px] text-muted-foreground/70" dateTime={event.datetime}>
          {event.timestamp}
        </time>
      </button>
    </li>
  )
}

export function RiskTimeline({ events, className }: RiskTimelineProps) {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null)

  return (
    <div className={cn("rounded-lg border bg-card shadow-sm overflow-hidden", className)}>
      <div className="px-4 py-3 border-b border-border/50 bg-muted/50">
        <h3 className="font-bold text-foreground text-sm">Threat Detection Log</h3>
      </div>
      <div className="p-6 relative">
        {/* Timeline vertical line */}
        <div className="absolute left-6 top-6 bottom-6 w-px bg-border" aria-hidden="true" />

        <ul className="space-y-6 relative" role="list">
          {events.map((event) => (
            <TimelineEventItem
              key={event.id}
              event={event}
              onClick={() => setSelectedEvent(event)}
            />
          ))}
        </ul>

        {events.length === 0 && (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No threat events detected
          </div>
        )}
      </div>

      {/* Event detail modal/panel could be added here */}
      {selectedEvent && (
        <div className="px-6 pb-6 pt-0 border-t bg-muted/30 animate-in fade-in duration-200">
          <div className="pt-4">
            <h4 className="font-bold text-sm text-foreground mb-2">{selectedEvent.title}</h4>
            <p className="text-xs text-muted-foreground mb-2">{selectedEvent.description}</p>
            <p className="text-xs text-muted-foreground">
              <time dateTime={selectedEvent.datetime}>{selectedEvent.timestamp}</time>
            </p>
            <button
              onClick={() => setSelectedEvent(null)}
              className="mt-3 text-xs text-primary hover:underline"
            >
              Close details
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
