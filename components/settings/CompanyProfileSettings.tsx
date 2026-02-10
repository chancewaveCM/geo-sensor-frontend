'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { get } from '@/lib/api-client'
import type { CompanyProfile } from '@/types/analysis'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { ProfileList } from './ProfileList'
import { ProfileModal } from './ProfileModal'

export function CompanyProfileSettings() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProfile, setSelectedProfile] = useState<CompanyProfile | null>(null)
  const [showInactive, setShowInactive] = useState(false)

  const { data: profiles = [], isLoading, refetch } = useQuery<CompanyProfile[]>({
    queryKey: ['company-profiles', showInactive],
    queryFn: () => get('/api/v1/company-profiles/'),
  })

  const filteredProfiles = showInactive
    ? profiles
    : profiles.filter(p => p.is_active)

  const handleEdit = (profile: CompanyProfile) => {
    setSelectedProfile(profile)
    setIsModalOpen(true)
  }

  const handleCreate = () => {
    setSelectedProfile(null)
    setIsModalOpen(true)
  }

  const handleClose = () => {
    setIsModalOpen(false)
    setSelectedProfile(null)
  }

  const handleSaved = () => {
    refetch()
    handleClose()
  }

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">로딩 중...</div>
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>저장된 기업 프로필</CardTitle>
              <CardDescription>분석에 사용할 수 있는 기업 프로필 목록입니다.</CardDescription>
            </div>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              새 프로필 추가
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ProfileList
            profiles={filteredProfiles}
            onEdit={handleEdit}
            onUpdate={() => refetch()}
            showInactive={showInactive}
            onShowInactiveChange={setShowInactive}
          />
        </CardContent>
      </Card>

      <ProfileModal
        open={isModalOpen}
        onClose={handleClose}
        profile={selectedProfile}
        onSaved={handleSaved}
      />
    </>
  )
}
