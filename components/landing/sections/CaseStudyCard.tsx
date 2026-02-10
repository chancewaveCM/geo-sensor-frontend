interface CaseStudyCardProps {
  industry: string
  title: string
  before: string
  after: string
  summary: string
}

export function CaseStudyCard({ industry, title, before, after, summary }: CaseStudyCardProps) {
  return (
    <article className="rounded-3xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-brand-navy">{industry}</p>
      <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{summary}</p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-border bg-muted/50 p-3 text-center">
          <p className="text-xs font-medium text-muted-foreground">Before</p>
          <p className="mt-1 text-xl font-bold text-gray-700">{before}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-center">
          <p className="text-xs font-medium text-emerald-700">After</p>
          <p className="mt-1 text-xl font-bold text-emerald-700">{after}</p>
        </div>
      </div>
    </article>
  )
}
