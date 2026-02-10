// lib/api/analysis.ts
// Wrapper around existing pipeline API with analysis-specific interfaces

import { get } from '@/lib/api-client'
import {
  startPipeline,
  getJobStatus,
  getJobs,
  cancelJob,
  getJobCategories,
  getJobQueries,
  getQueryResponses,
  rerunQuerySet,
} from '@/lib/api/pipeline'
import type { StartPipelineRequest, PipelineJobListResponse } from '@/types/pipeline'
import type { QuickAnalysisConfig, AdvancedAnalysisConfig } from '@/types/unified-analysis'
import type { CompanyProfile } from '@/types/analysis'

const API_PREFIX = '/api/v1'

// Start quick analysis (preset: 3 categories, 10 queries)
export async function startQuickAnalysis(config: QuickAnalysisConfig) {
  const request: StartPipelineRequest = {
    company_profile_id: config.companyProfileId,
    category_count: 3,
    queries_per_category: 10,
    llm_providers: config.llmProviders,
  }
  return startPipeline(request)
}

// Start advanced analysis (custom config)
export async function startAdvancedAnalysis(config: AdvancedAnalysisConfig) {
  const request: StartPipelineRequest = {
    company_profile_id: config.companyProfileId,
    category_count: config.categoryCount,
    queries_per_category: config.queriesPerCategory,
    llm_providers: config.llmProviders,
  }
  return startPipeline(request)
}

// Re-export pipeline functions that analysis uses directly
export { getJobStatus, getJobs, cancelJob, getJobCategories, getJobQueries, getQueryResponses, rerunQuerySet }

// Get company profiles for selection
export async function getCompanyProfiles(): Promise<CompanyProfile[]> {
  return get<CompanyProfile[]>(`${API_PREFIX}/company-profiles/`)
}
