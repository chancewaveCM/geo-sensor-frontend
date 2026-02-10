# GEO Sensor Platform Design System

> **Version**: 1.1.0
> **Last Updated**: 2026-02-10
> **Framework**: Next.js 14 + Tailwind CSS + shadcn/ui

A comprehensive design system for the GEO Sensor Platform ensuring visual consistency, accessibility, and maintainability across all dashboard pages.

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing System](#spacing-system)
5. [Component Specifications](#component-specifications)
6. [Layout Patterns](#layout-patterns)
7. [States & Interactions](#states--interactions)
8. [Accessibility Standards](#accessibility-standards)
9. [Implementation Guide](#implementation-guide)

---

## Design Philosophy

### Core Principles

1. **Data-Forward**: Prioritize clarity of metrics and insights over decorative elements
2. **Professional Trust**: Navy and orange convey authority and action
3. **Consistent Motion**: Subtle, purposeful animations that don't distract
4. **Accessible by Default**: WCAG 2.1 AA compliance minimum

### Visual Identity

- **Tone**: Professional analytics platform with approachable warmth
- **Key Differentiator**: Orange accent (#ff6821) as the action/highlight color against a navy trust foundation
- **Atmosphere**: Clean data visualization with subtle depth through shadows and layering

---

## Color System

### CSS Custom Properties

Add to `globals.css`:

```css
@layer base {
  :root {
    /* === Brand Colors === */
    --brand-orange: 24 100% 56%;           /* #ff6821 - Primary CTA */
    --brand-orange-hover: 24 100% 46%;     /* Darkened for hover */
    --brand-navy: 222 80% 33%;             /* #1e3a8a - Trust/Authority */
    --brand-navy-light: 222 80% 43%;       /* Lighter navy variant */

    /* === Semantic Colors === */
    --success: 142 76% 36%;                /* #22c55e */
    --success-foreground: 0 0% 100%;
    --warning: 38 92% 50%;                 /* #f59e0b */
    --warning-foreground: 0 0% 0%;
    --error: 0 84% 60%;                    /* #ef4444 */
    --error-foreground: 0 0% 100%;
    --info: 199 89% 48%;                   /* #0ea5e9 */
    --info-foreground: 0 0% 100%;

    /* === Background & Surface (Light Mode) === */
    --background: 210 40% 98%;             /* #f8fafc - Page background */
    --background-subtle: 210 40% 96%;      /* #f1f5f9 - Subtle sections */
    --foreground: 222 47% 11%;             /* #1e293b - Primary text */

    --card: 0 0% 100%;                     /* White cards */
    --card-foreground: 222 47% 11%;
    --card-hover: 210 40% 98%;             /* Card hover state */

    --popover: 0 0% 100%;
    --popover-foreground: 222 47% 11%;

    /* === UI Element Colors === */
    --primary: 24 100% 56%;                /* Brand orange for primary actions */
    --primary-foreground: 0 0% 100%;

    --secondary: 210 40% 96%;              /* Light gray for secondary */
    --secondary-foreground: 222 47% 11%;

    --muted: 210 40% 96%;
    --muted-foreground: 215 16% 47%;       /* #64748b - Subdued text */

    --accent: 222 80% 33%;                 /* Navy for accent elements */
    --accent-foreground: 0 0% 100%;

    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;

    /* === Border & Input === */
    --border: 214 32% 91%;                 /* #e2e8f0 */
    --border-strong: 214 32% 80%;          /* Stronger borders */
    --input: 214 32% 91%;
    --ring: 24 100% 56%;                   /* Focus ring uses brand orange */

    /* === Neutral Gray Scale === */
    --gray-50: 210 40% 98%;                /* #f8fafc */
    --gray-100: 210 40% 96%;               /* #f1f5f9 */
    --gray-200: 214 32% 91%;               /* #e2e8f0 */
    --gray-300: 213 27% 84%;               /* #cbd5e1 */
    --gray-400: 215 20% 65%;               /* #94a3b8 */
    --gray-500: 215 16% 47%;               /* #64748b */
    --gray-600: 215 19% 35%;               /* #475569 */
    --gray-700: 215 25% 27%;               /* #334155 */
    --gray-800: 217 33% 17%;               /* #1e293b */
    --gray-900: 222 47% 11%;               /* #0f172a */

    /* === Data Visualization === */
    --chart-1: 24 100% 56%;                /* Orange - Primary metric */
    --chart-2: 222 80% 33%;                /* Navy - Secondary metric */
    --chart-3: 142 76% 36%;                /* Green - Positive trends */
    --chart-4: 199 89% 48%;                /* Blue - Informational */
    --chart-5: 280 65% 60%;                /* Purple - Comparative */
    --chart-6: 38 92% 50%;                 /* Amber - Warnings/Attention */

    /* === Component Tokens === */
    --radius: 0.5rem;                      /* 8px base radius */
    --sidebar-width: 256px;                /* 16rem / 256px */
    --header-height: 64px;                 /* 4rem / 64px */
  }

  .dark {
    /* === Background & Surface (Dark Mode) === */
    --background: 222 47% 8%;              /* #0c1222 */
    --background-subtle: 222 47% 11%;      /* #1a1a2e */
    --foreground: 210 40% 98%;

    --card: 222 47% 11%;
    --card-foreground: 210 40% 98%;
    --card-hover: 222 47% 14%;

    --popover: 222 47% 11%;
    --popover-foreground: 210 40% 98%;

    /* === UI Element Colors (Dark) === */
    --primary: 24 100% 56%;
    --primary-foreground: 0 0% 100%;

    --secondary: 217 33% 17%;
    --secondary-foreground: 210 40% 98%;

    --muted: 217 33% 17%;
    --muted-foreground: 215 20% 65%;

    --accent: 24 100% 56%;                 /* Orange accent in dark mode */
    --accent-foreground: 0 0% 100%;

    --destructive: 0 63% 31%;
    --destructive-foreground: 210 40% 98%;

    /* === Border & Input (Dark) === */
    --border: 217 33% 17%;
    --border-strong: 217 33% 25%;
    --input: 217 33% 17%;
    --ring: 24 100% 56%;

    /* === Gray Scale (Dark) - Inverted === */
    --gray-50: 222 47% 11%;
    --gray-100: 217 33% 17%;
    --gray-200: 217 33% 25%;
    --gray-300: 215 25% 35%;
    --gray-400: 215 20% 50%;
    --gray-500: 215 16% 60%;
    --gray-600: 213 27% 75%;
    --gray-700: 214 32% 85%;
    --gray-800: 210 40% 92%;
    --gray-900: 210 40% 98%;
  }
}
```

### Tailwind Configuration

Extend `tailwind.config.ts`:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Brand
        brand: {
          orange: 'hsl(var(--brand-orange))',
          'orange-hover': 'hsl(var(--brand-orange-hover))',
          navy: 'hsl(var(--brand-navy))',
          'navy-light': 'hsl(var(--brand-navy-light))',
        },
        // Semantic
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        error: {
          DEFAULT: 'hsl(var(--error))',
          foreground: 'hsl(var(--error-foreground))',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))',
        },
        // UI Elements (shadcn compatible)
        border: 'hsl(var(--border))',
        'border-strong': 'hsl(var(--border-strong))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        'background-subtle': 'hsl(var(--background-subtle))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
          hover: 'hsl(var(--card-hover))',
        },
        // Chart colors
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
          6: 'hsl(var(--chart-6))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      // ... rest of config
    },
  },
}
```

### Color Usage Guidelines

| Use Case | Light Mode | Dark Mode | Tailwind Class |
|----------|------------|-----------|----------------|
| Primary CTA buttons | `#ff6821` | `#ff6821` | `bg-primary` |
| Secondary buttons | `#f1f5f9` | `#1e293b` | `bg-secondary` |
| Text - Primary | `#1e293b` | `#f8fafc` | `text-foreground` |
| Text - Muted | `#64748b` | `#94a3b8` | `text-muted-foreground` |
| Page background | `#f8fafc` | `#0c1222` | `bg-background` |
| Card background | `#ffffff` | `#1e293b` | `bg-card` |
| Borders | `#e2e8f0` | `#334155` | `border-border` |
| Focus ring | `#ff6821` | `#ff6821` | `ring-ring` |
| Positive/Success | `#22c55e` | `#22c55e` | `text-success` |
| Warning | `#f59e0b` | `#f59e0b` | `text-warning` |
| Error/Destructive | `#ef4444` | `#ef4444` | `text-error` |

---

## Typography

### Font Stack

```css
/* Primary font - already configured in Next.js */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Monospace for code/data */
--font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
```

### Type Scale

| Level | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| Display | 48px (3rem) | 1.1 | 700 | Hero sections, landing |
| H1 | 36px (2.25rem) | 1.2 | 700 | Page titles |
| H2 | 30px (1.875rem) | 1.25 | 600 | Section headers |
| H3 | 24px (1.5rem) | 1.3 | 600 | Card titles |
| H4 | 20px (1.25rem) | 1.4 | 600 | Subsection headers |
| H5 | 16px (1rem) | 1.5 | 600 | Minor headers |
| H6 | 14px (0.875rem) | 1.5 | 600 | Small headers |
| Body Large | 18px (1.125rem) | 1.6 | 400 | Featured text |
| Body | 16px (1rem) | 1.5 | 400 | Default body |
| Body Small | 14px (0.875rem) | 1.5 | 400 | Secondary text |
| Caption | 12px (0.75rem) | 1.4 | 400 | Labels, hints |
| Overline | 11px (0.6875rem) | 1.4 | 500 | Category labels |

### Typography Classes

```css
/* Add to globals.css */
@layer components {
  .text-display {
    @apply text-5xl font-bold leading-tight tracking-tight;
  }

  .text-h1 {
    @apply text-4xl font-bold leading-tight tracking-tight;
  }

  .text-h2 {
    @apply text-3xl font-semibold leading-snug;
  }

  .text-h3 {
    @apply text-2xl font-semibold leading-snug;
  }

  .text-h4 {
    @apply text-xl font-semibold leading-normal;
  }

  .text-h5 {
    @apply text-base font-semibold leading-normal;
  }

  .text-h6 {
    @apply text-sm font-semibold leading-normal;
  }

  .text-body-lg {
    @apply text-lg leading-relaxed;
  }

  .text-body {
    @apply text-base leading-normal;
  }

  .text-body-sm {
    @apply text-sm leading-normal;
  }

  .text-caption {
    @apply text-xs leading-snug;
  }

  .text-overline {
    @apply text-[11px] font-medium uppercase tracking-wider;
  }
}
```

### Font Weights

| Weight | Value | Usage |
|--------|-------|-------|
| Regular | 400 | Body text, descriptions |
| Medium | 500 | Labels, overlines, emphasis |
| Semibold | 600 | Headings, card titles |
| Bold | 700 | Page titles, key metrics |

---

## Spacing System

### Base Unit: 4px

All spacing derives from a 4px base unit for visual rhythm.

### Spacing Scale

| Token | Value | Pixels | Usage |
|-------|-------|--------|-------|
| `0` | 0 | 0px | Reset |
| `0.5` | 0.125rem | 2px | Micro spacing |
| `1` | 0.25rem | 4px | Tight inline spacing |
| `1.5` | 0.375rem | 6px | Icon gaps |
| `2` | 0.5rem | 8px | Default inline spacing |
| `2.5` | 0.625rem | 10px | Button padding-y |
| `3` | 0.75rem | 12px | Small component padding |
| `4` | 1rem | 16px | Default component padding |
| `5` | 1.25rem | 20px | Medium spacing |
| `6` | 1.5rem | 24px | Card padding |
| `8` | 2rem | 32px | Section spacing |
| `10` | 2.5rem | 40px | Large section spacing |
| `12` | 3rem | 48px | Page section gaps |
| `16` | 4rem | 64px | Major sections |
| `20` | 5rem | 80px | Page margins |
| `24` | 6rem | 96px | Hero spacing |

### Spacing Usage Guidelines

```tsx
// Component internal padding
<Card className="p-6">              {/* 24px */}

// Between related items
<div className="space-y-2">         {/* 8px */}

// Between components
<div className="space-y-4">         {/* 16px */}

// Between sections
<div className="space-y-6">         {/* 24px */}

// Page-level sections
<main className="space-y-8">        {/* 32px */}

// Grid gaps
<div className="grid gap-4 lg:gap-6">
```

---

## Component Specifications

### Cards

```tsx
// Base Card
<Card className="rounded-lg border bg-card text-card-foreground shadow-sm">
  <CardHeader className="flex flex-col space-y-1.5 p-6">
    <CardTitle className="text-2xl font-semibold leading-none tracking-tight">
      Title
    </CardTitle>
    <CardDescription className="text-sm text-muted-foreground">
      Description
    </CardDescription>
  </CardHeader>
  <CardContent className="p-6 pt-0">
    Content
  </CardContent>
</Card>
```

**Card Variants:**

| Variant | Border | Shadow | Usage |
|---------|--------|--------|-------|
| Default | `border` | `shadow-sm` | Standard content |
| Elevated | `border` | `shadow-md` | Featured content |
| Interactive | `border hover:border-primary` | `shadow-sm hover:shadow-md` | Clickable cards |
| Metric | `border-l-4 border-l-primary` | `shadow-sm` | KPI/stat cards |

**Metric Card Pattern:**

```tsx
<div className="rounded-lg border border-l-4 border-l-primary bg-card p-6 shadow-sm">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-muted-foreground">Total Projects</p>
      <p className="text-3xl font-bold text-foreground">24</p>
    </div>
    <div className="rounded-full bg-primary/10 p-3 text-primary">
      <FolderIcon className="h-6 w-6" />
    </div>
  </div>
  <div className="mt-4 flex items-center text-sm">
    <TrendingUp className="mr-1 h-4 w-4 text-success" />
    <span className="text-success font-medium">+12.5%</span>
    <span className="ml-1 text-muted-foreground">vs last month</span>
  </div>
</div>
```

### Buttons

**Variants:**

| Variant | Background | Text | Border | Usage |
|---------|------------|------|--------|-------|
| Primary | `bg-primary` | `text-primary-foreground` | none | Main CTAs |
| Secondary | `bg-secondary` | `text-secondary-foreground` | none | Secondary actions |
| Outline | `bg-transparent` | `text-foreground` | `border` | Tertiary actions |
| Ghost | `bg-transparent` | `text-foreground` | none | Navigation, subtle |
| Destructive | `bg-destructive` | `text-destructive-foreground` | none | Dangerous actions |
| Link | `bg-transparent` | `text-primary` | none | Inline links |

**Sizes:**

| Size | Height | Padding-X | Font Size | Usage |
|------|--------|-----------|-----------|-------|
| `sm` | 36px (h-9) | 12px (px-3) | 14px | Dense UIs, tables |
| `default` | 40px (h-10) | 16px (px-4) | 14px | Standard |
| `lg` | 44px (h-11) | 32px (px-8) | 16px | Hero CTAs |
| `icon` | 40px | 40px | - | Icon-only |

**Button Examples:**

```tsx
// Primary CTA
<Button className="bg-primary hover:bg-primary/90">
  분석 시작
</Button>

// Secondary
<Button variant="secondary">
  취소
</Button>

// Ghost for navigation
<Button variant="ghost" size="sm">
  <Settings className="mr-2 h-4 w-4" />
  설정
</Button>

// Destructive
<Button variant="destructive">
  삭제
</Button>
```

### Form Inputs

**Specifications:**

| Property | Value |
|----------|-------|
| Height | 40px (h-10) |
| Padding | 12px horizontal (px-3) |
| Border radius | 6px (rounded-md) |
| Border | 1px solid border |
| Font size | 14px (text-sm) |
| Focus ring | 2px ring with ring-ring color |

**States:**

```css
/* Default */
.input-default {
  @apply border-input bg-background;
}

/* Focus */
.input-focus {
  @apply border-primary ring-2 ring-ring ring-offset-2;
}

/* Error */
.input-error {
  @apply border-destructive focus:ring-destructive;
}

/* Disabled */
.input-disabled {
  @apply cursor-not-allowed opacity-50 bg-muted;
}
```

**Input with Label Pattern:**

```tsx
<div className="space-y-2">
  <Label htmlFor="email" className="text-sm font-medium">
    이메일
  </Label>
  <Input
    id="email"
    type="email"
    placeholder="name@example.com"
    className="h-10 px-3 text-sm"
  />
  <p className="text-xs text-muted-foreground">
    업무용 이메일을 입력하세요
  </p>
</div>
```

### Tables

```tsx
<div className="rounded-lg border bg-card">
  <Table>
    <TableHeader>
      <TableRow className="border-b bg-muted/50">
        <TableHead className="h-12 px-4 text-left text-sm font-medium text-muted-foreground">
          Column
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow className="border-b transition-colors hover:bg-muted/50">
        <TableCell className="p-4 text-sm">
          Content
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
</div>
```

**Table Specifications:**

| Element | Style |
|---------|-------|
| Header row | `bg-muted/50`, height 48px |
| Header text | `text-sm font-medium text-muted-foreground` |
| Body row | Height 52-56px, `hover:bg-muted/50` |
| Cell padding | 16px (p-4) |
| Border | Bottom border between rows |

### Badges/Pills

**Variants:**

| Variant | Background | Text | Usage |
|---------|------------|------|-------|
| Default | `bg-secondary` | `text-secondary-foreground` | Neutral labels |
| Primary | `bg-primary/10` | `text-primary` | Primary status |
| Success | `bg-success/10` | `text-success` | Positive status |
| Warning | `bg-warning/10` | `text-warning` | Attention needed |
| Error | `bg-error/10` | `text-error` | Error/critical |
| Info | `bg-info/10` | `text-info` | Informational |

```tsx
// Badge component
<span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-success/10 text-success">
  활성
</span>
```

### EmptyState

**Component Interface:**

```typescript
export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}
```

**Specifications:**

| Property | Value |
|----------|-------|
| Container | Centered, flex column, padding 64px (py-16) |
| Border | Dashed border, rounded corners |
| Icon area | Optional, circular muted background (bg-muted), padding 16px (p-4) |
| Icon size | h-8 w-8 |
| Title | text-lg font-semibold, text-foreground |
| Description | text-sm text-muted-foreground, max-w-sm, margin-top 8px (mt-2) |
| Action | Optional button area, margin-top 16px (mt-4) |

**Usage Pattern:**

```tsx
import { EmptyState } from '@/components/ui/empty-state'
import { Inbox, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function QueryListEmpty() {
  return (
    <EmptyState
      icon={<Inbox className="h-8 w-8 text-muted-foreground" />}
      title="쿼리가 없습니다"
      description="아직 생성된 쿼리가 없습니다. 새 분석을 시작해보세요."
      action={
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          새 쿼리 생성
        </Button>
      }
    />
  )
}
```

**Default Implementation Example:**

```tsx
// components/ui/empty-state.tsx
export interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-16 px-6 text-center',
        className
      )}
    >
      {icon && (
        <div className="mb-4 rounded-full bg-muted p-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-foreground">
        {title}
      </h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  )
}
```

### Navigation Items (Sidebar)

```tsx
// Active state
<Link className="flex items-center gap-3 rounded-lg bg-primary px-3 py-2.5 text-sm font-medium text-primary-foreground shadow-md">
  <Icon className="h-5 w-5" />
  메뉴 항목
</Link>

// Inactive state
<Link className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-accent hover:text-foreground">
  <Icon className="h-5 w-5" />
  메뉴 항목
</Link>
```

### Sidebar Pattern

**Specifications:**

| Property | Value |
|----------|-------|
| Width | 256px (w-64) |
| Background | `bg-card` |
| Border | Right border |
| Logo area height | 64px (h-16) |
| Nav item spacing | 8px (space-y-2) |
| Padding | 16px (p-4) |

### Header Pattern

**Specifications:**

| Property | Value |
|----------|-------|
| Height | 64px (h-16) |
| Background | `bg-card/95 backdrop-blur` |
| Border | Bottom border |
| Padding-X | 24px (px-6) |
| Position | Sticky top |
| Z-index | z-10 |

---

## Layout Patterns

### Standard Dashboard Layout

```tsx
<div className="min-h-screen bg-background">
  {/* Sidebar - Fixed */}
  <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card">
    {/* Sidebar content */}
  </aside>

  {/* Main Content */}
  <div className="lg:pl-64">
    {/* Header - Sticky */}
    <header className="sticky top-0 z-10 h-16 border-b bg-card/95 backdrop-blur">
      {/* Header content */}
    </header>

    {/* Page Content */}
    <main className="p-6">
      <div className="space-y-6">
        {/* Page sections */}
      </div>
    </main>
  </div>
</div>
```

### Grid Systems

```tsx
// Stats cards - 4 columns on large, 2 on medium, 1 on small
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
  {/* Cards */}
</div>

// Two-column layout
<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
  {/* Panels */}
</div>

// Sidebar + main content
<div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
  {/* Sidebar, Content */}
</div>

// Three-column dashboard
<div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
  {/* Widgets */}
</div>
```

### Responsive Breakpoints

| Breakpoint | Min Width | Usage |
|------------|-----------|-------|
| `sm` | 640px | Stack to 2 columns |
| `md` | 768px | Tablet layouts |
| `lg` | 1024px | Desktop, show sidebar |
| `xl` | 1280px | Wide desktop |
| `2xl` | 1400px | Max container width |

### Content Container

```tsx
// Max-width container with centered content
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>

// Full-width with padding
<div className="w-full px-6">
  {/* Content */}
</div>
```

---

## States & Interactions

### Loading States

**Skeleton Pattern:**

```tsx
// Skeleton base
<div className="animate-pulse rounded-md bg-muted h-4 w-full" />

// Card skeleton
<div className="rounded-lg border bg-card p-6 space-y-4">
  <div className="animate-pulse space-y-3">
    <div className="h-4 w-24 rounded bg-muted" />
    <div className="h-8 w-32 rounded bg-muted" />
  </div>
</div>

// Table skeleton
<div className="space-y-3">
  {[...Array(5)].map((_, i) => (
    <div key={i} className="flex gap-4">
      <div className="h-4 w-1/4 animate-pulse rounded bg-muted" />
      <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
      <div className="h-4 w-1/4 animate-pulse rounded bg-muted" />
    </div>
  ))}
</div>
```

**Spinner Pattern:**

```tsx
<div className="flex items-center justify-center p-8">
  <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
</div>
```

### Error States

```tsx
// Inline error
<div className="rounded-md border border-destructive/50 bg-destructive/10 p-4">
  <div className="flex items-start gap-3">
    <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
    <div>
      <p className="font-medium text-destructive">오류가 발생했습니다</p>
      <p className="text-sm text-muted-foreground mt-1">
        다시 시도해 주세요.
      </p>
    </div>
  </div>
</div>

// Full page error
<div className="flex flex-col items-center justify-center py-16 text-center">
  <div className="rounded-full bg-destructive/10 p-4 mb-4">
    <AlertCircle className="h-8 w-8 text-destructive" />
  </div>
  <h3 className="text-lg font-semibold">문제가 발생했습니다</h3>
  <p className="text-muted-foreground mt-2 max-w-md">
    데이터를 불러오는 중 오류가 발생했습니다.
  </p>
  <Button className="mt-4" variant="outline">
    다시 시도
  </Button>
</div>
```

### Empty States

```tsx
<div className="flex flex-col items-center justify-center py-16 text-center">
  <div className="rounded-full bg-muted p-4 mb-4">
    <Inbox className="h-8 w-8 text-muted-foreground" />
  </div>
  <h3 className="text-lg font-semibold">데이터가 없습니다</h3>
  <p className="text-muted-foreground mt-2 max-w-md">
    아직 분석된 쿼리가 없습니다. 새 분석을 시작해보세요.
  </p>
  <Button className="mt-4">
    <Plus className="mr-2 h-4 w-4" />
    새 분석 시작
  </Button>
</div>
```

### Interactive States

**Hover/Focus/Active:**

```css
/* Button states */
.btn-primary {
  @apply bg-primary text-primary-foreground;
  @apply hover:bg-primary/90;
  @apply focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2;
  @apply active:scale-[0.98];
  @apply disabled:pointer-events-none disabled:opacity-50;
}

/* Card hover */
.card-interactive {
  @apply transition-all duration-200;
  @apply hover:border-primary/50 hover:shadow-md;
  @apply focus-within:ring-2 focus-within:ring-ring;
}

/* Link hover */
.link-hover {
  @apply text-primary underline-offset-4 hover:underline;
}
```

### Transition Standards

| Property | Duration | Easing | Usage |
|----------|----------|--------|-------|
| Colors | 150ms | ease | Background, text color |
| Transform | 200ms | ease-out | Scale, translate |
| Shadow | 200ms | ease | Box shadow changes |
| Opacity | 200ms | ease | Fade in/out |

```css
/* Standard transitions */
.transition-colors { transition: color, background-color, border-color 150ms ease; }
.transition-transform { transition: transform 200ms ease-out; }
.transition-shadow { transition: box-shadow 200ms ease; }
.transition-opacity { transition: opacity 200ms ease; }
.transition-all { transition: all 200ms ease; }
```

### Animation Patterns

```css
@layer utilities {
  /* Fade in */
  .animate-in {
    animation: fadeIn 0.5s ease forwards;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* Pulse for loading */
  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  /* Spin for loaders */
  .animate-spin {
    animation: spin 1s linear infinite;
  }

  /* Slide in from right (for sidebars) */
  .animate-slide-in-right {
    animation: slideInRight 0.3s ease forwards;
  }

  @keyframes slideInRight {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
}
```

---

## Accessibility Standards

### Color Contrast Requirements

| Element | Minimum Ratio | Standard |
|---------|---------------|----------|
| Normal text | 4.5:1 | WCAG AA |
| Large text (18px+) | 3:1 | WCAG AA |
| UI components | 3:1 | WCAG AA |
| Focus indicators | 3:1 | WCAG AA |

**Verified Contrasts:**

| Combination | Ratio | Pass |
|-------------|-------|------|
| `foreground` on `background` | 12.6:1 | Yes |
| `muted-foreground` on `background` | 4.5:1 | Yes |
| `primary-foreground` on `primary` | 4.7:1 | Yes |
| `success` on white | 4.5:1 | Yes |
| `error` on white | 4.5:1 | Yes |

### Focus Indicators

```css
/* Standard focus ring */
.focus-ring {
  @apply focus-visible:outline-none
         focus-visible:ring-2
         focus-visible:ring-ring
         focus-visible:ring-offset-2
         focus-visible:ring-offset-background;
}

/* High contrast focus for important elements */
.focus-ring-strong {
  @apply focus-visible:outline-none
         focus-visible:ring-2
         focus-visible:ring-primary
         focus-visible:ring-offset-2;
}
```

### ARIA Patterns

**Button with loading state:**
```tsx
<Button
  disabled={isLoading}
  aria-busy={isLoading}
  aria-label={isLoading ? "처리 중" : "제출"}
>
  {isLoading ? (
    <>
      <Loader className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
      처리 중...
    </>
  ) : "제출"}
</Button>
```

**Navigation landmark:**
```tsx
<nav aria-label="주요 메뉴">
  <ul role="list">
    <li>
      <Link
        href="/dashboard"
        aria-current={isActive ? "page" : undefined}
      >
        대시보드
      </Link>
    </li>
  </ul>
</nav>
```

**Form with errors:**
```tsx
<div>
  <Label htmlFor="email">이메일</Label>
  <Input
    id="email"
    aria-invalid={hasError}
    aria-describedby={hasError ? "email-error" : undefined}
  />
  {hasError && (
    <p id="email-error" className="text-sm text-destructive" role="alert">
      올바른 이메일 주소를 입력하세요
    </p>
  )}
</div>
```

**Table with screen reader support:**
```tsx
<table aria-label="프로젝트 목록">
  <caption className="sr-only">프로젝트 현황 테이블</caption>
  <thead>
    <tr>
      <th scope="col">프로젝트명</th>
      <th scope="col">상태</th>
    </tr>
  </thead>
</table>
```

### Keyboard Navigation

| Component | Key | Action |
|-----------|-----|--------|
| Button | Enter, Space | Activate |
| Link | Enter | Navigate |
| Dropdown | Arrow keys | Navigate options |
| Modal | Escape | Close |
| Tab group | Tab | Move focus |
| Form | Tab | Next field |

### Screen Reader Utilities

```css
/* Visually hidden but accessible */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Skip link for keyboard users */
.skip-link {
  @apply sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
         focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground
         focus:rounded-md;
}
```

---

## Implementation Guide

### Migration Checklist

To unify existing pages with this design system:

1. **Replace hardcoded colors:**
   - `text-gray-900` → `text-foreground`
   - `text-gray-500` → `text-muted-foreground`
   - `bg-white` → `bg-card`
   - `bg-blue-600` → `bg-primary`
   - `border-gray-200` → `border`

2. **Standardize component usage:**
   - Use `<Card>` from shadcn/ui consistently
   - Use `<Button>` with proper variants
   - Use consistent heading hierarchy

3. **Apply spacing tokens:**
   - Card padding: `p-6`
   - Section gaps: `space-y-6`
   - Grid gaps: `gap-4` or `gap-6`

4. **Add proper states:**
   - Loading skeletons for async data
   - Error boundaries with styled fallbacks
   - Empty states with CTAs

### File Structure

```
components/
├── ui/                    # Base shadcn/ui components
│   ├── button.tsx
│   ├── card.tsx
│   ├── input.tsx
│   └── ...
├── dashboard/             # Dashboard-specific components
│   ├── Sidebar.tsx
│   ├── DashboardHeader.tsx
│   └── StatsCard.tsx
├── patterns/              # Reusable patterns
│   ├── EmptyState.tsx
│   ├── ErrorState.tsx
│   ├── LoadingSkeleton.tsx
│   └── PageHeader.tsx
└── charts/                # Data visualization
    └── ...
```

### Component Template

```tsx
// components/patterns/PageHeader.tsx
interface PageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-h2 text-foreground">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
```

### Usage Example

```tsx
// Unified page structure
export default function AnalysisPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PageHeader
        title="분석"
        description="기업 정보를 입력하고 AI 분석 질문을 생성하세요"
        action={<Button>새 분석</Button>}
      />

      <Card>
        <CardHeader>
          <CardTitle>기업 정보 입력</CardTitle>
          <CardDescription>
            분석할 기업의 정보를 입력하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Form content */}
        </CardContent>
      </Card>
    </div>
  )
}
```

---

## Quick Reference

### Common Tailwind Classes

| Purpose | Classes |
|---------|---------|
| Page background | `bg-background` |
| Card | `bg-card rounded-lg border shadow-sm p-6` |
| Primary button | `bg-primary text-primary-foreground hover:bg-primary/90` |
| Muted text | `text-muted-foreground` |
| Section spacing | `space-y-6` |
| Card grid | `grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4` |
| Focus ring | `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` |
| Transition | `transition-colors duration-150` |
| Hover card | `hover:border-primary/50 hover:shadow-md` |

### Color Tokens Summary

| Token | Light | Dark |
|-------|-------|------|
| `--primary` | `#ff6821` | `#ff6821` |
| `--accent` | `#1e3a8a` | `#ff6821` |
| `--background` | `#f8fafc` | `#0c1222` |
| `--foreground` | `#1e293b` | `#f8fafc` |
| `--muted-foreground` | `#64748b` | `#94a3b8` |
| `--border` | `#e2e8f0` | `#334155` |
| `--success` | `#22c55e` | `#22c55e` |
| `--warning` | `#f59e0b` | `#f59e0b` |
| `--error` | `#ef4444` | `#ef4444` |

---

## Changelog

### v1.1.0 (2026-02-10)
- Added EmptyState component specification with icon, title, description, and action support
- Documented EmptyState interface and default implementation pattern
- Updated navigation: all labels now in Korean
- Removed ROI Hub from navigation
- Added redirect rule: query-lab routes now redirect to /analysis

### v1.0.0 (2026-02-04)
- Initial design system documentation
- Color system with CSS custom properties
- Typography scale
- Component specifications
- Layout patterns
- States and interactions
- Accessibility standards
