import { ArrowRight, Bot, Gauge, MessageSquare } from 'lucide-react'

export function CitationDiagram() {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">Citation Flow</p>
      <div className="mt-5 space-y-4">
        <div className="rounded-2xl border border-border bg-muted/50 p-4">
          <p className="text-xs text-muted-foreground">사용자 질문</p>
          <p className="mt-1 text-sm font-semibold text-foreground">"프로젝트 관리 툴 추천해줘"</p>
        </div>

        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <ArrowRight className="h-4 w-4" />
          <Bot className="h-4 w-4" />
          <ArrowRight className="h-4 w-4" />
        </div>

        <div className="rounded-2xl border border-brand-orange/30 bg-brand-orange/5 p-4">
          <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-card/80 px-2 py-0.5 text-[11px] font-semibold text-brand-orange">
            <MessageSquare className="h-3 w-3" />
            AI 응답
          </div>
          <p className="text-sm leading-relaxed text-foreground">
            "... Notion, Asana, <strong>Monday.com</strong> ..."
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Gauge className="h-3.5 w-3.5" />
            Citation Share
          </div>
          <p className="mt-1 text-2xl font-bold text-foreground">33%</p>
          <p className="mt-1 text-xs text-muted-foreground">3개 모델 중 1개 언급</p>
        </div>
      </div>
    </div>
  )
}
