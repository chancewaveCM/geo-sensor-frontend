'use client';

import { useRef, useState, useEffect } from 'react';
import { PipelineSetupForm } from '@/components/query-lab/PipelineSetupForm';
import { PipelineProgress } from '@/components/query-lab/PipelineProgress';
import { PipelineResults } from '@/components/query-lab/PipelineResults';
import {
  startPipeline,
  getJobStatus,
  cancelJob,
  getJobCategories
} from '@/lib/api/pipeline';
import type {
  PipelineJobStatus,
  PipelineCategory,
  PipelineConfig
} from '@/types/pipeline';
import { ACTIVE_PIPELINE_STATUSES as ACTIVE_STATUSES } from '@/types/pipeline';

const POLLING_INTERVAL_MS = 2000;

export default function QueryLabPage() {
  const resultsRef = useRef<HTMLDivElement>(null);
  const pipelineJobRef = useRef<PipelineJobStatus | null>(null);

  // Pipeline state
  const [pipelineJob, setPipelineJob] = useState<PipelineJobStatus | null>(null);
  const [categories, setCategories] = useState<PipelineCategory[]>([]);
  const [isStarting, setIsStarting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [pipelineError, setPipelineError] = useState<string | null>(null);

  useEffect(() => {
    pipelineJobRef.current = pipelineJob;
  }, [pipelineJob]);

  // Polling for pipeline progress
  useEffect(() => {
    if (!pipelineJob || !ACTIVE_STATUSES.includes(pipelineJob.status)) {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const currentJob = pipelineJobRef.current;
        if (!currentJob) return;

        const status = await getJobStatus(currentJob.id);
        setPipelineJob(status);

        // Fetch categories for partial/completed results.
        if (['expanding_queries', 'executing_queries', 'completed'].includes(status.status)) {
          const cats = await getJobCategories(currentJob.id);
          setCategories(cats.categories);
        }
      } catch (err) {
        console.error('Failed to fetch job status:', err);
      }
    }, POLLING_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [pipelineJob?.id, pipelineJob?.status]);

  // Pipeline submit handler
  const handlePipelineSubmit = async (config: PipelineConfig) => {
    if (config.companyProfileId === null) return;

    setIsStarting(true);
    setPipelineError(null);
    setCategories([]);

    try {
      const response = await startPipeline({
        company_profile_id: config.companyProfileId,
        category_count: config.categoryCount,
        queries_per_category: config.queriesPerCategory,
        llm_providers: config.llmProviders,
      });

      // Fetch initial job status
      const status = await getJobStatus(response.job_id);
      setPipelineJob(status);
    } catch (err) {
      const message = err instanceof Error ? err.message : '파이프라인 시작 실패';
      setPipelineError(message);
    } finally {
      setIsStarting(false);
    }
  };

  // Pipeline cancel handler
  const handlePipelineCancel = async () => {
    if (!pipelineJob) return;

    setIsCancelling(true);
    try {
      await cancelJob(pipelineJob.id);
      const status = await getJobStatus(pipelineJob.id);
      setPipelineJob(status);
    } catch (err) {
      console.error('Failed to cancel job:', err);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleViewResults = () => {
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">쿼리 랩</h1>
        <p className="text-muted-foreground mt-1">
          기업 프로필 기반 대량 쿼리 파이프라인 분석
        </p>
      </div>

      {/* Pipeline */}
      {pipelineError && (
        <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
          <p className="text-destructive text-sm">{pipelineError}</p>
        </div>
      )}

      {!pipelineJob ? (
        <PipelineSetupForm
          onSubmit={handlePipelineSubmit}
          isLoading={isStarting}
        />
      ) : (
        <div className="space-y-6">
          <PipelineProgress
            job={pipelineJob}
            onCancel={handlePipelineCancel}
            isCancelling={isCancelling}
            categories={categories}
            onViewResults={handleViewResults}
          />

          {pipelineJob.status === 'completed' && categories.length > 0 && (
            <div ref={resultsRef}>
              <PipelineResults
                jobId={pipelineJob.id}
                categories={categories}
              />
            </div>
          )}

          {/* New Pipeline Button (after completion) */}
          {['completed', 'failed', 'cancelled'].includes(pipelineJob.status) && (
            <div className="text-center">
              <button
                onClick={() => {
                  setPipelineJob(null);
                  setCategories([]);
                  setPipelineError(null);
                }}
                className="text-sm text-primary hover:underline"
                aria-label="새 파이프라인 시작"
              >
                새 파이프라인 시작
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
