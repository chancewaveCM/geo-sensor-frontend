'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AvatarUpload } from './AvatarUpload'
import { patch, get } from '@/lib/api-client'
import { Loader2 } from 'lucide-react'

interface UserProfile {
  id: number
  email: string
  full_name: string | null
  avatar_url: string | null
  is_active: boolean
}

export function UserProfileForm() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Fetch profile on mount
  useEffect(() => {
    let cancelled = false
    get<UserProfile>('/api/v1/auth/me')
      .then((data) => {
        if (cancelled) return
        setProfile(data)
        setFullName(data.full_name || '')
      })
      .catch(() => {
        if (cancelled) return
        setMessage({ type: 'error', text: '프로필을 불러올 수 없습니다.' })
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    try {
      const updated = await patch<UserProfile>('/api/v1/auth/me', { full_name: fullName })
      setProfile(updated)
      setMessage({ type: 'success', text: '프로필이 업데이트되었습니다.' })
    } catch {
      setMessage({ type: 'error', text: '프로필 업데이트에 실패했습니다.' })
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>내 프로필</CardTitle>
          <CardDescription>프로필 정보를 수정합니다.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <AvatarUpload
            currentUrl={profile?.avatar_url ?? null}
            onUploaded={(url) => setProfile((prev) => prev ? { ...prev, avatar_url: url } : prev)}
          />

          <div className="space-y-2">
            <Label htmlFor="email">이메일</Label>
            <Input id="email" value={profile?.email ?? ''} disabled />
            <p className="text-xs text-muted-foreground">이메일은 변경할 수 없습니다.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">이름</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="이름을 입력하세요"
            />
          </div>

          {message && (
            <p className={message.type === 'success' ? 'text-sm text-success' : 'text-sm text-destructive'}>
              {message.text}
            </p>
          )}

          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            저장
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
