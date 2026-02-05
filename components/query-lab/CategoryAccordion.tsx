"use client"

import { useState } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Loader2, MessageSquare } from "lucide-react"
import { getJobQueries } from "@/lib/api/pipeline"
import type { PipelineCategory, ExpandedQuery } from "@/types/pipeline"

interface CategoryAccordionProps {
  categories: PipelineCategory[];
  jobId: number;
  onQuerySelect: (query: ExpandedQuery) => void;
  selectedQueryId?: number;
}

export function CategoryAccordion({
  categories,
  jobId,
  onQuerySelect,
  selectedQueryId
}: CategoryAccordionProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const [queriesByCategory, setQueriesByCategory] = useState<Record<number, ExpandedQuery[]>>({})
  const [loadingCategories, setLoadingCategories] = useState<Set<number>>(new Set())
  const [errorCategories, setErrorCategories] = useState<Set<number>>(new Set())

  const handleExpand = async (categoryId: number) => {
    // If already loaded, just toggle
    if (queriesByCategory[categoryId]) return

    // Load queries for this category
    setLoadingCategories(prev => new Set(prev).add(categoryId))
    setErrorCategories(prev => {
      const next = new Set(prev)
      next.delete(categoryId)
      return next
    })
    try {
      const response = await getJobQueries(jobId, categoryId)
      setQueriesByCategory(prev => ({
        ...prev,
        [categoryId]: response.queries
      }))
    } catch (error) {
      console.error('Failed to load queries:', error)
      setErrorCategories(prev => new Set(prev).add(categoryId))
    } finally {
      setLoadingCategories(prev => {
        const next = new Set(prev)
        next.delete(categoryId)
        return next
      })
    }
  }

  const personaLabels: Record<string, string> = {
    consumer: '소비자',
    investor: '투자자',
    expert: '전문가',
  }

  if (categories.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        카테고리가 없습니다
      </div>
    )
  }

  return (
    <Accordion
      type="multiple"
      value={expandedCategories}
      onValueChange={(values) => {
        setExpandedCategories(values)
        // Trigger load for newly expanded categories
        values.forEach(v => {
          const catId = parseInt(v, 10)
          if (!queriesByCategory[catId]) {
            handleExpand(catId)
          }
        })
      }}
    >
      {categories.map((category) => (
        <AccordionItem key={category.id} value={String(category.id)}>
          <AccordionTrigger className="hover:no-underline">
            <div className="flex flex-1 items-center justify-between pr-4">
              <div className="flex items-center gap-2">
                <span className="font-medium">{category.name}</span>
                <Badge variant="outline" className="text-xs">
                  {personaLabels[category.persona_type] || category.persona_type}
                </Badge>
              </div>
              <span className="text-sm text-muted-foreground">
                {category.query_count}개 쿼리
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            {loadingCategories.has(category.id) ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm text-muted-foreground">쿼리 로딩 중...</span>
              </div>
            ) : errorCategories.has(category.id) ? (
              <div className="py-4 text-center text-sm text-destructive">
                쿼리를 불러오는데 실패했습니다
              </div>
            ) : queriesByCategory[category.id]?.length ? (
              <div className="space-y-1">
                {queriesByCategory[category.id].map((query) => (
                  <button
                    key={query.id}
                    type="button"
                    onClick={() => onQuerySelect(query)}
                    aria-label={`쿼리 선택: ${query.text}`}
                    className={`w-full text-left p-2 rounded-md text-sm transition-colors flex items-center gap-2 ${
                      selectedQueryId === query.id
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <MessageSquare className="h-4 w-4 shrink-0" />
                    <span className="truncate flex-1">{query.text}</span>
                    <Badge variant="secondary" className="text-xs shrink-0">
                      {query.response_count}개 응답
                    </Badge>
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center text-sm text-muted-foreground">
                쿼리가 없습니다
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
