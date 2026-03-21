import React, { useState, useCallback } from 'react'
import Link from '@docusaurus/Link'
import Translate, { translate } from '@docusaurus/Translate'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

// ---------------------------------------------------------------------------
// Skill database — each skill has tags that map to answer categories
// ---------------------------------------------------------------------------
const SKILLS = [
  { name: 'MailClaw', desc: translate({ id: 'homepage.quiz.skill.mailclaw', message: 'Unified email management and smart filtering' }), cmd: 'clawhub install mailclaw', tags: ['email', 'beginner', 'ease', 'email-plat'] },
  { name: 'CalSync', desc: translate({ id: 'homepage.quiz.skill.calsync', message: 'Cross-platform calendar sync & scheduling' }), cmd: 'clawhub install calsync', tags: ['email', 'beginner', 'efficiency', 'email-plat'] },
  { name: 'DevAssist', desc: translate({ id: 'homepage.quiz.skill.devassist', message: 'AI-powered code review and PR summaries' }), cmd: 'clawhub install devassist', tags: ['dev', 'intermediate', 'efficiency', 'slack', 'discord'] },
  { name: 'GitClaw', desc: translate({ id: 'homepage.quiz.skill.gitclaw', message: 'GitHub/GitLab notifications and CI/CD triggers' }), cmd: 'clawhub install gitclaw', tags: ['dev', 'intermediate', 'efficiency', 'slack', 'discord'] },
  { name: 'CodeReview', desc: translate({ id: 'homepage.quiz.skill.codereview', message: 'Automated code review with LLM analysis' }), cmd: 'clawhub install codereview', tags: ['dev', 'advanced', 'security', 'slack'] },
  { name: 'HomeBridge', desc: translate({ id: 'homepage.quiz.skill.homebridge', message: 'Smart home device control via messaging' }), cmd: 'clawhub install homebridge', tags: ['smarthome', 'beginner', 'ease', 'telegram', 'whatsapp'] },
  { name: 'ClawIoT', desc: translate({ id: 'homepage.quiz.skill.clawiot', message: 'IoT sensor monitoring and automation rules' }), cmd: 'clawhub install clawiot', tags: ['smarthome', 'intermediate', 'efficiency', 'telegram'] },
  { name: 'SceneControl', desc: translate({ id: 'homepage.quiz.skill.scenecontrol', message: 'Multi-device scene automation' }), cmd: 'clawhub install scenecontrol', tags: ['smarthome', 'beginner', 'ease', 'telegram', 'whatsapp'] },
  { name: 'WebScraper', desc: translate({ id: 'homepage.quiz.skill.webscraper', message: 'Scheduled web scraping with change detection' }), cmd: 'clawhub install webscraper', tags: ['research', 'intermediate', 'efficiency', 'slack', 'email-plat'] },
  { name: 'ResearchBot', desc: translate({ id: 'homepage.quiz.skill.researchbot', message: 'Multi-source research aggregation with summaries' }), cmd: 'clawhub install researchbot', tags: ['research', 'intermediate', 'efficiency', 'slack', 'discord'] },
  { name: 'DataPipe', desc: translate({ id: 'homepage.quiz.skill.datapipe', message: 'Automated data collection and ETL pipelines' }), cmd: 'clawhub install datapipe', tags: ['research', 'advanced', 'efficiency', 'slack'] },
  { name: 'AutoFlow', desc: translate({ id: 'homepage.quiz.skill.autoflow', message: 'Visual workflow builder for AI automation' }), cmd: 'clawhub install autoflow', tags: ['automation', 'intermediate', 'ease', 'slack', 'discord'] },
  { name: 'ChainClaw', desc: translate({ id: 'homepage.quiz.skill.chainclaw', message: 'LLM chaining and multi-step AI pipelines' }), cmd: 'clawhub install chainclaw', tags: ['automation', 'advanced', 'efficiency', 'slack'] },
  { name: 'TriggerBot', desc: translate({ id: 'homepage.quiz.skill.triggerbot', message: 'Event-driven automation with smart triggers' }), cmd: 'clawhub install triggerbot', tags: ['automation', 'beginner', 'ease', 'telegram', 'discord'] },
  { name: 'SecureVault', desc: translate({ id: 'homepage.quiz.skill.securevault', message: 'Encrypted secret management for Skills' }), cmd: 'clawhub install securevault', tags: ['dev', 'advanced', 'security', 'free'] },
  { name: 'AuditLog', desc: translate({ id: 'homepage.quiz.skill.auditlog', message: 'Comprehensive audit logging and compliance' }), cmd: 'clawhub install auditlog', tags: ['dev', 'advanced', 'security', 'free'] },
  { name: 'TeleRelay', desc: translate({ id: 'homepage.quiz.skill.telerelay', message: 'Telegram bot with rich UI components' }), cmd: 'clawhub install telerelay', tags: ['automation', 'beginner', 'ease', 'telegram', 'free'] },
  { name: 'WhatsFlow', desc: translate({ id: 'homepage.quiz.skill.whatsflow', message: 'WhatsApp Business API integration' }), cmd: 'clawhub install whatsflow', tags: ['email', 'beginner', 'ease', 'whatsapp'] },
  { name: 'DiscordKit', desc: translate({ id: 'homepage.quiz.skill.discordkit', message: 'Discord slash commands & role management' }), cmd: 'clawhub install discordkit', tags: ['automation', 'beginner', 'ease', 'discord', 'free'] },
  { name: 'SlackOps', desc: translate({ id: 'homepage.quiz.skill.slackops', message: 'Slack workflow automation & ChatOps' }), cmd: 'clawhub install slackops', tags: ['dev', 'intermediate', 'efficiency', 'slack'] },
  { name: 'OpenRouter', desc: translate({ id: 'homepage.quiz.skill.openrouter', message: 'Open-source multi-LLM router and gateway' }), cmd: 'clawhub install openrouter', tags: ['automation', 'advanced', 'free', 'slack', 'discord'] },
]

