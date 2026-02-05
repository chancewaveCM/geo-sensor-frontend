'use client'

import { useState } from 'react'
import { Download, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export type SettlementStatus = 'Paid' | 'Pending' | 'Overdue'

export interface SettlementRecord {
  id: string
  date: string
  type: string
  amount: number
  status: SettlementStatus
}

export interface SettlementTableProps {
  records: SettlementRecord[]
  onExport: () => void
}

export function SettlementTable({ records, onExport }: SettlementTableProps) {
  const [sortField, setSortField] = useState<keyof SettlementRecord>('date')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const handleSort = (field: keyof SettlementRecord) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const sortedRecords = [...records].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
    }

    return 0
  })

  const getStatusBadge = (status: SettlementStatus) => {
    const styles = {
      Paid: 'bg-success/10 text-success',
      Pending: 'bg-warning/10 text-warning',
      Overdue: 'bg-error/10 text-error',
    }

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[status]}`}
      >
        {status === 'Paid' && (
          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
        )}
        {status === 'Pending' && (
          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-warning" aria-hidden="true" />
        )}
        {status === 'Overdue' && (
          <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-error" aria-hidden="true" />
        )}
        {status}
      </span>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Settlement Records</CardTitle>
          <Button
            onClick={onExport}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </CardHeader>

      <CardContent className="px-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b bg-muted/50">
                <TableHead
                  className="cursor-pointer select-none hover:text-primary"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center gap-1">
                    Date
                    <span className="text-xs opacity-50">⇅</span>
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none hover:text-primary"
                  onClick={() => handleSort('type')}
                >
                  <div className="flex items-center gap-1">
                    Type
                    <span className="text-xs opacity-50">⇅</span>
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none hover:text-primary"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center gap-1">
                    Amount
                    <span className="text-xs opacity-50">⇅</span>
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer select-none hover:text-primary"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-1">
                    Status
                    <span className="text-xs opacity-50">⇅</span>
                  </div>
                </TableHead>
                <TableHead className="w-12">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {sortedRecords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <p className="text-sm">No settlement records found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                sortedRecords.map((record) => (
                  <TableRow
                    key={record.id}
                    className="border-b transition-colors hover:bg-primary/5"
                  >
                    <TableCell className="font-medium">
                      {formatDate(record.date)}
                    </TableCell>
                    <TableCell>{record.type}</TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(record.amount)}
                    </TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            aria-label="Open actions menu"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Download Receipt</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Dispute
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
