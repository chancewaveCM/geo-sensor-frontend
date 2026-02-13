'use client'

import { useState } from 'react'
import {
  Wand2, ChevronDown, Download, Upload, Link2, FileText, Copy,
  Rocket, Share2,
  CheckCircle2, XCircle, AlertCircle, Info, ArrowRight,
  Hash, Eye,
  BarChart3, Lightbulb, MapPin, ArrowUpRight
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts'
import {
  MOCK_ORIGINAL_CONTENT, MOCK_OPTIMIZED_CONTENT, MOCK_GEO_SCORE,
  MOCK_SUGGESTIONS, MOCK_SNS_CHANNELS, MOCK_AI_SIMULATIONS,
  type Suggestion, type SuggestionStatus
} from './mock-data'

// Extended suggestion type with status
type SuggestionWithStatus = Suggestion & { status: SuggestionStatus }

export default function ContentOptimizerPage() {
  const [suggestions, setSuggestions] = useState<SuggestionWithStatus[]>(
    MOCK_SUGGESTIONS.map(s => ({ ...s, status: 'pending' as SuggestionStatus }))
  )
  const [appliedCount, setAppliedCount] = useState(0)
  const [isAnalyzed] = useState(true)
  const [activePreviewTab, setActivePreviewTab] = useState('optimized')

  const handleApply = (id: string) => {
    setSuggestions(prev => prev.map(s =>
      s.id === id ? { ...s, status: 'applied' as SuggestionStatus } : s
    ))
    setAppliedCount(prev => prev + 1)
  }

  const handleDismiss = (id: string) => {
    setSuggestions(prev => prev.map(s =>
      s.id === id ? { ...s, status: 'dismissed' as SuggestionStatus } : s
    ))
  }

  const handleApplyAll = () => {
    const pendingCount = suggestions.filter(s => s.status === 'pending').length
    setSuggestions(prev => prev.map(s =>
      s.status === 'pending' ? { ...s, status: 'applied' as SuggestionStatus } : s
    ))
    setAppliedCount(prev => prev + pendingCount)
  }

  const criticalSuggestions = suggestions.filter(s => s.severity === 'critical')
  const importantSuggestions = suggestions.filter(s => s.severity === 'important')
  const niceToHaveSuggestions = suggestions.filter(s => s.severity === 'nice-to-have')

  return (
    <div className="space-y-6 p-6 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-950">
            <Wand2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">GEO 콘텐츠 최적화</h1>
            <p className="text-sm text-muted-foreground">AI 최적화로 검색 인용률을 극대화하세요</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="campaign-1">
            <SelectTrigger className="w-[280px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="campaign-1">AI 반도체 HBM4 캠페인</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                내보내기
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                Markdown
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                DOCX
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                PDF
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                클립보드 복사
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Top Grid: Content Input + GEO Score */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Content Input Section */}
        <div className="lg:col-span-7">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                콘텐츠 입력
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Input Method Tabs */}
              <div className="flex gap-2 border-b">
                <Button variant="ghost" className="border-b-2 border-indigo-600 rounded-none">
                  <FileText className="mr-2 h-4 w-4" />
                  텍스트 붙여넣기
                </Button>
                <Button variant="ghost" className="text-muted-foreground">
                  <Link2 className="mr-2 h-4 w-4" />
                  URL 가져오기
                </Button>
                <Button variant="ghost" className="text-muted-foreground">
                  <Upload className="mr-2 h-4 w-4" />
                  파일 업로드
                </Button>
              </div>

              {/* Content Textarea */}
              <Textarea
                readOnly
                value={MOCK_ORIGINAL_CONTENT}
                className="min-h-[300px] font-mono text-sm resize-none"
              />

              {/* Settings Row */}
              <div className="grid gap-4 md:grid-cols-3 pt-2">
                {/* Target LLMs */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">타겟 LLM</label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox id="gpt" defaultChecked />
                      <label htmlFor="gpt" className="text-sm">GPT</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="gemini" defaultChecked />
                      <label htmlFor="gemini" className="text-sm">Gemini</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="claude" defaultChecked />
                      <label htmlFor="claude" className="text-sm">Claude</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="perplexity" defaultChecked />
                      <label htmlFor="perplexity" className="text-sm">Perplexity</label>
                    </div>
                  </div>
                </div>

                {/* Brand */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">브랜드</label>
                  <Input defaultValue="삼성전자" />
                </div>

                {/* Industry */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">산업군</label>
                  <Select defaultValue="semiconductor">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="semiconductor">반도체/전자</SelectItem>
                      <SelectItem value="automotive">자동차</SelectItem>
                      <SelectItem value="finance">금융</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Analyze Button */}
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700" size="lg">
                <CheckCircle2 className="mr-2 h-5 w-5" />
                GEO 분석 완료 ✓
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* GEO Score Panel */}
        <div className="lg:col-span-5">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-indigo-600" />
                GEO Score
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Main Score */}
              <div className="text-center space-y-2">
                <div className="text-5xl font-bold text-indigo-600 dark:text-indigo-400">
                  {MOCK_GEO_SCORE.after}
                </div>
                <Badge className="bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  {MOCK_GEO_SCORE.grade} Grade
                </Badge>
                <div className="text-sm text-muted-foreground">
                  <span className="text-red-500 dark:text-red-400">{MOCK_GEO_SCORE.before}</span>
                  {' → '}
                  <span className="text-emerald-500 dark:text-emerald-400">{MOCK_GEO_SCORE.after}</span>
                  <span className="ml-2 text-emerald-600 font-medium">
                    (+{MOCK_GEO_SCORE.after - MOCK_GEO_SCORE.before}▲)
                  </span>
                </div>
                <Progress value={MOCK_GEO_SCORE.after} className="h-2" />
              </div>

              {/* Radar Chart */}
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={MOCK_GEO_SCORE.dimensions.map(d => ({
                    dimension: d.name,
                    before: d.before,
                    after: d.after,
                  }))}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar name="Before" dataKey="before" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
                    <Radar name="After" dataKey="after" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Dimension Bars */}
              <div className="space-y-3">
                {MOCK_GEO_SCORE.dimensions.map((dim) => {
                  const change = dim.after - dim.before
                  const changeColor = change > 0 ? 'text-emerald-600' : change < 0 ? 'text-red-600' : 'text-gray-600'
                  return (
                    <div key={dim.name} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium">{dim.icon} {dim.name}</span>
                        <span className="text-muted-foreground">
                          {dim.before} → {dim.after}
                          <span className={`ml-1 font-medium ${changeColor}`}>
                            {change > 0 ? '▲' : change < 0 ? '▼' : ''}
                            {Math.abs(change)}
                          </span>
                        </span>
                      </div>
                      <Progress value={dim.after} className="h-1.5" />
                    </div>
                  )
                })}
              </div>

              {/* Stats */}
              <div className="space-y-2 pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">적용된 제안</span>
                  <span className="font-medium">{appliedCount}/{suggestions.length}건</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">예상 인용 확률</span>
                  <span className="font-medium">
                    <span className="text-red-500">23%</span>
                    {' → '}
                    <span className="text-emerald-500">78%</span>
                    <span className="ml-1 text-emerald-600">(+55%p)</span>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Suggestion Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              개선 제안 ({suggestions.length}건)
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {appliedCount}/{suggestions.length} 반영됨
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    심각도별
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>전체</DropdownMenuItem>
                  <DropdownMenuItem>Critical</DropdownMenuItem>
                  <DropdownMenuItem>Important</DropdownMenuItem>
                  <DropdownMenuItem>Nice-to-have</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    기대 효과순
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>기대 효과순</DropdownMenuItem>
                  <DropdownMenuItem>심각도순</DropdownMenuItem>
                  <DropdownMenuItem>위치순</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button onClick={handleApplyAll}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                전체 반영
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Critical Suggestions */}
          {criticalSuggestions.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <h3 className="font-medium text-sm">Critical ({criticalSuggestions.length})</h3>
              </div>
              {criticalSuggestions.map(suggestion => (
                <SuggestionCard
                  key={suggestion.id}
                  suggestion={suggestion}
                  onApply={handleApply}
                  onDismiss={handleDismiss}
                />
              ))}
            </div>
          )}

          {/* Important Suggestions */}
          {importantSuggestions.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <h3 className="font-medium text-sm">Important ({importantSuggestions.length})</h3>
              </div>
              {importantSuggestions.map(suggestion => (
                <SuggestionCard
                  key={suggestion.id}
                  suggestion={suggestion}
                  onApply={handleApply}
                  onDismiss={handleDismiss}
                />
              ))}
            </div>
          )}

          {/* Nice-to-have Suggestions */}
          {niceToHaveSuggestions.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-500" />
                <h3 className="font-medium text-sm">Nice-to-have ({niceToHaveSuggestions.length})</h3>
              </div>
              {niceToHaveSuggestions.map(suggestion => (
                <SuggestionCard
                  key={suggestion.id}
                  suggestion={suggestion}
                  onApply={handleApply}
                  onDismiss={handleDismiss}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            콘텐츠 미리보기
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activePreviewTab} onValueChange={setActivePreviewTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="original">원본</TabsTrigger>
              <TabsTrigger value="optimized">최적화본</TabsTrigger>
              <TabsTrigger value="simulation">AI 응답 시뮬레이션</TabsTrigger>
              <TabsTrigger value="compare">비교</TabsTrigger>
            </TabsList>

            <TabsContent value="original" className="space-y-4">
              <div className="rounded-lg border bg-muted/30 p-6">
                <pre className="whitespace-pre-wrap font-sans text-sm">
                  {MOCK_ORIGINAL_CONTENT}
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="optimized" className="space-y-4">
              <div className="rounded-lg border bg-muted/30 p-6">
                <div className="whitespace-pre-wrap font-sans text-sm">
                  {MOCK_OPTIMIZED_CONTENT.split('\n').map((line, i) => {
                    const hasHighlight = line.includes('HBM4') || line.includes('데이터 처리 속도') || line.includes('AI 반도체')
                    return (
                      <div key={i}>
                        {hasHighlight ? (
                          <span className="bg-emerald-50 dark:bg-emerald-950/30 px-1 rounded">
                            {line}
                          </span>
                        ) : (
                          line
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="simulation" className="space-y-6">
              {MOCK_AI_SIMULATIONS.map((sim) => (
                <div key={sim.provider} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge className={sim.color}>
                      {sim.icon} {sim.provider}
                    </Badge>
                    <span className="text-sm text-muted-foreground">질문: {sim.question}</span>
                  </div>

                  {/* Optimized Response */}
                  <div className="rounded-lg border-2 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="h-4 w-4" />
                      최적화 후
                    </div>
                    <p className="text-sm">{sim.responseAfter}</p>
                    <div className="text-xs text-muted-foreground">
                      출처: {sim.citationAfter}
                    </div>
                  </div>

                  {/* Original Response */}
                  <div className="rounded-lg border bg-muted/30 p-4 space-y-2 opacity-60">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <XCircle className="h-4 w-4" />
                      최적화 전
                    </div>
                    <p className="text-sm">{sim.responseBefore}</p>
                    <div className="text-xs text-muted-foreground">
                      출처: {sim.citationBefore}
                    </div>
                  </div>

                  {/* Probability */}
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">인용 확률</span>
                    <span className="text-sm">
                      <span className="text-red-500">{sim.probBefore}%</span>
                      {' → '}
                      <span className="text-emerald-500">{sim.probAfter}%</span>
                      <span className="ml-2 text-emerald-600 font-medium">
                        (+{sim.probAfter - sim.probBefore}%p ▲▲▲)
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="compare" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Original (Left) */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-400">
                    <XCircle className="h-4 w-4" />
                    원본
                  </div>
                  <div className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50/30 dark:bg-red-950/10 p-4">
                    <pre className="whitespace-pre-wrap font-sans text-sm line-through opacity-60">
                      {MOCK_ORIGINAL_CONTENT}
                    </pre>
                  </div>
                </div>

                {/* Optimized (Right) */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    최적화본
                  </div>
                  <div className="rounded-lg border border-emerald-200 dark:border-emerald-900 bg-emerald-50/30 dark:bg-emerald-950/10 p-4">
                    <div className="whitespace-pre-wrap font-sans text-sm">
                      {MOCK_OPTIMIZED_CONTENT.split('\n').map((line, i) => {
                        const hasHighlight = line.includes('HBM4') || line.includes('데이터 처리 속도') || line.includes('AI 반도체')
                        return (
                          <div key={i}>
                            {hasHighlight ? (
                              <span className="bg-emerald-200 dark:bg-emerald-900 px-1 rounded font-medium">
                                {line}
                              </span>
                            ) : (
                              line
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* SNS Channel Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5" />
                SNS 채널 최적화
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">📡 연동된 채널</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm">전체 자동수정</span>
                <Switch defaultChecked />
              </div>
              <Button variant="outline">
                자동수정된 콘텐츠 전체 보기
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {MOCK_SNS_CHANNELS.map((channel) => (
              <Card key={channel.id} className="border-2">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{channel.icon}</span>
                      <span className="font-medium">{channel.name}</span>
                    </div>
                    <Switch defaultChecked={channel.autoModify} />
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {channel.autoModify ? '자동수정 활성화' : '수동'}
                  </Badge>
                  <div className="text-sm text-muted-foreground line-clamp-3">
                    {channel.preview}
                  </div>
                  {channel.hashtags && (
                    <div className="flex flex-wrap gap-1">
                      {channel.hashtags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          <Hash className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="mr-2 h-4 w-4" />
                    보기
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            내보내기 & 배포
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              📄 Markdown
            </Button>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              📝 DOCX
            </Button>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              📋 PDF
            </Button>
            <Button variant="outline">
              <Copy className="mr-2 h-4 w-4" />
              📋 클립보드
            </Button>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Checkbox id="include-original" defaultChecked />
              <label htmlFor="include-original" className="text-sm">원본 포함</label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="include-history" defaultChecked />
              <label htmlFor="include-history" className="text-sm">변경 이력 포함</label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="include-report" defaultChecked />
              <label htmlFor="include-report" className="text-sm">GEO 리포트 첨부</label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="include-sns" />
              <label htmlFor="include-sns" className="text-sm">SNS 버전 포함</label>
            </div>
          </div>

          <Button className="w-full bg-indigo-600 hover:bg-indigo-700" size="lg">
            <Rocket className="mr-2 h-5 w-5" />
            🚀 선택 채널에 배포하기
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

// Suggestion Card Component (inline)
function SuggestionCard({
  suggestion,
  onApply,
  onDismiss
}: {
  suggestion: SuggestionWithStatus
  onApply: (id: string) => void
  onDismiss: (id: string) => void
}) {
  const severityConfig = {
    critical: {
      color: 'text-red-500 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900',
      badge: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
      icon: <AlertCircle className="h-4 w-4" />
    },
    important: {
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900',
      badge: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
      icon: <AlertCircle className="h-4 w-4" />
    },
    'nice-to-have': {
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900',
      badge: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
      icon: <Info className="h-4 w-4" />
    }
  }

  const config = severityConfig[suggestion.severity]

  if (suggestion.status === 'dismissed') {
    return (
      <Card className="opacity-50 border-l-4 border-l-gray-400">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-sm">{suggestion.title}</span>
              <Badge variant="outline" className="text-xs">무시됨</Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={() => onApply(suggestion.id)}>
              되돌리기
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const isApplied = suggestion.status === 'applied'

  return (
    <Card className={`relative border-l-4 ${isApplied ? 'border-l-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10' : `border-l-${suggestion.severity === 'critical' ? 'red' : suggestion.severity === 'important' ? 'amber' : 'blue'}-500`}`}>
      {isApplied && (
        <div className="absolute top-2 right-2">
          <Badge className="bg-emerald-500">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            반영됨
          </Badge>
        </div>
      )}
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={config.badge}>
              {config.icon}
              <span className="ml-1 capitalize">{suggestion.severity}</span>
            </Badge>
            <Badge variant="outline">
              <span>{suggestion.categoryIcon}</span>
              <span className="ml-1">{suggestion.categoryLabel}</span>
            </Badge>
          </div>
        </div>

        {/* Title & Location */}
        <div className="space-y-1">
          <h4 className="font-medium">{suggestion.title}</h4>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3 w-3" />
            <span>위치: {suggestion.location}</span>
          </div>
        </div>

        {/* Original Text */}
        <div className="space-y-1">
          <div className="text-sm font-medium text-muted-foreground">현재:</div>
          <div className="rounded-md bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 p-3">
            <p className="text-sm line-through opacity-75">{suggestion.original}</p>
          </div>
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <ArrowRight className="h-5 w-5 text-muted-foreground" />
        </div>

        {/* Suggested Text */}
        <div className="space-y-1">
          <div className="text-sm font-medium text-muted-foreground">제안:</div>
          <div className="rounded-md bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 p-3">
            <p className="text-sm font-medium">{suggestion.suggested}</p>
          </div>
        </div>

        {/* Explanation */}
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
            <Lightbulb className="h-4 w-4" />
            <span>왜?:</span>
          </div>
          <p className="text-sm text-muted-foreground pl-5">{suggestion.explanation}</p>
        </div>

        {/* Data Sources (if any) */}
        {suggestion.dataSources && suggestion.dataSources.length > 0 && (
          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">📎 추가 자료 제안:</div>
            <ul className="list-disc list-inside text-sm text-muted-foreground pl-2 space-y-1">
              {suggestion.dataSources.map((source, i) => (
                <li key={i}>{source}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Expected Impact */}
        <div className="flex items-center gap-2 text-sm">
          <ArrowUpRight className="h-4 w-4 text-emerald-500" />
          <span className="text-muted-foreground">📊 기대 효과:</span>
          <span className="font-medium text-emerald-600">
            {suggestion.expectedImpact.dimension} +{suggestion.expectedImpact.percentage}%
          </span>
        </div>

        {/* Actions */}
        {!isApplied && (
          <>
            <div className="border-t pt-4" />
            <div className="flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDismiss(suggestion.id)}
              >
                <XCircle className="mr-2 h-4 w-4" />
                무시
              </Button>
              <Button
                size="sm"
                onClick={() => onApply(suggestion.id)}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                ✓ 반영하기
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
