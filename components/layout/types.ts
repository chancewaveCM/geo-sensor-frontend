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

/** Sidebar display variants */
export type SidebarVariant = 'full' | 'compact' | 'none'

/** AppShell component props */
export interface AppShellProps {
  showSidebar?: boolean
  showHeader?: boolean
  headerVariant?: HeaderVariant
  sidebarVariant?: SidebarVariant
  breadcrumbs?: BreadcrumbItem[]
  title?: string
  showTimeFilter?: boolean
  onTimeRangeChange?: (range: TimeRange) => void
  requireProfileCheck?: boolean
  className?: string
  contentPadding?: string
  children: React.ReactNode
}

/** AppSidebar component props */
export interface AppSidebarProps {
  variant?: SidebarVariant
  isOpen: boolean
  onClose: () => void
  className?: string
}

/** AppHeader component props */
export interface AppHeaderProps {
  title?: string
  breadcrumbs?: BreadcrumbItem[]
  showTimeFilter?: boolean
  onTimeRangeChange?: (range: TimeRange) => void
  notificationCount?: number
  onMobileMenuToggle?: () => void
  variant?: HeaderVariant
}
