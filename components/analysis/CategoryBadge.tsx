import { cn } from '@/lib/utils'
import type { QueryCategory } from '@/types/analysis'

interface CategoryBadgeProps {
  category: QueryCategory
}

const categoryConfig: Record<QueryCategory, { label: string; className: string }> = {
  introductory: { label: '입문', className: 'bg-blue-100 text-blue-700' },
  comparative: { label: '비교', className: 'bg-purple-100 text-purple-700' },
  critical: { label: '비판', className: 'bg-red-100 text-red-700' },
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
