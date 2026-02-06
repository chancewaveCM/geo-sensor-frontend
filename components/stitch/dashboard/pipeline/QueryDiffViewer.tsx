'use client';

import { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { DiffLine } from './types';

interface QueryDiffViewerProps {
  original: string;
  edited: string;
  fileName?: string;
}

function computeDiff(original: string, edited: string): DiffLine[] {
  const originalLines = original.split('\n');
  const editedLines = edited.split('\n');
  const diff: DiffLine[] = [];

  // Simple line-by-line diff (in production, use a proper diff library)
  const maxLines = Math.max(originalLines.length, editedLines.length);

  for (let i = 0; i < maxLines; i++) {
    const origLine = originalLines[i];
    const editLine = editedLines[i];

    if (origLine === editLine) {
      diff.push({
        lineNumber: i + 1,
        type: 'unchanged',
        content: origLine || '',
      });
    } else {
      if (origLine !== undefined) {
        diff.push({
          lineNumber: null,
          type: 'removed',
          content: origLine,
        });
      }
      if (editLine !== undefined) {
        diff.push({
          lineNumber: null,
          type: 'added',
          content: editLine,
        });
      }
    }
  }

  return diff;
}

export function QueryDiffViewer({ original, edited, fileName = 'query.txt' }: QueryDiffViewerProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const diff = useMemo(() => computeDiff(original, edited), [original, edited]);

  const additions = diff.filter((line) => line.type === 'added').length;
  const deletions = diff.filter((line) => line.type === 'removed').length;

  const copyToClipboard = async () => {
    const diffText = diff.map((line) => {
      const prefix = line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' ';
      return `${prefix} ${line.content}`;
    }).join('\n');

    try {
      await navigator.clipboard.writeText(diffText);
      // TODO: Show toast notification
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      {/* Diff Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border bg-muted/50 px-6 py-4">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-sm font-bold text-brand-navy dark:text-foreground">
            {fileName}
          </span>
          <div className="flex gap-2">
            <span className="rounded bg-success/10 px-1.5 py-0.5 text-[10px] font-bold text-success">
              +{additions}
            </span>
            <span className="rounded bg-error/10 px-1.5 py-0.5 text-[10px] font-bold text-error">
              -{deletions}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label={isExpanded ? 'Collapse diff' : 'Expand diff'}
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            <span className="material-symbols-outlined text-xl">
              {isExpanded ? 'unfold_less' : 'unfold_more'}
            </span>
          </button>
          <button
            onClick={copyToClipboard}
            className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Copy diff to clipboard"
            title="Copy"
          >
            <span className="material-symbols-outlined text-xl">content_copy</span>
          </button>
        </div>
      </div>

      {/* Diff Content */}
      <div
        className={cn(
          'overflow-hidden transition-all duration-300',
          isExpanded ? 'max-h-[2000px]' : 'max-h-0'
        )}
      >
        <div className="overflow-x-auto font-mono text-[13px] leading-relaxed">
          <table className="w-full border-collapse">
            <tbody>
              {diff.map((line, index) => (
                <tr
                  key={index}
                  className={cn(
                    'group',
                    line.type === 'added' &&
                      'border-l-2 border-l-success bg-success/5 dark:bg-success/10',
                    line.type === 'removed' &&
                      'border-l-2 border-l-error bg-error/5 dark:bg-error/10'
                  )}
                >
                  <td
                    className={cn(
                      'w-12 select-none border-r px-4 py-0.5 text-right text-muted-foreground',
                      line.type === 'added' && 'border-r-success/30 bg-success/10',
                      line.type === 'removed' && 'border-r-error/30 bg-error/10',
                      line.type === 'unchanged' &&
                        'border-r-border bg-muted/30 dark:bg-background'
                    )}
                  >
                    {line.type === 'added'
                      ? '+'
                      : line.type === 'removed'
                      ? '-'
                      : line.lineNumber}
                  </td>
                  <td
                    className={cn(
                      'whitespace-pre px-4 py-0.5',
                      line.type === 'removed' &&
                        'text-error line-through',
                      line.type === 'added' && 'text-success'
                    )}
                  >
                    {line.content}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
