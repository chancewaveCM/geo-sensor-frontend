# AppShell Architecture Design

> Unified layout system for GEO Sensor frontend.
> Replaces 5 separate layout files and 4 sidebar/header components with a single composable AppShell.

---

## 1. AppShell Props Interface

```typescript
// components/layout/types.ts

/** Breadcrumb item for navigation trail */
export interface BreadcrumbItem {
  label: string
  href?: string
}

/** Navigation item for sidebar */
export interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

/** Grouped navigation section */
export interface NavSection {
  title?: string
  items: NavItem[]
}

/** Time range filter options */
export type TimeRange = '7d' | '30d' | '90d' | 'custom'

/** Header display variants */
export type HeaderVariant = 'default' | 'minimal' | 'none'

/**
 * 'default'  - Full header with breadcrumbs, time filter, notifications, user menu
 * 'minimal'  - Title + user menu only (no time filter, no breadcrumbs)
 * 'none'     - No header rendered
 */

/** Sidebar display variants */
export type SidebarVariant = 'full' | 'compact' | 'none'

/**
 * 'full'    - Full 256px sidebar with sections, user profile footer
 * 'compact' - Icon-only sidebar (future, not in MVP)
 * 'none'    - No sidebar rendered (auth pages, landing)
 */

/** AppShell component props */
export interface AppShellProps {
  /** Show/hide sidebar. Default: true */
  showSidebar?: boolean

  /** Show/hide header. Default: true */
  showHeader?: boolean

  /** Header display variant. Default: 'default' */
  headerVariant?: HeaderVariant

  /** Sidebar display variant. Default: 'full' */
  sidebarVariant?: SidebarVariant

  /** Breadcrumb trail displayed in header */
  breadcrumbs?: BreadcrumbItem[]

  /** Page title displayed in header */
  title?: string

  /** Show time range filter in header. Default: false */
  showTimeFilter?: boolean

  /** Callback when time range changes */
  onTimeRangeChange?: (range: TimeRange) => void

  /** Whether to wrap children in ProfileCheckProvider. Default: false */
  requireProfileCheck?: boolean

  /** Additional className for the main content area */
  className?: string

  /** Main content padding override. Default: 'p-6' */
  contentPadding?: string

  /** Page content */
  children: React.ReactNode
}
```

---

## 2. Route-to-AppShell Mapping Table

### Current Route Inventory

| Route Group | Route(s) | Current Layout File | Current Components |
|-------------|----------|--------------------|--------------------|
| `(dashboard)` | `/dashboard`, `/settings` | `(dashboard)/layout.tsx` | StitchSidebar + StitchHeader + ProfileCheckProvider |
| `(analysis)` | `/analysis` | `(analysis)/layout.tsx` | StitchSidebar + StitchHeader |
| `(query-lab)` | `/query-lab` | `(query-lab)/layout.tsx` | StitchSidebar + StitchHeader |
| `(stitch-dashboard)` | `/dashboard/strategic`, `/dashboard/brand-safety`, `/dashboard/pipeline`, `/dashboard/roi` | `(stitch-dashboard)/layout.tsx` | StitchSidebar + StitchHeader (client-side, dynamic title) |
| `(auth)` | `/login`, `/register` | `(auth)/layout.tsx` | No sidebar/header, decorative background |
| Root `/` | `/` (landing) | None (root layout only) | BentoLanding component, no shell |
| `/landing` | `/landing` | None | Redirect to `/` |

### Unified AppShell Configuration Per Route

