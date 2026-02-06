'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Minus, Medal } from 'lucide-react'

interface BrandRanking {
  rank: number
  brand: string
  score: number
  previousRank?: number
}

interface BrandRankingCardProps {
  rankings: BrandRanking[]
}

export function BrandRankingCard({ rankings }: BrandRankingCardProps) {
  const getPositionChange = (current: number, previous?: number) => {
    if (!previous || previous === current) return 0
    return previous - current
  }

  const getRankStyle = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-br from-rank-gold-from to-rank-gold-to text-white'
    if (rank === 2) return 'bg-gradient-to-br from-rank-silver-from to-rank-silver-to text-white'
    if (rank === 3) return 'bg-gradient-to-br from-rank-bronze-from to-rank-bronze-to text-white'
    return 'bg-muted text-muted-foreground'
  }

  return (
    <Card data-testid="brand-ranking" className="transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Medal className="h-5 w-5 text-primary" />
          Brand Rankings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {rankings.map((ranking) => {
            const positionChange = getPositionChange(ranking.rank, ranking.previousRank)
            return (
              <div
                key={ranking.rank}
                data-testid={`brand-entry-${ranking.rank}`}
                className="flex items-center gap-4 rounded-lg border bg-card p-4 transition-all duration-200 hover:bg-accent/50 hover:shadow-md"
              >
                {/* Rank Badge */}
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl font-bold shadow-md ${getRankStyle(
                    ranking.rank
                  )}`}
                >
                  {ranking.rank}
                </div>

                {/* Brand Info */}
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{ranking.brand}</p>
                  <p className="text-sm text-muted-foreground">
                    Score: <span className="font-medium text-primary">{ranking.score}</span>
                  </p>
                </div>

                {/* Position Change */}
                <div className="flex items-center gap-1">
                  {positionChange === 0 ? (
                    <Minus className="h-4 w-4 text-muted-foreground" />
                  ) : positionChange > 0 ? (
                    <>
                      <TrendingUp className="h-4 w-4 text-trend-up" />
                      <span className="text-sm font-medium text-trend-up">+{positionChange}</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-4 w-4 text-trend-down" />
                      <span className="text-sm font-medium text-trend-down">{positionChange}</span>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
