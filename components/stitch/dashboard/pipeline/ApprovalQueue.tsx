'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ApprovalItem } from './types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface ApprovalQueueProps {
  items: ApprovalItem[];
  onApprove: (ids: string[]) => void;
  onReject: (ids: string[]) => void;
}

export function ApprovalQueue({ items, onApprove, onReject }: ApprovalQueueProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedIds(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((item) => item.id)));
    }
  };

  const handleApprove = () => {
    const ids = Array.from(selectedIds);
    onApprove(ids);
    setSelectedIds(new Set());
  };

  const handleReject = () => {
    const ids = Array.from(selectedIds);
    onReject(ids);
    setSelectedIds(new Set());
  };

  const isAllSelected = items.length > 0 && selectedIds.size === items.length;
  const isSomeSelected = selectedIds.size > 0 && selectedIds.size < items.length;

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedIds.size > 0 && (
        <div className="flex items-center justify-between rounded-lg border border-primary/50 bg-primary/5 px-4 py-3">
          <span className="text-sm font-medium text-foreground">
            {selectedIds.size} item{selectedIds.size !== 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReject}
              className="border-error/50 text-error hover:bg-error/10"
            >
              <span className="material-symbols-outlined mr-2 text-base">cancel</span>
              Reject
            </Button>
            <Button
              size="sm"
              onClick={handleApprove}
              className="bg-success hover:bg-success/90"
            >
              <span className="material-symbols-outlined mr-2 text-base">check_circle</span>
              Approve
            </Button>
          </div>
        </div>
      )}

      {/* Queue List */}
      <div className="overflow-hidden rounded-lg border border-border bg-card">
        {/* Table Header */}
        <div className="flex items-center gap-4 border-b border-border bg-muted/50 px-6 py-3">
          <div className="flex items-center">
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={toggleSelectAll}
              aria-label="Select all items"
              className={cn(isSomeSelected && 'data-[state=checked]:bg-primary/50')}
            />
          </div>
          <div className="flex-1 text-sm font-medium text-muted-foreground">Query Text</div>
          <div className="w-40 text-sm font-medium text-muted-foreground">Submitter</div>
          <div className="w-32 text-sm font-medium text-muted-foreground">Date</div>
          <div className="w-28 text-sm font-medium text-muted-foreground">Status</div>
          <div className="w-32 text-sm font-medium text-muted-foreground">Actions</div>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <span className="material-symbols-outlined text-muted-foreground text-3xl">
                inbox
              </span>
            </div>
            <h3 className="text-lg font-semibold">No pending approvals</h3>
            <p className="mt-2 max-w-md text-muted-foreground">
              All items have been reviewed. New submissions will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {items.map((item) => {
              const isSelected = selectedIds.has(item.id);

              return (
                <div
                  key={item.id}
                  className={cn(
                    'flex items-center gap-4 px-6 py-4 transition-colors',
                    isSelected ? 'bg-primary/5' : 'hover:bg-muted/50'
                  )}
                >
                  <div className="flex items-center">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleSelection(item.id)}
                      aria-label={`Select ${item.queryText}`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground line-clamp-2">
                      {item.queryText}
                    </p>
                  </div>
                  <div className="w-40">
                    <p className="text-sm text-foreground">{item.submitter}</p>
                    <p className="text-xs text-muted-foreground">{item.submitterEmail}</p>
                  </div>
                  <div className="w-32">
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.dateSubmitted).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="w-28">
                    <span
                      className={cn(
                        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                        item.status === 'pending' && 'bg-warning/10 text-warning',
                        item.status === 'approved' && 'bg-success/10 text-success',
                        item.status === 'rejected' && 'bg-error/10 text-error'
                      )}
                    >
                      {item.status}
                    </span>
                  </div>
                  <div className="flex w-32 gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onReject([item.id])}
                      className="h-8 w-8 p-0 text-error hover:bg-error/10 hover:text-error"
                      aria-label="Reject item"
                    >
                      <span className="material-symbols-outlined text-base">close</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onApprove([item.id])}
                      className="h-8 w-8 p-0 text-success hover:bg-success/10 hover:text-success"
                      aria-label="Approve item"
                    >
                      <span className="material-symbols-outlined text-base">check</span>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