| Route Group | showSidebar | showHeader | headerVariant | sidebarVariant | title | breadcrumbs | showTimeFilter | requireProfileCheck |
|-------------|-------------|------------|---------------|----------------|-------|-------------|----------------|---------------------|
| `(dashboard)` `/dashboard` | true | true | `'default'` | `'full'` | `'대시보드'` | `[{label:'Overview'}, {label:'대시보드'}]` | false | **true** |
| `(dashboard)` `/settings` | true | true | `'default'` | `'full'` | `'설정'` | `[{label:'Settings'}]` | false | **true** |
| `(analysis)` `/analysis` | true | true | `'default'` | `'full'` | `'분석'` | `[{label:'Tools'}, {label:'분석'}]` | false | false |
| `(query-lab)` `/query-lab` | true | true | `'default'` | `'full'` | `'쿼리 랩'` | `[{label:'Tools'}, {label:'쿼리 랩'}]` | false | false |
| `(stitch)` `/dashboard/strategic` | true | true | `'default'` | `'full'` | Dynamic (from titleMap) | auto-generated | false | false |
| `(stitch)` `/dashboard/brand-safety` | true | true | `'default'` | `'full'` | Dynamic | auto-generated | false | false |
| `(stitch)` `/dashboard/pipeline` | true | true | `'default'` | `'full'` | Dynamic | auto-generated | false | false |
| `(stitch)` `/dashboard/roi` | true | true | `'default'` | `'full'` | Dynamic | auto-generated | false | false |
| `(auth)` `/login`, `/register` | **false** | **false** | `'none'` | `'none'` | N/A | N/A | false | false |
| Root `/` (landing) | **false** | **false** | `'none'` | `'none'` | N/A | N/A | false | false |

### Simplification: Merge Route Groups

After migration, the 5 route groups can be consolidated:

| New Route Group | Contains | AppShell Config |
|-----------------|----------|-----------------|
| `(app)` | `/dashboard`, `/dashboard/*`, `/analysis`, `/query-lab`, `/settings` | Sidebar + Header (full) |
| `(auth)` | `/login`, `/register` | No shell (decorative bg) |
| Root `/` | Landing page | No shell |

This eliminates `(stitch-dashboard)`, `(query-lab)`, and `(analysis)` as separate groups since they all use the same sidebar+header pattern. The only difference is the title/breadcrumbs, which are now driven by page-level config or dynamic pathname matching.

---

## 3. Unified Sidebar Plan

### 3.1 Navigation Item Merge Analysis

**Original Sidebar.tsx (5 items, flat):**
| Item | href | Icon |
|------|------|------|
| 대시보드 | `/` | LayoutDashboard |
| 프로젝트 | `/projects` | FolderKanban |
| 쿼리 랩 | `/query-lab` | FlaskConical |
| 분석 | `/analysis` | Target |
| 설정 | `/settings` | Settings |

**StitchSidebar.tsx (10 items, 4 sections):**
| Section | Item | href | Icon | Badge |
|---------|------|------|------|-------|
| OVERVIEW | 홈 | `/` | Home | - |
| OVERVIEW | 대시보드 | `/dashboard` | LayoutDashboard | - |
| ANALYSIS | Strategic Analysis | `/dashboard/strategic` | BarChart3 | - |
| ANALYSIS | Brand Safety | `/dashboard/brand-safety` | Shield | - |
| ANALYSIS | Pipeline | `/dashboard/pipeline` | GitBranch | `'3'` |
| ANALYSIS | ROI Hub | `/dashboard/roi` | DollarSign | - |
| TOOLS | 분석 | `/analysis` | LineChart | - |
| TOOLS | 쿼리 랩 | `/query-lab` | FlaskConical | - |
| SETTINGS | 설정 | `/settings` | Settings | - |

### 3.2 Unified Navigation Structure

The StitchSidebar already supersedes the original Sidebar. The unified sidebar adopts the StitchSidebar's sectioned structure with minor adjustments:

```typescript
// components/layout/navigation.ts
import {
  Home, LayoutDashboard, BarChart3, Shield,
  GitBranch, DollarSign, LineChart, FlaskConical, Settings,
} from 'lucide-react'
import type { NavSection } from './types'

export const navigationSections: NavSection[] = [
  {
    title: 'OVERVIEW',
    items: [
      { title: '홈',       href: '/',          icon: Home },
      { title: '대시보드',  href: '/dashboard',  icon: LayoutDashboard },
    ],
  },
  {
    title: 'ANALYSIS',
    items: [
      { title: 'Strategic Analysis', href: '/dashboard/strategic',    icon: BarChart3 },
      { title: 'Brand Safety',      href: '/dashboard/brand-safety',  icon: Shield },
      { title: 'Pipeline',          href: '/dashboard/pipeline',      icon: GitBranch, badge: '3' },
      { title: 'ROI Hub',           href: '/dashboard/roi',           icon: DollarSign },
    ],
  },
  {
    title: 'TOOLS',
    items: [
      { title: '분석',     href: '/analysis',   icon: LineChart },
      { title: '쿼리 랩',  href: '/query-lab',   icon: FlaskConical },
    ],
  },
  {
    title: 'SETTINGS',
    items: [
      { title: '설정', href: '/settings', icon: Settings },
    ],
  },
]
```

