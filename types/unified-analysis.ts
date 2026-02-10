// types/unified-analysis.ts
// Unified analysis types for Quick and Advanced modes

import type { PipelineStatus } from './pipeline'

// Analysis modes
export type AnalysisMode = 'quick' | 'advanced'

// Job wrapper around PipelineJobStatus
export interface AnalysisJob {
  id: number
  mode: AnalysisMode
  status: PipelineStatus
  companyProfileId: number
  companyName?: string
  querySetId?: number
  totalQueries: number
  completedQueries: number
  failedQueries: number
  progressPercentage: number
  startedAt: string | null
  completedAt: string | null
  elapsedSeconds: number | null
  errorMessage: string | null
  createdAt: string
}

// Quick analysis: simplified config
export interface QuickAnalysisConfig {
  companyProfileId: number
  llmProviders: string[]  // default ['gemini', 'openai']
}

// Advanced analysis: full config
export interface AdvancedAnalysisConfig {
  companyProfileId: number
  categoryCount: number      // 1-20
  queriesPerCategory: number // 1-20
  llmProviders: string[]
}

// Analysis results
export interface AnalysisResult {
  queryId: number
  queryText: string
  categoryName: string
  responses: ProviderResponse[]
}

export interface ProviderResponse {
  id: number
  provider: string
  model: string
  content: string
  tokensUsed: number | null
  latencyMs: number | null
  citations: CitationMatch[]
}

export interface CitationMatch {
  brandName: string
  matchedText: string
  matchType: string
  confidence: number
}
