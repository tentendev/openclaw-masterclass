import Layout from '@theme/Layout'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'

import HomepageFeatures from '@/components/Homepage/Features'
import QuoteSection from '@/components/Homepage/QuoteSection'
import CoursePreview from '@/components/Homepage/CoursePreview'
import SkillQuiz from '@/components/Homepage/SkillQuiz'
import MarchBanner from '@/components/Homepage/MarchBanner'
import SecurityBanner from '@/components/Homepage/SecurityBanner'
import TerminalDemo from '@/components/Homepage/TerminalDemo'
import ArchitectureDiagram from '@/components/Homepage/ArchitectureDiagram'
import EcosystemStats from '@/components/Homepage/EcosystemStats'
import NewFeaturesBanner from '@/components/Homepage/NewFeaturesBanner'
import LatestNews from '@/components/LatestNews'
import HeroBanner from '@/components/HeroBanner'
import ScrollReveal from '@/components/ScrollReveal'
import FloatingMolty from '@/components/FloatingMolty'

export default function Home({ homePageBlogMetadata, recentPosts }) {
  const { siteConfig } = useDocusaurusContext()

  return (
    <Layout
      title={`${siteConfig.title}`}
      description='OpenClaw MasterClass — 全球最完整的 OpenClaw 學習資源中心'
    >
      <main className='background-grid background-grid--fade-out'>
        <HeroBanner />
        <ScrollReveal delay={0}>
          <EcosystemStats />
        </ScrollReveal>
        <ScrollReveal delay={0}>
          <TerminalDemo />
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <NewFeaturesBanner />
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <QuoteSection />
        </ScrollReveal>
        <ScrollReveal delay={0}>
          <ArchitectureDiagram />
        </ScrollReveal>
        <ScrollReveal delay={0}>
          <HomepageFeatures />
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <CoursePreview />
        </ScrollReveal>
        <ScrollReveal delay={0}>
          <SkillQuiz />
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <MarchBanner />
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <SecurityBanner />
        </ScrollReveal>
        <ScrollReveal delay={0}>
          <LatestNews recentPosts={recentPosts} homePageBlogMetadata={homePageBlogMetadata} />
        </ScrollReveal>
      </main>
      <FloatingMolty />
    </Layout>
  )
}