**Deduplication notes:**
- Original `Sidebar.tsx`'s "프로젝트" (`/projects`) is removed -- no corresponding page exists.
- Original `Sidebar.tsx`'s root `/` mapped to "대시보드" while StitchSidebar maps `/` to "홈" -- use StitchSidebar's convention (Home = landing, Dashboard = `/dashboard`).
- Original `Sidebar.tsx` is fully superseded and can be deleted after migration.

### 3.3 Active Route Highlighting

```typescript
// Exact match for most routes
const isActive = pathname === item.href

// For dashboard sub-routes, also highlight parent
// e.g. /dashboard/strategic highlights both "대시보드" and "Strategic Analysis"
const isActiveOrChild = pathname === item.href || pathname.startsWith(item.href + '/')
```

Use `isActive` (exact) for leaf items. Use `isActiveOrChild` only if a parent-highlight behavior is desired (optional).

Active state styling (from StitchSidebar, adopted as canonical):
```
border-l-4 border-l-brand-orange bg-brand-orange/10 text-brand-orange
```

### 3.4 Mobile Responsive Strategy

**Breakpoint:** `md` (768px) -- below this, sidebar is hidden off-screen.

**Behavior:**
1. **Desktop (>=768px):** Sidebar fixed, always visible, `w-64` (256px). Main content offset with `md:pl-64`.
2. **Mobile (<768px):** Sidebar hidden (`-translate-x-full`). Hamburger button in header (top-left). Tap to slide in sidebar + overlay backdrop. Tap overlay or nav link to close.

**Implementation (from StitchSidebar, adopted):**
- Mobile toggle state managed via `useState` inside `AppSidebar`.
- Overlay: `fixed inset-0 bg-black/50` with `onClick={close}`.
- Transition: `transition-transform duration-300 ease-in-out`.
- Hamburger button: rendered inside `AppHeader` on mobile, triggers sidebar open via callback.

**Key change from current:** The hamburger button currently exists in BOTH StitchSidebar (as a fixed-position button) and StitchHeader. The unified AppShell moves it exclusively into the AppHeader component to avoid z-index conflicts and double-rendering.

```
Mobile layout:
+---------------------------+
| [=] Title        [N] [U]  |  <- AppHeader with hamburger
+---------------------------+
|                           |
|      Page Content         |
|                           |
+---------------------------+

Mobile with sidebar open:
+--------+------------------+
|        |  (overlay)       |
| Sidebar|  (darkened)      |
|  w-64  |                  |
|        |                  |
+--------+------------------+
```

### 3.5 User Profile Footer

Adopted from StitchSidebar. Shows user avatar (gradient), name, and role at sidebar bottom. In the unified version, these values will come from auth context rather than hardcoded strings.

---

## 4. Unified Header Plan

### 4.1 Merge Analysis

**DashboardHeader.tsx (simple):**
- Gradient title text
- Subtitle "다시 오신 것을 환영합니다!"
- Notifications bell (hardcoded count: 3)
- User profile button (hardcoded "데모 사용자")
- No breadcrumbs, no time filter, no dropdown menu

**StitchHeader.tsx (full-featured):**
- Breadcrumb navigation
- Dynamic title
- Time range filter (7D/30D/90D/Custom)
- Notifications bell (configurable count)
- User dropdown menu (profile, settings, logout) via DropdownMenu
- Mobile menu button
- Props: title, breadcrumb, showTimeFilter, onTimeRangeChange, onMobileMenuClick, notificationCount, userName, userRole

