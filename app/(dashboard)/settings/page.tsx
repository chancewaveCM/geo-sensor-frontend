"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Building2, Loader2 } from "lucide-react"
import { ProfileList } from "@/components/settings/ProfileList"
import { ProfileModal } from "@/components/settings/ProfileModal"
import { getCompanyProfiles } from "@/lib/api/company-profiles"
import type { CompanyProfile } from "@/types/analysis"

export default function SettingsPage() {
  const [profiles, setProfiles] = useState<CompanyProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingProfile, setEditingProfile] = useState<CompanyProfile | null>(null)
  const [showInactive, setShowInactive] = useState(false)

  const fetchProfiles = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await getCompanyProfiles(showInactive)
      setProfiles(response.items)
    } catch (err) {
      setError("프로필을 불러오는데 실패했습니다")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProfiles()
  }, [showInactive])

  const handleCreateClick = () => {
    setEditingProfile(null)
    setShowModal(true)
  }

  const handleEditClick = (profile: CompanyProfile) => {
    setEditingProfile(profile)
    setShowModal(true)
  }

  const handleModalClose = () => {
    setShowModal(false)
    setEditingProfile(null)
  }

  const handleProfileSaved = () => {
    handleModalClose()
    fetchProfiles()
  }

  const handleProfileUpdated = () => {
    fetchProfiles()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">설정</h1>
        <p className="text-muted-foreground mt-1">
          기업 프로필과 계정 설정을 관리하세요
        </p>
      </div>

      <Tabs defaultValue="profiles" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profiles" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            기업 프로필
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profiles" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>기업 프로필 관리</CardTitle>
                <CardDescription>
                  분석에 사용할 기업 프로필을 관리합니다
                </CardDescription>
              </div>
              <Button onClick={handleCreateClick}>
                <Plus className="h-4 w-4 mr-2" />
                새 프로필 추가
              </Button>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span className="text-muted-foreground">로딩 중...</span>
                </div>
              ) : error ? (
                <div className="text-center py-8 text-destructive">
                  {error}
                  <Button variant="link" onClick={fetchProfiles} className="ml-2">
                    다시 시도
                  </Button>
                </div>
              ) : (
                <ProfileList
                  profiles={profiles}
                  onEdit={handleEditClick}
                  onUpdate={handleProfileUpdated}
                  showInactive={showInactive}
                  onShowInactiveChange={setShowInactive}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <ProfileModal
        open={showModal}
        onClose={handleModalClose}
        profile={editingProfile}
        onSaved={handleProfileSaved}
      />
    </div>
  )
}
