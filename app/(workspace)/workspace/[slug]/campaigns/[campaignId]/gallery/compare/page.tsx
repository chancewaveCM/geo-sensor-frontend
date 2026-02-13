'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { SavedComparisons } from '@/components/gallery/SavedComparisons'
import {
  useCompareLLMs,
  useCompareDates,
  useCompareVersions,
  useCreateComparison,
} from '@/lib/hooks/use-gallery'
import { useWorkspaces } from '@/lib/hooks/use-workspaces'
import type {
  LLMCompareResponse,
  DateCompareResponse,
  VersionCompareResponse,
  VersionCompareResponseItem,
  ComparisonDiff,
} from '@/types'
import { ChevronRight, TrendingUp, Users, Target } from 'lucide-react'

type CompareResult =
  | { type: 'llm'; data: LLMCompareResponse }
  | { type: 'date'; data: DateCompareResponse }
  | { type: 'version'; data: VersionCompareResponse }

// Pre-populated comparison data
const MOCK_RESPONSES = [
  {
    id: 1,
    provider: 'OpenAI',
    model: 'GPT-4',
    content: '한국 AI 검색 시장은 네이버, 카카오, 구글이 주도하고 있습니다. 네이버는 하이퍼클로바X를 기반으로 한 AI 검색 서비스를 출시했으며, 카카오는 KoGPT를 활용한 검색 기능을 강화하고 있습니다. 구글 역시 바드(Bard)를 한국어로 지원하며 시장 점유율을 확대하고 있습니다. 업계 전문가들은 2024년 AI 검색 시장이 전년 대비 150% 성장할 것으로 전망하고 있습니다.',
    citations: [
      { brand: '네이버', position: 1, snippet: '하이퍼클로바X 기반 AI 검색' },
      { brand: '카카오', position: 2, snippet: 'KoGPT 검색 기능 강화' },
      { brand: '구글', position: 3, snippet: '바드 한국어 지원' },
    ],
    citationCount: 3,
    wordCount: 89,
    responseTime: 1.2,
    tokenCount: 245,
  },
  {
    id: 2,
    provider: 'Gemini',
    model: 'gemini-2.5-flash',
    content: '2024년 한국의 AI 검색 환경은 빠르게 진화하고 있습니다. 네이버가 시장을 선도하고 있으며, 하이퍼클로바X 기술을 통해 개인화된 검색 결과를 제공합니다. SK텔레콤은 에이닷(A.)을 출시하여 통신사 기반 AI 검색에 도전하고 있습니다. 구글은 제미나이(Gemini)를 한국 시장에 적극 홍보하며 점유율 확대를 노리고 있습니다. 카카오 역시 다음 검색과 연계한 AI 기능을 강화 중입니다.',
    citations: [
      { brand: '네이버', position: 1, snippet: '하이퍼클로바X 개인화 검색' },
      { brand: 'SK텔레콤', position: 2, snippet: '에이닷 출시' },
      { brand: '구글', position: 3, snippet: '제미나이 한국 시장 진출' },
      { brand: '카카오', position: 4, snippet: '다음 AI 검색 강화' },
    ],
    citationCount: 4,
    wordCount: 95,
    responseTime: 0.9,
    tokenCount: 267,
  },
  {
    id: 3,
    provider: 'Perplexity',
    model: 'pplx-70b-online',
    content: '한국 AI 검색 시장의 주요 플레이어는 네이버, 카카오, 구글, SK텔레콤입니다. 네이버는 검색 점유율 60% 이상을 차지하며 하이퍼클로바X로 AI 검색을 주도합니다. SK텔레콤의 에이닷은 통신 데이터와 결합한 차별화된 검색을 제공합니다. 구글은 글로벌 AI 기술력을 바탕으로 한국 시장 공략을 강화하고 있으며, 카카오는 메신저 기반 생태계와 연계한 AI 검색 전략을 추진 중입니다. LG AI연구원도 엑사원(EXAONE)을 기반으로 한 검색 서비스 개발을 검토하고 있습니다.',
    citations: [
      { brand: '네이버', position: 1, snippet: '검색 점유율 60%, 하이퍼클로바X' },
      { brand: 'SK텔레콤', position: 2, snippet: '에이닷 통신 데이터 결합' },
      { brand: '구글', position: 3, snippet: '글로벌 AI 기술력' },
      { brand: '카카오', position: 4, snippet: '메신저 생태계 연계' },
      { brand: 'LG AI연구원', position: 5, snippet: '엑사원 검색 서비스 개발' },
    ],
    citationCount: 5,
    wordCount: 112,
    responseTime: 1.5,
    tokenCount: 312,
  },
]

