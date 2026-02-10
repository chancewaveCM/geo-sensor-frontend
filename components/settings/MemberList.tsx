'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { get, del } from '@/lib/api-client'
import { Loader2, UserX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MemberRoleSelect } from './MemberRoleSelect'

interface Member {
  id: number
  user_id: number
  workspace_id: number
  role: string
  user: {
    id: number
    email: string
    full_name: string | null
  }
}

export function MemberList() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const wsId = localStorage.getItem('current_workspace_id') || '1'
    get<Member[]>(`/api/v1/workspaces/${wsId}/members`)
      .then(setMembers)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleRemove = async (memberId: number) => {
    if (!confirm('정말 이 멤버를 제거하시겠습니까?')) return
    const wsId = localStorage.getItem('current_workspace_id') || '1'
    try {
      await del(`/api/v1/workspaces/${wsId}/members/${memberId}`)
      setMembers((prev) => prev.filter((m) => m.id !== memberId))
    } catch {
      alert('멤버 제거에 실패했습니다.')
    }
  }

  const handleRoleChanged = (memberId: number, newRole: string) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
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
        <CardTitle>멤버 관리</CardTitle>
        <CardDescription>워크스페이스 멤버와 권한을 관리합니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium">
                  {(member.user.full_name || member.user.email)[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium">{member.user.full_name || member.user.email}</p>
                  <p className="text-xs text-muted-foreground">{member.user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MemberRoleSelect
                  memberId={member.id}
                  currentRole={member.role}
                  onRoleChanged={(role) => handleRoleChanged(member.id, role)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemove(member.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <UserX className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {members.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">멤버가 없습니다.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
