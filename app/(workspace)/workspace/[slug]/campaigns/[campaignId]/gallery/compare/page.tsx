'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
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

type CompareResult =
  | { type: 'llm'; data: LLMCompareResponse }
  | { type: 'date'; data: DateCompareResponse }
  | { type: 'version'; data: VersionCompareResponse }

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
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">응답 비교</h1>
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

