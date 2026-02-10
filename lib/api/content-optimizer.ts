import { get, post } from '@/lib/api-client'

const API_PREFIX = '/api/v1/content-optimizer'

export type LLMProvider = 'gemini' | 'openai'

export interface ContentAnalysisRequest {
  content: string
  contentType: 'text' | 'url'
  brandName: string
  llmProvider?: LLMProvider
}

export interface CitationScore {
  overall_score: number
  brand_mention_score: number
  authority_score: number
  structure_score: number
  freshness_score: number
}

export interface DiagnosisItem {
  category: string
  severity: 'critical' | 'warning' | 'info'
  title: string
  description: string
  recommendation: string
}

export interface DiagnosisResult {
  citation_score: CitationScore
  findings: DiagnosisItem[]
  summary: string
}

export interface SuggestionItem {
  category: string
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  example_before: string | null
  example_after: string | null
}

export interface SuggestResult {
  suggestions: SuggestionItem[]
  estimated_score_improvement: number
  summary: string
}

export interface CompareResult {
  original_score: CitationScore
  optimized_score: CitationScore
  improvement: number
  changes_summary: string[]
}

interface AnalysisHistoryItem {
  id: number
  target_brand: string
  overall_score: number
  text_preview: string
  created_at: string
}

interface AnalysisHistoryResponse {
  items: AnalysisHistoryItem[]
  total: number
}

export async function analyzeContent(
  request: ContentAnalysisRequest
): Promise<DiagnosisResult> {
  const llmProvider = request.llmProvider ?? 'gemini'

  if (request.contentType === 'url') {
    return post<DiagnosisResult>(`${API_PREFIX}/analyze-url`, {
      url: request.content,
      target_brand: request.brandName,
      llm_provider: llmProvider,
    })
  }

  return post<DiagnosisResult>(`${API_PREFIX}/analyze-text`, {
    text: request.content,
    target_brand: request.brandName,
    llm_provider: llmProvider,
  })
}

export async function diagnoseContent(params: {
  text: string
  brandName: string
  llmProvider?: LLMProvider
}): Promise<DiagnosisResult> {
  return post<DiagnosisResult>(`${API_PREFIX}/diagnose`, {
    text: params.text,
    target_brand: params.brandName,
    llm_provider: params.llmProvider ?? 'gemini',
  })
}

export async function suggestImprovements(params: {
  text: string
  brandName: string
  llmProvider?: LLMProvider
}): Promise<SuggestResult> {
  return post<SuggestResult>(`${API_PREFIX}/suggest`, {
    text: params.text,
    target_brand: params.brandName,
    llm_provider: params.llmProvider ?? 'gemini',
  })
}

export async function compareContent(params: {
  originalText: string
  optimizedText: string
  brandName: string
  llmProvider?: LLMProvider
}): Promise<CompareResult> {
  return post<CompareResult>(`${API_PREFIX}/compare`, {
    original_text: params.originalText,
    optimized_text: params.optimizedText,
    target_brand: params.brandName,
    llm_provider: params.llmProvider ?? 'gemini',
  })
}

export async function getAnalysisHistory(
  limit = 20,
  offset = 0
): Promise<AnalysisHistoryResponse> {
  const params = new URLSearchParams()
  params.set('limit', String(limit))
  params.set('offset', String(offset))
  return get<AnalysisHistoryResponse>(`${API_PREFIX}/history?${params.toString()}`)
}
