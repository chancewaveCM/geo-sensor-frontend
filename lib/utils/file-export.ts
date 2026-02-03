// lib/utils/file-export.ts
import type { QueryLabResult } from '@/types/query-lab';

/**
 * Triggers a file download in the browser
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Formats QueryLabResult as JSON string
 */
export function formatResultAsJSON(result: QueryLabResult): string {
  return JSON.stringify(result, null, 2);
}

/**
 * Formats QueryLabResult as CSV string
 */
export function formatResultAsCSV(result: QueryLabResult): string {
  const rows: string[][] = [];

  // Header row
  rows.push([
    'Query',
    'Provider',
    'Brand',
    'Citation Share (%)',
    'Match Type',
    'Sentiment',
    'Citation Type',
    'Context',
  ]);

  // Data rows
  for (const response of result.responses) {
    for (const citation of response.citations) {
      rows.push([
        result.query,
        response.provider,
        citation.brandName,
        (response.citationShare[citation.brandName] || 0).toString(),
        response.brandMentions.find(m => m.brandName === citation.brandName)?.matchType || '',
        citation.sentiment,
        citation.citationType,
        citation.context,
      ]);
    }
  }

  // Convert to CSV with proper escaping
  return rows
    .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
    .join('\n');
}

/**
 * Export result as JSON file
 */
export function exportAsJSON(result: QueryLabResult): void {
  const content = formatResultAsJSON(result);
  downloadFile(content, `query-lab-${result.id}.json`, 'application/json');
}

/**
 * Export result as CSV file
 */
export function exportAsCSV(result: QueryLabResult): void {
  const content = formatResultAsCSV(result);
  downloadFile(content, `query-lab-${result.id}.csv`, 'text/csv');
}
