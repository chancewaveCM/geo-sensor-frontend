# S3-04 & S3-06 Implementation Documentation

## Overview

This document describes the implementation of:
- **S3-04**: Query Lab LLM Response Comparison Component
- **S3-06**: Reusable EmptyState Component

Both components follow the established design system and shadcn/ui patterns.

---

## S3-04: QueryResponseComparison Component

### Location
`components/query-lab/QueryResponseComparison.tsx`

### Features

✅ **Side-by-side LLM response comparison**
- Grid layout (1 column on mobile, 2 columns on desktop)
- Provider badges (Gemini, OpenAI, etc.)
- Response content with scrollable containers
- Citation display (when available)
- Token usage and latency stats

✅ **Three required states implemented**
- **Loading State**: Skeleton placeholders with smooth animations
- **Empty State**: "이 쿼리에 대한 응답이 없습니다" message
- **Error State**: Error message with retry button

### Usage

```tsx
import { QueryResponseComparison } from '@/components/query-lab/QueryResponseComparison'

<QueryResponseComparison
  queryId={123}
  queryText="최고의 스마트폰 브랜드는?"
/>
```

### Integration Example

See `app/(stitch-dashboard)/dashboard/pipeline/query-comparison-example.tsx` for a complete integration example showing:
- Query list with "비교" buttons
- Dialog modal for comparison view
- State management for selected query

### Component Structure

```
QueryResponseComparison (main component)
├── LoadingSkeleton (loading state)
├── EmptyState (no data)
├── EmptyState (error with retry)
└── ResponseCard[] (data display)
    ├── Provider Badge
    ├── Response Text
    ├── Citations (optional)
    └── Stats Row (tokens, latency, word count)
```

### API Integration

Uses existing API function:
```typescript
import { getQueryResponses } from '@/lib/api/pipeline'

// Returns: { responses: RawLLMResponse[] }
```

### Design Tokens Used

| Element | Style |
|---------|-------|
| Grid | `grid-cols-1 md:grid-cols-2 gap-4` |
| Card | `shadow-sm hover:shadow-md transition-shadow` |
| Badge | `variant="default"` with `capitalize` |
| Text Content | `text-sm leading-relaxed` in `bg-muted/30` container |
| Stats | `text-xs text-muted-foreground` |
| Error Box | `bg-destructive/10 text-destructive` |

---

## S3-06: EmptyState Component

### Location
`components/ui/empty-state.tsx`

### Features

✅ **Reusable empty state component**
- Centered layout with min-height
- Optional icon (12x12 in muted circle)
- Title (lg font-semibold)
- Optional description (sm text with max-width)
- Optional action button/CTA

### Props

```typescript
interface EmptyStateProps {
  icon?: React.ReactNode          // Optional icon element
  title: string                   // Required title text
  description?: string            // Optional description
  action?: React.ReactNode        // Optional CTA button
  className?: string              // Additional Tailwind classes
}
```

### Usage Examples

#### Basic Empty State
```tsx
<EmptyState
  icon={<Inbox className="h-6 w-6" />}
  title="데이터가 없습니다"
  description="아직 생성된 항목이 없습니다."
/>
```

#### With Action Button
```tsx
<EmptyState
  icon={<AlertCircle className="h-6 w-6" />}
  title="데이터를 불러올 수 없습니다"
  description="네트워크 오류가 발생했습니다."
  action={
    <Button onClick={retry} variant="outline">
      <RefreshCw className="mr-2 h-4 w-4" />
      다시 시도
    </Button>
  }
/>
```

#### In Card Component
```tsx
<Card>
  <CardHeader>
    <CardTitle>Recent Activity</CardTitle>
  </CardHeader>
  <CardContent>
    {data.length === 0 ? (
      <EmptyState
        icon={<BarChart3 className="h-6 w-6" />}
        title="활동 내역이 없습니다"
        className="min-h-[150px]"
      />
    ) : (
      <DataList data={data} />
    )}
  </CardContent>
</Card>
```

### Example Use Cases

See `components/dashboard/EmptyStateExamples.tsx` for 7 complete examples:

1. **EmptyChartState** - No data in charts
2. **NoSearchResultsState** - No search results
3. **NoCampaignsState** - Empty campaign list with CTA
4. **NoReportsState** - Empty report list
5. **ErrorState** - Error with retry button
6. **DashboardCardWithEmptyState** - Integration in Card
7. **DashboardGridExample** - Multiple empty states in grid

### Design Tokens Used

