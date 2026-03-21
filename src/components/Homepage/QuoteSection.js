import React from 'react'
import Translate from '@docusaurus/Translate'

export default function QuoteSection() {
  return (
    <section className='px-4 py-12 sm:py-16'>
      <div className='mx-auto max-w-4xl'>
        <div className='relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 via-white to-gray-100 p-8 shadow-lg sm:p-12 dark:from-gray-800/60 dark:via-gray-900/80 dark:to-gray-800/60'>
          {/* Decorative gradient accent */}
          <div className='absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-[#ffaa40] via-[#9c40ff] to-[#ffaa40]' />

          {/* Large quotation mark */}
          <div className='pointer-events-none absolute top-4 left-6 text-[120px] leading-none font-serif text-gray-200 select-none sm:text-[160px] dark:text-gray-700'>
            &ldquo;
          </div>

          <div className='relative z-10'>
            <blockquote className='mb-6 text-xl leading-relaxed font-medium text-gray-800 italic sm:text-2xl md:text-3xl dark:text-gray-100'>
              <Translate id="homepage.quote.text" description="Jensen Huang quote about OpenClaw">
                Probably the single most important release of software ever
              </Translate>
            </blockquote>

            <div className='flex items-center gap-3'>
              <div className='h-px flex-1 bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-600' />
              <cite className='text-sm font-semibold not-italic text-gray-600 sm:text-base dark:text-gray-400'>
                <Translate id="homepage.quote.attribution" description="Quote attribution">
                  Jensen Huang, CEO of NVIDIA — GTC 2026
                </Translate>
              </cite>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
