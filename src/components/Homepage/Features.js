import React from 'react'
import Link from '@docusaurus/Link'
import Translate, {translate} from '@docusaurus/Translate'
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const FeatureList = [
  {
    emoji: '🎓',
    title: translate({id: 'homepage.features.masterclass.title', message: 'MasterClass 課程'}),
    description: translate({id: 'homepage.features.masterclass.description', message: '從零開始學習 OpenClaw，涵蓋架構設計、Skill 開發、多平台部署與進階安全性配置的完整課程體系。'}),
    link: '/docs/masterclass/overview',
    linkText: translate({id: 'homepage.features.masterclass.linkText', message: '開始學習'})
  },
  {
    emoji: '🏆',
    title: translate({id: 'homepage.features.top50.title', message: 'Top 50 Skills 精選'}),
    description: translate({id: 'homepage.features.top50.description', message: '精心策劃的 50 個必裝 Skills，包含生產力工具、開發輔助、社群管理與 AI 整合，每個都附帶詳細教學。'}),
    link: '/docs/top-50-skills/overview',
    linkText: translate({id: 'homepage.features.top50.linkText', message: '瀏覽 Skills'})
  },
  {
    emoji: '🤝',
    title: translate({id: 'homepage.features.community.title', message: '社群指南'}),
    description: translate({id: 'homepage.features.community.description', message: '加入全球 OpenClaw 開發者社群，學習如何貢獻 Skills、參與 RFC 討論、以及成為核心貢獻者的路徑。'}),
    link: '/docs/communities/top-10',
    linkText: translate({id: 'homepage.features.community.linkText', message: '加入社群'})
  },
  {
    emoji: '🆕',
    title: translate({id: 'homepage.features.whatsnew.title', message: "What's New — 2026 年 3 月"}),
    description: translate({id: 'homepage.features.whatsnew.description', message: 'OpenClaw 最新動態：v4.2 版本更新、新增 Skill Marketplace、改進的 Gateway API 以及安全性強化。'}),
    link: '/blog',
    linkText: translate({id: 'homepage.features.whatsnew.linkText', message: '查看最新消息'})
  }
]

function FeatureCard({ emoji, title, description, link, linkText }) {
  return (
    <Card className='flex h-full flex-col justify-between transition-shadow duration-200 hover:shadow-md'>
      <CardHeader>
        <div className='mb-2 text-3xl'>{emoji}</div>
        <CardTitle className='text-lg'>{title}</CardTitle>
        <CardDescription className='mt-2 leading-relaxed'>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button asChild variant='outline' size='sm'>
          <Link to={link} className='hover:text-accent-foreground'>
            {linkText} →
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function HomepageFeatures() {
  return (
    <section className='py-10 px-4'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-10 text-center'>
          <h2 className='mb-3 text-2xl font-bold sm:text-3xl'>
            <Translate id="homepage.features.sectionTitle" description="Features section title">探索 OpenClaw MasterClass</Translate>
          </h2>
          <p className='text-gray-600 dark:text-gray-400'>
            <Translate id="homepage.features.sectionSubtitle" description="Features section subtitle">系統化的學習路徑，帶你從入門到精通</Translate>
          </p>
        </div>
        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4'>
          {FeatureList.map((props, idx) => (
            <FeatureCard key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  )
}
