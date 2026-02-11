'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RewritePanel } from '@/components/content-optimizer/RewritePanel'
import { PublishHistory } from '@/components/content-optimizer/PublishHistory'

export default function DistributionPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">콘텐츠 배포</h1>
        <p className="text-muted-foreground">
          AI 리라이팅과 소셜 미디어 게시를 관리합니다.
        </p>
      </div>

      <Tabs defaultValue="rewrite" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rewrite">리라이팅</TabsTrigger>
          <TabsTrigger value="history">게시 내역</TabsTrigger>
        </TabsList>

        <TabsContent value="rewrite" className="space-y-4">
          <RewritePanel />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <PublishHistory />
        </TabsContent>
      </Tabs>
    </div>
  )
}
