"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ProfileForm } from "@/components/settings/ProfileForm"
import { createCompanyProfile } from "@/lib/api/company-profiles"
import type { CompanyProfileCreate } from "@/types/analysis"
import { Building2 } from "lucide-react"

interface ProfileCheckModalProps {
  open: boolean
  onProfileCreated: () => void
}

export function ProfileCheckModal({ open, onProfileCreated }: ProfileCheckModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: CompanyProfileCreate) => {
    setIsLoading(true)
    setError(null)
    try {
      await createCompanyProfile(data)
      onProfileCreated()
    } catch (err) {
      setError("프로필 생성에 실패했습니다. 다시 시도해주세요.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        onInteractOutside={(e: Event) => e.preventDefault()}
        onEscapeKeyDown={(e: KeyboardEvent) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <DialogTitle>시작하기 전에</DialogTitle>
              <DialogDescription>
                분석을 시작하려면 먼저 기업 프로필을 등록해주세요
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <ProfileForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}
