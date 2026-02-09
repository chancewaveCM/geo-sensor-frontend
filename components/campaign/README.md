# Citation Highlighting Components

## Components

### CitationHighlight

Displays response text with highlighted citations. Hovering over a citation shows details in a tooltip.

**Props:**
- `responseText: string` - The full response text
- `citations: RunCitation[]` - Array of citations to highlight

**Features:**
- Target brand citations: Orange highlight with orange border
- Other brand citations: Blue highlight with blue border
- Hover tooltip shows:
  - Brand name
  - Confidence score (%)
  - Extraction method
  - Context before/after (if available)
  - "타겟 브랜드" badge for target brands

**Example:**
```tsx
import { CitationHighlight } from '@/components/campaign/CitationHighlight'
import { CitationLegend } from '@/components/campaign/CitationLegend'

export function ResponseView({ response, citations }) {
  return (
    <div className="space-y-4">
      <CitationLegend citations={citations} />
      <CitationHighlight
        responseText={response.content}
        citations={citations}
      />
    </div>
  )
}
```

### CitationLegend

Shows a summary of citations with color legend.

**Props:**
- `citations: RunCitation[]` - Array of citations

**Displays:**
- Orange dot + "타겟 브랜드" count
- Blue dot + "기타 브랜드" count
- Total citation count
- Average confidence score

## Styling

Both components use shadcn/ui components and Tailwind CSS:
- Smooth transitions on hover
- Dark mode support
- Accessible with proper ARIA labels
- Responsive design

## Integration

These components are designed to work with the Gallery detail page and any other view that displays AI responses with citations.

**Required types:**
```typescript
import { RunCitation } from '@/lib/types/gallery'
```

The `RunCitation` type includes:
- `id`, `run_response_id`
- `cited_brand`, `citation_span`
- `context_before`, `context_after`
- `position_in_response`, `is_target_brand`
- `confidence_score`, `extraction_method`
- `is_verified`
