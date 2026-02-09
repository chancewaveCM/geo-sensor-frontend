'use client'

/**
 * Example integration of QueryResponseComparison component
 *
 * This file demonstrates how to use the QueryResponseComparison component
 * in the Pipeline page to show LLM response comparisons.
 *
 * Usage:
 * 1. Add a "비교" (Compare) button to each query in your query list
 * 2. Open a Dialog when the button is clicked
 * 3. Render QueryResponseComparison inside the Dialog
 */

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { QueryResponseComparison } from '@/components/query-lab/QueryResponseComparison'
import { Eye } from 'lucide-react'

interface Query {
  id: number
  text: string
}

export function QueryComparisonExample() {
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null)

  // Example query list
  const queries: Query[] = [
    { id: 1, text: '최고의 스마트폰 브랜드는?' },
    { id: 2, text: 'Which cloud provider is best for startups?' },
    { id: 3, text: 'Top project management tools for remote teams?' },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Query List</h2>

      {/* Query list with compare buttons */}
      <div className="space-y-2">
        {queries.map((query) => (
          <div
            key={query.id}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <p className="text-sm">{query.text}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedQuery(query)}
            >
              <Eye className="mr-2 h-4 w-4" />
              비교
            </Button>
          </div>
        ))}
      </div>

      {/* Comparison Dialog */}
      <Dialog
        open={!!selectedQuery}
        onOpenChange={(open) => !open && setSelectedQuery(null)}
      >
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>LLM Response Comparison</DialogTitle>
            <DialogDescription>
              Compare responses from different LLM providers for this query
            </DialogDescription>
          </DialogHeader>

          {selectedQuery && (
            <QueryResponseComparison
              queryId={selectedQuery.id}
              queryText={selectedQuery.text}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
