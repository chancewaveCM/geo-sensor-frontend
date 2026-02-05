'use client'

import { useState } from 'react'
import { ArrowUpDown, TrendingUp, TrendingDown } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export interface BrandRanking {
  rank: number
  brand: string
  mentions: number
  share: number
  change: number
}

interface BrandRankingTableProps {
  brands: BrandRanking[]
  onSort?: (field: keyof BrandRanking) => void
}

type SortField = keyof BrandRanking
type SortDirection = 'asc' | 'desc'

export function BrandRankingTable({ brands, onSort }: BrandRankingTableProps) {
  const [sortField, setSortField] = useState<SortField>('rank')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
    onSort?.(field)
  }

  const sortedBrands = [...brands].sort((a, b) => {
    const multiplier = sortDirection === 'asc' ? 1 : -1
    if (a[sortField] < b[sortField]) return -1 * multiplier
    if (a[sortField] > b[sortField]) return 1 * multiplier
    return 0
  })

  const SortButton = ({ field, label }: { field: SortField; label: string }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground transition-colors"
    >
      {label}
      <ArrowUpDown className="h-4 w-4" />
    </button>
  )

  return (
    <Card className="shadow-sm hover:shadow-md transition-all duration-200">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Brand Rankings</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="rounded-lg border-t">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-16">
                  <SortButton field="rank" label="Rank" />
                </TableHead>
                <TableHead>
                  <SortButton field="brand" label="Brand" />
                </TableHead>
                <TableHead className="text-right">
                  <SortButton field="mentions" label="Mentions" />
                </TableHead>
                <TableHead className="text-right">
                  <SortButton field="share" label="Share %" />
                </TableHead>
                <TableHead className="text-right">Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedBrands.map((brand) => (
                <TableRow
                  key={brand.brand}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <TableCell className="font-medium">#{brand.rank}</TableCell>
                  <TableCell className="font-semibold text-foreground">
                    {brand.brand}
                  </TableCell>
                  <TableCell className="text-right">
                    {brand.mentions.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {brand.share.toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {brand.change > 0 ? (
                        <>
                          <TrendingUp className="h-4 w-4 text-success" />
                          <span className="font-medium text-success">
                            +{brand.change.toFixed(1)}%
                          </span>
                        </>
                      ) : brand.change < 0 ? (
                        <>
                          <TrendingDown className="h-4 w-4 text-error" />
                          <span className="font-medium text-error">
                            {brand.change.toFixed(1)}%
                          </span>
                        </>
                      ) : (
                        <span className="font-medium text-muted-foreground">
                          0.0%
                        </span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
