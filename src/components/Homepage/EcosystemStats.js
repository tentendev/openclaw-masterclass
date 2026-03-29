import React from 'react'
import Translate, {translate} from '@docusaurus/Translate'

const stats = [
  {
    value: '250K+',
    label: translate({id: 'homepage.stats.stars', message: 'GitHub Stars'}),
  },
  {
    value: '13,000+',
    label: translate({id: 'homepage.stats.skills', message: 'ClawHub Skills'}),
  },
  {
    value: '541',
    label: translate({id: 'homepage.stats.functions', message: '社群 Functions'}),
  },
  {
    value: '276',
    label: translate({id: 'homepage.stats.tools', message: '社群 Tools'}),
  },
  {
    value: '50+',
    label: translate({id: 'homepage.stats.mcp', message: 'MCP 連接器'}),
  },
  {
    value: '15+',
    label: translate({id: 'homepage.stats.llm', message: 'LLM 提供者'}),
  },
]

export default function EcosystemStats() {
  return (
    <section className='py-12 px-4'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-8 text-center'>
          <h2 className='mb-3 text-2xl font-bold sm:text-3xl'>
            <Translate id="homepage.stats.title">OpenClaw 生態系統</Translate>
          </h2>
          <p className='text-gray-600 dark:text-gray-400'>
            <Translate id="homepage.stats.subtitle">全球最活躍的開源 AI Agent 社群</Translate>
          </p>
        </div>
        <div className='grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6'>
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className='rounded-xl border border-gray-200 bg-white/50 p-6 text-center backdrop-blur-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800/50'
            >
              <div className='mb-1 text-3xl font-bold text-indigo-600 dark:text-indigo-400'>
                {stat.value}
              </div>
              <div className='text-sm text-gray-600 dark:text-gray-400'>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
