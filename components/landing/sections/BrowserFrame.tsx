import { type ReactNode } from 'react'

export function BrowserFrame({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
      <div className="flex h-11 items-center gap-2 border-b border-border bg-muted/40 px-4">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        <div className="ml-3 rounded-md border border-border bg-card px-3 py-1 text-[11px] text-muted-foreground">
          app.geo-sensor.ai/dashboard
        </div>
      </div>
      <div className="bg-card p-5">{children}</div>
    </div>
  )
}
