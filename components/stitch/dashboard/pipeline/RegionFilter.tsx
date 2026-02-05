'use client';

import { cn } from '@/lib/utils';

interface Region {
  code: string;
  label: string;
}

interface RegionFilterProps {
  regions: Region[];
  active: string;
  onChange: (regionCode: string) => void;
}

export function RegionFilter({ regions, active, onChange }: RegionFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Region:
      </span>
      {regions.map((region) => {
        const isActive = active === region.code;

        return (
          <button
            key={region.code}
            onClick={() => onChange(region.code)}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'bg-secondary text-secondary-foreground hover:bg-accent hover:text-foreground'
            )}
            aria-current={isActive ? 'true' : undefined}
            aria-label={`${region.label} region`}
          >
            <span className="material-symbols-outlined text-lg">flag</span>
            <span>{region.label}</span>
          </button>
        );
      })}
    </div>
  );
}
