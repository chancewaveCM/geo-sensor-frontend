'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { get, put } from '@/lib/api-client'
import { Loader2 } from 'lucide-react'

interface Workspace {
  id: number
  name: string
  slug: string
}

export function WorkspaceGeneralForm() {
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    let cancelled = false
    const wsId = typeof window !== 'undefined'
      ? localStorage.getItem('current_workspace_id')
      : null

    if (!wsId) {
      setLoading(false)
      return
    }

    get<Workspace>(`/api/v1/workspaces/${wsId}`)
      .then((data) => {
        if (cancelled) return
        setWorkspace(data)
        setName(data.name)
      })
      .catch(() => {
        if (cancelled) return
        setMessage({ type: 'error', text: '워크스페이스 정보를 불러올 수 없습니다.' })
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const handleSave = async () => {
    if (!workspace) return
    setSaving(true)
    setMessage(null)
    try {
      const updated = await put<Workspace>(`/api/v1/workspaces/${workspace.id}`, { name })
      setWorkspace(updated)
      setMessage({ type: 'success', text: '워크스페이스가 업데이트되었습니다.' })
    } catch {
      setMessage({ type: 'error', text: '업데이트에 실패했습니다.' })
    } finally {
      setSaving(false)
    }
  }

  const wsId = typeof window !== 'undefined'
    ? localStorage.getItem('current_workspace_id')
    : null

  if (!wsId) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          워크스페이스를 선택해주세요.
        </CardContent>
      </Card>
    )
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
        <CardTitle>워크스페이스 일반</CardTitle>
        <CardDescription>워크스페이스의 기본 정보를 관리합니다.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="wsName">워크스페이스 이름</Label>
          <Input
            id="wsName"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>슬러그</Label>
          <Input value={workspace?.slug ?? ''} disabled />
          <p className="text-xs text-muted-foreground">슬러그는 자동 생성되며 변경할 수 없습니다.</p>
        </div>

        {message && (
          <p className={message.type === 'success' ? 'text-sm text-success' : 'text-sm text-destructive'}>
            {message.text}
          </p>
        )}

        <Button onClick={handleSave} disabled={saving || !name.trim()}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          저장
        </Button>
      </CardContent>
    </Card>
  )
}
