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
import type { CampaignCreate } from '@/lib/types'
import { toast } from 'sonner'

export default function CampaignsPage() {
  const params = useParams()
  const slug = params?.slug as string

  const { data: workspaces } = useWorkspaces()
  const workspace = workspaces?.find((w) => w.slug === slug)
  const workspaceId = workspace?.id ?? 0

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
        toast.success('Campaign created successfully!')
        setOpen(false)
        setFormData({
          name: '',
          description: '',
          target_brand: '',
          schedule_enabled: false,
          schedule_interval_hours: 24
        })
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.detail || 'Failed to create campaign')
      }
    })
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor your citation analysis campaigns
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-brand-orange hover:bg-brand-orange-hover">
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Campaign Name *</Label>
                <Input
                  id="name"
                  placeholder="Q1 2026 Brand Analysis"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target_brand">Target Brand *</Label>
                <Input
                  id="target_brand"
                  placeholder="Your Brand Name"
                  value={formData.target_brand}
                  onChange={(e) => setFormData({ ...formData, target_brand: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Campaign objectives and notes..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="schedule">Automatic Scheduling</Label>
                  <p className="text-sm text-muted-foreground">
                    Run campaign on a schedule
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
                  <Label htmlFor="interval">Interval (hours)</Label>
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
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 bg-brand-orange hover:bg-brand-orange-hover"
                >
                  {isPending ? 'Creating...' : 'Create Campaign'}
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
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="rounded-full bg-brand-orange/10 p-6 mb-4">
            <Rocket className="h-12 w-12 text-brand-orange" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No campaigns yet</h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Create your first campaign to start analyzing brand citations and tracking performance
          </p>
          <Button
            onClick={() => setOpen(true)}
            className="bg-brand-orange hover:bg-brand-orange-hover"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Campaign
          </Button>
        </div>
      )}
    </div>
  )
}
