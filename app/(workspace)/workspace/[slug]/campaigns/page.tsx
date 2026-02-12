'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { CampaignCard } from '@/components/campaign/CampaignCard'
import { Plus, Rocket } from 'lucide-react'
import { useCampaigns, useCreateCampaign } from '@/lib/hooks/use-campaigns'
import { useWorkspaces } from '@/lib/hooks/use-workspaces'
import type { CampaignCreate } from '@/types'
import { toast } from 'sonner'
import { EmptyState } from '@/components/shared/EmptyState'

export default function CampaignsPage() {
  const params = useParams()
  const slug = params?.slug as string

  const { data: workspaces } = useWorkspaces()
  const workspace = workspaces?.find((w) => w.slug === slug)
  const workspaceId = workspace?.id

  const { data: campaigns, isLoading } = useCampaigns(workspaceId)
  const { mutate: createCampaign, isPending } = useCreateCampaign(workspaceId)

  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<CampaignCreate>({
    name: '',
    description: '',
    target_brand: '',
    schedule_enabled: false,
    schedule_interval_hours: 24
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createCampaign(formData, {
      onSuccess: () => {
        toast.success('캠페인이 생성되었습니다!')
        setOpen(false)
        setFormData({
          name: '',
          description: '',
          target_brand: '',
          schedule_enabled: false,
          schedule_interval_hours: 24
        })
      },
      onError: () => {
        toast.error('캠페인 생성에 실패했습니다')
      }
    })
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">캠페인 관리</h1>
          <p className="text-muted-foreground mt-1">
            인용 분석 캠페인을 관리하고 모니터링하세요
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-orange hover:bg-brand-orange-hover">
              <Plus className="h-4 w-4 mr-2" />
              캠페인 생성
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>새 캠페인 만들기</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">캠페인 이름 *</Label>
                <Input
                  id="name"
                  placeholder="2026 1분기 브랜드 분석"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target_brand">목표 브랜드 *</Label>
                <Input
                  id="target_brand"
                  placeholder="브랜드 이름"
                  value={formData.target_brand}
                  onChange={(e) => setFormData({ ...formData, target_brand: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">설명</Label>
                <Textarea
                  id="description"
                  placeholder="캠페인 목표 및 메모..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="schedule">자동 스케줄링</Label>
                  <p className="text-sm text-muted-foreground">
                    캠페인을 일정에 따라 실행
                  </p>
                </div>
                <Switch
                  id="schedule"
                  checked={formData.schedule_enabled}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, schedule_enabled: checked })
                  }
                />
              </div>

              {formData.schedule_enabled && (
                <div className="space-y-2">
                  <Label htmlFor="interval">간격 (시간)</Label>
                  <Input
                    id="interval"
                    type="number"
                    min="1"
                    value={formData.schedule_interval_hours}
                    onChange={(e) =>
                      setFormData({ ...formData, schedule_interval_hours: parseInt(e.target.value) || 24 })
                    }
                  />
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="flex-1"
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 bg-brand-orange hover:bg-brand-orange-hover"
                >
                  {isPending ? '생성 중...' : '캠페인 생성'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Campaign Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      ) : campaigns && campaigns.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} workspaceSlug={slug} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Rocket}
          title="캠페인이 없습니다"
          description="첫 번째 캠페인을 생성하여 브랜드 인용 분석을 시작하세요"
          action={{
            label: '첫 캠페인 만들기',
            onClick: () => setOpen(true),
          }}
        />
      )}
    </div>
  )
}
