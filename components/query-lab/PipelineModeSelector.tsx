"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Layers } from "lucide-react"

interface PipelineModeSelectorProps {
  mode: 'single' | 'pipeline';
  onModeChange: (mode: 'single' | 'pipeline') => void;
  disabled?: boolean;
}

export function PipelineModeSelector({ mode, onModeChange, disabled }: PipelineModeSelectorProps) {
  return (
    <Tabs value={mode} onValueChange={(v) => onModeChange(v as 'single' | 'pipeline')}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="single" disabled={disabled} className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          단일 쿼리
        </TabsTrigger>
        <TabsTrigger value="pipeline" disabled={disabled} className="flex items-center gap-2">
          <Layers className="h-4 w-4" />
          파이프라인 분석
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