// ---------------------------------------------------------------------------
// Tag mappings from answer indices to skill tags
// ---------------------------------------------------------------------------
const Q1_TAGS = ['email', 'dev', 'smarthome', 'research', 'automation']
const Q2_TAGS = ['beginner', 'intermediate', 'advanced']
const Q3_TAGS = ['security', 'efficiency', 'ease', 'free']
const Q4_TAGS = ['telegram', 'whatsapp', 'discord', 'slack', 'email-plat']

// ---------------------------------------------------------------------------
// Questions data
// ---------------------------------------------------------------------------
function getQuestions() {
  return [
    {
      id: 'purpose',
      title: translate({ id: 'homepage.quiz.q1.title', message: 'What do you mainly want to use OpenClaw for?' }),
      options: [
        { emoji: '\uD83D\uDCE7', label: translate({ id: 'homepage.quiz.q1.opt1', message: 'Manage emails & calendar' }) },
        { emoji: '\uD83D\uDCBB', label: translate({ id: 'homepage.quiz.q1.opt2', message: 'Assist software development' }) },
        { emoji: '\uD83C\uDFE0', label: translate({ id: 'homepage.quiz.q1.opt3', message: 'Control smart home' }) },
        { emoji: '\uD83D\uDD0D', label: translate({ id: 'homepage.quiz.q1.opt4', message: 'Research & data collection' }) },
        { emoji: '\uD83E\uDD16', label: translate({ id: 'homepage.quiz.q1.opt5', message: 'Build AI automation' }) },
      ],
      multi: false,
    },
    {
      id: 'level',
      title: translate({ id: 'homepage.quiz.q2.title', message: 'What is your technical level?' }),
      options: [
        { emoji: '\uD83C\uDF31', label: translate({ id: 'homepage.quiz.q2.opt1', message: 'Beginner' }) },
        { emoji: '\uD83C\uDF3F', label: translate({ id: 'homepage.quiz.q2.opt2', message: 'Intermediate' }) },
        { emoji: '\uD83C\uDF33', label: translate({ id: 'homepage.quiz.q2.opt3', message: 'Advanced' }) },
      ],
      multi: false,
    },
    {
      id: 'priority',
      title: translate({ id: 'homepage.quiz.q3.title', message: 'What matters most to you?' }),
      options: [
        { emoji: '\uD83D\uDD12', label: translate({ id: 'homepage.quiz.q3.opt1', message: 'Security' }) },
        { emoji: '\u26A1', label: translate({ id: 'homepage.quiz.q3.opt2', message: 'Speed / Efficiency' }) },
        { emoji: '\uD83C\uDFA8', label: translate({ id: 'homepage.quiz.q3.opt3', message: 'Ease of use' }) },
        { emoji: '\uD83D\uDCB0', label: translate({ id: 'homepage.quiz.q3.opt4', message: 'Free / Open source' }) },
      ],
      multi: false,
    },
    {
      id: 'platforms',
      title: translate({ id: 'homepage.quiz.q4.title', message: 'Which platforms do you use?' }),
      subtitle: translate({ id: 'homepage.quiz.q4.subtitle', message: 'Select all that apply' }),
      options: [
        { emoji: '\uD83D\uDCAC', label: 'Telegram' },
        { emoji: '\uD83D\uDCF1', label: 'WhatsApp' },
        { emoji: '\uD83C\uDFAE', label: 'Discord' },
        { emoji: '\uD83D\uDCBC', label: 'Slack' },
        { emoji: '\uD83D\uDCE7', label: 'Email' },
      ],
      multi: true,
    },
  ]
}

