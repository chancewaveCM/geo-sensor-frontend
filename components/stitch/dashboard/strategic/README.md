# Strategic Dashboard Components

Reusable components for the Strategic GEO Performance Analysis Dashboard.

## Components

### PerformanceMetricCard

Display key performance metrics with trend indicators and sparklines.

```tsx
import { PerformanceMetricCard } from '@/components/stitch/dashboard/strategic'

<PerformanceMetricCard
  title="Citation Share"
  value="35.2%"
  change={5.2}
  trend="up"
  sparklineData={[60, 65, 62, 70, 68, 75, 78, 85]}
  unit="%"
/>
```

**Props:**
- `title` (string) - Metric name
- `value` (string | number) - Main metric value
- `change` (number) - Percentage change
- `trend` ('up' | 'down') - Direction of change
- `sparklineData` (number[], optional) - Array of values for mini chart (0-100 range)
- `unit` (string, optional) - Unit suffix (default: '%')

---

### CitationShareChart

Pie chart showing brand citation distribution.

```tsx
import { CitationShareChart } from '@/components/stitch/dashboard/strategic'

const data = [
  { brand: 'Your Brand', share: 35.2, color: 'hsl(var(--chart-1))' },
  { brand: 'Competitor A', share: 28.5, color: 'hsl(var(--chart-2))' },
]

<CitationShareChart
  data={data}
  title="Citation Share Distribution"
/>
```

**Props:**
- `data` (CitationData[]) - Array of brand citation data
  - `brand` (string) - Brand name
  - `share` (number) - Percentage share
  - `color` (string) - Chart color (HSL format)
- `title` (string, optional) - Chart title

---

### BrandRankingTable

Sortable table of brand performance metrics.

```tsx
import { BrandRankingTable, BrandRanking } from '@/components/stitch/dashboard/strategic'

const brands: BrandRanking[] = [
  { rank: 1, brand: 'Your Brand', mentions: 1450, share: 35.2, change: 5.2 },
  { rank: 2, brand: 'Competitor A', mentions: 1175, share: 28.5, change: -2.1 },
]

<BrandRankingTable
  brands={brands}
  onSort={(field) => console.log('Sorted by:', field)}
/>
```

**Props:**
- `brands` (BrandRanking[]) - Array of brand rankings
  - `rank` (number) - Brand rank
  - `brand` (string) - Brand name
  - `mentions` (number) - Total mentions
  - `share` (number) - Market share percentage
  - `change` (number) - Change from previous period
- `onSort` ((field: keyof BrandRanking) => void, optional) - Sort callback

---

### TrendChart

Multi-line chart for time series analysis.

```tsx
import { TrendChart } from '@/components/stitch/dashboard/strategic'

const data = [
  { date: 'W1', 'Your Brand': 32, 'Competitor A': 30 },
  { date: 'W2', 'Your Brand': 33, 'Competitor A': 29 },
]

const brands = [
  { name: 'Your Brand', color: 'hsl(var(--chart-1))' },
  { name: 'Competitor A', color: 'hsl(var(--chart-2))' },
]

<TrendChart
  data={data}
  brands={brands}
  timeRange="30D"
  title="Performance Trends"
/>
```

**Props:**
- `data` (TrendDataPoint[]) - Time series data
  - `date` (string) - Date label
  - `[brandName]` (number) - Value for each brand
- `brands` (BrandConfig[]) - Brand configuration
  - `name` (string) - Brand name (must match data keys)
  - `color` (string) - Line color (HSL format)
- `timeRange` (string, optional) - Selected time range
- `title` (string, optional) - Chart title

---

## Color Tokens

Use Tailwind CSS custom properties for consistent theming:

```tsx
// Brand colors
color: 'hsl(var(--brand-orange))'  // #ff6821
color: 'hsl(var(--brand-navy))'    // #1e3a8a

// Chart colors
color: 'hsl(var(--chart-1))'  // Orange - Primary brand
color: 'hsl(var(--chart-2))'  // Navy - Competitor
color: 'hsl(var(--chart-3))'  // Green - Positive trends
color: 'hsl(var(--chart-4))'  // Blue - Informational
color: 'hsl(var(--chart-5))'  // Purple - Comparative
color: 'hsl(var(--chart-6))'  // Amber - Warnings

// Semantic colors
color: 'hsl(var(--success))'  // Green - positive changes
color: 'hsl(var(--error))'    // Red - negative changes
```

---

## Layout Example

```tsx
<div className="space-y-6">
  {/* Metrics Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
    <PerformanceMetricCard {...metric1} />
    <PerformanceMetricCard {...metric2} />
    <PerformanceMetricCard {...metric3} />
    <PerformanceMetricCard {...metric4} />
  </div>

  {/* Charts Grid */}
  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
    <CitationShareChart data={citationData} />
    <BrandRankingTable brands={rankings} />
    <CustomCard />
    <TrendChart data={trendData} brands={brandConfig} />
  </div>
</div>
```

---

## Dependencies

- **recharts** - Chart library (already installed)
- **lucide-react** - Icons
- **@/components/ui/card** - Card components
- **@/components/ui/button** - Button components
- **@/components/ui/table** - Table components

---

## Responsive Behavior

All components are responsive by default:

- **Mobile (< 640px)**: Single column, stacked layout
- **Tablet (640px - 1024px)**: 2 columns for metrics
- **Desktop (> 1024px)**: 4 columns for metrics, 2 columns for charts

---

## Accessibility

- All charts include `role="img"` and `aria-label`
- Interactive elements have focus states
- Color is not the only indicator of meaning (icons + text)
- Keyboard navigation supported in tables

---

## Examples

See the full implementation in:
- `app/(stitch-dashboard)/dashboard/strategic/page.tsx`
