'use client'

import { StatsCard } from '@/components/dashboard/StatsCard'
import { CitationShareChart } from '@/components/charts/CitationShareChart'
import { BrandRankingCard } from '@/components/charts/BrandRankingCard'
import { GeoScoreChart } from '@/components/charts/GeoScoreChart'
import {
  mockStats,
  mockCitationData,
  mockBrandRankings,
  mockGeoScore,
} from '@/lib/mock-data'
import { FolderKanban, TrendingUp, BarChart3, Target } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Projects"
          value={mockStats.totalProjects}
          trend={{ value: 12.5, isPositive: true }}
          icon={<FolderKanban className="h-6 w-6" />}
        />
        <StatsCard
          title="Citation Share"
          value={`${mockStats.citationShare}%`}
          trend={{ value: 8.2, isPositive: true }}
          icon={<TrendingUp className="h-6 w-6" />}
        />
        <StatsCard
          title="Queries Analyzed"
          value={mockStats.queriesAnalyzed.toLocaleString()}
          trend={{ value: 15.3, isPositive: true }}
          icon={<BarChart3 className="h-6 w-6" />}
        />
        <StatsCard
          title="Avg Position"
          value={mockStats.avgPosition.toFixed(1)}
          trend={{ value: 5.7, isPositive: false }}
          icon={<Target className="h-6 w-6" />}
        />
      </div>

      {/* Citation Share Charts */}
      <CitationShareChart data={mockCitationData} />

      {/* Bottom Row: Rankings and GEO Score */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <BrandRankingCard rankings={mockBrandRankings} />
        <GeoScoreChart data={mockGeoScore} />
      </div>
    </div>
  )
}
