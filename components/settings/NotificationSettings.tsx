'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { get, patch } from '@/lib/api-client'
import { Loader2 } from 'lucide-react'

interface NotificationPrefs {
  email_reports: boolean
  pipeline_complete: boolean
  weekly_digest: boolean
  marketing: boolean
}

const defaultPrefs: NotificationPrefs = {
  email_reports: true,
  pipeline_complete: true,
  weekly_digest: false,
  marketing: false,
}

const notificationOptions = [
  { key: 'email_reports' as const, label: '분석 리포트 이메일', description: '분석 완료 시 이메일로 리포트를 보냅니다.' },
  { key: 'pipeline_complete' as const, label: '파이프라인 완료 알림', description: '파이프라인 실행이 완료되면 알림을 보냅니다.' },
  { key: 'weekly_digest' as const, label: '주간 요약', description: '매주 월요일 주간 분석 요약을 보냅니다.' },
  { key: 'marketing' as const, label: '마케팅 소식', description: '새로운 기능 및 업데이트 소식을 받습니다.' },
]

interface UserMeResponse {
  notification_preferences: NotificationPrefs | null
}

export function NotificationSettings() {
  const [prefs, setPrefs] = useState<NotificationPrefs>(defaultPrefs)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    get<UserMeResponse>('/api/v1/auth/me')
      .then((data) => {
        if (cancelled) return
        if (data.notification_preferences) {
          setPrefs({ ...defaultPrefs, ...data.notification_preferences })
        }
      })
      .catch(() => {
        if (cancelled) return
        setError('알림 설정을 불러올 수 없습니다.')
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const handleToggle = async (key: keyof NotificationPrefs) => {
    const previousValue = prefs[key]
    const newPrefs = { ...prefs, [key]: !prefs[key] }
    setPrefs(newPrefs)
    setSaving(true)

    try {
      await patch('/api/v1/auth/me', {
        notification_preferences: JSON.stringify(newPrefs),
      })
    } catch {
      // Rollback using captured previous value
      setPrefs((current) => ({ ...current, [key]: previousValue }))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>알림 설정</CardTitle>
        <CardDescription>알림 및 이메일 수신 설정을 관리합니다.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <p className="text-sm text-destructive text-center py-4">{error}</p>
        )}
        {notificationOptions.map(({ key, label, description }) => (
          <div key={key} className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{label}</Label>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
            <Switch
              checked={prefs[key]}
              onCheckedChange={() => handleToggle(key)}
              disabled={saving}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
