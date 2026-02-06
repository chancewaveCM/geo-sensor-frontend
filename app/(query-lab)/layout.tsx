import { AppShell } from '@/components/layout/AppShell'

export default function QueryLabLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppShell showSidebar showHeader>
      {children}
    </AppShell>
  )
}
