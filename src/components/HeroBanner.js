import React from 'react'
import Link from '@docusaurus/Link'
import { cn } from '@/lib/utils'
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text'

const StatItem = ({ value, label }) => (
  <div className='flex flex-col items-center px-4 py-2 sm:px-6'>
    <span className='text-lg font-bold text-gray-900 sm:text-xl dark:text-white'>{value}</span>
    <span className='text-xs text-gray-500 sm:text-sm dark:text-gray-400'>{label}</span>
  </div>
)

export default function HeroBanner() {
  const stats = [
    { value: '250K+', label: 'GitHub Stars' },
    { value: '13,000+', label: 'Skills' },
    { value: '20+', label: '通訊平台' },
    { value: '5', label: 'Languages' }
  ]

  return (
    <div>
      <div className='px-4 py-8 sm:py-16'>
        <div className='mx-auto max-w-7xl'>
          <div className='text-center'>
            <div className='group relative mx-auto flex w-max items-center justify-center rounded-full bg-white px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] dark:bg-transparent'>
              <span
                className={cn(
                  'animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-linear-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-size-[300%_100%] p-px'
                )}
                style={{
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'destination-out',
                  mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  maskComposite: 'subtract',
                  WebkitClipPath: 'padding-box'
                }}
              />
              <AnimatedGradientText className='text-sm font-medium'>
                🦞 全球最完整的 OpenClaw 學習平台
              </AnimatedGradientText>
            </div>

            <h1 className='mt-4 mb-4 text-[32px] leading-tight font-bold text-gray-900 sm:mt-6 sm:mb-6 sm:text-5xl md:text-6xl lg:text-7xl dark:text-white'>
              OpenClaw MasterClass 🦞
            </h1>

            <p className='mx-auto mb-6 max-w-2xl text-base leading-relaxed text-gray-600 sm:mb-8 sm:text-lg md:text-xl dark:text-gray-300'>
              全球最完整的 OpenClaw 學習資源中心
            </p>

            <div className='flex flex-wrap justify-center gap-4'>
              <Link
                to='/docs/masterclass/overview'
                className='inline-flex items-center rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-primary/90 hover:text-white hover:no-underline hover:shadow-lg sm:text-base'
              >
                開始學習 MasterClass
              </Link>
              <Link
                to='/docs/getting-started/installation'
                className='inline-flex items-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:text-gray-900 hover:no-underline hover:shadow-md dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white sm:text-base'
              >
                快速開始
              </Link>
            </div>

            <div className='mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center divide-x divide-gray-200 rounded-xl border border-gray-200 bg-white/80 py-2 shadow-sm backdrop-blur-sm sm:mt-12 dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-800/80'>
              {stats.map((stat, index) => (
                <StatItem key={index} value={stat.value} label={stat.label} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
