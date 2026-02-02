import { Sidebar } from '@/components/dashboard/Sidebar'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64">
        <DashboardHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