const MOCK_COMPARISONS = [
  {
    providerA: 'OpenAI',
    providerB: 'Gemini',
    similarity: 0.72,
    brandOverlap: 0.67,
    sharedBrands: ['네이버', '카카오', '구글'],
    uniqueA: [],
    uniqueB: ['SK텔레콤'],
  },
  {
    providerA: 'OpenAI',
    providerB: 'Perplexity',
    similarity: 0.65,
    brandOverlap: 0.60,
    sharedBrands: ['네이버', '카카오', '구글'],
    uniqueA: [],
    uniqueB: ['SK텔레콤', 'LG AI연구원'],
  },
  {
    providerA: 'Gemini',
    providerB: 'Perplexity',
    similarity: 0.78,
    brandOverlap: 0.80,
    sharedBrands: ['네이버', 'SK텔레콤', '구글', '카카오'],
    uniqueA: [],
    uniqueB: ['LG AI연구원'],
  },
]

function DemoComparisonSection() {
  const [selectedResponse, setSelectedResponse] = useState<typeof MOCK_RESPONSES[0] | null>(null)

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">LLM 간 비교 분석</h1>
          </div>
          <p className="text-muted-foreground">
            "한국 AI 검색 시장 현황" 쿼리에 대한 3개 LLM 응답 비교
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 dark:bg-blue-900/30">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">비교 LLM 수</p>
                <p className="text-2xl font-bold">3개</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2 dark:bg-green-900/30">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">평균 유사도</p>
                <p className="text-2xl font-bold">72%</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-2 dark:bg-purple-900/30">
                <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">공통 브랜드</p>
                <p className="text-2xl font-bold">3개</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Response Cards */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {MOCK_RESPONSES.map((resp) => (
            <Card
              key={resp.id}
              className="group cursor-pointer transition-all hover:shadow-lg hover:border-primary/50"
              onClick={() => setSelectedResponse(resp)}
            >
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-semibold">
                      {resp.provider}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{resp.model}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>

                <div className="max-h-32 overflow-hidden rounded border bg-muted/30 p-3 text-sm leading-relaxed">
                  <p className="line-clamp-4">{resp.content}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{resp.citationCount}개 인용</span>
                  <span>{resp.wordCount}단어</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {resp.citations.slice(0, 3).map((citation, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="text-xs"
                    >
                      {citation.brand}
                    </Badge>
                  ))}
                  {resp.citations.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{resp.citations.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Pairwise Comparisons */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">쌍별 비교 결과</h3>
          {MOCK_COMPARISONS.map((comp, idx) => (
            <Card key={idx} className="p-4">
              <div className="space-y-3">
                <h4 className="flex items-center gap-2 text-sm font-semibold">
                  <Badge variant="outline">{comp.providerA}</Badge>
                  <span className="text-muted-foreground">vs</span>
                  <Badge variant="outline">{comp.providerB}</Badge>
                </h4>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">유사도:</span>{' '}
                    <span className="font-medium">{(comp.similarity * 100).toFixed(0)}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">브랜드 겹침:</span>{' '}
                    <span className="font-medium">{(comp.brandOverlap * 100).toFixed(0)}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">공통:</span>{' '}
                    <span className="font-medium">{comp.sharedBrands.length}개 브랜드</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {comp.sharedBrands.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">공통:</span>
                      {comp.sharedBrands.map((b) => (
                        <Badge key={b} className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          {b}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {comp.uniqueA.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        {comp.providerA} 전용:
                      </span>
                      {comp.uniqueA.map((b) => (
                        <Badge key={b} className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                          {b}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {comp.uniqueB.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        {comp.providerB} 전용:
                      </span>
                      {comp.uniqueB.map((b) => (
                        <Badge key={b} className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400">
                          {b}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedResponse} onOpenChange={(open) => !open && setSelectedResponse(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedResponse && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Badge variant="outline">{selectedResponse.provider}</Badge>
                  <span>{selectedResponse.model}</span>
                </DialogTitle>
                <DialogDescription>
                  응답 상세 정보 및 인용 분석
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Response Metadata */}
                <div className="grid grid-cols-3 gap-4 rounded-lg border bg-muted/30 p-4">
                  <div>
                    <p className="text-xs text-muted-foreground">응답 시간</p>
                    <p className="text-lg font-semibold">{selectedResponse.responseTime}초</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">토큰 수</p>
                    <p className="text-lg font-semibold">{selectedResponse.tokenCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">단어 수</p>
                    <p className="text-lg font-semibold">{selectedResponse.wordCount}</p>
                  </div>
                </div>

                {/* Full Response */}
                <div className="space-y-2">
                  <h4 className="font-semibold">전체 응답</h4>
                  <div className="rounded-lg border bg-background p-4 text-sm leading-relaxed">
                    {selectedResponse.content}
                  </div>
                </div>

                {/* Citations */}
                <div className="space-y-3">
                  <h4 className="font-semibold">인용 상세 ({selectedResponse.citationCount}개)</h4>
                  <div className="space-y-2">
                    {selectedResponse.citations.map((citation, idx) => (
                      <Card key={idx} className="p-3">
                        <div className="flex items-start gap-3">
                          <Badge className="mt-0.5">{citation.position}</Badge>
                          <div className="flex-1 space-y-1">
                            <p className="font-semibold">{citation.brand}</p>
                            <p className="text-sm text-muted-foreground">
                              "{citation.snippet}"
                            </p>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default function ComparePage() {
  const params = useParams()
  const slug = params.slug as string
  const campaignId = Number(params.campaignId)

  const { data: workspaces } = useWorkspaces()
  const workspace = workspaces?.find((w) => w.slug === slug)
  const workspaceId = workspace?.id

  const compareLLMsMutation = useCompareLLMs(workspaceId)
  const compareDatesMutation = useCompareDates(workspaceId)
  const compareVersionsMutation = useCompareVersions(workspaceId)
  const createComparisonMutation = useCreateComparison(workspaceId)

  const [activeTab, setActiveTab] = useState<'llm' | 'date' | 'version'>('llm')
  const [result, setResult] = useState<CompareResult | null>(null)

  // LLM comparison state
  const [llmParams, setLlmParams] = useState({ runId: '', queryVersionId: '' })

  // Date comparison state
  const [dateParams, setDateParams] = useState({
    campaignId: campaignId.toString(),
    queryVersionId: '',
    llmProvider: '',
    runIdA: '',
    runIdB: '',
  })

  // Version comparison state
  const [versionParams, setVersionParams] = useState({
    runId: '',
    llmProvider: '',
    queryVersionIdA: '',
    queryVersionIdB: '',
  })

  const [comparisonName, setComparisonName] = useState('')

  const handleCompareLLMs = async () => {
    if (!llmParams.runId || !llmParams.queryVersionId) return
    const data = await compareLLMsMutation.mutateAsync({
      run_id: parseInt(llmParams.runId),
      query_version_id: parseInt(llmParams.queryVersionId),
    })
    setResult({ type: 'llm', data })
  }

  const handleCompareDates = async () => {
    if (!dateParams.queryVersionId || !dateParams.llmProvider || !dateParams.runIdA || !dateParams.runIdB) return
    const data = await compareDatesMutation.mutateAsync({
      campaign_id: parseInt(dateParams.campaignId),
      query_version_id: parseInt(dateParams.queryVersionId),
      llm_provider: dateParams.llmProvider,
      run_id_a: parseInt(dateParams.runIdA),
      run_id_b: parseInt(dateParams.runIdB),
    })
    setResult({ type: 'date', data })
  }

  const handleCompareVersions = async () => {
    if (
      !versionParams.runId ||
      !versionParams.llmProvider ||
      !versionParams.queryVersionIdA ||
      !versionParams.queryVersionIdB
    )
      return
    const data = await compareVersionsMutation.mutateAsync({
      run_id: parseInt(versionParams.runId),
      llm_provider: versionParams.llmProvider,
      query_version_id_a: parseInt(versionParams.queryVersionIdA),
      query_version_id_b: parseInt(versionParams.queryVersionIdB),
    })
    setResult({ type: 'version', data })
  }

  const handleSaveComparison = () => {
    if (!result || !comparisonName) return
    const configRecord: Record<string, unknown> =
      result.type === 'llm'
        ? { run_id: llmParams.runId, query_version_id: llmParams.queryVersionId }
        : result.type === 'date'
        ? { ...dateParams }
        : { ...versionParams }

    createComparisonMutation.mutate({
      name: comparisonName,
      comparison_type:
        result.type === 'llm'
          ? 'llm_vs_llm'
          : result.type === 'date'
          ? 'date_vs_date'
          : 'version_vs_version',
      config: configRecord,
      notes: getSummaryText(result),
    })
  }

  if (!workspaceId) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">워크스페이스 로딩 중...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto space-y-8 p-6">
      {/* Latest Comparison Results */}
      <DemoComparisonSection />

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            커스텀 비교 실행
          </span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'llm' | 'date' | 'version')}>
        <TabsList>
          <TabsTrigger value="llm">LLM 간 비교</TabsTrigger>
          <TabsTrigger value="date">날짜 간 비교</TabsTrigger>
          <TabsTrigger value="version">버전 간 비교</TabsTrigger>
        </TabsList>

        <TabsContent value="llm" className="space-y-4">
          <Card className="p-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">실행 ID</label>
                  <Input
                    type="number"
                    value={llmParams.runId}
                    onChange={(e) =>
                      setLlmParams((prev) => ({ ...prev, runId: e.target.value }))
                    }
                    placeholder="실행 ID 입력"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">쿼리 버전 ID</label>
                  <Input
                    type="number"
                    value={llmParams.queryVersionId}
                    onChange={(e) =>
                      setLlmParams((prev) => ({ ...prev, queryVersionId: e.target.value }))
                    }
                    placeholder="쿼리 버전 ID 입력"
                  />
                </div>
              </div>
              <Button
                onClick={handleCompareLLMs}
                disabled={compareLLMsMutation.isPending || !llmParams.runId || !llmParams.queryVersionId}
              >
                비교
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="date" className="space-y-4">
          <Card className="p-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">쿼리 버전 ID</label>
                  <Input
                    type="number"
                    value={dateParams.queryVersionId}
                    onChange={(e) =>
                      setDateParams((prev) => ({ ...prev, queryVersionId: e.target.value }))
                    }
                    placeholder="쿼리 버전 ID 입력"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">LLM 제공자</label>
                  <Input
                    value={dateParams.llmProvider}
                    onChange={(e) =>
                      setDateParams((prev) => ({ ...prev, llmProvider: e.target.value }))
                    }
                    placeholder="예: openai, anthropic"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">실행 ID A</label>
                  <Input
                    type="number"
                    value={dateParams.runIdA}
                    onChange={(e) =>
                      setDateParams((prev) => ({ ...prev, runIdA: e.target.value }))
                    }
                    placeholder="실행 ID 입력"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">실행 ID B</label>
                  <Input
                    type="number"
                    value={dateParams.runIdB}
                    onChange={(e) =>
                      setDateParams((prev) => ({ ...prev, runIdB: e.target.value }))
                    }
                    placeholder="실행 ID 입력"
                  />
                </div>
              </div>
              <Button
                onClick={handleCompareDates}
                disabled={
                  compareDatesMutation.isPending ||
                  !dateParams.queryVersionId ||
                  !dateParams.llmProvider ||
                  !dateParams.runIdA ||
                  !dateParams.runIdB
                }
              >
                비교
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="version" className="space-y-4">
          <Card className="p-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">실행 ID</label>
                  <Input
                    type="number"
                    value={versionParams.runId}
                    onChange={(e) =>
                      setVersionParams((prev) => ({ ...prev, runId: e.target.value }))
                    }
                    placeholder="실행 ID 입력"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">LLM 제공자</label>
                  <Input
                    value={versionParams.llmProvider}
                    onChange={(e) =>
                      setVersionParams((prev) => ({ ...prev, llmProvider: e.target.value }))
                    }
                    placeholder="예: openai, anthropic"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">쿼리 버전 ID A</label>
                  <Input
                    type="number"
                    value={versionParams.queryVersionIdA}
                    onChange={(e) =>
                      setVersionParams((prev) => ({ ...prev, queryVersionIdA: e.target.value }))
                    }
                    placeholder="버전 ID 입력"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">쿼리 버전 ID B</label>
                  <Input
                    type="number"
                    value={versionParams.queryVersionIdB}
                    onChange={(e) =>
                      setVersionParams((prev) => ({ ...prev, queryVersionIdB: e.target.value }))
                    }
                    placeholder="버전 ID 입력"
                  />
                </div>
              </div>
              <Button
                onClick={handleCompareVersions}
                disabled={
                  compareVersionsMutation.isPending ||
                  !versionParams.runId ||
                  !versionParams.llmProvider ||
                  !versionParams.queryVersionIdA ||
                  !versionParams.queryVersionIdB
                }
              >
                비교
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {result && (
        <div className="space-y-4">
          <CompareResultView result={result} />

          <Card className="p-4">
            <div className="flex gap-4">
              <Input
                value={comparisonName}
                onChange={(e) => setComparisonName(e.target.value)}
                placeholder="비교 이름 입력..."
              />
              <Button
                onClick={handleSaveComparison}
                disabled={createComparisonMutation.isPending || !comparisonName}
              >
                비교 저장
              </Button>
            </div>
          </Card>
        </div>
      )}

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">저장된 비교</h2>
        <SavedComparisons workspaceId={workspaceId} />
      </div>
    </div>
  )
}

function getSummaryText(result: CompareResult): string {
  if (result.type === 'llm') {
    const d = result.data
    return `${d.responses.length} responses compared, ${d.comparisons.length} pairs`
  }
  const diff = result.data.diff
  return `Similarity: ${(diff.similarity * 100).toFixed(0)}%, Shared: ${diff.shared_brands.length} brands`
}

function CompareResultView({ result }: { result: CompareResult }) {
  if (result.type === 'llm') {
    return <LLMCompareResultView data={result.data} />
  }
  return <DiffCompareResultView data={result.data} type={result.type} />
}

function LLMCompareResultView({ data }: { data: LLMCompareResponse }) {
  return (
    <div className="space-y-4">
      {/* Responses grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.responses.map((resp) => (
          <Card key={resp.id} className="p-4">
            <div className="mb-3 flex items-center gap-2">
              <Badge variant="outline">{resp.llm_provider}</Badge>
              <span className="text-sm text-muted-foreground">{resp.llm_model}</span>
            </div>
            <div className="max-h-64 overflow-y-auto rounded border p-3 text-sm leading-relaxed">
              {resp.content}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {resp.citation_count}개 인용 - {resp.word_count}단어
            </p>
          </Card>
        ))}
      </div>

      {/* Pairwise comparisons */}
      {data.comparisons.map((comp, idx) => (
        <Card key={idx} className="p-4">
          <h3 className="mb-3 text-sm font-semibold">
            {comp.response_a.llm_provider} vs {comp.response_b.llm_provider}
          </h3>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">유사도:</span>{' '}
              <span className="font-medium">{(comp.similarity * 100).toFixed(0)}%</span>
            </div>
            <div>
              <span className="text-muted-foreground">브랜드 겹침:</span>{' '}
              <span className="font-medium">{(comp.brand_overlap * 100).toFixed(0)}%</span>
            </div>
            <div>
              <span className="text-muted-foreground">공통:</span>{' '}
              <span className="font-medium">{comp.shared_brands.length}개 브랜드</span>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            {comp.shared_brands.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">공통:</span>
                {comp.shared_brands.map((b) => (
                  <Badge key={b} className="bg-green-100 text-green-800">{b}</Badge>
                ))}
              </div>
            )}
            {comp.unique_a.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {comp.response_a.llm_provider} 전용:
                </span>
                {comp.unique_a.map((b) => (
                  <Badge key={b} className="bg-blue-100 text-blue-800">{b}</Badge>
                ))}
              </div>
            )}
            {comp.unique_b.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {comp.response_b.llm_provider} 전용:
                </span>
                {comp.unique_b.map((b) => (
                  <Badge key={b} className="bg-orange-100 text-orange-800">{b}</Badge>
                ))}
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}

function DiffCompareResultView({
  data,
  type,
}: {
  data: DateCompareResponse | VersionCompareResponse
  type: 'date' | 'version'
}) {
  const diff: ComparisonDiff = data.diff
  const labelA = type === 'date' ? `Run ${data.response_a.id}` : `Version ${(data.response_a as VersionCompareResponseItem).query_version_id}`
  const labelB = type === 'date' ? `Run ${data.response_b.id}` : `Version ${(data.response_b as VersionCompareResponseItem).query_version_id}`

  return (
    <div className="space-y-4">
      {/* Side by side panels */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <Badge variant="outline">{data.llm_provider}</Badge>
            <span className="text-sm text-muted-foreground">{labelA}</span>
          </div>
          <div className="max-h-96 overflow-y-auto rounded border p-3 text-sm leading-relaxed">
            {data.response_a.content}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {data.response_a.citation_count}개 인용 - {data.response_a.word_count}단어
          </p>
        </Card>

        <Card className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <Badge variant="outline">{data.llm_provider}</Badge>
            <span className="text-sm text-muted-foreground">{labelB}</span>
          </div>
          <div className="max-h-96 overflow-y-auto rounded border p-3 text-sm leading-relaxed">
            {data.response_b.content}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {data.response_b.citation_count}개 인용 - {data.response_b.word_count}단어
          </p>
        </Card>
      </div>

      {/* Diff summary */}
      <Card className="p-4">
        <h3 className="mb-3 text-sm font-semibold">비교 차이</h3>
        <div className="grid grid-cols-3 gap-4 text-sm mb-3">
          <div>
            <span className="text-muted-foreground">유사도:</span>{' '}
            <span className="font-medium">{(diff.similarity * 100).toFixed(0)}%</span>
          </div>
          <div>
            <span className="text-muted-foreground">브랜드 겹침:</span>{' '}
            <span className="font-medium">{(diff.brand_overlap * 100).toFixed(0)}%</span>
          </div>
          <div>
            <span className="text-muted-foreground">내용 변경:</span>{' '}
            <span className="font-medium">{diff.content_changed ? '예' : '아니오'}</span>
          </div>
        </div>
        <div className="space-y-2">
          {diff.shared_brands.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">공통:</span>
              {diff.shared_brands.map((b) => (
                <Badge key={b} className="bg-green-100 text-green-800">{b}</Badge>
              ))}
            </div>
          )}
          {diff.unique_a.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">{labelA} 전용:</span>
              {diff.unique_a.map((b) => (
                <Badge key={b} className="bg-blue-100 text-blue-800">{b}</Badge>
              ))}
            </div>
          )}
          {diff.unique_b.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">{labelB} 전용:</span>
              {diff.unique_b.map((b) => (
                <Badge key={b} className="bg-orange-100 text-orange-800">{b}</Badge>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}

