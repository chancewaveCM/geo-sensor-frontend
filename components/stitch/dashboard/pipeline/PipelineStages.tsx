'use client';

import { cn } from '@/lib/utils';
import { PipelineStageData } from './types';

interface PipelineStagesProps {
  stages: PipelineStageData[];
  activeStage?: string;
  onStageClick?: (stageId: string) => void;
}

export function PipelineStages({ stages, activeStage, onStageClick }: PipelineStagesProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {stages.map((stage, index) => {
        const isActive = activeStage === stage.id;
        const isLast = index === stages.length - 1;

        return (
          <div key={stage.id} className="flex items-center">
            <button
              onClick={() => onStageClick?.(stage.id)}
              className={cn(
                'relative flex items-center gap-3 rounded-lg border px-6 py-4 transition-all duration-200',
                'min-w-[200px]',
                isActive
                  ? 'border-primary bg-primary shadow-lg shadow-primary/20 text-white'
                  : 'border-border bg-card hover:border-primary/50 hover:shadow-md text-foreground'
              )}
              aria-current={isActive ? 'step' : undefined}
              aria-label={`${stage.label} stage - ${stage.count} items`}
            >
              <div className="flex flex-col items-start gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold uppercase tracking-widest">
                    {stage.label}
                  </span>
                  <span
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold',
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-primary/10 text-primary'
                    )}
                  >
                    {stage.count}
                  </span>
                </div>
              </div>
            </button>

            {!isLast && (
              <div className="flex items-center px-2" aria-hidden="true">
                <svg
                  className="h-5 w-5 text-muted-foreground"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
