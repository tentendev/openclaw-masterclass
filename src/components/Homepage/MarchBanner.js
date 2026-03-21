import React from 'react'
import Link from '@docusaurus/Link'
import Translate, {translate} from '@docusaurus/Translate'
import { Button } from '@/components/ui/button'

const highlights = [
  {
    emoji: '🚀',
    text: translate({id: 'homepage.march.highlight1', message: 'NemoClaw announced at NVIDIA GTC'})
  },
  {
    emoji: '⭐',
    text: translate({id: 'homepage.march.highlight2', message: '250K+ GitHub Stars milestone reached'})
  },
  {
    emoji: '🛡️',
    text: translate({id: 'homepage.march.highlight3', message: 'ClawHavoc security patch released'})
  },
  {
    emoji: '🤖',
    text: translate({id: 'homepage.march.highlight4', message: '5 new flagship LLM models supported'})
  }
]

export default function MarchBanner() {
  return (
    <section className='px-4 py-10'>
      <div className='mx-auto max-w-4xl'>
        <div className='relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-900'>
          {/* Gradient border accent on the left */}
          <div className='absolute top-0 left-0 h-full w-1.5 bg-gradient-to-b from-[#ffaa40] via-[#9c40ff] to-[#ffaa40]' />

          <div className='py-8 pr-8 pl-8 sm:pl-10'>
            <div className='mb-1 text-sm font-semibold tracking-wider text-[#9c40ff] uppercase dark:text-[#c084fc]'>
              <Translate id="homepage.march.label" description="March banner label">
                Latest Updates
              </Translate>
            </div>
            <h3 className='mb-6 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white'>
              <Translate id="homepage.march.title" description="March banner title">
                What&apos;s New in March 2026
              </Translate>
            </h3>

            <ul className='mb-8 space-y-3'>
              {highlights.map((item, idx) => (
                <li key={idx} className='flex items-start gap-3 text-base text-gray-700 dark:text-gray-300'>
                  <span className='mt-0.5 text-lg'>{item.emoji}</span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>

            <Button asChild>
              <Link to='/docs/whats-new/march-2026' className='hover:text-primary-foreground'>
                <Translate id="homepage.march.cta" description="March banner CTA">
                  See Full Changelog
                </Translate>
                {' →'}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
