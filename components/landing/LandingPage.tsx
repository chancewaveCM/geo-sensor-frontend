import { Inter, Noto_Sans_KR } from 'next/font/google'
import { NavigationHeader } from '@/components/landing/sections/NavigationHeader'
import { HeroSection } from '@/components/landing/sections/HeroSection'
import { LLMTickerStrip } from '@/components/landing/sections/LLMTickerStrip'
import { SocialProofBar } from '@/components/landing/sections/SocialProofBar'
import { WhyCitationShareSection } from '@/components/landing/sections/WhyCitationShareSection'
import { FeatureShowcase } from '@/components/landing/sections/FeatureShowcase'
import { DashboardPreview } from '@/components/landing/sections/DashboardPreview'
import { GeoScoreExplained } from '@/components/landing/sections/GeoScoreExplained'
import { HowItWorks } from '@/components/landing/sections/HowItWorks'
import { ProviderComparison } from '@/components/landing/sections/ProviderComparison'
import { CaseStudies } from '@/components/landing/sections/CaseStudies'
import { TestimonialsSection } from '@/components/landing/sections/TestimonialsSection'
import { FAQSection } from '@/components/landing/sections/FAQSection'
import { FinalCTA } from '@/components/landing/sections/FinalCTA'
import { Footer } from '@/components/landing/sections/Footer'
import { ScrollReveal } from '@/components/landing/sections/ScrollReveal'
import { SectionErrorBoundary } from '@/components/landing/sections/SectionErrorBoundary'

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans-kr',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter-landing',
})

export function LandingPage() {
  return (
    <div
      className={`${notoSansKr.variable} ${inter.variable} min-h-screen bg-background text-foreground [font-family:var(--font-noto-sans-kr),var(--font-inter-landing),system-ui,sans-serif]`}
    >
      <NavigationHeader />
      <main id="main-content">
        <SectionErrorBoundary sectionName="Hero">
          <HeroSection />
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="LLM Ticker">
          <LLMTickerStrip />
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="Social Proof">
          <SocialProofBar />
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="Why Citation Share">
          <WhyCitationShareSection />
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="Feature Showcase">
          <ScrollReveal>
            <FeatureShowcase />
          </ScrollReveal>
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="Dashboard Preview">
          <ScrollReveal>
            <DashboardPreview />
          </ScrollReveal>
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="GEO Score">
          <GeoScoreExplained />
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="How It Works">
          <ScrollReveal>
            <HowItWorks />
          </ScrollReveal>
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="Provider Comparison">
          <ProviderComparison />
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="Case Studies">
          <ScrollReveal>
            <CaseStudies />
          </ScrollReveal>
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="Testimonials">
          <ScrollReveal>
            <TestimonialsSection />
          </ScrollReveal>
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="FAQ">
          <FAQSection />
        </SectionErrorBoundary>
        <SectionErrorBoundary sectionName="Final CTA">
          <FinalCTA />
        </SectionErrorBoundary>
      </main>
      <Footer />
    </div>
  )
}
