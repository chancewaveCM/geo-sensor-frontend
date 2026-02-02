'use client';

import { useState } from 'react';
import { QueryInput } from '@/components/query-lab/QueryInput';
import { ResponsePanel } from '@/components/query-lab/ResponsePanel';
import { AnalysisSummary } from '@/components/query-lab/AnalysisSummary';
import { ExportButton } from '@/components/query-lab/ExportButton';
import { mockQueryResult, generateComparisonSummary } from '@/lib/mock-query-data';
import type { LLMProvider, QueryLabResult } from '@/types/query-lab';

export default function QueryLabPage() {
  const [query, setQuery] = useState('');
  const [selectedProviders, setSelectedProviders] = useState<LLMProvider[]>(['gemini', 'gpt-4']);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<QueryLabResult | null>(null);

  const handleSubmit = async () => {
    if (!query.trim() || selectedProviders.length === 0) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    setResult({
      ...mockQueryResult,
      query,
      timestamp: new Date().toISOString(),
    });
    setIsLoading(false);
  };

  const comparisonSummary = result ? generateComparisonSummary(result) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Query Lab</h1>
          <p className="text-gray-500 mt-1">
            Compare LLM responses and analyze brand citations
          </p>
        </div>
        {result && <ExportButton result={result} />}
      </div>

      <QueryInput
        query={query}
        onQueryChange={setQuery}
        selectedProviders={selectedProviders}
        onProvidersChange={setSelectedProviders}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />

      {result && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {result.responses.map((response) => (
              <ResponsePanel
                key={response.provider}
                response={response}
              />
            ))}
          </div>

          {comparisonSummary && (
            <AnalysisSummary summary={comparisonSummary} responses={result.responses} />
          )}
        </>
      )}

      {!result && !isLoading && (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Enter a query to get started
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Type your question above and select which LLM providers to compare.
            We will analyze the responses for brand citations and sentiment.
          </p>
        </div>
      )}
    </div>
  );
}
