import { ArrowDownRight, ArrowRight, ArrowUpRight, Bot } from 'lucide-react'
import { LLM_PROVIDERS } from '@/components/landing/data/providers'
import { cn } from '@/lib/utils'

const providers = LLM_PROVIDERS

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'neutral' }) {
  if (trend === 'up') return <ArrowUpRight className="h-3.5 w-3.5 text-emerald-400" />
  if (trend === 'down') return <ArrowDownRight className="h-3.5 w-3.5 text-rose-400" />
  return <ArrowRight className="h-3.5 w-3.5 text-gray-400" />
}

function ProviderPill({ provider }: { provider: (typeof LLM_PROVIDERS)[number] }) {
  return (
    <div
      className={cn(
        'inline-flex shrink-0 items-center gap-2 rounded-full border border-gray-700 bg-gray-800/90 px-3 py-1.5 text-xs text-gray-100 transition-colors',
        'hover:border-gray-500'
      )}
    >
      <Bot className={cn('h-3.5 w-3.5', provider.colorClass)} />
      <span className="font-semibold">{provider.name}</span>
      <span className="text-gray-300">{provider.citationShare.toFixed(1)}%</span>
      <TrendIcon trend={provider.trend} />
    </div>
  )
}

export function LLMTickerStrip() {
  return (
    <section className="overflow-hidden border-y border-gray-800 bg-gray-900 py-4">
      <div className="flex w-max animate-ticker-scroll items-center motion-reduce:animate-none [animation-duration:22s] hover:[animation-play-state:paused] md:[animation-duration:32s]">
        <div className="flex shrink-0 items-center gap-3 pr-3">
          {providers.map((provider) => (
            <ProviderPill key={provider.id} provider={provider} />
          ))}
        </div>
        <div aria-hidden className="flex shrink-0 items-center gap-3 pr-3">
          {providers.map((provider) => (
            <ProviderPill key={`${provider.id}-dup`} provider={provider} />
          ))}
        </div>
      </div>
    </section>
  )
}
