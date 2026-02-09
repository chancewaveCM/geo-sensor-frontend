'use client'

/**
 * EmptyState Component Usage Examples
 *
 * This file demonstrates various ways to use the EmptyState component
 * in dashboard contexts (charts, tables, stats, etc.)
 */

import { EmptyState } from '@/components/ui/empty-state'
import { Button } from '@/components/ui/button'
import {
  BarChart3,
  FileText,
  Inbox,
  Search,
  Plus,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'

// Example 1: Empty chart data
export function EmptyChartState() {
  return (
    <EmptyState
      icon={<BarChart3 className="h-6 w-6" />}
      title="데이터가 없습니다"
      description="선택한 기간에 표시할 데이터가 없습니다. 다른 기간을 선택해주세요."
    />
  )
}

// Example 2: No search results
export function NoSearchResultsState() {
  return (
    <EmptyState
      icon={<Search className="h-6 w-6" />}
      title="검색 결과가 없습니다"
      description="검색어와 일치하는 항목을 찾을 수 없습니다. 다른 검색어로 시도해보세요."
      action={
        <Button variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          초기화
        </Button>
      }
    />
  )
}

// Example 3: Empty campaign list
export function NoCampaignsState() {
  return (
    <EmptyState
      icon={<Inbox className="h-6 w-6" />}
      title="캠페인이 없습니다"
      description="아직 생성된 캠페인이 없습니다. 첫 캠페인을 시작해보세요."
      action={
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          새 캠페인 만들기
        </Button>
      }
    />
  )
}

// Example 4: Empty report list
export function NoReportsState() {
  return (
    <EmptyState
      icon={<FileText className="h-6 w-6" />}
      title="리포트가 없습니다"
      description="이 기간에 생성된 리포트가 없습니다."
    />
  )
}

// Example 5: Error state
export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <EmptyState
      icon={<AlertCircle className="h-6 w-6" />}
      title="데이터를 불러올 수 없습니다"
      description="네트워크 오류가 발생했습니다. 다시 시도해주세요."
      action={
        <Button onClick={onRetry} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          다시 시도
        </Button>
      }
    />
  )
}

// Example 6: Usage in a Card component
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function DashboardCardWithEmptyState() {
  const hasData = false // This would come from your data fetching logic

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">최근 분석</CardTitle>
      </CardHeader>
      <CardContent>
        {hasData ? (
          <div>Your data here</div>
        ) : (
          <EmptyState
            icon={<BarChart3 className="h-6 w-6" />}
            title="분석 결과가 없습니다"
            description="최근 7일간 분석 결과가 없습니다."
            className="min-h-[150px]"
          />
        )}
      </CardContent>
    </Card>
  )
}

// Example 7: Grid layout with multiple empty states
export function DashboardGridExample() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Citation Share</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyChartState />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">GEO Score</CardTitle>
        </CardHeader>
        <CardContent>
          <EmptyChartState />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <NoCampaignsState />
        </CardContent>
      </Card>
    </div>
  )
}
