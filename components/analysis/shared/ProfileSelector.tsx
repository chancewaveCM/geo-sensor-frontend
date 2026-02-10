'use client'

import { useEffect, useState } from 'react'
import { Building2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/ui/empty-state'
import { get } from '@/lib/api-client'
import { cn } from '@/lib/utils'
import type { CompanyProfile } from '@/types/analysis'

interface ProfileSelectorProps {
  selectedProfileId: number | null
  onSelect: (profileId: number) => void
  className?: string
}

export function ProfileSelector({ selectedProfileId, onSelect, className }: ProfileSelectorProps) {
  const [profiles, setProfiles] = useState<CompanyProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchProfiles() {
      try {
        setLoading(true)
        setError(null)
        const data = await get<{ items: CompanyProfile[] }>('/api/v1/company-profiles/')
        setProfiles(data.items)
      } catch (err) {
        setError(err instanceof Error ? err.message : '프로필을 불러오는데 실패했습니다')
      } finally {
        setLoading(false)
      }
    }
    fetchProfiles()
  }, [])

  if (loading) {
    return <Skeleton className={cn('h-10 w-full', className)} />
  }

  if (error) {
    return (
      <div className={cn('text-sm text-destructive', className)}>
        에러: {error}
      </div>
    )
  }

  if (profiles.length === 0) {
    return (
      <div className={cn('rounded-lg border border-dashed p-8', className)}>
        <EmptyState
          icon={<Building2 className="h-6 w-6" />}
          title="프로필 없음"
          description="분석을 시작하려면 먼저 회사 프로필을 생성하세요"
        />
      </div>
    )
  }

  return (
    <Select
      value={selectedProfileId?.toString() || ''}
      onValueChange={(value) => onSelect(Number(value))}
    >
      <SelectTrigger className={cn('w-full', className)}>
        <SelectValue placeholder="회사 프로필 선택" />
      </SelectTrigger>
      <SelectContent>
        {profiles.map((profile) => (
          <SelectItem key={profile.id} value={profile.id.toString()}>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{profile.name}</span>
              <span className="text-sm text-muted-foreground">({profile.industry})</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
