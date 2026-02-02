export const mockStats = {
  totalProjects: 12,
  citationShare: 35.5,
  queriesAnalyzed: 1247,
  avgPosition: 2.3,
}

export const mockCitationData = [
  { brand: 'Samsung', share: 35.5, color: '#3B82F6' },
  { brand: 'Apple', share: 28.2, color: '#22C55E' },
  { brand: 'LG', share: 18.7, color: '#F59E0B' },
  { brand: 'Sony', share: 12.1, color: '#8B5CF6' },
  { brand: 'Others', share: 5.5, color: '#6B7280' },
]

export const mockBrandRankings = [
  { rank: 1, brand: 'Samsung', score: 89.5, previousRank: 2 },
  { rank: 2, brand: 'Apple', score: 85.2, previousRank: 1 },
  { rank: 3, brand: 'LG', score: 78.4, previousRank: 3 },
  { rank: 4, brand: 'Sony', score: 72.1, previousRank: 5 },
  { rank: 5, brand: 'Xiaomi', score: 68.9, previousRank: 4 },
]

export const mockGeoScore = {
  overall: 76,
  grade: 'B',
  dimensions: [
    { name: 'Clear Definition', score: 85 },
    { name: 'Structured Info', score: 72 },
    { name: 'Statistics', score: 68 },
    { name: 'Authority', score: 80 },
    { name: 'Summary', score: 75 },
  ],
}