// ---------------------------------------------------------------------------
// Recommendation engine
// ---------------------------------------------------------------------------
function getRecommendations(answers) {
  const wantedTags = new Set()

  // Q1 purpose
  if (answers[0] !== undefined) wantedTags.add(Q1_TAGS[answers[0]])
  // Q2 level
  if (answers[1] !== undefined) wantedTags.add(Q2_TAGS[answers[1]])
  // Q3 priority
  if (answers[2] !== undefined) wantedTags.add(Q3_TAGS[answers[2]])
  // Q4 platforms (array)
  if (answers[3]) {
    answers[3].forEach((i) => wantedTags.add(Q4_TAGS[i]))
  }

  // Score each skill
  const scored = SKILLS.map((skill) => {
    let score = 0
    skill.tags.forEach((t) => { if (wantedTags.has(t)) score++ })
    return { ...skill, score }
  })

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, 5)
}

// ---------------------------------------------------------------------------
// Copy-to-clipboard button
// ---------------------------------------------------------------------------
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [text])

  return (
    <button
      onClick={handleCopy}
      className='ml-2 shrink-0 rounded-md border border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
      aria-label={translate({ id: 'homepage.quiz.copyAriaLabel', message: 'Copy install command' })}
    >
      {copied
        ? translate({ id: 'homepage.quiz.copied', message: 'Copied!' })
        : translate({ id: 'homepage.quiz.copy', message: 'Copy' })}
    </button>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
export default function SkillQuiz() {
  const questions = getQuestions()
  const [step, setStep] = useState(0) // 0..3 = questions, 4 = results
  const [answers, setAnswers] = useState([undefined, undefined, undefined, undefined])
  const [multiSelect, setMultiSelect] = useState([]) // for Q4

  const isResults = step === questions.length

  const handleSingleSelect = (optionIdx) => {
    const next = [...answers]
    next[step] = optionIdx
    setAnswers(next)
    // Auto-advance after short delay
    setTimeout(() => setStep((s) => s + 1), 300)
  }

  const handleMultiToggle = (optionIdx) => {
    setMultiSelect((prev) =>
      prev.includes(optionIdx) ? prev.filter((i) => i !== optionIdx) : [...prev, optionIdx]
    )
  }

  const handleMultiConfirm = () => {
    const next = [...answers]
    next[step] = multiSelect.length > 0 ? multiSelect : [0] // default to first if none selected
    setAnswers(next)
    setStep((s) => s + 1)
  }

  const handleBack = () => {
    if (step > 0) {
      if (step === questions.length) {
        // Going back from results to Q4
        setMultiSelect(answers[3] || [])
      }
      setStep((s) => s - 1)
    }
  }

  const handleRestart = () => {
    setStep(0)
    setAnswers([undefined, undefined, undefined, undefined])
    setMultiSelect([])
  }

  const recommendations = isResults ? getRecommendations(answers) : []

  return (
    <section className='px-4 py-10'>
      <div className='mx-auto max-w-3xl'>
        <div className='mb-8 text-center'>
          <h2 className='mb-3 text-2xl font-bold sm:text-3xl'>
            <Translate id='homepage.quiz.sectionTitle'>
              Skill Recommendation Quiz
            </Translate>
          </h2>
          <p className='text-gray-600 dark:text-gray-400'>
            <Translate id='homepage.quiz.sectionSubtitle'>
              Answer 4 quick questions and discover the best Skills for you
            </Translate>
          </p>
        </div>

        {/* Progress bar */}
        {!isResults && (
          <div className='mb-6 flex items-center gap-2'>
            {questions.map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-colors duration-300 ${
                  i < step
                    ? 'bg-blue-500 dark:bg-blue-400'
                    : i === step
                      ? 'bg-blue-300 dark:bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
        )}

        {/* Question cards */}
        {!isResults && (
          <div className='relative'>
            {questions.map((q, qIdx) => (
              <div
                key={q.id}
                className='transition-all duration-500'
                style={{
                  opacity: qIdx === step ? 1 : 0,
                  transform: qIdx === step ? 'translateY(0)' : qIdx > step ? 'translateY(24px)' : 'translateY(-24px)',
                  position: qIdx === step ? 'relative' : 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  pointerEvents: qIdx === step ? 'auto' : 'none',
                }}
              >
                <Card>
                  <CardHeader>
                    <div className='mb-1 flex items-center gap-2'>
                      <Badge variant='outline' className='text-xs'>
                        {qIdx + 1} / {questions.length}
                      </Badge>
                    </div>
                    <CardTitle className='text-xl'>{q.title}</CardTitle>
                    {q.subtitle && (
                      <CardDescription>{q.subtitle}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className='flex flex-col gap-3'>
                      {q.options.map((opt, optIdx) => {
                        const isSelected = q.multi
                          ? multiSelect.includes(optIdx)
                          : answers[qIdx] === optIdx
                        return (
                          <button
                            key={optIdx}
                            onClick={() =>
                              q.multi ? handleMultiToggle(optIdx) : handleSingleSelect(optIdx)
                            }
                            className={`flex items-center gap-3 rounded-lg border-2 px-4 py-3 text-left transition-all duration-200 hover:shadow-sm ${
                              isSelected
                                ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/30'
                                : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-600'
                            }`}
                          >
                            <span className='text-2xl'>{opt.emoji}</span>
                            <span className='text-sm font-medium'>{opt.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </CardContent>
                  <CardFooter className='flex justify-between'>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={handleBack}
                      disabled={step === 0}
                    >
                      <Translate id='homepage.quiz.back'>Back</Translate>
                    </Button>
                    {q.multi && (
                      <Button size='sm' onClick={handleMultiConfirm}>
                        <Translate id='homepage.quiz.next'>Next</Translate>
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {isResults && (
          <div
            className='transition-all duration-500'
            style={{ animation: 'fadeInUp 0.5s ease-out' }}
          >
            <Card>
              <CardHeader className='text-center'>
                <CardTitle className='text-xl'>
                  <Translate id='homepage.quiz.resultsTitle'>
                    Your Top 5 Recommended Skills
                  </Translate>
                </CardTitle>
                <CardDescription>
                  <Translate id='homepage.quiz.resultsSubtitle'>
                    Based on your answers, here are the best Skills for you
                  </Translate>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex flex-col gap-4'>
                  {recommendations.map((skill, idx) => (
                    <div
                      key={skill.name}
                      className='flex flex-col gap-2 rounded-lg border border-gray-200 p-4 transition-all duration-300 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between'
                      style={{
                        animation: `fadeInUp 0.4s ease-out ${idx * 0.1}s both`,
                      }}
                    >
                      <div className='flex-1'>
                        <div className='flex items-center gap-2'>
                          <span className='text-lg font-bold text-blue-600 dark:text-blue-400'>
                            #{idx + 1}
                          </span>
                          <span className='font-semibold'>{skill.name}</span>
                        </div>
                        <p className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
                          {skill.desc}
                        </p>
                      </div>
                      <div className='flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1.5 font-mono text-xs dark:bg-gray-800'>
                        <code className='whitespace-nowrap'>{skill.cmd}</code>
                        <CopyButton text={skill.cmd} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className='flex flex-col items-center gap-3 sm:flex-row sm:justify-between'>
                <Button variant='ghost' size='sm' onClick={handleRestart}>
                  <Translate id='homepage.quiz.restart'>Retake Quiz</Translate>
                </Button>
                <Button asChild size='sm'>
                  <Link to='/docs/top-50-skills/overview'>
                    <Translate id='homepage.quiz.viewAll'>
                      View Full Top 50 Skills
                    </Translate>{' '}
                    &rarr;
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>

      {/* Keyframe animation */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  )
}
