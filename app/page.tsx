import type { Metadata } from 'next'
import { LandingPage } from '@/components/landing/LandingPage'

export const metadata: Metadata = {
  title: 'GEO Sensor | AI 브랜드 인용 분석 플랫폼',
  description:
    'ChatGPT, Gemini 등 AI 챗봇 응답에서 브랜드 인용률을 추적하고 GEO 최적화 인사이트를 제공하는 B2B SaaS',
  openGraph: {
    title: 'GEO Sensor | AI 브랜드 인용 분석 플랫폼',
    description: 'AI 답변 속 브랜드 인용률을 추적하고 실행 가능한 GEO 인사이트를 제공합니다.',
    url: '/',
    siteName: 'GEO Sensor',
    locale: 'ko_KR',
    type: 'website',
  },
}

export default function HomePage() {
  return <LandingPage />
}
