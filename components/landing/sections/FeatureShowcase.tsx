'use client'

import { Bot, ClipboardList, GalleryHorizontalEnd, Layers3 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FeatureCard } from '@/components/landing/sections/FeatureCard'

export function FeatureShowcase() {
  return (
    <section id="features" className="scroll-mt-24 px-4 py-16 md:px-6 md:py-20">
      <div className="mx-auto w-full max-w-[1200px]">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-navy">Product Features</p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          측정, 비교, 개선까지 한 화면에서
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
          마케터, SEO/GEO 담당자, 데이터 분석가가 같은 지표를 보고 바로 실행할 수 있도록 구성했습니다.
        </p>

        <Tabs defaultValue="multi-llm" className="mt-8">
          <TabsList className="h-auto w-full flex-wrap gap-2 bg-transparent p-0">
            <TabsTrigger value="multi-llm" className="rounded-full border border-border px-4 py-2 data-[state=active]:bg-brand-navy data-[state=active]:text-white">
              Multi-LLM
            </TabsTrigger>
            <TabsTrigger value="query-lab" className="rounded-full border border-border px-4 py-2 data-[state=active]:bg-brand-navy data-[state=active]:text-white">
              Query Lab
            </TabsTrigger>
            <TabsTrigger value="gallery" className="rounded-full border border-border px-4 py-2 data-[state=active]:bg-brand-navy data-[state=active]:text-white">
              Gallery
            </TabsTrigger>
            <TabsTrigger value="action-queue" className="rounded-full border border-border px-4 py-2 data-[state=active]:bg-brand-navy data-[state=active]:text-white">
              Action Queue
            </TabsTrigger>
          </TabsList>

          <TabsContent value="multi-llm" className="mt-6">
            <FeatureCard
              title="6개 AI 모델 비교 분석"
              description="같은 질문을 모델별로 병렬 실행해 Citation Share 차이를 즉시 확인합니다."
              icon={<Bot className="h-5 w-5" />}
            >
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {['ChatGPT', 'Gemini', 'Claude', 'Copilot', 'Perplexity', 'Grok'].map((provider) => (
                  <div key={provider} className="rounded-xl border border-border bg-muted/50 px-3 py-2 text-xs font-medium text-foreground">
                    {provider}
                  </div>
                ))}
              </div>
            </FeatureCard>
          </TabsContent>

          <TabsContent value="query-lab" className="mt-6">
            <FeatureCard
              title="질문 실험실(Query Lab)"
              description="질문 버전별 성능을 비교하고, 실제 인용률에 영향을 준 표현을 추출합니다."
              icon={<ClipboardList className="h-5 w-5" />}
            >
              <div className="space-y-2 rounded-2xl border border-border bg-muted/40 p-4 text-sm">
                <p className="font-medium text-foreground">실험 A: 비교형 질문 템플릿</p>
                <p className="text-muted-foreground">Citation Share +12.3%, 경쟁사 언급률 -8.1%</p>
              </div>
            </FeatureCard>
          </TabsContent>

          <TabsContent value="gallery" className="mt-6">
            <FeatureCard
              title="응답 Gallery"
              description="브랜드가 실제로 어떻게 언급되는지 스냅샷으로 저장하고 팀에 공유합니다."
              icon={<GalleryHorizontalEnd className="h-5 w-5" />}
            >
              <div className="grid gap-2 md:grid-cols-2">
                <div className="rounded-xl border border-border bg-white p-3 text-xs text-gray-700 shadow-sm">
                  "Notion, Asana와 함께 GEO Sensor가 자주 추천됩니다."
                </div>
                <div className="rounded-xl border border-border bg-white p-3 text-xs text-gray-700 shadow-sm">
                  "B2B GEO 모니터링 도구로는 GEO Sensor가 가장 구조적입니다."
                </div>
              </div>
            </FeatureCard>
          </TabsContent>

          <TabsContent value="action-queue" className="mt-6">
            <FeatureCard
              title="Action Queue"
              description="분석 결과를 바로 실행 항목으로 전환해 캠페인 운영 리듬을 만듭니다."
              icon={<Layers3 className="h-5 w-5" />}
            >
              <ul className="space-y-2 text-sm">
                <li className="rounded-xl border border-border bg-muted/40 px-3 py-2 text-gray-700">카테고리 페이지 Q&A 블록 업데이트</li>
                <li className="rounded-xl border border-border bg-muted/40 px-3 py-2 text-gray-700">비교형 랜딩 카피 A/B 테스트</li>
                <li className="rounded-xl border border-border bg-muted/40 px-3 py-2 text-gray-700">모델별 저성과 질문셋 재작성</li>
              </ul>
            </FeatureCard>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}
