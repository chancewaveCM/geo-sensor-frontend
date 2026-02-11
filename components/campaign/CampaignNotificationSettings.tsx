'use client'

import * as React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Mail, Webhook, Trash2, TestTube2, Plus } from 'lucide-react'
import type { NotificationConfig, NotificationEvent, NotificationType } from '@/types/campaign'
import { cn } from '@/lib/utils'

interface CampaignNotificationSettingsProps {
  workspaceId: number
  campaignId: number
  notifications: NotificationConfig[]
  onCreateNotification: (data: {
    type: NotificationType
    destination: string
    events: NotificationEvent[]
    is_active?: boolean
  }) => Promise<void>
  onUpdateNotification: (id: number, data: Partial<{
    type: NotificationType
    destination: string
    events: NotificationEvent[]
    is_active: boolean
  }>) => Promise<void>
  onDeleteNotification: (id: number) => Promise<void>
  onTestNotification: (id: number) => Promise<void>
  className?: string
}

const EVENT_LABELS: Record<NotificationEvent, string> = {
  run_completed: '실행 완료',
  threshold_crossed: '임계값 초과',
  competitor_change: '경쟁사 변동',
  error: '오류',
}

const TYPE_ICONS = {
  email: Mail,
  webhook: Webhook,
}

export function CampaignNotificationSettings({
  workspaceId,
  campaignId,
  notifications,
  onCreateNotification,
  onUpdateNotification,
  onDeleteNotification,
  onTestNotification,
  className,
}: CampaignNotificationSettingsProps) {
  const [showAddForm, setShowAddForm] = React.useState(false)
  const [newType, setNewType] = React.useState<NotificationType>('email')
  const [newDestination, setNewDestination] = React.useState('')
  const [newEvents, setNewEvents] = React.useState<NotificationEvent[]>(['run_completed'])
  const [deleteId, setDeleteId] = React.useState<number | null>(null)
  const [isSaving, setIsSaving] = React.useState(false)

  const handleCreate = async () => {
    if (!newDestination.trim() || newEvents.length === 0) return

    setIsSaving(true)
    try {
      await onCreateNotification({
        type: newType,
        destination: newDestination.trim(),
        events: newEvents,
        is_active: true,
      })
      setShowAddForm(false)
      setNewDestination('')
      setNewEvents(['run_completed'])
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleActive = async (id: number, isActive: boolean) => {
    await onUpdateNotification(id, { is_active: isActive })
  }

  const handleDelete = async () => {
    if (deleteId === null) return
    await onDeleteNotification(deleteId)
    setDeleteId(null)
  }

  const handleTest = async (id: number) => {
    await onTestNotification(id)
  }

  const toggleEvent = (event: NotificationEvent) => {
    setNewEvents((prev) =>
      prev.includes(event)
        ? prev.filter((e) => e !== event)
        : [...prev, event]
    )
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">알림 설정</h3>
          <p className="text-sm text-muted-foreground">
            캠페인 이벤트 알림을 설정하세요
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          알림 추가
        </Button>
      </div>

      {showAddForm && (
        <Card className="p-4 space-y-4 border-primary">
          <h4 className="font-semibold">새 알림 설정</h4>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="notification-type">알림 유형</Label>
              <Select value={newType} onValueChange={(v) => setNewType(v as NotificationType)}>
                <SelectTrigger id="notification-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">이메일</SelectItem>
                  <SelectItem value="webhook">웹훅</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="destination">
                {newType === 'email' ? '이메일 주소' : '웹훅 URL'}
              </Label>
              <Input
                id="destination"
                type={newType === 'email' ? 'email' : 'url'}
                placeholder={
                  newType === 'email'
                    ? 'example@company.com'
                    : 'https://example.com/webhook'
                }
                value={newDestination}
                onChange={(e) => setNewDestination(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label>알림 받을 이벤트</Label>
              <div className="space-y-2">
                {Object.entries(EVENT_LABELS).map(([event, label]) => (
                  <div key={event} className="flex items-center gap-2">
                    <Checkbox
                      id={`event-${event}`}
                      checked={newEvents.includes(event as NotificationEvent)}
                      onCheckedChange={() => toggleEvent(event as NotificationEvent)}
                    />
                    <Label htmlFor={`event-${event}`} className="font-normal cursor-pointer">
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddForm(false)
                setNewDestination('')
                setNewEvents(['run_completed'])
              }}
              disabled={isSaving}
            >
              취소
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!newDestination.trim() || newEvents.length === 0 || isSaving}
            >
              {isSaving ? '추가 중...' : '추가'}
            </Button>
          </div>
        </Card>
      )}

      {notifications.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">설정된 알림이 없습니다</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => {
            const Icon = TYPE_ICONS[notification.type]
            return (
              <Card key={notification.id} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 rounded-lg bg-muted">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={notification.type === 'email' ? 'default' : 'secondary'}>
                        {notification.type === 'email' ? '이메일' : '웹훅'}
                      </Badge>
                      <Badge variant={notification.is_active ? 'success' : 'outline'}>
                        {notification.is_active ? '활성' : '비활성'}
                      </Badge>
                    </div>

                    <div className="text-sm font-medium break-all">
                      {notification.destination}
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {notification.events.map((event) => (
                        <Badge key={event} variant="outline" className="text-xs">
                          {EVENT_LABELS[event]}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={notification.is_active}
                      onCheckedChange={(checked) =>
                        handleToggleActive(notification.id, checked)
                      }
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTest(notification.id)}
                      title="테스트 발송"
                    >
                      <TestTube2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteId(notification.id)}
                      title="삭제"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>알림 설정 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 알림 설정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>삭제</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
