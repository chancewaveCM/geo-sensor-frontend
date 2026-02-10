import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const emptyStateVariants = cva(
  'flex flex-col items-center justify-center text-center',
  {
    variants: {
      variant: {
        featured:
          'min-h-[400px] space-y-6 rounded-xl border-2 border-dashed p-12',
        default:
          'min-h-[200px] space-y-4 rounded-lg border border-dashed p-8',
        minimal:
          'min-h-[120px] space-y-2 p-4',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface EmptyStateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyStateVariants> {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  variant,
  className,
  ...props
}: EmptyStateProps) {
  const iconSizes: Record<string, string> = {
    featured: 'h-16 w-16',
    default: 'h-12 w-12',
    minimal: 'h-8 w-8',
  }

  const titleSizes: Record<string, string> = {
    featured: 'text-xl font-bold',
    default: 'text-lg font-semibold',
    minimal: 'text-sm font-medium',
  }

  const v = variant ?? 'default'

  return (
    <div
      className={cn(emptyStateVariants({ variant }), className)}
      {...props}
    >
      {icon && (
        <div
          className={cn(
            'flex items-center justify-center rounded-full bg-muted text-muted-foreground',
            iconSizes[v]
          )}
        >
          {icon}
        </div>
      )}
      <div className={variant === 'minimal' ? 'space-y-1' : 'space-y-2'}>
        <h3 className={cn('text-foreground', titleSizes[v])}>
          {title}
        </h3>
        {description && (
          <p
            className={cn(
              'text-muted-foreground',
              variant === 'featured' ? 'max-w-md text-base' : 'max-w-sm text-sm'
            )}
          >
            {description}
          </p>
        )}
      </div>
      {action && <div className={variant === 'featured' ? 'pt-4' : 'pt-2'}>{action}</div>}
    </div>
  )
}
