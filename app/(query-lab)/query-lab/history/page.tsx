'use client';

import { useState, useEffect, useCallback } from 'react';
import { History, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table } from '@/components/ui/table';
import { EmptyState } from '@/components/ui/empty-state';
import {
  getJobs,
  getJobCategories,
  getJobQueries,
  getQueryResponses,
} from '@/lib/api/pipeline';
import type {
  PipelineJobSummary,
  PipelineCategory,
  ExpandedQuery,
  RawLLMResponse,
} from '@/types/pipeline';

type StatusFilter = 'all' | 'completed' | 'failed' | 'running';

export default function HistoryPage() {
  const [jobs, setJobs] = useState<PipelineJobSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [expandedJobId, setExpandedJobId] = useState<number | null>(null);
  const [jobDetails, setJobDetails] = useState<{
    categories: PipelineCategory[];
    queries: ExpandedQuery[];
    loadingCategories: boolean;
    loadingQueries: boolean;
  } | null>(null);

  const [expandedQueryId, setExpandedQueryId] = useState<number | null>(null);
  const [queryResponses, setQueryResponses] = useState<{
    [queryId: number]: {
      responses: RawLLMResponse[];
      loading: boolean;
    };
  }>({});

  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getJobs(undefined, 50, 0);

      // Apply client-side status filter
      let filtered = data.jobs;
      if (statusFilter === 'completed') {
        filtered = data.jobs.filter(j => j.status === 'completed');
      } else if (statusFilter === 'failed') {
        filtered = data.jobs.filter(j => j.status === 'failed');
      } else if (statusFilter === 'running') {
        filtered = data.jobs.filter(j =>
          ['pending', 'generating_categories', 'expanding_queries', 'executing_queries'].includes(j.status)
        );
      }

      setJobs(filtered);
      setTotal(filtered.length);
    } catch (err) {
      const message = err instanceof Error ? err.message : '작업 목록을 불러오지 못했습니다';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleRowClick = async (jobId: number) => {
    if (expandedJobId === jobId) {
      setExpandedJobId(null);
      setJobDetails(null);
      return;
    }

    setExpandedJobId(jobId);
    setJobDetails({
      categories: [],
      queries: [],
      loadingCategories: true,
      loadingQueries: true,
    });

    try {
      const [categoriesData, queriesData] = await Promise.all([
        getJobCategories(jobId),
        getJobQueries(jobId),
      ]);

      setJobDetails({
        categories: categoriesData.categories,
        queries: queriesData.queries,
        loadingCategories: false,
        loadingQueries: false,
      });
    } catch (err) {
      console.error('Failed to load job details:', err);
      setJobDetails(prev => prev ? {
        ...prev,
        loadingCategories: false,
        loadingQueries: false,
      } : null);
    }
  };

  const handleQueryClick = async (queryId: number) => {
    if (expandedQueryId === queryId) {
      setExpandedQueryId(null);
      return;
    }

    setExpandedQueryId(queryId);
    setQueryResponses(prev => ({
      ...prev,
      [queryId]: { responses: [], loading: true },
    }));

    try {
      const data = await getQueryResponses(queryId);
      setQueryResponses(prev => ({
        ...prev,
        [queryId]: { responses: data.responses, loading: false },
      }));
    } catch (err) {
      console.error('Failed to load query responses:', err);
      setQueryResponses(prev => ({
        ...prev,
        [queryId]: { responses: [], loading: false },
      }));
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; label: string }> = {
      completed: { variant: 'default', label: '완료' },
      failed: { variant: 'destructive', label: '실패' },
      cancelled: { variant: 'secondary', label: '취소됨' },
      pending: { variant: 'outline', label: '대기중' },
      generating_categories: { variant: 'outline', label: '카테고리 생성중' },
      expanding_queries: { variant: 'outline', label: '쿼리 확장중' },
      executing_queries: { variant: 'outline', label: '실행중' },
    };

    const config = variants[status] || { variant: 'outline' as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getProviderBadge = (provider: string) => {
    const colors: Record<string, string> = {
      gemini: 'bg-blue-100 text-blue-800 border-blue-200',
      openai: 'bg-green-100 text-green-800 border-green-200',
    };
    const className = colors[provider] || 'bg-gray-100 text-gray-800 border-gray-200';

    return (
      <Badge variant="outline" className={className}>
        {provider}
      </Badge>
    );
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatElapsedTime = (startedAt: string | null, completedAt: string | null) => {
    if (!startedAt) return '-';
    const start = new Date(startedAt).getTime();
    const end = completedAt ? new Date(completedAt).getTime() : Date.now();
    const seconds = Math.floor((end - start) / 1000);

    if (seconds < 60) return `${seconds}초`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}분`;
    return `${Math.floor(seconds / 3600)}시간`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">파이프라인 히스토리</h1>
        <p className="text-muted-foreground mt-1">
          과거 실행된 파이프라인 작업 이력을 확인하세요
        </p>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">필터</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('all')}
            >
              전체
            </Button>
            <Button
              variant={statusFilter === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('completed')}
            >
              완료
            </Button>
            <Button
              variant={statusFilter === 'failed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('failed')}
            >
              실패
            </Button>
            <Button
              variant={statusFilter === 'running' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('running')}
            >
              실행중
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Job List */}
      <Card>
        <CardHeader>
          <CardTitle>작업 목록</CardTitle>
          <CardDescription>{total}개의 작업</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          ) : jobs.length === 0 ? (
            <EmptyState
              icon={<History />}
              title="작업 이력이 없습니다"
              description="아직 실행된 파이프라인 작업이 없습니다"
            />
          ) : (
            <div className="space-y-2">
              {jobs.map((job) => (
                <div key={job.id} className="border rounded-lg">
                  <button
                    onClick={() => handleRowClick(job.id)}
                    className="w-full p-4 hover:bg-muted/50 transition-colors text-left"
                  >
                    <div className="grid grid-cols-[auto_1fr_auto_auto_auto_auto] gap-4 items-center">
                      <div className="text-sm font-mono text-muted-foreground">
                        #{job.id}
                      </div>

                      <div>
                        <div className="font-medium">{job.company_name || '알 수 없는 브랜드'}</div>
                        <div className="text-sm text-muted-foreground">
                          {job.query_set_name || '-'}
                        </div>
                      </div>

                      <div className="flex gap-1">
                        {job.llm_providers.map((p) => (
                          <span key={p}>{getProviderBadge(p)}</span>
                        ))}
                      </div>

                      <div className="text-center">
                        <div className="text-sm font-medium">
                          {job.progress_percentage}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {job.completed_queries}/{job.total_queries}
                        </div>
                      </div>

                      <div>
                        {getStatusBadge(job.status)}
                      </div>

                      <div className="text-right">
                        <div className="text-sm">{formatDate(job.started_at)}</div>
                        <div className="text-xs text-muted-foreground">
                          소요: {formatElapsedTime(job.started_at, job.completed_at)}
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {expandedJobId === job.id && jobDetails && (
                    <div className="border-t bg-muted/20 p-4 space-y-4">
                      {/* Categories */}
                      <div>
                        <h3 className="font-semibold mb-2">카테고리 ({jobDetails.categories.length})</h3>
                        {jobDetails.loadingCategories ? (
                          <div className="flex justify-center py-4">
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-2">
                            {jobDetails.categories.map((cat) => (
                              <div
                                key={cat.id}
                                className="p-2 bg-background border rounded text-sm"
                              >
                                <div className="font-medium">{cat.name}</div>
                                <div className="text-xs text-muted-foreground">
                                  {cat.query_count}개 쿼리 · {cat.persona_type}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Queries */}
                      <div>
                        <h3 className="font-semibold mb-2">쿼리 ({jobDetails.queries.length})</h3>
                        {jobDetails.loadingQueries ? (
                          <div className="flex justify-center py-4">
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {jobDetails.queries.slice(0, 10).map((query) => (
                              <div key={query.id} className="border rounded">
                                <button
                                  onClick={() => handleQueryClick(query.id)}
                                  className="w-full p-3 hover:bg-muted/50 transition-colors text-left"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <div className="text-sm">{query.text}</div>
                                      <div className="text-xs text-muted-foreground mt-1">
                                        {query.response_count}개 응답
                                      </div>
                                    </div>
                                    {expandedQueryId === query.id ? (
                                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                    )}
                                  </div>
                                </button>

                                {/* Query Responses */}
                                {expandedQueryId === query.id && queryResponses[query.id] && (
                                  <div className="border-t bg-muted/20 p-3 space-y-2">
                                    {queryResponses[query.id].loading ? (
                                      <div className="flex justify-center py-2">
                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                      </div>
                                    ) : (
                                      queryResponses[query.id].responses.map((resp) => (
                                        <div
                                          key={resp.id}
                                          className="p-2 bg-background border rounded text-sm"
                                        >
                                          <div className="flex items-center gap-2 mb-1">
                                            {getProviderBadge(resp.llm_provider)}
                                            <span className="text-xs text-muted-foreground">
                                              {resp.llm_model}
                                            </span>
                                            {resp.tokens_used && (
                                              <span className="text-xs text-muted-foreground">
                                                · {resp.tokens_used} tokens
                                              </span>
                                            )}
                                            {resp.latency_ms && (
                                              <span className="text-xs text-muted-foreground">
                                                · {resp.latency_ms}ms
                                              </span>
                                            )}
                                          </div>
                                          <div className="text-sm whitespace-pre-wrap">
                                            {resp.content.slice(0, 200)}
                                            {resp.content.length > 200 && '...'}
                                          </div>
                                          {resp.error_message && (
                                            <div className="text-xs text-destructive mt-1">
                                              에러: {resp.error_message}
                                            </div>
                                          )}
                                        </div>
                                      ))
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                            {jobDetails.queries.length > 10 && (
                              <p className="text-xs text-muted-foreground text-center py-2">
                                ...외 {jobDetails.queries.length - 10}개 쿼리
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
