import React from 'react'
import Link from '@docusaurus/Link'
import Translate, {translate} from '@docusaurus/Translate'
import { Badge } from '@/components/ui/badge'

const features = [
  {
    label: 'Pipelines',
    description: translate({id: 'homepage.newfeatures.pipelines', message: '可程式化的 AI 工作流'}),
    link: '/docs/features/pipelines',
    badge: 'NEW',
  },
  {
    label: 'Agentic RAG',
    description: translate({id: 'homepage.newfeatures.rag', message: '智慧檢索增強生成'}),
    link: '/docs/features/knowledge-rag',
    badge: 'NEW',
  },
  {
    label: 'Arena Mode',
    description: translate({id: 'homepage.newfeatures.arena', message: 'AI 模型盲測對決'}),
    link: '/docs/features/arena-mode',
    badge: 'NEW',
  },
  {
    label: 'User Groups',
    description: translate({id: 'homepage.newfeatures.groups', message: 'RBAC 權限管理'}),
    link: '/docs/features/user-groups',
    badge: 'NEW',
  },
  {
    label: 'Canvas',
    description: translate({id: 'homepage.newfeatures.canvas', message: '畫布與 Artifacts'}),
    link: '/docs/features/canvas',
    badge: 'NEW',
  },
  {
    label: 'Jupyter',
    description: translate({id: 'homepage.newfeatures.jupyter', message: '互動式程式碼執行'}),
    link: '/docs/features/jupyter',
    badge: 'NEW',
  },
  {
    label: 'MCP',
    description: translate({id: 'homepage.newfeatures.mcp', message: '50+ 外部連接器'}),
    link: '/docs/integrations/mcp-connectors',
    badge: 'NEW',
  },
  {
    label: '10x Performance',
    description: translate({id: 'homepage.newfeatures.perf', message: '批次查詢 + KV 快取'}),
    link: '/docs/features/performance',
    badge: 'UPGRADE',
  },
]

export default function NewFeaturesBanner() {
  return (
    <section className='py-10 px-4'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-8 text-center'>
          <h2 className='mb-3 text-2xl font-bold sm:text-3xl'>
            <Translate id="homepage.newfeatures.title">2026 Q1 新功能</Translate>
          </h2>
          <p className='text-gray-600 dark:text-gray-400'>
            <Translate id="homepage.newfeatures.subtitle">OpenClaw 史上最大規模功能更新</Translate>
          </p>
        </div>
        <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
          {features.map((feat, idx) => (
            <Link
              key={idx}
              to={feat.link}
              className='group flex flex-col items-start rounded-lg border border-gray-200 p-4 no-underline transition-all hover:border-indigo-300 hover:shadow-md dark:border-gray-700 dark:hover:border-indigo-600'
            >
              <div className='mb-2 flex items-center gap-2'>
                <span className='font-semibold text-gray-900 group-hover:text-indigo-600 dark:text-gray-100 dark:group-hover:text-indigo-400'>
                  {feat.label}
                </span>
                <Badge variant={feat.badge === 'NEW' ? 'default' : 'secondary'} className='text-[10px] px-1.5 py-0'>
                  {feat.badge}
                </Badge>
              </div>
              <span className='text-xs text-gray-500 dark:text-gray-400'>
                {feat.description}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
