// lib/utils/text-highlighter.tsx
import type { BrandMention } from '@/types/query-lab';
import { BRAND_HIGHLIGHT_COLOR } from '@/lib/constants/query-lab-config';

interface HighlightOptions {
  /** Background color for highlighted text */
  highlightColor?: string;
  /** Additional CSS classes for highlight marks */
  className?: string;
}

/**
 * Renders text with brand mentions highlighted.
 * Handles overlapping mentions by skipping duplicates.
 */
export function highlightBrandMentions(
  text: string,
  mentions: BrandMention[],
  options: HighlightOptions = {}
): React.ReactNode {
  const { highlightColor = BRAND_HIGHLIGHT_COLOR, className = '' } = options;

  if (mentions.length === 0) {
    return <span className="whitespace-pre-wrap">{text}</span>;
  }

  const sortedMentions = [...mentions].sort(
    (a, b) => a.positionStart - b.positionStart
  );

  const parts: React.ReactNode[] = [];
  let lastEnd = 0;

  for (const mention of sortedMentions) {
    // Skip overlapping or out-of-bounds mentions
    if (mention.positionStart < lastEnd || mention.positionEnd > text.length) {
      continue;
    }

    // Add text before this mention
    if (mention.positionStart > lastEnd) {
      parts.push(
        <span key={`text-${lastEnd}`}>
          {text.slice(lastEnd, mention.positionStart)}
        </span>
      );
    }

    // Add highlighted mention
    parts.push(
      <mark
        key={`mention-${mention.positionStart}`}
        className={`px-1 rounded cursor-pointer hover:brightness-90 transition-all ${className}`}
        style={{ backgroundColor: highlightColor }}
        title={`${mention.brandName} (${mention.matchType}, ${Math.round(mention.confidence * 100)}% confidence)`}
      >
        {text.slice(mention.positionStart, mention.positionEnd)}
      </mark>
    );

    lastEnd = mention.positionEnd;
  }

  // Add remaining text
  if (lastEnd < text.length) {
    parts.push(
      <span key={`text-${lastEnd}`}>
        {text.slice(lastEnd)}
      </span>
    );
  }

  return <>{parts}</>;
}
