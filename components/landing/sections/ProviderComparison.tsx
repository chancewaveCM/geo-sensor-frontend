'use client'

import { useMemo, useState } from 'react'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LLM_PROVIDERS, RADAR_METRIC_LABELS } from '@/components/landing/data/providers'
import { ProviderDetailPanel } from '@/components/landing/sections/ProviderDetailPanel'
import { getTokenColor } from '@/lib/design-tokens'

const PROVIDER_COLORS: Record<string, string> = {
  chatgpt: '--chart-1',
  gemini: '--chart-2',
  claude: '--chart-3',
  copilot: '--chart-4',
  perplexity: '--chart-8',
  grok: '--chart-7',
}

const RADAR_KEYS = RADAR_METRIC_LABELS.map((metric) => metric.key)

export function ProviderComparison() {
  const [selectedProviderId, setSelectedProviderId] = useState(LLM_PROVIDERS[0].id)

  const radarData = useMemo(() => {
    return RADAR_METRIC_LABELS.map((metric) => {
      const row: Record<string, string | number> = { metric: metric.label }
      for (const provider of LLM_PROVIDERS) {
        row[provider.id] = provider.radar[metric.key]
      }
      return row
    })
  }, [])

  const selectedProvider = LLM_PROVIDERS.find((provider) => provider.id === selectedProviderId) ?? LLM_PROVIDERS[0]

  return (
    <section id="providers" className="scroll-mt-24 bg-muted/30 px-4 py-16 md:px-6 md:py-20">
      <div className="mx-auto w-full max-w-[1200px]">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-navy">Provider Comparison</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          어떤 모델에서 우리 브랜드가 강한가?
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
          6개 모델의 Citation Share와 품질 지표를 같은 프레임으로 비교해 우선순위를 결정합니다.
        </p>

        <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <p className="text-sm font-semibold text-foreground">6개 모델 레이더 비교</p>
            <div className="mt-4 h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke={getTokenColor('--chart-grid')} />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12, fill: getTokenColor('--chart-axis-text') }} />
                  <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                  {LLM_PROVIDERS.map((provider) => (
                    <Radar
                      key={provider.id}
                      name={provider.name}
                      dataKey={provider.id}
                      stroke={getTokenColor(PROVIDER_COLORS[provider.id])}
                      fill={getTokenColor(PROVIDER_COLORS[provider.id])}
                      fillOpacity={0.08}
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive
                    />
                  ))}
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3">
              {LLM_PROVIDERS.map((provider) => (
                <div key={provider.id} className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1.5 text-xs text-foreground">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: getTokenColor(PROVIDER_COLORS[provider.id]) }}
                  />
                  <span>{provider.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Tabs value={selectedProviderId} onValueChange={setSelectedProviderId}>
              <TabsList className="h-auto w-full flex-wrap gap-2 bg-transparent p-0">
                {LLM_PROVIDERS.map((provider) => (
                  <TabsTrigger
                    key={provider.id}
                    value={provider.id}
                    className="rounded-full border border-border px-3 py-1.5 text-xs data-[state=active]:bg-brand-navy data-[state=active]:text-white"
                  >
                    {provider.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <div className="mt-4">
              <ProviderDetailPanel provider={selectedProvider} />
            </div>
            <div className="mt-3 rounded-2xl border border-border bg-card p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">추천 채널 우선순위</p>
              <ul className="mt-2 space-y-2 text-sm text-foreground">
                {RADAR_KEYS.map((key) => (
                  <li key={key} className="rounded-lg bg-muted px-3 py-2">
                    {RADAR_METRIC_LABELS.find((item) => item.key === key)?.label}: {selectedProvider.radar[key]}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
