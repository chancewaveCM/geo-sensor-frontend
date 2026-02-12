const chain = [
  '질문셋 수집',
  '모델별 응답 비교',
  '저성과 패턴 식별',
  '콘텐츠/카피 개선',
  'Citation Share 상승',
]

export function OutcomeTimeline() {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <p className="text-sm font-semibold text-foreground">Outcome Chain</p>
      <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-center">
        {chain.map((item, index) => (
          <div key={item} className="flex items-center gap-2">
            <span className="rounded-lg bg-muted px-2.5 py-1 text-xs font-medium text-foreground">{item}</span>
            {index < chain.length - 1 && <span className="hidden text-brand-navy md:inline">→</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
