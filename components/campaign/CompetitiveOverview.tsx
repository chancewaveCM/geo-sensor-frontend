'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { TrendIndicator } from './TrendIndicator'
import { Crown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface CompetitiveBrand {
  brand_name: string
  citation_share: number
  rank: number
  change_from_previous: number | null
  is_target_brand: boolean
}

interface CompetitiveOverviewProps {
  brands: CompetitiveBrand[]
  className?: string
}

type SortField = 'rank' | 'brand_name' | 'citation_share' | 'change_from_previous'
type SortDirection = 'asc' | 'desc'

export function CompetitiveOverview({ brands, className }: CompetitiveOverviewProps) {
  const [sortField, setSortField] = useState<SortField>('rank')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedBrands = [...brands].sort((a, b) => {
    let aValue: string | number = a[sortField] ?? 0
    let bValue: string | number = b[sortField] ?? 0

    if (sortField === 'brand_name') {
      aValue = String(aValue)
      bValue = String(bValue)
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }

    aValue = Number(aValue)
    bValue = Number(bValue)
    return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
  })

  const getTrendDirection = (change: number | null): 'up' | 'down' | 'flat' => {
    if (change === null) return 'flat'
    if (change > 0.5) return 'up'
    if (change < -0.5) return 'down'
    return 'flat'
  }

  const SortableHeader = ({
    field,
    children,
  }: {
    field: SortField
    children: React.ReactNode
  }) => {
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleSort(field)
      }
    }

    const ariaSort = sortField === field
      ? sortDirection === 'asc'
        ? 'ascending'
        : 'descending'
      : undefined

    return (
      <TableHead
        className="cursor-pointer hover:bg-muted/50 select-none"
        onClick={() => handleSort(field)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-sort={ariaSort}
      >
        <div className="flex items-center gap-1">
          {children}
          {sortField === field && (
            <span className="text-xs">{sortDirection === 'asc' ? '↑' : '↓'}</span>
          )}
        </div>
      </TableHead>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">경쟁 분석</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader field="rank">순위</SortableHeader>
              <SortableHeader field="brand_name">브랜드명</SortableHeader>
              <SortableHeader field="citation_share">인용률</SortableHeader>
              <SortableHeader field="change_from_previous">변화</SortableHeader>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedBrands.map((brand) => (
              <TableRow
                key={brand.brand_name}
                className={cn(
                  brand.is_target_brand && 'bg-brand-orange/5 hover:bg-brand-orange/10'
                )}
              >
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    #{brand.rank}
                    {brand.rank === 1 && (
                      <Crown className="h-4 w-4 text-yellow-500" />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {brand.brand_name}
                    {brand.is_target_brand && (
                      <Badge variant="outline" className="text-xs">
                        타겟
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {brand.citation_share.toFixed(1)}%
                </TableCell>
                <TableCell>
                  {brand.change_from_previous !== null ? (
                    <TrendIndicator
                      direction={getTrendDirection(brand.change_from_previous)}
                      changePercent={brand.change_from_previous}
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
