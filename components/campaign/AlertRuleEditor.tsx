'use client'

import * as React from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Plus, Trash2, AlertTriangle } from 'lucide-react'
import type { AlertRule, AlertRuleCreate, AlertComparison } from '@/types/campaign'
import { cn } from '@/lib/utils'

interface AlertRuleEditorProps {
  rules: AlertRule[]
  onCreateRule: (data: AlertRuleCreate) => Promise<void>
  onUpdateRule: (id: number, data: Partial<AlertRule>) => Promise<void>
  onDeleteRule: (id: number) => Promise<void>
  className?: string
}

const COMPARISON_LABELS: Record<AlertComparison, string> = {
  above: '초과',
  below: '미만',
  change_exceeds: '변화량 초과',
}

const METRIC_OPTIONS = [
  { value: 'citation_share', label: '인용 점유율 (%)' },
  { value: 'total_citations', label: '총 인용 수' },
  { value: 'brand_rank', label: '브랜드 순위' },
  { value: 'geo_score', label: 'GEO 점수' },
]

export function AlertRuleEditor({
  rules,
  onCreateRule,
  onUpdateRule,
  onDeleteRule,
  className,
}: AlertRuleEditorProps) {
  const [showAddForm, setShowAddForm] = React.useState(false)
  const [newName, setNewName] = React.useState('')
  const [newMetric, setNewMetric] = React.useState('citation_share')
  const [newComparison, setNewComparison] = React.useState<AlertComparison>('above')
  const [newThreshold, setNewThreshold] = React.useState('')
  const [deleteId, setDeleteId] = React.useState<number | null>(null)
  const [isSaving, setIsSaving] = React.useState(false)

  const handleCreate = async () => {
    if (!newName.trim() || !newThreshold.trim()) return

    const threshold = parseFloat(newThreshold)
    if (isNaN(threshold)) return

    setIsSaving(true)
    try {
      await onCreateRule({
        name: newName.trim(),
        metric: newMetric,
        comparison: newComparison,
        threshold,
      })
      setShowAddForm(false)
      setNewName('')
      setNewMetric('citation_share')
      setNewComparison('above')
      setNewThreshold('')
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleActive = async (id: number, isActive: boolean) => {
    await onUpdateRule(id, { is_active: isActive })
  }

  const handleDelete = async () => {
    if (deleteId === null) return
    await onDeleteRule(deleteId)
    setDeleteId(null)
  }

  const getMetricLabel = (metric: string) => {
    return METRIC_OPTIONS.find((opt) => opt.value === metric)?.label || metric
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">알림 규칙</h3>
          <p className="text-sm text-muted-foreground">
            특정 조건에서 알림을 받도록 규칙을 설정하세요
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          규칙 추가
        </Button>
      </div>

      {showAddForm && (
        <Card className="p-4 space-y-4 border-primary">
          <h4 className="font-semibold">새 알림 규칙</h4>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="rule-name">규칙 이름</Label>
              <Input
                id="rule-name"
                placeholder="예: 인용률 50% 초과 시 알림"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="metric">지표</Label>
              <Select value={newMetric} onValueChange={setNewMetric}>
                <SelectTrigger id="metric">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {METRIC_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="comparison">비교 연산</Label>
                <Select
                  value={newComparison}
                  onValueChange={(v) => setNewComparison(v as AlertComparison)}
                >
                  <SelectTrigger id="comparison">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(COMPARISON_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="threshold">임계값</Label>
                <Input
                  id="threshold"
                  type="number"
                  step="0.1"
                  placeholder="예: 50"
                  value={newThreshold}
                  onChange={(e) => setNewThreshold(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddForm(false)
                setNewName('')
                setNewMetric('citation_share')
                setNewComparison('above')
                setNewThreshold('')
              }}
              disabled={isSaving}
            >
              취소
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!newName.trim() || !newThreshold.trim() || isSaving}
            >
              {isSaving ? '추가 중...' : '추가'}
            </Button>
          </div>
        </Card>
      )}

      {rules.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">설정된 알림 규칙이 없습니다</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {rules.map((rule) => (
            <Card key={rule.id} className="p-4">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-muted">
                  <AlertTriangle className="h-5 w-5" />
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{rule.name}</h4>
                    <Badge variant={rule.is_active ? 'success' : 'outline'}>
                      {rule.is_active ? '활성' : '비활성'}
                    </Badge>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    {getMetricLabel(rule.metric)} {COMPARISON_LABELS[rule.comparison]}{' '}
                    <span className="font-semibold">{rule.threshold}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={rule.is_active}
                    onCheckedChange={(checked) => handleToggleActive(rule.id, checked)}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteId(rule.id)}
                    title="삭제"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>알림 규칙 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              이 알림 규칙을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
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
