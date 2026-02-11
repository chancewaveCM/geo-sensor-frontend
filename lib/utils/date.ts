/**
 * Date formatting utilities with Korean locale
 */

/**
 * Format a date to Korean locale with both date and time
 * @param date - Date string or Date object
 * @returns Formatted date string (e.g., "2026. 2. 11. 오후 3:45:30")
 */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('ko-KR')
}

/**
 * Format a date to Korean locale (date only)
 * @param date - Date string or Date object
 * @returns Formatted date string (e.g., "2026. 2. 11.")
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('ko-KR')
}
