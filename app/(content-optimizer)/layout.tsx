import { AppShell } from '@/components/layout/AppShell'

export default function ContentOptimizerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AppShell>{children}</AppShell>
}