### 4.2 Unified AppHeader

The StitchHeader is the canonical version. DashboardHeader is deprecated.

```typescript
// components/layout/AppHeader.tsx

interface AppHeaderProps {
  /** Page title */
  title?: string

  /** Breadcrumb trail */
  breadcrumbs?: BreadcrumbItem[]

  /** Show time range filter. Default: false */
  showTimeFilter?: boolean

  /** Time range change callback */
  onTimeRangeChange?: (range: TimeRange) => void

  /** Notification count badge */
  notificationCount?: number

  /** Mobile sidebar toggle callback */
  onMobileMenuToggle?: () => void

  /** Header variant */
  variant?: HeaderVariant
}
```

**Variant behavior:**

| Variant | Breadcrumbs | Time Filter | Notifications | User Menu | Title |
|---------|-------------|-------------|---------------|-----------|-------|
| `'default'` | Yes | Optional | Yes | Yes | Yes |
| `'minimal'` | No | No | Yes | Yes | Yes |
| `'none'` | N/A (not rendered) | N/A | N/A | N/A | N/A |

**Sticky behavior:** `sticky top-0 z-10` with `backdrop-blur-md` (from StitchHeader).

**Breadcrumb system:**
```typescript
// Auto-generated from pathname when not explicitly provided
function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = []

  const labelMap: Record<string, string> = {
    'dashboard': 'Overview',
    'strategic': 'Strategic Analysis',
    'brand-safety': 'Brand Safety',
    'pipeline': 'Pipeline',
    'roi': 'ROI Hub',
    'analysis': 'Tools',
    'query-lab': 'Tools',
    'settings': 'Settings',
  }

  // Build breadcrumb trail from path segments
  let currentPath = ''
  for (const segment of segments) {
    currentPath += `/${segment}`
    breadcrumbs.push({
      label: labelMap[segment] || segment,
      href: currentPath,
    })
  }

  return breadcrumbs
}
```

### 4.3 Right-side Actions

Unified action bar (from StitchHeader):
1. **Time filter** (optional, segmented buttons: 7D | 30D | 90D | Custom)
2. **Notifications bell** with badge count
3. **User dropdown menu** (DropdownMenu from shadcn/ui):
   - Profile link
   - Settings link
   - Separator
   - Logout (destructive)

---

## 5. Responsive Breakpoint Strategy

### 5.1 Current Inconsistency

| Component | Mobile breakpoint | Desktop sidebar offset |
|-----------|------------------|----------------------|
| Sidebar.tsx | `lg` (1024px) | `lg:translate-x-0` |
| StitchSidebar.tsx | `md` (768px) | `md:translate-x-0` |
| (dashboard) layout | - | `md:pl-64` |
| (stitch-dashboard) layout | - | `md:ml-64` |
| (analysis) layout | - | `md:pl-64` |
| StitchHeader mobile button | `md:hidden` | - |
| DashboardHeader | No mobile handling | - |

**Issues:**
1. Original Sidebar uses `lg` while StitchSidebar uses `md` -- inconsistent breakpoint.
2. Dashboard layout uses `pl-64` while stitch-dashboard uses `ml-64` -- different offset approach.
3. `(stitch-dashboard)` uses `p-4 md:p-6` while others use `p-6` only.

### 5.2 Unified Breakpoint System

Adopt a three-tier system aligned with Tailwind defaults:

| Tier | Breakpoint | Name | Sidebar behavior |
|------|-----------|------|------------------|
| Mobile | `< 768px` (`md`) | `mobile` | Hidden, hamburger menu |
| Tablet | `768px - 1023px` (`md` to `lg`) | `tablet` | Full sidebar visible |
| Desktop | `>= 1024px` (`lg`) | `desktop` | Full sidebar visible |

**Decision:** Use `md` (768px) as the sidebar visibility breakpoint. This matches StitchSidebar (the canonical component) and is the standard for dashboard-style applications.

### 5.3 Spacing Rules

