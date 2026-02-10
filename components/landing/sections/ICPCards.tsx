const personas = [
  { role: 'Growth Marketer', pain: '브랜드가 AI 추천 목록에 들어가지 않음', goal: '도입 리드 확보' },
  { role: 'SEO/GEO Specialist', pain: '검색 지표와 AI 지표가 분리됨', goal: '채널 통합 측정' },
  { role: 'Data Analyst', pain: '모델별 성과 원인 분석이 어려움', goal: '주간 개선 루프 구축' },
]

export function ICPCards() {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {personas.map((persona) => (
        <article key={persona.role} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-brand-navy">{persona.role}</p>
          <p className="mt-3 text-sm text-muted-foreground">문제: {persona.pain}</p>
          <p className="mt-1 text-sm font-medium text-foreground">목표: {persona.goal}</p>
        </article>
      ))}
    </div>
  )
}
