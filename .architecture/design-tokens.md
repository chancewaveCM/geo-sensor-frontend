# GEO Sensor Design Token System

> Comprehensive design token specification for UI/UX unification.
> All hardcoded values must be replaced with these tokens.
> Visual appearance remains identical after tokenization.

---

## Table of Contents

1. [Color Tokens](#1-color-tokens)
2. [Spacing Tokens](#2-spacing-tokens)
3. [Typography Tokens](#3-typography-tokens)
4. [Border Radius Tokens](#4-border-radius-tokens)
5. [Shadow Tokens](#5-shadow-tokens)
6. [Hardcoded to Token Replacement Map](#6-hardcoded-to-token-replacement-map)
7. [Implementation Guide](#7-implementation-guide)

---

## 1. Color Tokens

### 1.1 Brand Colors

Core brand identity colors. These MUST NOT change.

| Token | CSS Variable | HSL Value | Hex Equivalent | Usage |
|-------|-------------|-----------|----------------|-------|
| `brand.orange` | `--brand-orange` | `24 100% 56%` | `#E06820` | Primary CTA, accent highlights |
| `brand.orange-hover` | `--brand-orange-hover` | `24 100% 46%` | `#c75a1b` | Hover state for brand orange |
| `brand.navy` | `--brand-navy` | `222 80% 33%` | `#114BA3` | Secondary brand, headings, links |
| `brand.navy-hover` | `--brand-navy-hover` | `222 80% 23%` | `#0d3876` | Hover state for brand navy |
| `brand.navy-light` | `--brand-navy-light` | `222 80% 93%` | (light tint) | Subtle navy backgrounds |

### 1.2 Semantic Colors

Functional colors for UI states and actions.

| Token | CSS Variable | Light Mode HSL | Dark Mode HSL | Usage |
|-------|-------------|---------------|---------------|-------|
| `primary` | `--primary` | `217 91% 60%` | `217 91% 60%` | Primary actions, links |
| `primary-foreground` | `--primary-foreground` | `210 40% 98%` | `222.2 47.4% 11.2%` | Text on primary |
| `secondary` | `--secondary` | `210 40% 96.1%` | `217.2 32.6% 17.5%` | Secondary actions |
| `secondary-foreground` | `--secondary-foreground` | `222.2 47.4% 11.2%` | `210 40% 98%` | Text on secondary |
| `destructive` | `--destructive` | `0 84.2% 60.2%` | `0 62.8% 30.6%` | Destructive/danger actions |
| `destructive-foreground` | `--destructive-foreground` | `210 40% 98%` | `210 40% 98%` | Text on destructive |
| `success` | `--success` | `142 76% 36%` | `142 76% 36%` | Success states, confirmations |
| `success-foreground` | `--success-foreground` | `0 0% 100%` | `0 0% 100%` | Text on success |
| `warning` | `--warning` | `38 92% 50%` | `38 92% 50%` | Warning states |
| `warning-foreground` | `--warning-foreground` | `0 0% 100%` | `0 0% 100%` | Text on warning |
| `info` | `--info` | `217 91% 60%` | `217 91% 60%` | Informational states |
| `info-foreground` | `--info-foreground` | `0 0% 100%` | `0 0% 100%` | Text on info |
| `error` | `--error` | `0 84.2% 60.2%` | `0 62.8% 30.6%` | Error states (alias of destructive) |
| `error-foreground` | `--error-foreground` | `210 40% 98%` | `210 40% 98%` | Text on error |

### 1.3 Surface / Neutral Colors

Background, foreground, and UI element colors.

| Token | CSS Variable | Light Mode HSL | Dark Mode HSL | Usage |
|-------|-------------|---------------|---------------|-------|
| `background` | `--background` | `0 0% 100%` | `222.2 84% 4.9%` | Page background |
| `background-subtle` | `--background-subtle` | `0 0% 98%` | `222.2 84% 7%` | Subtle background (#FAFAFA) |
| `foreground` | `--foreground` | `222.2 84% 4.9%` | `210 40% 98%` | Primary text |
| `card` | `--card` | `0 0% 100%` | `222.2 84% 4.9%` | Card backgrounds |
| `card-foreground` | `--card-foreground` | `222.2 84% 4.9%` | `210 40% 98%` | Card text |
| `card-hover` | `--card-hover` | `0 0% 98%` | `222.2 84% 7%` | Card hover background |
| `popover` | `--popover` | `0 0% 100%` | `222.2 84% 4.9%` | Popover backgrounds |
| `popover-foreground` | `--popover-foreground` | `222.2 84% 4.9%` | `210 40% 98%` | Popover text |
| `muted` | `--muted` | `210 40% 96.1%` | `217.2 32.6% 17.5%` | Muted backgrounds |
| `muted-foreground` | `--muted-foreground` | `215.4 16.3% 46.9%` | `215 20.2% 65.1%` | Muted/secondary text |
| `accent` | `--accent` | `210 40% 96.1%` | `217.2 32.6% 17.5%` | Accent backgrounds |
| `accent-foreground` | `--accent-foreground` | `222.2 47.4% 11.2%` | `210 40% 98%` | Accent text |
| `border` | `--border` | `214.3 31.8% 91.4%` | `217.2 32.6% 17.5%` | Default borders |
| `border-strong` | `--border-strong` | `214.3 31.8% 80%` | `217.2 32.6% 30%` | Emphasized borders |
| `input` | `--input` | `214.3 31.8% 91.4%` | `217.2 32.6% 17.5%` | Input borders |
| `ring` | `--ring` | `217 91% 60%` | `224.3 76.3% 48%` | Focus rings |

### 1.4 Gray Scale (Neutral)

10-level gray scale for fine-grained control.

| Token | CSS Variable | Hex Equivalent | Tailwind Slate Equivalent |
|-------|-------------|----------------|--------------------------|
| `gray.50` | `--gray-50` | `#F8FAFC` | `slate-50` |
| `gray.100` | `--gray-100` | `#F1F5F9` | `slate-100` |
| `gray.200` | `--gray-200` | `#E2E8F0` | `slate-200` |
| `gray.300` | `--gray-300` | `#CBD5E1` | `slate-300` |
| `gray.400` | `--gray-400` | `#94A3B8` | `slate-400` |
| `gray.500` | `--gray-500` | `#64748B` | `slate-500` |
| `gray.600` | `--gray-600` | `#475569` | `slate-600` |
| `gray.700` | `--gray-700` | `#334155` | `slate-700` |
| `gray.800` | `--gray-800` | `#1E293B` | `slate-800` |
| `gray.900` | `--gray-900` | `#0F172A` | `slate-900` |

> **Migration note**: All `slate-*` Tailwind utility classes should be replaced with `gray-*` tokens to use CSS variables. This enables dark mode switching via the variable layer.

### 1.5 Chart / Data Visualization Colors

6-color palette for charts. Designed for visual distinction and accessibility.

| Token | CSS Variable | HSL Value | Hex Equivalent | Usage |
|-------|-------------|-----------|----------------|-------|
| `chart.1` | `--chart-1` | `24 100% 56%` | `#E06820` | Brand orange (primary series) |
| `chart.2` | `--chart-2` | `222 80% 33%` | `#114BA3` | Brand navy (secondary series) |
| `chart.3` | `--chart-3` | `142 71% 45%` | `#22c55e` | Green (success / positive) |
| `chart.4` | `--chart-4` | `217 91% 60%` | `#3B82F6` | Blue (primary / default) |
| `chart.5` | `--chart-5` | `271 76% 53%` | `#8b5cf6` | Purple (tertiary series) |
| `chart.6` | `--chart-6` | `45 93% 47%` | `#eab308` | Yellow (highlight / warning) |

**Extended chart palette** (for 7+ series):

| Token | CSS Variable | HSL Value | Hex Equivalent |
|-------|-------------|-----------|----------------|
| `chart.7` | `--chart-7` | `0 84% 60%` | `#ef4444` | Red |
| `chart.8` | `--chart-8` | `199 89% 48%` | `#0ea5e9` | Sky blue |

**Chart utility colors**:

| Token | CSS Variable | Hex Equivalent | Usage |
|-------|-------------|----------------|-------|
| `chart.grid` | `--chart-grid` | `#e5e7eb` | Grid lines (gray-200) |
| `chart.axis-text` | `--chart-axis-text` | `#6b7280` | Axis label text (gray-500) |
| `chart.fill-opacity` | `--chart-fill-opacity` | `0.6` | Default radar/area fill opacity |

### 1.6 Status Colors

For status indicators across the application.

| Token | CSS Variable | HSL Value | Hex Equivalent | Usage |
|-------|-------------|-----------|----------------|-------|
| `status.active` | `--status-active` | `142 71% 45%` | `#22c55e` | Active/online/positive |
| `status.inactive` | `--status-inactive` | `215.4 16.3% 46.9%` | `#64748b` | Inactive/disabled |
| `status.pending` | `--status-pending` | `38 92% 50%` | `#f59e0b` | Pending/in-progress |
| `status.error` | `--status-error` | `0 84.2% 60.2%` | `#ef4444` | Error/failed |

### 1.7 Category Colors

Semantic colors for query category badges (CategoryBadge component).

| Token | CSS Variable (bg) | CSS Variable (text) | Background | Text | Usage |
|-------|-------------------|---------------------|------------|------|-------|
| `category.introductory` | `--category-introductory-bg` | `--category-introductory-text` | `#DBEAFE` (blue-100) | `#1D4ED8` (blue-700) | Introductory queries |
| `category.comparative` | `--category-comparative-bg` | `--category-comparative-text` | `#F3E8FF` (purple-100) | `#7E22CE` (purple-700) | Comparative queries |
| `category.critical` | `--category-critical-bg` | `--category-critical-text` | `#FEE2E2` (red-100) | `#B91C1C` (red-700) | Critical queries |

### 1.8 Rank / Medal Colors

For brand ranking display (BrandRankingCard component).

| Token | CSS Variable (from) | CSS Variable (to) | Gradient From | Gradient To | Usage |
|-------|---------------------|-------------------|---------------|-------------|-------|
| `rank.gold` | `--rank-gold-from` | `--rank-gold-to` | `#FACC15` (yellow-400) | `#CA8A04` (yellow-600) | 1st place |
| `rank.silver` | `--rank-silver-from` | `--rank-silver-to` | `#CBD5E1` (slate-300) | `#64748B` (slate-500) | 2nd place |
| `rank.bronze` | `--rank-bronze-from` | `--rank-bronze-to` | `#D97706` (amber-600) | `#92400E` (amber-800) | 3rd place |

### 1.9 Grade Colors

For GEO Score grade display (GeoScoreChart component).

| Token | CSS Variable (text) | CSS Variable (border) | CSS Variable (bg) | Text | Border | Background | Grade |
|-------|---------------------|----------------------|-------------------|------|--------|------------|-------|
| `grade.a` | `--grade-a-text` | `--grade-a-border` | `--grade-a-bg` | `#22c55e` | `#22c55e` | `#22c55e1a` | A |
| `grade.b` | `--grade-b-text` | `--grade-b-border` | `--grade-b-bg` | `#3B82F6` | `#3B82F6` | `#3B82F61a` | B |
| `grade.c` | `--grade-c-text` | `--grade-c-border` | `--grade-c-bg` | `#eab308` | `#eab308` | `#eab3081a` | C |
| `grade.d` | `--grade-d-text` | `--grade-d-border` | `--grade-d-bg` | `#f97316` | `#f97316` | `#f973161a` | D |
| `grade.f` | `--grade-f-text` | `--grade-f-border` | `--grade-f-bg` | `#ef4444` | `#ef4444` | `#ef44441a` | F |

### 1.10 Sentiment Colors

For sentiment analysis display (SentimentGauge component).

| Token | CSS Variable | Hex Value | Usage |
|-------|-------------|-----------|-------|
| `sentiment.positive` | `--sentiment-positive` | `#22c55e` | Positive sentiment |
| `sentiment.neutral` | `--sentiment-neutral` | `#f59e0b` | Neutral sentiment |
| `sentiment.negative` | `--sentiment-negative` | `#ef4444` | Negative sentiment |

### 1.11 Trend Colors

For up/down/unchanged indicators (StatsCard, BrandRankingCard).

| Token | CSS Variable | Hex Value | Usage |
|-------|-------------|-----------|-------|
| `trend.up` | `--trend-up` | `#22c55e` | Positive trend (green-500) |
| `trend.down` | `--trend-down` | `#ef4444` | Negative trend (red-500) |
| `trend.neutral` | `--trend-neutral` | (inherits muted-foreground) | No change |

### 1.12 Step / Progress Colors

For multi-step wizards (AnalysisSteps component).

| Token | CSS Variable | Hex/HSL | Usage |
|-------|-------------|---------|-------|
| `step.completed-bg` | `--step-completed-bg` | `#DCFCE7` (green-100) | Completed step background |
| `step.completed-text` | `--step-completed-text` | `#15803D` (green-700) | Completed step text |
| `step.completed-hover` | `--step-completed-hover` | `#BBF7D0` (green-200) | Completed step hover |
| `step.completed-icon` | `--step-completed-icon` | `#16A34A` (green-600) | Completed step icon bg |
| `step.completed-line` | `--step-completed-line` | `#22c55e` (green-500) | Completed connector line |
| `step.active-bg` | `--step-active-bg` | (inherits primary) | Active step background |
| `step.active-text` | `--step-active-text` | (inherits primary-foreground) | Active step text |
| `step.inactive-bg` | `--step-inactive-bg` | (inherits muted) | Inactive step background |
| `step.inactive-text` | `--step-inactive-text` | (inherits muted-foreground) | Inactive step text |

---

## 2. Spacing Tokens

### 2.1 Base Scale

Base unit: **4px**. All spacing values are multiples of 4.

| Token | Value | Tailwind Class | Usage |
|-------|-------|----------------|-------|
| `space-xs` | `4px` (0.25rem) | `p-1` / `gap-1` | Tight inner spacing |
| `space-sm` | `8px` (0.5rem) | `p-2` / `gap-2` | Small inner spacing |
| `space-md` | `12px` (0.75rem) | `p-3` / `gap-3` | Medium inner spacing |
| `space-base` | `16px` (1rem) | `p-4` / `gap-4` | Default spacing |
| `space-lg` | `20px` (1.25rem) | `p-5` / `gap-5` | Large spacing |
| `space-xl` | `24px` (1.5rem) | `p-6` / `gap-6` | Extra large spacing |
| `space-2xl` | `32px` (2rem) | `p-8` / `gap-8` | Section spacing |
| `space-3xl` | `40px` (2.5rem) | `p-10` / `gap-10` | Large section spacing |
| `space-4xl` | `48px` (3rem) | `p-12` / `gap-12` | Page-level spacing |

### 2.2 Component Spacing

Predefined spacing for common component patterns.

| Token | Value | Usage |
|-------|-------|-------|
| `card-padding` | `24px` (1.5rem / `p-6`) | Card internal padding (CardHeader, CardContent) |
| `card-padding-compact` | `20px` (1.25rem / `p-5`) | Compact card padding (landing cards) |
| `card-gap` | `6px` (0.375rem / `space-y-1.5`) | Gap between CardHeader title and description |
| `section-gap` | `24px` (1.5rem / `gap-6`) | Gap between sections/cards |
| `form-gap` | `10px` (0.625rem / `space-y-2.5`) | Gap between form fields |
| `list-gap` | `12px` (0.75rem / `space-y-3`) | Gap between list items |

### 2.3 Layout Spacing

Fixed layout dimensions.

| Token | CSS Variable | Value | Usage |
|-------|-------------|-------|-------|
| `sidebar-width` | `--sidebar-width` | `256px` | Sidebar width |
| `header-height` | `--header-height` | `64px` | Header height |
| `content-padding` | `--content-padding` | `24px` (1.5rem) | Main content area padding |
| `container-max` | `--container-max` | `1400px` | Max container width (2xl) |
| `landing-max` | `--landing-max` | `1440px` | Landing page max width |

---

## 3. Typography Tokens

### 3.1 Type Scale

All type scales are defined in `tailwind.config.ts` as custom `fontSize` entries.

| Token | Font Size | Line Height | Font Weight | Tailwind Class | Usage |
|-------|-----------|-------------|-------------|----------------|-------|
| `display` | `3rem` (48px) | `1.1` | `700` (bold) | `text-display` | Hero headings |
| `h1` | `2.25rem` (36px) | `1.2` | `700` (bold) | `text-h1` | Page titles |
| `h2` | `1.875rem` (30px) | `1.25` | `600` (semibold) | `text-h2` | Section headings |
| `h3` | `1.5rem` (24px) | `1.3` | `600` (semibold) | `text-h3` | Subsection headings |
| `h4` | `1.25rem` (20px) | `1.4` | `600` (semibold) | `text-h4` | Card titles |
| `h5` | `1rem` (16px) | `1.5` | `600` (semibold) | `text-h5` | Small headings |
| `h6` | `0.875rem` (14px) | `1.5` | `600` (semibold) | `text-h6` | Label headings |
| `body-lg` | `1.125rem` (18px) | `1.6` | `400` (regular) | `text-body-lg` | Lead paragraphs |
| `body` | `1rem` (16px) | `1.5` | `400` (regular) | `text-body` | Body text |
| `body-sm` | `0.875rem` (14px) | `1.5` | `400` (regular) | `text-body-sm` | Small body text |
| `caption` | `0.75rem` (12px) | `1.4` | `400` (regular) | `text-caption` | Captions, meta text |
| `overline` | `0.6875rem` (11px) | `1.4` | `500` (medium) | `text-overline` | Overline labels |
| `code` | `0.875rem` (14px) | `1.5` | `400` (regular) | `font-mono text-body-sm` | Code snippets |

### 3.2 Font Weights

| Token | Value | Tailwind Class | Usage |
|-------|-------|----------------|-------|
| `font-regular` | `400` | `font-normal` | Body text |
| `font-medium` | `500` | `font-medium` | Emphasis, labels |
| `font-semibold` | `600` | `font-semibold` | Headings, buttons |
| `font-bold` | `700` | `font-bold` | Display, strong emphasis |

### 3.3 Font Families

| Token | Value | Tailwind Class |
|-------|-------|----------------|
| `font-sans` | `Inter, Pretendard, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif` | `font-sans` |
| `font-mono` | `JetBrains Mono, Fira Code, Consolas, monospace` | `font-mono` |

> **Note**: `Pretendard` is added for Korean text rendering on the landing page.

---

## 4. Border Radius Tokens

### 4.1 Standard Radii

Reduced to 4 standard values plus `full`.

| Token | CSS Variable | Value | Tailwind Class | Usage |
|-------|-------------|-------|----------------|-------|
| `radius-sm` | `calc(var(--radius) - 4px)` | `4px` | `rounded-sm` | Small elements (badges, tags) |
| `radius-md` | `calc(var(--radius) - 2px)` | `6px` | `rounded-md` | Buttons, inputs |
| `radius-lg` | `var(--radius)` | `8px` (0.5rem) | `rounded-lg` | Cards, dialogs |
| `radius-xl` | `12px` | `12px` | `rounded-xl` | Landing cards, large panels |
| `radius-2xl` | `16px` | `16px` | `rounded-2xl` | Landing hero cards, header |
| `radius-full` | `9999px` | `9999px` | `rounded-full` | Pills, badges, avatars |

### 4.2 Current Usage Mapping

| Current Usage | Component | New Token |
|---------------|-----------|-----------|
| `rounded-lg` | Card, tooltips, dimension bars | `radius-lg` |
| `rounded-md` | Button default | `radius-md` |
| `rounded-xl` | Landing sub-cards, inner sections | `radius-xl` |
| `rounded-2xl` | Landing main articles, header | `radius-2xl` |
| `rounded-full` | Badges, pills, CTAs, avatars, rank circles | `radius-full` |
| `rounded` (4px) | Landing grade tags | `radius-sm` |

---

## 5. Shadow Tokens

### 5.1 Elevation System

4-level shadow system plus interactive states.

| Token | CSS Variable | Value | Tailwind Class | Usage |
|-------|-------------|-------|----------------|-------|
| `shadow-sm` | `--shadow-sm` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` | `shadow-sm` | Subtle (cards at rest) |
| `shadow-md` | `--shadow-md` | `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)` | `shadow-md` | Medium (hover states) |
| `shadow-lg` | `--shadow-lg` | `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` | `shadow-lg` | Prominent (active/focused cards) |
| `shadow-xl` | `--shadow-xl` | `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)` | `shadow-xl` | Maximum (dialogs, modals) |

### 5.2 Interaction Pattern

```
Rest state:    shadow-sm
Hover state:   shadow-md or shadow-lg (cards use hover:shadow-lg)
Active/Focus:  shadow-lg
Dialog/Modal:  shadow-xl
```

---

## 6. Hardcoded to Token Replacement Map

### 6.1 Hex Color Replacements

| File | Line(s) | Current Value | New Token | CSS Variable / Tailwind Class |
|------|---------|---------------|-----------|-------------------------------|
| `CitationShareChart.tsx` | 71, 98 | `#3B82F6` | `chart.4` | `hsl(var(--chart-4))` |
| `GeoScoreChart.tsx` | 93 | `#e5e7eb` | `chart.grid` | `hsl(var(--chart-grid))` |
| `GeoScoreChart.tsx` | 96 | `#6b7280` | `chart.axis-text` | `hsl(var(--chart-axis-text))` |
| `GeoScoreChart.tsx` | 102-103 | `#3B82F6` | `chart.4` | `hsl(var(--chart-4))` |
| `BentoLanding.tsx` | 9 | `#FAFAFA` | `background-subtle` | `bg-background-subtle` |
| `BentoLanding.tsx` | 17, 22, 25, 28, 34, 68, 95, 117, 132, 172, 227 | `#114BA3` | `brand.navy` | `text-brand-navy` / `bg-brand-navy` |
| `BentoLanding.tsx` | 44, 61, 81, 87, 139, 164, 187, 231, 276, 296 | `#E06820` | `brand.orange` | `text-brand-orange` / `bg-brand-orange` |
| `BentoLanding.tsx` | 61, 231 | `#c75a1b` | `brand.orange-hover` | `hover:bg-brand-orange-hover` |
| `BentoLanding.tsx` | 150 | `#114BA3` (SVG stroke) | `brand.navy` | Use CSS var in JS |
| `BentoLanding.tsx` | 139 | `#E06820` (SVG stroke) | `brand.orange` | Use CSS var in JS |
| `BentoLanding.tsx` | 259 | `#E2E8F0` (SVG stroke) | `gray.200` | `hsl(var(--gray-200))` |
| `BentoLanding.tsx` | 276-277 | `#E06820`, `#114BA3` (gradient stops) | `brand.orange`, `brand.navy` | CSS var in SVG `stopColor` |
| `SentimentGauge.tsx` | 14-16 | `#22c55e`, `#f59e0b`, `#ef4444` | `sentiment.*` | `hsl(var(--sentiment-*))` |
| `strategic/CitationShareChart.tsx` | 62 | `#8884d8` | `chart.5` | `hsl(var(--chart-5))` |

### 6.2 Tailwind Color Class Replacements

| File | Line(s) | Current Classes | New Token | New Classes |
|------|---------|----------------|-----------|-------------|
| **AnalysisSteps.tsx** | | | | |
| | 29 | `bg-green-100 text-green-700 hover:bg-green-200` | `step.completed-*` | `bg-step-completed text-step-completed-text hover:bg-step-completed-hover` |
| | 36 | `bg-green-600 text-white` | `step.completed-icon` | `bg-step-completed-icon text-white` |
| | 49 | `bg-green-500` | `step.completed-line` | `bg-step-completed-line` |
| **CategoryBadge.tsx** | | | | |
| | 9 | `bg-blue-100 text-blue-700` | `category.introductory` | `bg-category-introductory text-category-introductory-text` |
| | 10 | `bg-purple-100 text-purple-700` | `category.comparative` | `bg-category-comparative text-category-comparative-text` |
| | 11 | `bg-red-100 text-red-700` | `category.critical` | `bg-category-critical text-category-critical-text` |
| **BrandRankingCard.tsx** | | | | |
| | 24 | `from-yellow-400 to-yellow-600` | `rank.gold` | `from-rank-gold-from to-rank-gold-to` |
| | 25 | `from-slate-300 to-slate-500` | `rank.silver` | `from-rank-silver-from to-rank-silver-to` |
| | 26 | `from-amber-600 to-amber-800` | `rank.bronze` | `from-rank-bronze-from to-rank-bronze-to` |
| | 71-72 | `text-green-500` | `trend.up` | `text-trend-up` |
| | 76-77 | `text-red-500` | `trend.down` | `text-trend-down` |
| **GeoScoreChart.tsx** | | | | |
| | 28 | `text-green-500 border-green-500 bg-green-500/10` | `grade.a` | `text-grade-a border-grade-a bg-grade-a/10` |
| | 30 | `text-blue-500 border-blue-500 bg-blue-500/10` | `grade.b` | `text-grade-b border-grade-b bg-grade-b/10` |
| | 32 | `text-yellow-500 border-yellow-500 bg-yellow-500/10` | `grade.c` | `text-grade-c border-grade-c bg-grade-c/10` |
| | 34 | `text-orange-500 border-orange-500 bg-orange-500/10` | `grade.d` | `text-grade-d border-grade-d bg-grade-d/10` |
| | 36 | `text-red-500 border-red-500 bg-red-500/10` | `grade.f` | `text-grade-f border-grade-f bg-grade-f/10` |
| | 126 | `from-blue-500 to-purple-500` | `chart.4`, `chart.5` | `from-chart-4 to-chart-5` |
| **StatsCard.tsx** | | | | |
| | 26 | `text-green-500` | `trend.up` | `text-trend-up` |
| | 28, 36 | `text-red-500` | `trend.down` | `text-trend-down` |
| | 35 | `text-green-500` | `trend.up` | `text-trend-up` |
| **badge.tsx** | | | | |
| | 19 | `bg-green-500 text-white hover:bg-green-600` | `success` | `bg-success text-success-foreground hover:bg-success/90` |
| **PasswordStrengthIndicator.tsx** | | | | |
| | 27 | `text-green-600` | `status.active` (via success) | `text-success` |
| | 33 | `text-red-500` | `status.error` (via destructive) | `text-destructive` |
| **EmailAvailabilityIndicator.tsx** | | | | |
| | 21 | `text-green-600` | `status.active` | `text-success` |
| | 22 | `text-red-600` | `status.error` | `text-destructive` |
| **QueryItem.tsx** | | | | |
| | 65 | `text-orange-600` | `brand.orange` | `text-brand-orange` |
| | 78 | `text-green-600` | `status.active` | `text-success` |
| | 81 | `text-red-600` | `status.error` | `text-destructive` |
| **QueryGenerationPanel.tsx** | | | | |
| | 53 | `text-yellow-500` | `warning` | `text-warning` |
| **PipelineProgress.tsx** | | | | |
| | 61 | `text-green-600` | `trend.up` / `success` | `text-success` |
| | 65 | `text-red-600` | `trend.down` / `error` | `text-destructive` |
| **AnalysisSummary.tsx** | | | | |
| | 113, 125 | `bg-blue-50`, `bg-blue-100 text-blue-700` | `info` | `bg-info/10`, `bg-info/20 text-info` |
| | 136, 148 | `bg-amber-50`, `bg-amber-100 text-amber-700` | `warning` | `bg-warning/10`, `bg-warning/20 text-warning` |
| | 170 | `text-blue-600` | `info` | `text-info` |
| | 176 | `text-amber-600` | `warning` | `text-warning` |
| **QueryInput.tsx** | | | | |
| | 92 | `text-amber-600` | `warning` | `text-warning` |
| **QueryResponseDetail.tsx** | | | | |
| | 16 | `bg-blue-500` | `chart.4` | `bg-chart-4` |
| | 17 | `bg-green-500` | `chart.3` | `bg-chart-3` |
| **DashboardHeader.tsx** | | | | |
| | 22 | `bg-red-500` | `destructive` | `bg-destructive` |

### 6.3 Stitch Dashboard Components

| File | Current Value | New Token |
|------|---------------|-----------|
| `RiskMetricCard.tsx:13-17` | `bg-red-50/50`, `bg-red-100`, `text-red-600`, `bg-red-500`, `border-red-500/50` | `status.error` variants |
| `RiskMetricCard.tsx:22-26` | `bg-amber-50/50`, `bg-amber-100`, `text-amber-600`, `bg-amber-500`, `border-amber-500/50` | `status.pending` / `warning` variants |
| `RiskTimeline.tsx:22,26,30` | `bg-red-500`, `bg-amber-500`, `bg-blue-500` | `status.error`, `status.pending`, `info` |
| `IncidentList.tsx:33-42` | red/amber bg/badge patterns | `status.error`, `warning` variants |
| `SafetyActionPanel.tsx:77` | `text-amber-400 bg-amber-900/20` | dark mode `warning` variant |

---

## 7. Implementation Guide

### 7.1 CSS Variable Naming Convention

All CSS variables follow the pattern: `--{category}-{name}[-{variant}]`

```css
/* Categories */
--brand-*          /* Brand identity colors */
--chart-*          /* Data visualization */
--category-*       /* Query category badges */
--rank-*           /* Medal/ranking */
--grade-*          /* GEO Score grades */
--sentiment-*      /* Sentiment analysis */
--trend-*          /* Trend indicators */
--step-*           /* Step/wizard progress */
--status-*         /* Status indicators */
--gray-*           /* Neutral gray scale */

/* Existing (shadcn) */
--primary, --secondary, --destructive, --muted, --accent
--background, --foreground, --card, --popover, --border, --input, --ring
```

### 7.2 globals.css Structure

```css
@layer base {
  :root {
    /* === Existing shadcn tokens === */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    /* ... (keep all existing) ... */

    /* === NEW: Background variants === */
    --background-subtle: 0 0% 98%;

    /* === NEW: Gray scale (mapped from Tailwind slate) === */
    --gray-50: 210 40% 98%;
    --gray-100: 210 40% 96.1%;
    --gray-200: 214.3 31.8% 91.4%;
    --gray-300: 212.7 26.8% 83.9%;
    --gray-400: 215 20.2% 65.1%;
    --gray-500: 215.4 16.3% 46.9%;
    --gray-600: 215.3 19.3% 34.5%;
    --gray-700: 217.2 32.6% 17.5%;
    --gray-800: 222.2 47.4% 11.2%;
    --gray-900: 222.2 84% 4.9%;

    /* === NEW: Category badge tokens === */
    --category-introductory-bg: 213 97% 87%;
    --category-introductory-text: 226 71% 40%;
    --category-comparative-bg: 270 100% 95%;
    --category-comparative-text: 274 72% 47%;
    --category-critical-bg: 0 93% 94%;
    --category-critical-text: 0 63% 43%;

    /* === NEW: Rank tokens === */
    --rank-gold-from: 48 96% 53%;
    --rank-gold-to: 45 93% 47%;
    --rank-silver-from: 213 27% 84%;
    --rank-silver-to: 215 16% 47%;
    --rank-bronze-from: 38 92% 50%;
    --rank-bronze-to: 26 90% 37%;

    /* === NEW: Grade tokens === */
    --grade-a: 142 71% 45%;
    --grade-b: 217 91% 60%;
    --grade-c: 48 96% 53%;
    --grade-d: 25 95% 53%;
    --grade-f: 0 84% 60%;

    /* === NEW: Sentiment tokens === */
    --sentiment-positive: 142 71% 45%;
    --sentiment-neutral: 38 92% 50%;
    --sentiment-negative: 0 84% 60%;

    /* === NEW: Trend tokens === */
    --trend-up: 142 71% 45%;
    --trend-down: 0 84% 60%;

    /* === NEW: Step/wizard tokens === */
    --step-completed-bg: 141 85% 93%;
    --step-completed-text: 138 76% 30%;
    --step-completed-hover: 141 85% 86%;
    --step-completed-icon: 142 72% 39%;
    --step-completed-line: 142 71% 45%;

    /* === NEW: Status tokens === */
    --status-active: 142 71% 45%;
    --status-inactive: 215.4 16.3% 46.9%;
    --status-pending: 38 92% 50%;
    --status-error: 0 84% 60%;

    /* === NEW: Chart utility tokens === */
    --chart-grid: 220 13% 91%;
    --chart-axis-text: 220 9% 46%;
    --chart-fill-opacity: 0.6;
  }

  .dark {
    /* ... override tokens for dark mode ... */
    --background-subtle: 222.2 84% 7%;
    --gray-50: 222.2 84% 4.9%;
    --gray-100: 217.2 32.6% 17.5%;
    /* ... (invert gray scale) ... */

    /* Category, rank, grade, sentiment tokens may need adjustment for dark mode */
    /* For MVP: keep same values; refine in Phase 2 */
  }
}
```

### 7.3 Tailwind Config Structure

```typescript
// tailwind.config.ts - extend.colors additions
colors: {
  // ... existing tokens ...

  // Category badges
  category: {
    introductory: {
      DEFAULT: 'hsl(var(--category-introductory-bg))',
      text: 'hsl(var(--category-introductory-text))',
    },
    comparative: {
      DEFAULT: 'hsl(var(--category-comparative-bg))',
      text: 'hsl(var(--category-comparative-text))',
    },
    critical: {
      DEFAULT: 'hsl(var(--category-critical-bg))',
      text: 'hsl(var(--category-critical-text))',
    },
  },

  // Rank/medal
  rank: {
    'gold-from': 'hsl(var(--rank-gold-from))',
    'gold-to': 'hsl(var(--rank-gold-to))',
    'silver-from': 'hsl(var(--rank-silver-from))',
    'silver-to': 'hsl(var(--rank-silver-to))',
    'bronze-from': 'hsl(var(--rank-bronze-from))',
    'bronze-to': 'hsl(var(--rank-bronze-to))',
  },

  // Grade
  grade: {
    a: 'hsl(var(--grade-a))',
    b: 'hsl(var(--grade-b))',
    c: 'hsl(var(--grade-c))',
    d: 'hsl(var(--grade-d))',
    f: 'hsl(var(--grade-f))',
  },

  // Sentiment
  sentiment: {
    positive: 'hsl(var(--sentiment-positive))',
    neutral: 'hsl(var(--sentiment-neutral))',
    negative: 'hsl(var(--sentiment-negative))',
  },

  // Trend
  trend: {
    up: 'hsl(var(--trend-up))',
    down: 'hsl(var(--trend-down))',
  },

  // Step/wizard
  step: {
    completed: {
      DEFAULT: 'hsl(var(--step-completed-bg))',
      text: 'hsl(var(--step-completed-text))',
      hover: 'hsl(var(--step-completed-hover))',
      icon: 'hsl(var(--step-completed-icon))',
      line: 'hsl(var(--step-completed-line))',
    },
  },

  // Status
  status: {
    active: 'hsl(var(--status-active))',
    inactive: 'hsl(var(--status-inactive))',
    pending: 'hsl(var(--status-pending))',
    error: 'hsl(var(--status-error))',
  },

  // Chart utilities
  'chart-grid': 'hsl(var(--chart-grid))',
  'chart-axis': 'hsl(var(--chart-axis-text))',
}
```

### 7.4 Component Usage Patterns

**Pattern 1: Tailwind utility classes (preferred for static values)**

```tsx
// Before
<span className="bg-blue-100 text-blue-700">입문</span>

// After
<span className="bg-category-introductory text-category-introductory-text">입문</span>
```

**Pattern 2: CSS variables in JS (required for Recharts/SVG)**

```tsx
// Before
<Radar stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />

// After - use a helper to resolve CSS vars
import { getTokenColor } from '@/lib/design-tokens'

<Radar
  stroke={getTokenColor('--chart-4')}
  fill={getTokenColor('--chart-4')}
  fillOpacity={0.6}
/>
```

**Helper function** (`lib/design-tokens.ts`):

```typescript
/**
 * Resolve a CSS custom property to its computed HSL color string.
 * For use in Recharts/SVG where className is not supported.
 */
export function getTokenColor(variable: string): string {
  if (typeof window === 'undefined') {
    // SSR fallback map
    const fallbacks: Record<string, string> = {
      '--chart-1': '#E06820',
      '--chart-2': '#114BA3',
      '--chart-3': '#22c55e',
      '--chart-4': '#3B82F6',
      '--chart-5': '#8b5cf6',
      '--chart-6': '#eab308',
      '--chart-grid': '#e5e7eb',
      '--chart-axis-text': '#6b7280',
      '--brand-orange': '#E06820',
      '--brand-navy': '#114BA3',
      '--gray-200': '#E2E8F0',
      '--sentiment-positive': '#22c55e',
      '--sentiment-neutral': '#f59e0b',
      '--sentiment-negative': '#ef4444',
      '--grade-a': '#22c55e',
      '--grade-b': '#3B82F6',
      '--grade-c': '#eab308',
      '--grade-d': '#f97316',
      '--grade-f': '#ef4444',
    }
    return fallbacks[variable] ?? '#000000'
  }
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim()
  return value ? `hsl(${value})` : '#000000'
}

/**
 * Chart color palette array for iterating over series.
 */
export const CHART_COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--chart-6)',
] as const
```

**Pattern 3: Gradient tokens (SVG)**

```tsx
// Before
<linearGradient>
  <stop offset="0%" stopColor="#E06820" />
  <stop offset="100%" stopColor="#114BA3" />
</linearGradient>

// After
<linearGradient>
  <stop offset="0%" stopColor={getTokenColor('--brand-orange')} />
  <stop offset="100%" stopColor={getTokenColor('--brand-navy')} />
</linearGradient>
```

### 7.5 Migration Priority

| Priority | Scope | Files | Rationale |
|----------|-------|-------|-----------|
| P0 | CSS variables + Tailwind config | `globals.css`, `tailwind.config.ts` | Foundation - must be done first |
| P1 | Helper utility | `lib/design-tokens.ts` | Needed for chart components |
| P2 | Chart components | `CitationShareChart`, `GeoScoreChart`, `SentimentGauge` | Highest hex density |
| P3 | Analysis components | `CategoryBadge`, `AnalysisSteps`, `QueryItem` | Semantic color tokens |
| P4 | Dashboard components | `StatsCard`, `BrandRankingCard`, `DashboardHeader` | Trend/status tokens |
| P5 | Landing page | `BentoLanding.tsx` | Brand color consolidation |
| P6 | Auth & misc | `PasswordStrengthIndicator`, `EmailAvailability`, `QueryInput` | Small changes |
| P7 | Stitch dashboard | `RiskMetricCard`, `RiskTimeline`, `IncidentList`, `SafetyActionPanel` | Lower priority |

### 7.6 Validation Checklist

After tokenization, verify:

- [ ] No hex color values (`#XXXXXX`) remain in component files (except SVG `fill="none"` and `fill="white"`)
- [ ] No Tailwind color utility classes with raw color names (e.g., `text-green-500`) remain
- [ ] All chart colors resolve correctly at runtime
- [ ] Dark mode toggle works without visual regression
- [ ] Brand colors (#E06820, #114BA3) render identically
- [ ] CategoryBadge, AnalysisSteps, BrandRankingCard, GeoScoreChart look identical
- [ ] Landing page gradients render correctly
- [ ] No TypeScript compilation errors

---

## Appendix: Complete Token Count Summary

| Category | Token Count | CSS Variables |
|----------|-------------|---------------|
| Brand | 5 | 5 |
| Semantic (primary, destructive, etc.) | 14 | 14 |
| Surface/Neutral | 16 | 16 |
| Gray Scale | 10 | 10 |
| Chart | 11 | 11 |
| Status | 4 | 4 |
| Category | 3 (x2 bg+text) | 6 |
| Rank | 3 (x2 from+to) | 6 |
| Grade | 5 | 5 |
| Sentiment | 3 | 3 |
| Trend | 2 | 2 |
| Step/Progress | 5 | 5 |
| **Total** | **~81** | **~87** |
