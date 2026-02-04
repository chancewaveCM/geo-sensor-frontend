'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PROVIDERS } from '@/lib/constants/query-lab-config';
import type { LLMProvider } from '@/types/query-lab';

interface QueryInputProps {
  query: string;
  onQueryChange: (query: string) => void;
  selectedProviders: LLMProvider[];
  onProvidersChange: (providers: LLMProvider[]) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function QueryInput({
  query,
  onQueryChange,
  selectedProviders,
  onProvidersChange,
  onSubmit,
  isLoading,
}: QueryInputProps) {
  const toggleProvider = (providerId: LLMProvider) => {
    if (selectedProviders.includes(providerId)) {
      onProvidersChange(selectedProviders.filter(p => p !== providerId));
    } else {
      onProvidersChange([...selectedProviders, providerId]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium">쿼리 입력</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="query" className="block text-sm font-medium text-gray-700 mb-2">
            질문을 입력하세요
          </label>
          <textarea
            id="query"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="예: 2024년 최고의 스마트폰을 추천해주세요"
            className="w-full min-h-[120px] px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y text-gray-900 placeholder-gray-400"
            disabled={isLoading}
          />
          <p className="mt-1 text-xs text-gray-500">
            Ctrl+Enter (Mac: Cmd+Enter)로 제출
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            LLM 제공자 선택
          </label>
          <div className="flex flex-wrap gap-3">
            {PROVIDERS.map((provider) => (
              <button
                key={provider.id}
                type="button"
                onClick={() => toggleProvider(provider.id)}
                disabled={isLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                  selectedProviders.includes(provider.id)
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span className="text-lg">{provider.icon}</span>
                <span className="font-medium">{provider.name}</span>
                {selectedProviders.includes(provider.id) && (
                  <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
          {selectedProviders.length === 0 && (
            <p className="mt-2 text-sm text-amber-600">
              최소 1개의 제공자를 선택하세요
            </p>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button
            onClick={onSubmit}
            disabled={!query.trim() || selectedProviders.length === 0 || isLoading}
            className="px-6"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                분석 중...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                쿼리 분석
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
