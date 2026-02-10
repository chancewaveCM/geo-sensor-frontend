import { CompanyProfileSettings } from '@/components/settings/CompanyProfileSettings'

export default function CompanyProfilesSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">기업 프로필</h2>
        <p className="text-sm text-muted-foreground">분석에 사용할 기업 프로필을 관리합니다.</p>
      </div>
      <CompanyProfileSettings />
    </div>
  )
}
