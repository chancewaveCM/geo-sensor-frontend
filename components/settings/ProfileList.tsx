"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MoreVertical,
  Pencil,
  Power,
  PowerOff,
  Building2,
  Globe,
  Users,
  Loader2,
} from "lucide-react"
import { deactivateCompanyProfile, reactivateCompanyProfile } from "@/lib/api/company-profiles"
import type { CompanyProfile } from "@/types/analysis"

interface ProfileListProps {
  profiles: CompanyProfile[]
  onEdit: (profile: CompanyProfile) => void
  onUpdate: () => void
  showInactive: boolean
  onShowInactiveChange: (show: boolean) => void
}

export function ProfileList({
  profiles,
  onEdit,
  onUpdate,
  showInactive,
  onShowInactiveChange,
}: ProfileListProps) {
  const [loadingId, setLoadingId] = useState<number | null>(null)

  const handleDeactivate = async (profile: CompanyProfile) => {
    setLoadingId(profile.id)
    try {
      await deactivateCompanyProfile(profile.id)
      onUpdate()
    } catch (error) {
      console.error("Failed to deactivate profile:", error)
    } finally {
      setLoadingId(null)
    }
  }

  const handleReactivate = async (profile: CompanyProfile) => {
    setLoadingId(profile.id)
    try {
      await reactivateCompanyProfile(profile.id)
      onUpdate()
    } catch (error) {
      console.error("Failed to reactivate profile:", error)
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end space-x-2">
        <Switch
          id="show-inactive"
          checked={showInactive}
          onCheckedChange={onShowInactiveChange}
        />
        <Label htmlFor="show-inactive" className="text-sm text-muted-foreground">
          비활성 프로필 표시
        </Label>
      </div>

      {profiles.length === 0 ? (
        <div className="py-12 text-center">
          <Building2 className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-medium">프로필이 없습니다</h3>
          <p className="text-muted-foreground">
            {showInactive
              ? "표시할 프로필이 없습니다."
              : "활성 프로필이 없습니다. '비활성 프로필 표시'를 켜서 복구할 수 있습니다."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile) => (
            <Card key={profile.id} className={`relative ${!profile.is_active ? "opacity-60" : ""}`}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <CardTitle className="truncate text-lg">{profile.name}</CardTitle>
                    <CardDescription className="mt-1 flex items-center gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {profile.industry}
                      </Badge>
                      {!profile.is_active && (
                        <Badge variant="outline" className="text-xs">
                          비활성
                        </Badge>
                      )}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        {loadingId === profile.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <MoreVertical className="h-4 w-4" />
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(profile)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        수정
                      </DropdownMenuItem>
                      {profile.is_active ? (
                        <DropdownMenuItem onClick={() => handleDeactivate(profile)} className="text-destructive">
                          <PowerOff className="mr-2 h-4 w-4" />
                          비활성화
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handleReactivate(profile)}>
                          <Power className="mr-2 h-4 w-4" />
                          재활성화
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{profile.description}</p>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {profile.target_audience && (
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {profile.target_audience}
                    </span>
                  )}
                  {profile.website_url && (
                    <span className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      웹사이트
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
