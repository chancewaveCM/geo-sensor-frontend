'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Megaphone, Users, Plus, ArrowRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useWorkspaces } from '@/lib/hooks/use-workspaces'
import { useWorkspaceMembers } from '@/lib/hooks/use-workspaces'
import { useCampaigns } from '@/lib/hooks/use-campaigns'

export default function WorkspaceOverviewPage() {
  const params = useParams()
  const slug = params.slug as string

  const { data: workspaces } = useWorkspaces()
  const workspace = workspaces?.find((w) => w.slug === slug)

  const { data: campaigns, isLoading: campaignsLoading } = useCampaigns(workspace?.id)
  const { data: members, isLoading: membersLoading } = useWorkspaceMembers(workspace?.id)

  if (!workspace) {
    return null
  }

  return (
    <div className="space-y-6">
      {/* Workspace Info */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{workspace.name}</h1>
        {workspace.description && (
          <p className="mt-1 text-sm text-muted-foreground">
            {workspace.description}
          </p>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Campaigns Count */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Campaigns
            </CardTitle>
            <Megaphone className="h-5 w-5 text-brand-orange" />
          </CardHeader>
          <CardContent>
            {campaignsLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-3xl font-bold text-foreground">
                {campaigns?.length ?? 0}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Members Count */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Members
            </CardTitle>
            <Users className="h-5 w-5 text-brand-orange" />
          </CardHeader>
          <CardContent>
            {membersLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-3xl font-bold text-foreground">
                {members?.length ?? 0}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Create Campaign */}
        <Card className="group transition-shadow hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-orange/10">
              <Plus className="h-6 w-6 text-brand-orange" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Create Campaign</h3>
              <p className="text-sm text-muted-foreground">
                Start a new brand monitoring campaign
              </p>
            </div>
            <Link href={`/workspace/${slug}/campaigns` as any}>
              <Button variant="outline" size="sm" className="gap-1">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Invite Member */}
        <Card className="group transition-shadow hover:shadow-md">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-orange/10">
              <Users className="h-6 w-6 text-brand-orange" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">Invite Member</h3>
              <p className="text-sm text-muted-foreground">
                Add team members to this workspace
              </p>
            </div>
            <Button variant="outline" size="sm" className="gap-1" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Campaigns */}
      {campaigns && campaigns.length > 0 && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Recent Campaigns</h2>
            <Link href={`/workspace/${slug}/campaigns` as any}>
              <Button variant="ghost" size="sm" className="gap-1 text-brand-orange">
                View All
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-3">
            {campaigns.slice(0, 5).map((campaign) => (
              <Card key={campaign.id} className="transition-shadow hover:shadow-sm">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Megaphone className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-foreground">{campaign.name}</p>
                      {campaign.target_brand && (
                        <p className="text-xs text-muted-foreground">
                          Target: {campaign.target_brand}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {campaign.status}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