| Area | Mobile (<768px) | Tablet/Desktop (>=768px) |
|------|----------------|--------------------------|
| Main content padding | `p-4` | `p-6` |
| Main content left offset | `pl-0` | `pl-64` (256px, sidebar width) |
| Header horizontal padding | `px-4` | `px-8` |
| Sidebar width | `w-64` (when open) | `w-64` (always) |
| Header height | `h-16` (64px) | `h-16` (64px) |

Use `pl-64` (padding-left) consistently instead of `ml-64` (margin-left) to avoid content width calculation issues.

### 5.4 Tailwind Config Additions

The existing tailwind config already has `sidebar: '256px'` and `header: '64px'` spacing tokens. These should be used:

```html
<!-- Instead of hardcoded values -->
<div class="md:pl-sidebar">  <!-- md:pl-[256px] -->
<header class="h-header">    <!-- h-[64px] -->
```

---

## 6. File Structure

```
components/layout/
├── AppShell.tsx           # Main shell: composes sidebar + header + content area
├── AppSidebar.tsx         # Unified sidebar (replaces Sidebar.tsx + StitchSidebar.tsx)
├── AppHeader.tsx          # Unified header (replaces DashboardHeader.tsx + StitchHeader.tsx)
├── Breadcrumbs.tsx        # Breadcrumb navigation component
├── navigation.ts          # Navigation sections data (NavSection[])
└── types.ts               # Shared types (AppShellProps, NavItem, NavSection, etc.)
```

### Component Hierarchy

```
RootLayout (app/layout.tsx)
  └── Providers
        └── AppShell (per route group layout)
              ├── AppSidebar (when showSidebar=true)
              │     ├── Logo
              │     ├── NavSections
              │     │     └── NavItem (with active state)
              │     └── UserProfile footer
              │
              ├── AppHeader (when showHeader=true)
              │     ├── MobileMenuButton (md:hidden)
              │     ├── Breadcrumbs
              │     ├── Title
              │     ├── TimeFilter (optional)
              │     ├── NotificationBell
              │     └── UserDropdownMenu
              │
              └── <main> content area
                    └── {children}
```

### Component Responsibilities

| Component | Responsibility |
|-----------|---------------|
| `AppShell` | Composes sidebar + header based on variant props. Manages mobile sidebar state. Wraps with ProfileCheckProvider when needed. |
| `AppSidebar` | Renders navigation sections, logo, user profile. Receives `isOpen` and `onClose` for mobile. No internal toggle state. |
| `AppHeader` | Renders breadcrumbs, title, actions. Receives `onMobileMenuToggle` callback. |
| `Breadcrumbs` | Pure presentational. Renders breadcrumb trail from `BreadcrumbItem[]`. |
| `navigation.ts` | Static data file. Exports `navigationSections: NavSection[]`. |
| `types.ts` | All shared TypeScript interfaces and types. |

### Key Design Decisions

1. **Mobile sidebar state lives in AppShell** (not AppSidebar). AppShell passes `isOpen`/`onClose` down to AppSidebar and `onMobileMenuToggle` up to AppHeader. This eliminates the current dual-button problem.

2. **AppShell is a client component** (`'use client'`) because it manages mobile sidebar state. AppSidebar and AppHeader are also client components (navigation highlighting, dropdown state).

3. **Route group layouts become thin wrappers:**
   ```tsx
   // app/(app)/layout.tsx
   export default function AppLayout({ children }: { children: React.ReactNode }) {
     return (
       <AppShell showSidebar showHeader>
         {children}
       </AppShell>
     )
   }
   ```

4. **Page-level title/breadcrumbs** are derived from pathname in AppShell (using a route config map), not passed as layout props. This avoids prop-drilling through route groups.

---

## 7. Migration Checklist

### Phase 1: Create New Components (Non-breaking)

- [ ] **1.1** Create `components/layout/types.ts` with all type definitions
- [ ] **1.2** Create `components/layout/navigation.ts` with unified nav sections
- [ ] **1.3** Create `components/layout/Breadcrumbs.tsx` extracted from StitchHeader
- [ ] **1.4** Create `components/layout/AppHeader.tsx` based on StitchHeader
  - Copy StitchHeader logic
  - Accept variant prop
  - Remove mobile hamburger from StitchSidebar, add to AppHeader
  - Import Breadcrumbs component
