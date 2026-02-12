'use client'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { FileEdit, GitBranch, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AnnotationMarkerProps {
  date: string
  title: string
  type: 'manual' | 'query_change' | 'model_change'
  description?: string
  className?: string
}

export function AnnotationMarker({
  date,
  title,
  type,
  description,
  className,
}: AnnotationMarkerProps) {
  const getTypeConfig = () => {
    switch (type) {
      case 'manual':
        return {
          icon: FileEdit,
          color: 'bg-blue-500',
          label: '수동',
        }
      case 'query_change':
        return {
          icon: GitBranch,
          color: 'bg-purple-500',
          label: '쿼리 변경',
        }
      case 'model_change':
        return {
          icon: Settings,
          color: 'bg-orange-500',
          label: '모델 변경',
        }
      default:
        return {
          icon: FileEdit,
          color: 'bg-muted-foreground',
          label: '기타',
        }
    }
  }

  const { icon: Icon, color, label } = getTypeConfig()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              'inline-flex items-center justify-center rounded-full p-1.5 cursor-pointer transition-transform hover:scale-110',
              color,
              className
            )}
            role="button"
            tabIndex={0}
            aria-label={`${label}: ${title}`}
          >
            <Icon className="h-3 w-3 text-white" />
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {label}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {new Date(date).toLocaleDateString('ko-KR')}
              </span>
            </div>
            <p className="font-semibold text-sm">{title}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
