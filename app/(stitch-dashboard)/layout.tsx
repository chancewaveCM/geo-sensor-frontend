import { AppShell } from '@/components/layout/AppShell'

export default function StitchDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AppShell>{children}</AppShell>
  )
}
