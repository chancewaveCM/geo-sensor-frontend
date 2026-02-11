'use client'

import * as React from 'react'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { ScheduleInterval } from '@/types/campaign'
import { cn } from '@/lib/utils'

interface ScheduleConfigProps {
  isActive: boolean
  interval: ScheduleInterval
  nextRunAt?: string | null
  lastRunAt?: string | null
  cronExpression?: string
  onUpdate: (config: {
    is_active: boolean
    interval: ScheduleInterval
    cron_expression?: string
  }) => Promise<void>
  className?: string
}

const INTERVAL_LABELS: Record<ScheduleInterval, string> = {
  hourly: '매시간',
  every_6h: '6시간마다',
  daily: '매일',
  weekly: '매주',
  monthly: '매월',
}

export function ScheduleConfig({
  isActive,
  interval,
  nextRunAt,
  lastRunAt,
  cronExpression,
  onUpdate,
  className,
}: ScheduleConfigProps) {
  const [localActive, setLocalActive] = React.useState(isActive)
  const [localInterval, setLocalInterval] = React.useState<ScheduleInterval>(interval)
  const [localCron, setLocalCron] = React.useState(cronExpression || '')
  const [showAdvanced, setShowAdvanced] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)

  const hasChanges =
    localActive !== isActive ||
    localInterval !== interval ||
    (showAdvanced && localCron !== (cronExpression || ''))

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onUpdate({
        is_active: localActive,
        interval: localInterval,
        cron_expression: showAdvanced ? localCron : undefined,
      })
    } finally {
      setIsSaving(false)
    }
  }

  const formatDateTime = (dateStr?: string | null) => {
    if (!dateStr) return '-'
    const date = new Date(dateStr)
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Card className={cn('p-6 space-y-6', className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">스케줄 설정</h3>
          <p className="text-sm text-muted-foreground">
            캠페인 자동 실행 주기를 설정하세요
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="schedule-active">활성화</Label>
          <Switch
            id="schedule-active"
            checked={localActive}
            onCheckedChange={setLocalActive}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="interval">실행 주기</Label>
          <Select
            value={localInterval}
            onValueChange={(value) => setLocalInterval(value as ScheduleInterval)}
            disabled={!localActive}
          >
            <SelectTrigger id="interval">
              <SelectValue placeholder="주기 선택" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(INTERVAL_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">마지막 실행</Label>
            <div className="text-sm font-medium">{formatDateTime(lastRunAt)}</div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">다음 실행</Label>
            <div className="text-sm font-medium flex items-center gap-2">
              {formatDateTime(nextRunAt)}
              {localActive && nextRunAt && (
                <Badge variant="success" className="text-xs">
                  예정
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {showAdvanced ? '▼' : '▶'} 고급 설정 (Cron 표현식)
          </button>

          {showAdvanced && (
            <div className="mt-4 space-y-2">
              <Label htmlFor="cron">Cron 표현식</Label>
              <Input
                id="cron"
                value={localCron}
                onChange={(e) => setLocalCron(e.target.value)}
                placeholder="예: 0 */6 * * *"
                disabled={!localActive}
              />
              <p className="text-xs text-muted-foreground">
                Cron 표현식을 직접 입력하면 실행 주기 설정을 무시합니다
              </p>
            </div>
          )}
        </div>
      </div>

      {hasChanges && (
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setLocalActive(isActive)
              setLocalInterval(interval)
              setLocalCron(cronExpression || '')
            }}
            disabled={isSaving}
          >
            취소
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? '저장 중...' : '저장'}
          </Button>
        </div>
      )}
    </Card>
  )
}
