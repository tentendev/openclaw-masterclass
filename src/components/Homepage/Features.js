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
    emoji: '🔧',
    title: translate({id: 'homepage.features.pipelines.title', message: 'Pipelines & Functions'}),
    description: translate({id: 'homepage.features.pipelines.description', message: '541 個 Functions + 276 個 Tools 的強大生態系。用 Pipelines 打造自訂 RAG、訊息過濾、即時翻譯等 AI 工作流。'}),
    link: '/docs/features/pipelines',
    linkText: translate({id: 'homepage.features.pipelines.linkText', message: '探索 Pipelines'})
  },
  {
    emoji: '🧠',
    title: translate({id: 'homepage.features.rag.title', message: 'Knowledge Base & RAG'}),
    description: translate({id: 'homepage.features.rag.description', message: 'Agentic RAG、混合搜尋、KV 前綴快取——讓你的 AI 真正理解你的文件和知識庫，後續回應幾乎即時。'}),
    link: '/docs/features/knowledge-rag',
    linkText: translate({id: 'homepage.features.rag.linkText', message: '建構知識庫'})
  },
  {
    emoji: '🏟️',
    title: translate({id: 'homepage.features.arena.title', message: 'Arena 模式'}),
    description: translate({id: 'homepage.features.arena.description', message: '透過盲測 A/B 對比，科學地找出最適合你的 AI 模型。ELO 評分系統，消除品牌偏見。'}),
    link: '/docs/features/arena-mode',
    linkText: translate({id: 'homepage.features.arena.linkText', message: '開始盲測'})
  },
  {
    emoji: '🏆',
    title: translate({id: 'homepage.features.top50.title', message: 'Top 50 Skills 精選'}),
    description: translate({id: 'homepage.features.top50.description', message: '精心策劃的 50 個必裝 Skills，包含生產力工具、開發輔助、社群管理與 AI 整合，每個都附帶詳細教學。'}),
    link: '/docs/top-50-skills/overview',
    linkText: translate({id: 'homepage.features.top50.linkText', message: '瀏覽 Skills'})
  },
  {
    emoji: '🎨',
    title: translate({id: 'homepage.features.canvas.title', message: 'Canvas & Artifacts'}),
    description: translate({id: 'homepage.features.canvas.description', message: '內建畫布工具、程式碼 Artifacts 獨立渲染、PDF 引用跳轉——從純文字對話升級到視覺化互動體驗。'}),
    link: '/docs/features/canvas',
    linkText: translate({id: 'homepage.features.canvas.linkText', message: '探索 Canvas'})
  },
  {
    emoji: '🔊',
    title: translate({id: 'homepage.features.voice.title', message: '語音 & 多模態'}),
    description: translate({id: 'homepage.features.voice.description', message: 'ElevenLabs、Deepgram、Whisper 語音整合，加上圖像分析、視訊通話和檔案處理的完整多模態能力。'}),
    link: '/docs/features/voice-tts-stt',
    linkText: translate({id: 'homepage.features.voice.linkText', message: '體驗語音'})
  },
  {
    emoji: '🚀',
    title: translate({id: 'homepage.features.deploy.title', message: '部署 & 整合指南'}),
    description: translate({id: 'homepage.features.deploy.description', message: 'Docker / Podman 部署、雲端平台（AWS/GCP/Azure）、Ollama 多實例、MCP 連接器——完整的部署與整合生態。'}),
    link: '/docs/deployment/docker-guide',
    linkText: translate({id: 'homepage.features.deploy.linkText', message: '開始部署'})
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
