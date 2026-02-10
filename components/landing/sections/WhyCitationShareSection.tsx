import { BarChart3, GitCompare, TrendingUp } from 'lucide-react'
import { ScrollReveal } from '@/components/landing/sections/ScrollReveal'
import { CitationDiagram } from '@/components/landing/sections/CitationDiagram'

export function WhyCitationShareSection() {
  return (
    <section className="bg-muted/30 px-4 py-16 md:px-6 md:py-20">
      <div className="mx-auto w-full max-w-[1200px]">
        <ScrollReveal>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-navy">Citation Share</p>
          <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl">
            검색 순위가 아니라,
            <br className="hidden md:block" />
            AI의 추천이 매출을 만듭니다
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
            2026년의 구매자는 검색창보다 AI에게 먼저 묻습니다. AI 응답에 브랜드가
            반복적으로 언급되어야 실제 비교 후보군에 들어갑니다.
          </p>
        </ScrollReveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <CitationDiagram />
            </div>
          </div>

          <div className="space-y-5">
            <ScrollReveal className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-navy/10 text-brand-navy">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight text-foreground">Citation Share란?</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                특정 질문 묶음에서 브랜드가 실제로 얼마나 언급되는지를 측정하는 지표입니다.
                클릭률 대신 AI 추천 점유율을 봅니다.
              </p>
              <div className="mt-4 rounded-xl border-l-4 border-brand-orange bg-brand-orange/5 p-4 text-sm text-gray-700">
                질문: "프로젝트 관리 툴 추천해줘" <br />
                응답 3개 중 1개에서 브랜드가 언급되면 Citation Share는 33%입니다.
              </div>
            </ScrollReveal>

            <ScrollReveal delay={120} className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-navy/10 text-brand-navy">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight text-foreground">왜 지금 중요할까요?</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                AI 검색 사용량은 계속 커지고 있고, B2B 구매 여정에서 AI 리서치 비중도 빠르게 증가하고 있습니다.
                지금 측정하고 개선하는 팀이 카테고리의 기본값이 됩니다.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-muted p-3 text-center">
                  <p className="text-xl font-bold text-brand-navy">340%</p>
                  <p className="mt-1 text-xs text-muted-foreground">AI 검색 증가율</p>
                </div>
                <div className="rounded-xl bg-muted p-3 text-center">
                  <p className="text-xl font-bold text-brand-navy">67%</p>
                  <p className="mt-1 text-xs text-muted-foreground">B2B 구매자 사용</p>
                </div>
                <div className="rounded-xl bg-muted p-3 text-center">
                  <p className="text-xl font-bold text-brand-navy">23%</p>
                  <p className="mt-1 text-xs text-muted-foreground">리드 증가 폭</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={240} className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-navy/10 text-brand-navy">
                <GitCompare className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight text-foreground">SEO와 GEO는 함께 갑니다</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                SEO는 검색 결과 내 노출, GEO는 AI 응답 내 존재감을 최적화합니다.
                둘 다 필요하지만, GEO는 아직 대부분의 팀이 측정조차 하지 못합니다.
              </p>
              <div className="mt-4 overflow-hidden rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/70 text-left text-xs uppercase tracking-[0.08em] text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2">구분</th>
                      <th className="px-3 py-2">SEO</th>
                      <th className="px-3 py-2">GEO</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-border">
                      <td className="px-3 py-2 font-medium text-foreground">목표</td>
                      <td className="px-3 py-2 text-muted-foreground">검색 순위</td>
                      <td className="px-3 py-2 text-muted-foreground">AI 인용 점유율</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-3 py-2 font-medium text-foreground">측정</td>
                      <td className="px-3 py-2 text-muted-foreground">CTR / 순위</td>
                      <td className="px-3 py-2 text-muted-foreground">Citation Share</td>
                    </tr>
                    <tr className="border-t border-border">
                      <td className="px-3 py-2 font-medium text-foreground">채널</td>
                      <td className="px-3 py-2 text-muted-foreground">Google, Bing</td>
                      <td className="px-3 py-2 text-muted-foreground">ChatGPT, Gemini 등</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  )
}
