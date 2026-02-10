'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { del } from '@/lib/api-client'
import { AlertTriangle, Loader2 } from 'lucide-react'

export function AccountDangerZone() {
  const [confirmText, setConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    if (confirmText !== '계정 삭제') return

    setDeleting(true)
    try {
      await del('/api/v1/auth/me')
      // Clear tokens and redirect
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      window.location.href = '/login'
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status
      if (status === 403) {
        alert('계정 삭제는 워크스페이스 소유자만 가능합니다.')
      } else if (status === 409) {
        alert('활성 데이터가 있어 삭제할 수 없습니다.')
      } else {
        alert('계정 삭제에 실패했습니다. 다시 시도해주세요.')
      }
      setDeleting(false)
    }
  }

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <CardTitle className="text-destructive">위험 구역</CardTitle>
        </div>
        <CardDescription>
          계정을 삭제하면 모든 데이터가 비활성화됩니다. 이 작업은 되돌릴 수 없습니다.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!showConfirm ? (
          <Button
            variant="destructive"
            onClick={() => setShowConfirm(true)}
          >
            계정 삭제
          </Button>
        ) : (
          <div className="space-y-4 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
            <p className="text-sm font-medium">
              정말로 계정을 삭제하시겠습니까? 확인하려면 아래에 &quot;계정 삭제&quot;를 입력하세요.
            </p>
            <div className="space-y-2">
              <Label htmlFor="confirmDelete">확인 텍스트</Label>
              <Input
                id="confirmDelete"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="계정 삭제"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={confirmText !== '계정 삭제' || deleting}
              >
                {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                영구 삭제
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowConfirm(false)
                  setConfirmText('')
                }}
              >
                취소
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
