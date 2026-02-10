'use client'

import { useState } from 'react'
import { patch } from '@/lib/api-client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface MemberRoleSelectProps {
  memberId: number
  currentRole: string
  onRoleChanged: (role: string) => void
}

export function MemberRoleSelect({ memberId, currentRole, onRoleChanged }: MemberRoleSelectProps) {
  const [saving, setSaving] = useState(false)

  const handleChange = async (newRole: string) => {
    setSaving(true)
    const wsId = localStorage.getItem('current_workspace_id') || '1'
    try {
      await patch(`/api/v1/workspaces/${wsId}/members/${memberId}`, { role: newRole })
      onRoleChanged(newRole)
    } catch {
      alert('역할 변경에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Select value={currentRole} onValueChange={handleChange} disabled={saving}>
      <SelectTrigger className="w-28">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="admin">관리자</SelectItem>
        <SelectItem value="member">멤버</SelectItem>
        <SelectItem value="viewer">뷰어</SelectItem>
      </SelectContent>
    </Select>
  )
}
