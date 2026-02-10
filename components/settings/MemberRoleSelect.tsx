'use client'

import { useState } from 'react'
import { patch } from '@/lib/api-client'
import { getSelectedWorkspaceId } from '@/lib/utils/workspace-selection'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface MemberRoleSelectProps {
  userId: number
  currentRole: 'admin' | 'user'
  onRoleChanged: (role: 'admin' | 'user') => void
}

export function MemberRoleSelect({
  userId,
  currentRole,
  onRoleChanged,
}: MemberRoleSelectProps) {
  const [saving, setSaving] = useState(false)

  const handleChange = async (newRole: 'admin' | 'user') => {
    const wsId = getSelectedWorkspaceId()
    if (!wsId) {
      alert('워크스페이스를 먼저 선택해주세요.')
      return
    }

    setSaving(true)
    try {
      await patch(`/api/v1/workspaces/${wsId}/members/${userId}`, { role: newRole })
      onRoleChanged(newRole)
    } catch {
      alert('역할 변경에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Select
      value={currentRole}
      onValueChange={(value) => handleChange(value as 'admin' | 'user')}
      disabled={saving}
    >
      <SelectTrigger className="w-28">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="admin">관리자</SelectItem>
        <SelectItem value="user">사용자</SelectItem>
      </SelectContent>
    </Select>
  )
}
