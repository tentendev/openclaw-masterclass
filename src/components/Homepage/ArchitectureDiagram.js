import React, { useState } from 'react'
import Link from '@docusaurus/Link'
import Translate, { translate } from '@docusaurus/Translate'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const layers = [
  {
    id: 'gateway',
    titleId: 'homepage.architecture.gateway.title',
    titleDefault: 'Gateway',
    descId: 'homepage.architecture.gateway.desc',
    descDefault: 'WebSocket Orchestrator \u2022 Port 18789',
    detailId: 'homepage.architecture.gateway.detail',
    detailDefault: 'Manages all incoming WebSocket connections, routes messages to the reasoning layer, and handles multi-platform protocol translation.',
    flowLabelId: 'homepage.architecture.flow.messages',
    flowLabelDefault: 'Messages',
    color: 'blue',
    bgClass: 'bg-blue-50 dark:bg-blue-950/40',
    borderClass: 'border-blue-300 dark:border-blue-700',
    hoverBorderClass: 'hover:border-blue-500 dark:hover:border-blue-400',
    textClass: 'text-blue-700 dark:text-blue-300',
    dotClass: 'bg-blue-500',
    link: '/docs/masterclass/module-1',
  },
  {
    id: 'reasoning',
    titleId: 'homepage.architecture.reasoning.title',
    titleDefault: 'Reasoning Layer',
    descId: 'homepage.architecture.reasoning.desc',
    descDefault: 'LLM Mega-prompting',
    detailId: 'homepage.architecture.reasoning.detail',
    detailDefault: 'Constructs mega-prompts from context, memory, and skill manifests, then dispatches them to the configured LLM provider.',
    flowLabelId: 'homepage.architecture.flow.prompts',
    flowLabelDefault: 'Prompts',
    color: 'purple',
    bgClass: 'bg-purple-50 dark:bg-purple-950/40',
    borderClass: 'border-purple-300 dark:border-purple-700',
    hoverBorderClass: 'hover:border-purple-500 dark:hover:border-purple-400',
    textClass: 'text-purple-700 dark:text-purple-300',
    dotClass: 'bg-purple-500',
    link: '/docs/masterclass/module-5',
  },
  {
    id: 'memory',
    titleId: 'homepage.architecture.memory.title',
    titleDefault: 'Memory System',
    descId: 'homepage.architecture.memory.desc',
    descDefault: 'Write-Ahead Logging \u2022 Markdown Compaction',
    detailId: 'homepage.architecture.memory.detail',
    detailDefault: 'Persists conversation context via write-ahead logs and compacts long histories into concise markdown summaries.',
    flowLabelId: 'homepage.architecture.flow.context',
    flowLabelDefault: 'Context',
    color: 'green',
    bgClass: 'bg-green-50 dark:bg-green-950/40',
    borderClass: 'border-green-300 dark:border-green-700',
    hoverBorderClass: 'hover:border-green-500 dark:hover:border-green-400',
    textClass: 'text-green-700 dark:text-green-300',
    dotClass: 'bg-green-500',
    link: '/docs/masterclass/module-1',
  },
  {
    id: 'skills',
    titleId: 'homepage.architecture.skills.title',
    titleDefault: 'Skills / Execution',
    descId: 'homepage.architecture.skills.desc',
    descDefault: 'Sandboxed Containers',
    detailId: 'homepage.architecture.skills.detail',
    detailDefault: 'Executes skill code in isolated, sandboxed containers with resource limits, secret injection, and audit logging.',
    flowLabelId: 'homepage.architecture.flow.actions',
    flowLabelDefault: 'Actions',
    color: 'amber',
    bgClass: 'bg-amber-50 dark:bg-amber-950/40',
    borderClass: 'border-amber-300 dark:border-amber-700',
    hoverBorderClass: 'hover:border-amber-500 dark:hover:border-amber-400',
    textClass: 'text-amber-700 dark:text-amber-300',
    dotClass: 'bg-amber-500',
    link: '/docs/masterclass/module-2',
  },
]

function AnimatedConnector({ color }) {
  return (
    <div className='relative flex items-center justify-center py-1'>
      <div className={`relative h-8 w-px border-l-2 border-dashed border-${color}-300 dark:border-${color}-600`}>
        <div
          className={`absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-${color}-500 animate-flow-dot`}
        />
      </div>
    </div>
  )
}

function LayerCard({ layer, index }) {
  const [expanded, setExpanded] = useState(false)

  const title = translate({ id: layer.titleId, message: layer.titleDefault })
  const desc = translate({ id: layer.descId, message: layer.descDefault })
  const detail = translate({ id: layer.detailId, message: layer.detailDefault })
  const flowLabel = translate({ id: layer.flowLabelId, message: layer.flowLabelDefault })

  return (
    <Link
      to={layer.link}
      className='block no-underline hover:no-underline'
      onClick={(e) => {
        if (expanded) {
          // allow link navigation
        }
      }}
    >
      <Card
        className={`
          relative cursor-pointer border-2 transition-all duration-300 ease-out
          ${layer.bgClass} ${layer.borderClass} ${layer.hoverBorderClass}
          ${expanded ? 'scale-[1.02] shadow-lg' : 'hover:scale-[1.01] hover:shadow-md'}
        `}
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
      >
        {/* Flow label */}
        <div className={`absolute -left-2 top-1/2 -translate-y-1/2 -translate-x-full hidden lg:block`}>
          <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${layer.textClass} ${layer.bgClass} border ${layer.borderClass}`}>
            {flowLabel} →
          </span>
        </div>

        <CardHeader className='pb-2'>
          <div className='flex items-center gap-3'>
            <div className={`h-3 w-3 rounded-full ${layer.dotClass} animate-pulse`} />
            <CardTitle className={`text-base font-bold sm:text-lg ${layer.textClass}`}>
              {title}
            </CardTitle>
          </div>
          <CardDescription className={`mt-1 text-sm ${layer.textClass} opacity-80`}>
            {desc}
          </CardDescription>
        </CardHeader>

        {/* Expanded detail */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-out ${
            expanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className='px-6 pb-4'>
            <p className={`text-sm leading-relaxed ${layer.textClass} opacity-70`}>
              {detail}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  )
}

export default function ArchitectureDiagram() {
  return (
    <section className='py-10 px-4'>
      <div className='mx-auto max-w-3xl'>
        <div className='mb-8 text-center'>
          <h2 className='mb-2 text-2xl font-bold sm:text-3xl'>
            <Translate id='homepage.architecture.title' description='Architecture diagram section title'>
              OpenClaw 四層架構
            </Translate>
          </h2>
          <p className='text-sm text-gray-500 dark:text-gray-400'>
            <Translate id='homepage.architecture.subtitle' description='Architecture diagram subtitle'>
              Click any layer to explore the corresponding MasterClass module
            </Translate>
          </p>
        </div>

        <div className='relative pl-0 lg:pl-28'>
          {layers.map((layer, index) => (
            <React.Fragment key={layer.id}>
              <LayerCard layer={layer} index={index} />
              {index < layers.length - 1 && (
                <AnimatedConnector color={layers[index + 1].color} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes flow-dot {
          0% { top: -4px; opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { top: calc(100% - 4px); opacity: 0; }
        }
        .animate-flow-dot {
          animation: flow-dot 1.5s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}
