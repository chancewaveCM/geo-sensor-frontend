'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { ComparisonView } from '@/components/gallery/ComparisonView'
import { SavedComparisons } from '@/components/gallery/SavedComparisons'
import {
  useCompareLLMs,
  useCompareDates,
  useCompareVersions,
  useCreateComparison,
} from '@/lib/hooks/use-gallery'
import { useWorkspaces } from '@/lib/hooks/use-workspaces'

interface ComparisonResult {
  left: {
    response_text: string
    llm_provider: string
    model_name: string
    citations: Array<{ brand_name: string; domain?: string; position: number }>
  }
  right: {
    response_text: string
    llm_provider: string
    model_name: string
    citations: Array<{ brand_name: string; domain?: string; position: number }>
  }
}

export default function ComparePage() {
  const params = useParams()
  const slug = params.slug as string

  const { data: workspaces } = useWorkspaces()
  const workspace = workspaces?.find((w) => w.slug === slug)
  const workspaceId = workspace?.id

  const compareLLMsMutation = useCompareLLMs(workspaceId)
  const compareDatesMutation = useCompareDates(workspaceId)
  const compareVersionsMutation = useCompareVersions(workspaceId)
  const createComparisonMutation = useCreateComparison(workspaceId)

  const [activeTab, setActiveTab] = useState<'llm' | 'date' | 'version'>('llm')
  const [result, setResult] = useState<ComparisonResult | null>(null)

  // LLM comparison state
  const [llmResponseIds, setLlmResponseIds] = useState({ left: '', right: '' })

  // Date comparison state
  const [dateParams, setDateParams] = useState({
    queryDefinitionId: '',
    runIds: { left: '', right: '' },
  })

  // Version comparison state
  const [versionParams, setVersionParams] = useState({
    queryDefinitionId: '',
    versionIds: { left: '', right: '' },
  })

  const [comparisonName, setComparisonName] = useState('')

  const handleCompareLLMs = async () => {
    if (!llmResponseIds.left || !llmResponseIds.right) return
    const data = await compareLLMsMutation.mutateAsync({
      response_ids: [parseInt(llmResponseIds.left), parseInt(llmResponseIds.right)],
    })
    setResult(data as unknown as ComparisonResult)
  }

  const handleCompareDates = async () => {
    if (!dateParams.queryDefinitionId || !dateParams.runIds.left || !dateParams.runIds.right) return
    const data = await compareDatesMutation.mutateAsync({
      query_definition_id: parseInt(dateParams.queryDefinitionId),
      run_ids: [parseInt(dateParams.runIds.left), parseInt(dateParams.runIds.right)],
    })
    setResult(data as unknown as ComparisonResult)
  }

  const handleCompareVersions = async () => {
    if (
      !versionParams.queryDefinitionId ||
      !versionParams.versionIds.left ||
      !versionParams.versionIds.right
    )
      return
    const data = await compareVersionsMutation.mutateAsync({
      query_definition_id: parseInt(versionParams.queryDefinitionId),
      version_ids: [parseInt(versionParams.versionIds.left), parseInt(versionParams.versionIds.right)],
    })
    setResult(data as unknown as ComparisonResult)
  }

  const handleSaveComparison = () => {
    if (!result || !comparisonName) return
    createComparisonMutation.mutate({
      name: comparisonName,
      comparison_type: activeTab,
      config: JSON.stringify(
        activeTab === 'llm'
          ? llmResponseIds
          : activeTab === 'date'
          ? dateParams
          : versionParams
      ),
      result_summary: `Shared: ${
        Array.from(new Set(result.left.citations.map((c) => c.brand_name))).filter((b) =>
          result.right.citations.some((c) => c.brand_name === b)
        ).length
      } brands`,
    })
  }

  if (!workspaceId) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-muted-foreground">Loading workspace...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Compare Responses</h1>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
        <TabsList>
          <TabsTrigger value="llm">LLM vs LLM</TabsTrigger>
          <TabsTrigger value="date">Date vs Date</TabsTrigger>
          <TabsTrigger value="version">Version vs Version</TabsTrigger>
        </TabsList>

        <TabsContent value="llm" className="space-y-4">
          <Card className="p-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Left Response ID</label>
                  <Input
                    type="number"
                    value={llmResponseIds.left}
                    onChange={(e) =>
                      setLlmResponseIds((prev) => ({ ...prev, left: e.target.value }))
                    }
                    placeholder="Enter response ID"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Right Response ID</label>
                  <Input
                    type="number"
                    value={llmResponseIds.right}
                    onChange={(e) =>
                      setLlmResponseIds((prev) => ({ ...prev, right: e.target.value }))
                    }
                    placeholder="Enter response ID"
                  />
                </div>
              </div>
              <Button
                onClick={handleCompareLLMs}
                disabled={compareLLMsMutation.isPending || !llmResponseIds.left || !llmResponseIds.right}
              >
                Compare
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="date" className="space-y-4">
          <Card className="p-4">
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Query Definition ID</label>
                <Input
                  type="number"
                  value={dateParams.queryDefinitionId}
                  onChange={(e) =>
                    setDateParams((prev) => ({ ...prev, queryDefinitionId: e.target.value }))
                  }
                  placeholder="Enter query definition ID"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Left Run ID</label>
                  <Input
                    type="number"
                    value={dateParams.runIds.left}
                    onChange={(e) =>
                      setDateParams((prev) => ({
                        ...prev,
                        runIds: { ...prev.runIds, left: e.target.value },
                      }))
                    }
                    placeholder="Enter run ID"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Right Run ID</label>
                  <Input
                    type="number"
                    value={dateParams.runIds.right}
                    onChange={(e) =>
                      setDateParams((prev) => ({
                        ...prev,
                        runIds: { ...prev.runIds, right: e.target.value },
                      }))
                    }
                    placeholder="Enter run ID"
                  />
                </div>
              </div>
              <Button
                onClick={handleCompareDates}
                disabled={
                  compareDatesMutation.isPending ||
                  !dateParams.queryDefinitionId ||
                  !dateParams.runIds.left ||
                  !dateParams.runIds.right
                }
              >
                Compare
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="version" className="space-y-4">
          <Card className="p-4">
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Query Definition ID</label>
                <Input
                  type="number"
                  value={versionParams.queryDefinitionId}
                  onChange={(e) =>
                    setVersionParams((prev) => ({ ...prev, queryDefinitionId: e.target.value }))
                  }
                  placeholder="Enter query definition ID"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">Left Version ID</label>
                  <Input
                    type="number"
                    value={versionParams.versionIds.left}
                    onChange={(e) =>
                      setVersionParams((prev) => ({
                        ...prev,
                        versionIds: { ...prev.versionIds, left: e.target.value },
                      }))
                    }
                    placeholder="Enter version ID"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Right Version ID</label>
                  <Input
                    type="number"
                    value={versionParams.versionIds.right}
                    onChange={(e) =>
                      setVersionParams((prev) => ({
                        ...prev,
                        versionIds: { ...prev.versionIds, right: e.target.value },
                      }))
                    }
                    placeholder="Enter version ID"
                  />
                </div>
              </div>
              <Button
                onClick={handleCompareVersions}
                disabled={
                  compareVersionsMutation.isPending ||
                  !versionParams.queryDefinitionId ||
                  !versionParams.versionIds.left ||
                  !versionParams.versionIds.right
                }
              >
                Compare
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {result && (
        <div className="space-y-4">
          <ComparisonView
            leftResponse={result.left}
            rightResponse={result.right}
            comparisonType={activeTab}
          />

          <Card className="p-4">
            <div className="flex gap-4">
              <Input
                value={comparisonName}
                onChange={(e) => setComparisonName(e.target.value)}
                placeholder="Enter comparison name..."
              />
              <Button
                onClick={handleSaveComparison}
                disabled={createComparisonMutation.isPending || !comparisonName}
              >
                Save Comparison
              </Button>
            </div>
          </Card>
        </div>
      )}

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Saved Comparisons</h2>
        <SavedComparisons workspaceId={workspaceId} />
      </div>
    </div>
  )
}
