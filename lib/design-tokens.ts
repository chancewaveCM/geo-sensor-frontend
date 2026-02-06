/**
 * Design token utilities for GEO Sensor.
 *
 * Provides runtime access to CSS custom property color tokens,
 * primarily needed for Recharts/SVG components where Tailwind
 * utility classes cannot be used.
 */

/** SSR-safe fallback map for CSS variable hex values. */
const TOKEN_FALLBACKS: Record<string, string> = {
  // Brand
  '--brand-orange': '#E06820',
  '--brand-orange-hover': '#c75a1b',
  '--brand-navy': '#114BA3',
  '--brand-navy-hover': '#0d3876',
  // Chart palette
  '--chart-1': '#E06820',
  '--chart-2': '#114BA3',
  '--chart-3': '#22c55e',
  '--chart-4': '#3B82F6',
  '--chart-5': '#8b5cf6',
  '--chart-6': '#eab308',
  '--chart-7': '#ef4444',
  '--chart-8': '#0ea5e9',
  '--chart-grid': '#e5e7eb',
  '--chart-axis-text': '#6b7280',
  // Gray
  '--gray-200': '#E2E8F0',
  // Grade
  '--grade-a': '#22c55e',
  '--grade-b': '#3B82F6',
  '--grade-c': '#eab308',
  '--grade-d': '#f97316',
  '--grade-f': '#ef4444',
  // Sentiment
  '--sentiment-positive': '#22c55e',
  '--sentiment-neutral': '#f59e0b',
  '--sentiment-negative': '#ef4444',
  // Trend
  '--trend-up': '#22c55e',
  '--trend-down': '#ef4444',
  // Status
  '--status-active': '#22c55e',
  '--status-pending': '#f59e0b',
  '--status-error': '#ef4444',
  // Semantic
  '--primary': '#3B82F6',
  '--destructive': '#ef4444',
  '--success': '#16a34a',
  '--warning': '#f59e0b',
}

/**
 * Resolve a CSS custom property to its computed color string.
 * Returns an `hsl(...)` value at runtime, or a hex fallback during SSR.
 *
 * @example
 * ```tsx
 * <Radar stroke={getTokenColor('--chart-4')} />
 * ```
 */
export function getTokenColor(variable: string): string {
  if (typeof window === 'undefined') {
    return TOKEN_FALLBACKS[variable] ?? '#000000'
  }
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim()
  return value ? `hsl(${value})` : (TOKEN_FALLBACKS[variable] ?? '#000000')
}

/**
 * Pre-built chart color palette as CSS variable references.
 * Use with `getTokenColor` to resolve at render time.
 */
export const CHART_PALETTE = [
  '--chart-1',
  '--chart-2',
  '--chart-3',
  '--chart-4',
  '--chart-5',
  '--chart-6',
  '--chart-7',
  '--chart-8',
] as const

/**
 * Resolve the full chart palette to color strings.
 * Call inside a component (client-side) for accurate values.
 */
export function getChartColors(count?: number): string[] {
  const palette = count ? CHART_PALETTE.slice(0, count) : CHART_PALETTE
  return palette.map(getTokenColor)
}

/**
 * Sentiment color map for chart components.
 */
export const SENTIMENT_COLORS = {
  positive: '--sentiment-positive',
  neutral: '--sentiment-neutral',
  negative: '--sentiment-negative',
} as const

/**
 * Grade color map for GEO Score display.
 */
export const GRADE_COLORS: Record<string, string> = {
  A: '--grade-a',
  B: '--grade-b',
  C: '--grade-c',
  D: '--grade-d',
  F: '--grade-f',
}
