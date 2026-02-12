function MiniBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[11px] font-medium text-muted-foreground">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-brand-orange to-brand-navy"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

export function MiniDashboard() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-border bg-muted/30 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.07em] text-muted-foreground">Brand Ranking</p>
        <div className="mt-3 space-y-2.5">
          <MiniBar label="GEO Sensor" value={89} />
          <MiniBar label="Competitor A" value={64} />
          <MiniBar label="Competitor B" value={47} />
        </div>
      </div>
      <div className="rounded-2xl border border-border bg-muted/30 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.07em] text-muted-foreground">Citation Trend</p>
        <svg viewBox="0 0 220 100" className="mt-2 h-[130px] w-full" aria-label="trend-line">
          <path
            d="M0,76 C28,63 48,68 74,50 C102,34 123,40 148,28 C172,18 193,15 220,8"
            fill="none"
            className="stroke-brand-orange"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M0,84 C30,77 52,72 79,67 C108,59 128,54 154,45 C176,39 196,35 220,30"
            fill="none"
            className="stroke-brand-navy"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  )
}