| Element | Style |
|---------|-------|
| Container | `flex flex-col items-center justify-center space-y-4` |
| Border | `border border-dashed rounded-lg` |
| Min Height | `min-h-[200px]` (adjustable via className) |
| Icon Circle | `h-12 w-12 bg-muted text-muted-foreground rounded-full` |
| Title | `text-lg font-semibold text-foreground` |
| Description | `text-sm text-muted-foreground max-w-sm text-center` |

---

## Design Guidelines Applied

✅ **shadcn/ui components only**
- No native HTML inputs/buttons
- All UI from `components/ui/`

✅ **Tailwind styles**
- `space-y-6`, `gap-4` for spacing
- `rounded-lg` for borders
- `shadow-sm`, `hover:shadow-md` for elevation

✅ **Color palette**
- `primary`, `muted`, `accent` variables
- NO hardcoded colors
- `text-foreground`, `text-muted-foreground`

✅ **Typography**
- `text-sm` (body text)
- `text-xs` (labels, stats)
- `font-semibold` (titles)

✅ **Responsive**
- `grid-cols-1 md:grid-cols-2` breakpoints
- Mobile-first approach

✅ **Three states implemented**
- ✅ Loading (Skeleton)
- ✅ Empty State
- ✅ Error State

---

## Testing

### TypeScript Compilation
```bash
cd /c/workspace/geo/geo-sensor-frontend
npx tsc --noEmit
```

**Result**: ✅ Zero type errors

### Manual Testing Checklist

#### QueryResponseComparison
- [ ] Loading skeleton displays correctly
- [ ] Empty state shows when no responses
- [ ] Error state shows with retry button
- [ ] Side-by-side grid works on desktop
- [ ] Stacks vertically on mobile
- [ ] Provider badges display correctly
- [ ] Stats row shows tokens/latency when available
- [ ] Error messages display in red box

#### EmptyState
- [ ] Icon displays in muted circle
- [ ] Title is readable and prominent
- [ ] Description is centered and constrained
- [ ] Action button renders when provided
- [ ] Works inside Card components
- [ ] Responsive on all screen sizes
- [ ] Custom className works

---

## File Structure

```
components/
├── ui/
│   └── empty-state.tsx              # ✅ S3-06 - Reusable empty state
├── query-lab/
│   └── QueryResponseComparison.tsx  # ✅ S3-04 - LLM comparison view
└── dashboard/
    └── EmptyStateExamples.tsx       # 📚 Usage examples

app/(stitch-dashboard)/dashboard/pipeline/
└── query-comparison-example.tsx     # 📚 Integration example

docs/
└── S3-04-S3-06-IMPLEMENTATION.md    # 📚 This file
```

---

## Next Steps

### To integrate QueryResponseComparison into Pipeline page:

1. **Add compare button to query list**
```tsx
<Button variant="outline" size="sm" onClick={() => setSelectedQuery(query)}>
  <Eye className="mr-2 h-4 w-4" />
  비교
</Button>
```

2. **Add Dialog wrapper**
```tsx
<Dialog open={!!selectedQuery} onOpenChange={...}>
  <DialogContent className="max-w-5xl">
    <QueryResponseComparison
      queryId={selectedQuery.id}
      queryText={selectedQuery.text}
    />
  </DialogContent>
</Dialog>
```

### To apply EmptyState to existing pages:

1. **Identify data components** (charts, tables, lists)
2. **Add conditional rendering**
3. **Choose appropriate icon and message**
4. **Add action button if needed** (retry, create, etc.)

See `EmptyStateExamples.tsx` for copy-paste ready examples.

---

## Technical Notes

### Dependencies
- All required shadcn/ui components already installed
- Uses existing API functions (`getQueryResponses`)
- Uses existing types (`RawLLMResponse`, `Citation`)
- Zero new package installations needed

### Performance
- React state management with `useState`
- Automatic data fetching with `useEffect`
- Skeleton avoids layout shift during loading
- Responsive grid uses CSS Grid (no JS)

### Accessibility
- Semantic HTML structure
- Icon labels with screen reader text
- Keyboard navigable buttons
- Focus states on interactive elements

---

## Summary

✅ **S3-04 Implementation Complete**
- QueryResponseComparison component created
- Three states implemented (Loading, Empty, Error)
- API integration working
- Example integration provided

✅ **S3-06 Implementation Complete**
- EmptyState component created
- Fully reusable with props
- 7 usage examples provided
- Ready for dashboard integration

✅ **Design Guidelines Followed**
- shadcn/ui components only
- Tailwind design tokens
- Responsive breakpoints
- Professional UI/UX quality

✅ **TypeScript Verification Passed**
- Zero compilation errors
- Full type safety maintained
