'use client'

import { Suspense } from 'react'
import { AnalysisPage } from '@/components/analysis/AnalysisPage'

export default function Page() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <AnalysisPage />
    </Suspense>
  )
}
