'use client'

import * as React from 'react'
import { useParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LoadingCard } from '@/components/ui/loading-card'
import { ScheduleConfig } from '@/components/campaign/ScheduleConfig'
import { CampaignNotificationSettings } from '@/components/campaign/CampaignNotificationSettings'
import { AlertRuleEditor } from '@/components/campaign/AlertRuleEditor'
import {
  useCampaign,
  useUpdateCampaign,
  useNotificationConfigs,
  useCreateNotification,
  useUpdateNotification,
  useDeleteNotification,
  useTestNotification,
} from '@/lib/hooks/use-campaigns'
import { useWorkspaces } from '@/lib/hooks/use-workspaces'
import { toast } from 'sonner'
import type { ScheduleInterval, AlertRule, AlertRuleCreate, NotificationConfig } from '@/types/campaign'

export default function CampaignSettingsPage() {
  const params = useParams()
  const slug = params.slug as string
  const campaignId = parseInt(params.campaignId as string, 10)

  const { data: workspaces } = useWorkspaces()
  const workspace = workspaces?.find((w) => w.slug === slug)
  const workspaceId = workspace?.id

  const { data: campaign, isLoading: campaignLoading } = useCampaign(
    workspaceId,
    campaignId
  )
  const { data: notificationsData, isLoading: notificationsLoading } =
    useNotificationConfigs(workspaceId, campaignId)

  const notifications = (notificationsData as NotificationConfig[]) || []

  const updateCampaign = useUpdateCampaign(workspaceId || 0, campaignId)
  const createNotification = useCreateNotification(workspaceId, campaignId)
  const updateNotification = useUpdateNotification(workspaceId)
  const deleteNotification = useDeleteNotification(workspaceId)
  const testNotification = useTestNotification(workspaceId, campaignId)

  // Mock alert rules data (backend not implemented yet)
  const [alertRules, setAlertRules] = React.useState<AlertRule[]>([])

  const handleScheduleUpdate = async (config: {
    is_active: boolean
    interval: ScheduleInterval
    cron_expression?: string
  }) => {
    try {
      await updateCampaign.mutateAsync({
        schedule_enabled: config.is_active,
        schedule_interval_hours:
          config.interval === 'hourly'
            ? 1
            : config.interval === 'every_6h'
            ? 6
            : config.interval === 'daily'
            ? 24
            : config.interval === 'weekly'
            ? 168
            : 720, // monthly
      })
      toast.success('스케줄 설정이 업데이트되었습니다')
    } catch (error) {
      toast.error('스케줄 업데이트에 실패했습니다')
      throw error
    }
  }

  const handleCreateNotification = async (data: {
    type: string
    destination: string
    events: string[]
    is_active?: boolean
  }) => {
    try {
      await createNotification.mutateAsync(data)
      toast.success('알림이 추가되었습니다')
    } catch (error) {
      toast.error('알림 추가에 실패했습니다')
      throw error
    }
  }

  const handleUpdateNotification = async (
    id: number,
    data: Partial<{
      type: string
      destination: string
      events: string[]
      is_active: boolean
    }>
  ) => {
    try {
      await updateNotification.mutateAsync({ notificationId: id, data })
      toast.success('알림이 업데이트되었습니다')
    } catch (error) {
      toast.error('알림 업데이트에 실패했습니다')
      throw error
    }
  }

  const handleDeleteNotification = async (id: number) => {
    try {
      await deleteNotification.mutateAsync(id)
      toast.success('알림이 삭제되었습니다')
    } catch (error) {
      toast.error('알림 삭제에 실패했습니다')
      throw error
    }
  }

  const handleTestNotification = async (id: number) => {
    try {
      await testNotification.mutateAsync(id)
      toast.success('테스트 알림이 전송되었습니다')
    } catch (error) {
      toast.error('테스트 알림 전송에 실패했습니다')
      throw error
    }
  }

  const handleCreateAlertRule = async (data: AlertRuleCreate) => {
    // Mock implementation - backend not ready yet
    const newRule: AlertRule = {
      id: Date.now(),
      ...data,
      is_active: true,
    }
    setAlertRules((prev) => [...prev, newRule])
    toast.success('알림 규칙이 추가되었습니다')
  }

  const handleUpdateAlertRule = async (
    id: number,
    data: Partial<AlertRule>
  ) => {
    setAlertRules((prev) =>
      prev.map((rule) => (rule.id === id ? { ...rule, ...data } : rule))
    )
    toast.success('알림 규칙이 업데이트되었습니다')
  }

  const handleDeleteAlertRule = async (id: number) => {
    setAlertRules((prev) => prev.filter((rule) => rule.id !== id))
    toast.success('알림 규칙이 삭제되었습니다')
  }

  const getScheduleInterval = (): ScheduleInterval => {
    if (!campaign) return 'daily'
    const hours = campaign.schedule_interval_hours
    if (hours === 1) return 'hourly'
    if (hours === 6) return 'every_6h'
    if (hours === 24) return 'daily'
    if (hours === 168) return 'weekly'
    return 'monthly'
  }

  if (campaignLoading) {
    return (
      <div className="container mx-auto py-8 space-y-6">
        <LoadingCard type="page-header" />
        <LoadingCard type="metric" count={3} />
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-center text-muted-foreground">
          캠페인을 찾을 수 없습니다
        </p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{campaign.name}</h1>
        <p className="text-muted-foreground">캠페인 설정</p>
      </div>

      <Tabs defaultValue="schedule" className="space-y-6">
        <TabsList>
          <TabsTrigger value="schedule">스케줄 설정</TabsTrigger>
          <TabsTrigger value="notifications">알림 설정</TabsTrigger>
          <TabsTrigger value="alerts">알림 규칙</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4">
          <ScheduleConfig
            isActive={campaign.schedule_enabled}
            interval={getScheduleInterval()}
            nextRunAt={campaign.schedule_next_run_at}
            lastRunAt={null}
            onUpdate={handleScheduleUpdate}
          />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          {notificationsLoading ? (
            <LoadingCard type="list-item" count={2} />
          ) : (
            <CampaignNotificationSettings
              workspaceId={workspaceId || 0}
              campaignId={campaignId}
              notifications={notifications}
              onCreateNotification={handleCreateNotification}
              onUpdateNotification={handleUpdateNotification}
              onDeleteNotification={handleDeleteNotification}
              onTestNotification={handleTestNotification}
            />
          )}
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <AlertRuleEditor
            rules={alertRules}
            onCreateRule={handleCreateAlertRule}
            onUpdateRule={handleUpdateAlertRule}
            onDeleteRule={handleDeleteAlertRule}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
