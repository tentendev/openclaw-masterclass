import React from 'react'
import Link from '@docusaurus/Link'
import Translate from '@docusaurus/Translate'
import { Button } from '@/components/ui/button'

export default function SecurityBanner() {
  return (
    <section className='px-4 py-10'>
      <div className='mx-auto max-w-4xl'>
        <div className='relative overflow-hidden rounded-2xl border border-amber-200 bg-amber-50/80 shadow-sm dark:border-amber-800/50 dark:bg-amber-950/30'>
          {/* Top amber accent bar */}
          <div className='h-1 w-full bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400' />

          <div className='p-8 sm:p-10'>
            <div className='flex flex-col gap-6 sm:flex-row sm:items-start'>
              {/* Shield icon area */}
              <div className='flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-3xl dark:bg-amber-900/50'>
                🔒
              </div>

              <div className='flex-1'>
                <h3 className='mb-2 text-xl font-bold text-amber-900 sm:text-2xl dark:text-amber-200'>
                  <Translate id="homepage.security.title" description="Security banner title">
                    Security First
                  </Translate>
                </h3>
                <p className='mb-4 leading-relaxed text-amber-800 dark:text-amber-300/90'>
                  <Translate id="homepage.security.description" description="Security banner description">
                    The ClawHavoc vulnerability highlighted the critical importance of Skill vetting and sandboxing. Always review third-party Skills before installation, enable audit logging, and keep your OpenClaw instance up to date with the latest security patches.
                  </Translate>
                </p>

                <Button asChild variant='outline' className='border-amber-300 bg-white text-amber-900 hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-950/50 dark:text-amber-200 dark:hover:bg-amber-900/50'>
                  <Link to='/docs/security/best-practices'>
                    <Translate id="homepage.security.cta" description="Security banner CTA">
                      Security Best Practices
                    </Translate>
                    {' →'}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