- [ ] **1.5** Create `components/layout/AppSidebar.tsx` based on StitchSidebar
  - Copy StitchSidebar logic
  - Remove internal mobile toggle state (receive as props)
  - Remove fixed-position mobile hamburger button
  - Import navigation from `navigation.ts`
- [ ] **1.6** Create `components/layout/AppShell.tsx`
  - Compose AppSidebar + AppHeader
  - Manage mobile sidebar state
  - Apply variant-based rendering
  - Conditionally wrap with ProfileCheckProvider

### Phase 2: Migrate Route Groups (One at a time)

- [ ] **2.1** Migrate `(analysis)/layout.tsx`
  - Replace StitchSidebar + StitchHeader with `<AppShell>`
  - Verify `/analysis` page renders correctly
  - Test mobile sidebar toggle

- [ ] **2.2** Migrate `(query-lab)/layout.tsx`
  - Replace StitchSidebar + StitchHeader with `<AppShell>`
  - Verify `/query-lab` page renders correctly

- [ ] **2.3** Migrate `(dashboard)/layout.tsx`
  - Replace StitchSidebar + StitchHeader + ProfileCheckProvider with `<AppShell requireProfileCheck>`
  - Verify `/dashboard` and `/settings` pages render correctly

- [ ] **2.4** Migrate `(stitch-dashboard)/layout.tsx`
  - Replace client-side StitchSidebar + StitchHeader with `<AppShell>`
  - Move dynamic title logic into AppShell's route config
  - Preserve auth redirect logic (move to middleware or keep in layout)
  - Verify all 4 sub-pages render correctly

- [ ] **2.5** Verify `(auth)/layout.tsx`
  - Auth layout does NOT use AppShell (no sidebar/header)
  - Keep decorative background as-is
  - No changes needed

- [ ] **2.6** Verify root `/` (landing)
  - Landing page does NOT use AppShell
  - No changes needed

### Phase 3: Consolidate Route Groups

- [ ] **3.1** Merge `(dashboard)`, `(analysis)`, `(query-lab)`, `(stitch-dashboard)` into single `(app)` group
  - Move all page directories under `(app)/`
  - Single `(app)/layout.tsx` with `<AppShell>`
  - Remove old layout files

- [ ] **3.2** Update any internal links/redirects if route paths changed

### Phase 4: Cleanup

- [ ] **4.1** Delete `components/dashboard/Sidebar.tsx` (superseded by AppSidebar)
- [ ] **4.2** Delete `components/dashboard/DashboardHeader.tsx` (superseded by AppHeader)
- [ ] **4.3** Delete `components/stitch/StitchSidebar.tsx` (superseded by AppSidebar)
- [ ] **4.4** Delete `components/stitch/StitchHeader.tsx` (superseded by AppHeader)
- [ ] **4.5** Delete `components/stitch/index.ts` (no longer needed)
- [ ] **4.6** Remove any unused imports across the codebase

### Phase 5: Verification

- [ ] **5.1** All pages render with correct sidebar/header configuration
- [ ] **5.2** Mobile sidebar toggle works on all pages
- [ ] **5.3** Active route highlighting works for all nav items
- [ ] **5.4** Breadcrumbs display correctly per route
- [ ] **5.5** ProfileCheckProvider fires on dashboard routes only
- [ ] **5.6** Auth redirect works on stitch-dashboard routes
- [ ] **5.7** Auth pages show no sidebar/header
- [ ] **5.8** Landing page shows no sidebar/header
- [ ] **5.9** No TypeScript errors (`pnpm tsc --noEmit`)
- [ ] **5.10** E2E tests pass (`pnpm test:e2e`)

---

## 8. AppShell Pseudocode

