interface TestimonialCardProps {
  quote: string
  name: string
  role: string
}

export function TestimonialCard({ quote, name, role }: TestimonialCardProps) {
  return (
    <article className="min-w-[280px] rounded-2xl border border-border bg-card p-5 shadow-sm md:min-w-0">
      <p className="text-sm leading-relaxed text-foreground">"{quote}"</p>
      <div className="mt-4">
        <p className="text-sm font-semibold text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground">{role}</p>
      </div>
    </article>
  )
}
