'use client';

import { cn } from '@/lib/utils';
import { WorkflowStats as WorkflowStatsType } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WorkflowStatsProps {
  stats: WorkflowStatsType;
}

const statCards = [
  {
    key: 'total',
    label: 'Total Items',
    icon: 'folder',
    color: 'text-brand-navy dark:text-brand-orange',
    bgColor: 'bg-brand-navy/10 dark:bg-brand-orange/10',
  },
  {
    key: 'pending',
    label: 'Pending Review',
    icon: 'pending',
    color: 'text-warning',
    bgColor: 'bg-warning/10',
  },
  {
    key: 'approved',
    label: 'Approved',
    icon: 'check_circle',
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  {
    key: 'rejected',
    label: 'Rejected',
    icon: 'cancel',
    color: 'text-error',
    bgColor: 'bg-error/10',
  },
] as const;

export function WorkflowStats({ stats }: WorkflowStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card) => {
        const value = stats[card.key] as number;
        const trend = stats.trends?.[card.key] as number | undefined;

        return (
          <Card key={card.key} className="border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
              <div className={cn('rounded-full p-2', card.bgColor)}>
                <span className={cn('material-symbols-outlined text-xl', card.color)}>
                  {card.icon}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{value}</div>
              {trend !== undefined && (
                <div className="mt-2 flex items-center text-sm">
                  <span
                    className={cn(
                      'material-symbols-outlined mr-1 text-base',
                      trend >= 0 ? 'text-success' : 'text-error'
                    )}
                  >
                    {trend >= 0 ? 'trending_up' : 'trending_down'}
                  </span>
                  <span className={cn('font-medium', trend >= 0 ? 'text-success' : 'text-error')}>
                    {trend >= 0 ? '+' : ''}
                    {trend}%
                  </span>
                  <span className="ml-1 text-muted-foreground">vs last month</span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
