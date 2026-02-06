import { cn } from '@/lib/utils'
import type { QueryCategory } from '@/types/analysis'

interface CategoryBadgeProps {
  category: QueryCategory
}

const categoryConfig: Record<QueryCategory, { label: string; className: string }> = {
  introductory: { label: '입문', className: 'bg-category-introductory text-category-introductory-text' },
  comparative: { label: '비교', className: 'bg-category-comparative text-category-comparative-text' },
  critical: { label: '비판', className: 'bg-category-critical text-category-critical-text' },
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const config = categoryConfig[category]

  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
      config.className
    )}>
      {config.label}
    </span>
  )
}
