"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ProfileForm } from "./ProfileForm"
import { createCompanyProfile, updateCompanyProfile } from "@/lib/api/company-profiles"
import type { CompanyProfile, CompanyProfileCreate } from "@/types/analysis"

interface ProfileModalProps {
  open: boolean
  onClose: () => void
  profile?: CompanyProfile | null
  onSaved: () => void
}

export function ProfileModal({ open, onClose, profile, onSaved }: ProfileModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEditing = !!profile

  const handleSubmit = async (data: CompanyProfileCreate) => {
    setIsLoading(true)
    setError(null)
    try {
      if (isEditing && profile) {
        await updateCompanyProfile(profile.id, data)
      } else {
        await createCompanyProfile(data)
      }
      onSaved()
    } catch (err) {
      setError(isEditing ? "프로필 수정에 실패했습니다" : "프로필 생성에 실패했습니다")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "기업 프로필 수정" : "새 기업 프로필"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "기업 프로필 정보를 수정합니다"
              : "분석에 사용할 새 기업 프로필을 등록합니다"}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <ProfileForm
          initialData={profile}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}
