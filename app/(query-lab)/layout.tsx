import { StitchSidebar } from '@/components/stitch/StitchSidebar'
import { StitchHeader } from '@/components/stitch/StitchHeader'

export default function QueryLabLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <StitchSidebar />
      <div className="md:pl-64">
        <StitchHeader
          title="쿼리 랩"
          breadcrumb={[{ label: 'Tools' }, { label: '쿼리 랩' }]}
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
