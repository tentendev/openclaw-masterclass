import Layout from '@theme/Layout'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'

import HomepageFeatures from '@/components/Homepage/Features'
import LatestNews from '@/components/LatestNews'
import HeroBanner from '@/components/HeroBanner'

export default function Home({ homePageBlogMetadata, recentPosts }) {
  const { siteConfig } = useDocusaurusContext()

  return (
    <Layout
      title={`${siteConfig.title}`}
      description='OpenClaw MasterClass — 全球最完整的 OpenClaw 學習資源中心'
    >
      <main className='background-grid background-grid--fade-out'>
        <HeroBanner />
        <HomepageFeatures />
        <LatestNews recentPosts={recentPosts} homePageBlogMetadata={homePageBlogMetadata} />
      </main>
    </Layout>
  )
}
