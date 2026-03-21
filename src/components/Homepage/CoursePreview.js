import React from 'react'
import Link from '@docusaurus/Link'
import Translate, {translate} from '@docusaurus/Translate'
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const modules = [
  {
    number: '01',
    title: translate({id: 'homepage.course.mod1.title', message: 'Architecture Deep Dive'}),
    description: translate({id: 'homepage.course.mod1.desc', message: 'Understand the OpenClaw core architecture, event pipeline, and plugin system from the ground up.'}),
    difficulty: translate({id: 'homepage.course.difficulty.beginner', message: 'Beginner'}),
    difficultyColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    link: '/docs/masterclass/module-01'
  },
  {
    number: '02',
    title: translate({id: 'homepage.course.mod2.title', message: 'Your First Skill'}),
    description: translate({id: 'homepage.course.mod2.desc', message: 'Build, test, and publish a Skill from scratch with step-by-step guidance.'}),
    difficulty: translate({id: 'homepage.course.difficulty.beginner', message: 'Beginner'}),
    difficultyColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    link: '/docs/masterclass/module-02'
  },
  {
    number: '03',
    title: translate({id: 'homepage.course.mod3.title', message: 'Multi-Platform Deploy'}),
    description: translate({id: 'homepage.course.mod3.desc', message: 'Deploy OpenClaw across Slack, Discord, Teams, and LINE with unified configuration.'}),
    difficulty: translate({id: 'homepage.course.difficulty.intermediate', message: 'Intermediate'}),
    difficultyColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    link: '/docs/masterclass/module-03'
  },
  {
    number: '04',
    title: translate({id: 'homepage.course.mod4.title', message: 'Gateway API & Routing'}),
    description: translate({id: 'homepage.course.mod4.desc', message: 'Master the Gateway API for traffic management, rate limiting, and intelligent routing.'}),
    difficulty: translate({id: 'homepage.course.difficulty.intermediate', message: 'Intermediate'}),
    difficultyColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    link: '/docs/masterclass/module-04'
  },
  {
    number: '05',
    title: translate({id: 'homepage.course.mod5.title', message: 'LLM Integration'}),
    description: translate({id: 'homepage.course.mod5.desc', message: 'Connect OpenClaw to GPT-4o, Claude, Gemini, and open-source models via a unified interface.'}),
    difficulty: translate({id: 'homepage.course.difficulty.advanced', message: 'Advanced'}),
    difficultyColor: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
    link: '/docs/masterclass/module-05'
  },
  {
    number: '06',
    title: translate({id: 'homepage.course.mod6.title', message: 'Security Hardening'}),
    description: translate({id: 'homepage.course.mod6.desc', message: 'Implement best practices for Skill vetting, sandboxing, secret management, and audit logging.'}),
    difficulty: translate({id: 'homepage.course.difficulty.advanced', message: 'Advanced'}),
    difficultyColor: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
    link: '/docs/masterclass/module-06'
  }
]

export default function CoursePreview() {
  return (
    <section className='px-4 py-10'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-10 text-center'>
          <h2 className='mb-3 text-2xl font-bold sm:text-3xl'>
            <Translate id="homepage.course.sectionTitle" description="Course preview section title">
              MasterClass Modules
            </Translate>
          </h2>
          <p className='text-gray-600 dark:text-gray-400'>
            <Translate id="homepage.course.sectionSubtitle" description="Course preview section subtitle">
              Six structured modules from fundamentals to production-grade expertise
            </Translate>
          </p>
        </div>

        <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
          {modules.map((mod) => (
            <Card key={mod.number} className='flex h-full flex-col justify-between transition-shadow duration-200 hover:shadow-md'>
              <CardHeader>
                <div className='mb-2 flex items-center justify-between'>
                  <span className='text-sm font-bold tracking-wider text-gray-400 dark:text-gray-500'>
                    MODULE {mod.number}
                  </span>
                  <Badge variant='outline' className={mod.difficultyColor + ' border-0'}>
                    {mod.difficulty}
                  </Badge>
                </div>
                <CardTitle className='text-lg'>{mod.title}</CardTitle>
                <CardDescription className='mt-2 leading-relaxed'>{mod.description}</CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild variant='outline' size='sm'>
                  <Link to={mod.link} className='hover:text-accent-foreground'>
                    {translate({id: 'homepage.course.viewModule', message: 'View Module'})} →
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
