'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Check, ChevronsUpDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { useCampaigns, useCampaign } from '@/lib/hooks/use-campaigns'
import { useWorkspaces } from '@/lib/hooks/use-workspaces'
import { cn } from '@/lib/utils'

interface CampaignSwitcherProps {
  slug: string        // workspace slug
  campaignId: string  // current campaign ID
}

export function CampaignSwitcher({ slug, campaignId }: CampaignSwitcherProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const { data: workspaces } = useWorkspaces()
  const workspace = workspaces?.find((w) => w.slug === slug)
  const workspaceId = workspace?.id

  const { data: campaigns } = useCampaigns(workspaceId)
  const { data: currentCampaign } = useCampaign(workspaceId, parseInt(campaignId, 10))

  const handleSelect = (selectedCampaignId: number) => {
    setOpen(false)
    const basePath = `/workspace/${slug}/campaigns/${campaignId}`
    const subPath = pathname.replace(basePath, '')
    const newPath = `/workspace/${slug}/campaigns/${selectedCampaignId}${subPath}`
    router.push(newPath as any)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="h-auto px-2 py-1 text-sm font-medium hover:bg-accent"
        >
          <span className="max-w-[200px] truncate">
            {currentCampaign?.name || `캠페인 #${campaignId}`}
          </span>
          <ChevronsUpDown className="ml-1 h-3.5 w-3.5 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <Command>
          <CommandInput placeholder="캠페인 검색..." />
          <CommandList>
            <CommandEmpty>캠페인을 찾을 수 없습니다</CommandEmpty>
            <CommandGroup>
              {campaigns?.map((campaign) => (
                <CommandItem
                  key={campaign.id}
                  value={campaign.name}
                  onSelect={() => handleSelect(campaign.id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      campaign.id === parseInt(campaignId, 10)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  <span className="truncate">{campaign.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
