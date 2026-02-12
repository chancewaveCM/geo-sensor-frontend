import { type LLMProvider } from '@/components/landing/data/providers'

export function ProviderDetailPanel({ provider }: { provider: LLMProvider }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">{provider.name}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">{provider.citationShare.toFixed(1)}%</p>
      <p className="mt-1 text-sm text-muted-foreground">평균 응답시간 {provider.avgResponseTime}</p>
      <div className="mt-4 space-y-2">
        {provider.strengths.map((strength) => (
          <p key={strength} className="rounded-lg bg-muted px-3 py-2 text-xs font-medium text-gray-700">
            {strength}
          </p>
        ))}
      </div>
    </div>
  )
}
