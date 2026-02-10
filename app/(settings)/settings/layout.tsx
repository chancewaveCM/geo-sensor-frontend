import { SettingsSidebar } from '@/components/settings/SettingsSidebar'

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-[calc(100vh-var(--header-height,64px))] gap-6 p-6">
      <SettingsSidebar />
      <main className="flex-1 max-w-3xl">{children}</main>
    </div>
  )
}
