import { StitchSidebar } from '@/components/stitch/StitchSidebar'
import { StitchHeader } from '@/components/stitch/StitchHeader'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <StitchSidebar />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64">
        <StitchHeader
          title="대시보드"
          breadcrumb={[{ label: 'Overview' }, { label: '대시보드' }]}
          showTimeFilter={false}
        />
        <main className="p-6">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