```tsx
// components/layout/AppShell.tsx
'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { AppSidebar } from './AppSidebar'
import { AppHeader } from './AppHeader'
import { ProfileCheckProvider } from '@/components/profile/ProfileCheckProvider'
import { cn } from '@/lib/utils'
import type { AppShellProps } from './types'

// Route-based configuration for title and breadcrumbs
const routeConfig: Record<string, { title: string; breadcrumbs: BreadcrumbItem[] }> = {
  '/dashboard':            { title: '대시보드',                              breadcrumbs: [{ label: 'Overview' }, { label: '대시보드' }] },
  '/dashboard/strategic':  { title: 'Strategic GEO Performance Analysis',   breadcrumbs: [{ label: 'Analysis' }, { label: 'Strategic' }] },
  '/dashboard/brand-safety': { title: 'Brand Safety & Risk Control Center', breadcrumbs: [{ label: 'Analysis' }, { label: 'Brand Safety' }] },
  '/dashboard/pipeline':   { title: 'Global GEO Pipeline & Approval Workflow', breadcrumbs: [{ label: 'Analysis' }, { label: 'Pipeline' }] },
  '/dashboard/roi':        { title: 'Enterprise ROI & Settlement Hub',      breadcrumbs: [{ label: 'Analysis' }, { label: 'ROI Hub' }] },
  '/analysis':             { title: '분석',                                 breadcrumbs: [{ label: 'Tools' }, { label: '분석' }] },
  '/query-lab':            { title: '쿼리 랩',                              breadcrumbs: [{ label: 'Tools' }, { label: '쿼리 랩' }] },
  '/settings':             { title: '설정',                                 breadcrumbs: [{ label: 'Settings' }] },
}

export function AppShell({
  showSidebar = true,
  showHeader = true,
  headerVariant = 'default',
  sidebarVariant = 'full',
  title,
  breadcrumbs,
  showTimeFilter = false,
  onTimeRangeChange,
  requireProfileCheck = false,
  className,
  contentPadding = 'p-4 md:p-6',
  children,
}: AppShellProps) {
  const pathname = usePathname()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // Resolve title and breadcrumbs from route config if not explicitly provided
  const config = routeConfig[pathname]
  const resolvedTitle = title ?? config?.title ?? 'GEO Sensor'
  const resolvedBreadcrumbs = breadcrumbs ?? config?.breadcrumbs ?? []

  const content = (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      {showSidebar && sidebarVariant !== 'none' && (
        <AppSidebar
          variant={sidebarVariant}
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className={cn(
        'flex-1',
        showSidebar && sidebarVariant !== 'none' && 'md:pl-sidebar'
      )}>
        {/* Header */}
        {showHeader && headerVariant !== 'none' && (
          <AppHeader
            variant={headerVariant}
            title={resolvedTitle}
            breadcrumbs={resolvedBreadcrumbs}
            showTimeFilter={showTimeFilter}
            onTimeRangeChange={onTimeRangeChange}
            onMobileMenuToggle={() => setIsMobileSidebarOpen(prev => !prev)}
          />
        )}

        {/* Page Content */}
        <main className={cn(contentPadding, className)}>
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  )

  // Conditionally wrap with ProfileCheckProvider
  if (requireProfileCheck) {
    return <ProfileCheckProvider>{content}</ProfileCheckProvider>
  }

  return content
}
```

---

## 9. Summary of Eliminated Duplication

| Before (Current) | After (Unified) |
|-------------------|-----------------|
| 5 layout files with duplicated sidebar+header patterns | 1 AppShell component + thin route layouts |
| 2 sidebar components (Sidebar.tsx, StitchSidebar.tsx) | 1 AppSidebar component |
| 2 header components (DashboardHeader.tsx, StitchHeader.tsx) | 1 AppHeader component |
| Inconsistent breakpoints (lg vs md) | Consistent md breakpoint |
| Inconsistent offsets (pl-64 vs ml-64) | Consistent pl-sidebar token |
| Inconsistent padding (p-6 vs p-4 md:p-6) | Consistent p-4 md:p-6 |
| Dual mobile hamburger buttons (sidebar + header) | Single hamburger in AppHeader |
| Hardcoded user info | Centralized, ready for auth context |
| 4 separate route groups for same shell | 1 `(app)` route group |
