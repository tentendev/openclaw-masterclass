import React, { useState, useEffect, useRef, useCallback } from 'react'

const SEQUENCES = [
  {
    command: 'openclaw install framix-team/openclaw-tavily',
    output: [
      '\u2713 Installing Tavily skill...',
      '\u2713 Tavily skill installed successfully!',
      '\u2713 3 new capabilities added: web_search, crawl, extract',
    ],
  },
  {
    command: 'openclaw chat "summarize the top HN stories today"',
    output: [
      '\ud83e\uddde Molty is thinking...',
      'Here are today\u2019s top 5 Hacker News stories:',
      '1. NemoClaw: Nvidia\u2019s new AI agent platform (892 pts)',
      '2. OpenClaw reaches 250K GitHub stars (654 pts)',
      '3. Why every developer needs an AI agent in 2026 (521 pts)',
    ],
  },
  {
    command: 'openclaw doctor',
    output: [
      '\u2713 Node.js v24.1.0',
      '\u2713 Gateway: running on port 18789',
      '\u2713 Memory: 2.4GB / WAL healthy',
      '\u2713 Skills: 23 installed, 0 updates available',
      '\u2713 Channels: Telegram \u2713 Discord \u2713 Slack \u2713',
      '\ud83e\uddde All systems operational!',
    ],
  },
]

const TYPING_SPEED = 40
const OUTPUT_LINE_DELAY = 200
const PAUSE_AFTER_OUTPUT = 2000
const PAUSE_AFTER_SEQUENCE = 1500

export default function TerminalDemo() {
  const [lines, setLines] = useState([])
  const [currentTyped, setCurrentTyped] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  const [isTypingCommand, setIsTypingCommand] = useState(false)

  const seqIndexRef = useRef(0)
  const charIndexRef = useRef(0)
  const outputIndexRef = useRef(0)
  const phaseRef = useRef('idle') // 'typing' | 'output' | 'waiting' | 'idle'
  const timerRef = useRef(null)
  const isPausedRef = useRef(false)
  const linesRef = useRef([])

  // Keep ref in sync with state
  useEffect(() => {
    isPausedRef.current = isPaused
  }, [isPaused])

  useEffect(() => {
    linesRef.current = lines
  }, [lines])

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const scheduleNext = useCallback((fn, delay) => {
    clearTimer()
    timerRef.current = setTimeout(fn, delay)
  }, [clearTimer])

  const showNextOutputLine = useCallback(() => {
    if (isPausedRef.current) {
      timerRef.current = setTimeout(showNextOutputLine, 100)
      return
    }

    const seq = SEQUENCES[seqIndexRef.current]
    if (outputIndexRef.current < seq.output.length) {
      const line = seq.output[outputIndexRef.current]
      setLines(prev => [...prev, { type: 'output', text: line }])
      outputIndexRef.current += 1
      scheduleNext(showNextOutputLine, OUTPUT_LINE_DELAY)
    } else {
      // Done with this sequence's output
      phaseRef.current = 'waiting'
      scheduleNext(() => {
        // Move to next sequence
        seqIndexRef.current = (seqIndexRef.current + 1) % SEQUENCES.length

        // If looping back to start, clear the terminal
        if (seqIndexRef.current === 0) {
          setLines([])
          linesRef.current = []
        }

        charIndexRef.current = 0
        outputIndexRef.current = 0
        scheduleNext(typeNextChar, PAUSE_AFTER_SEQUENCE)
      }, PAUSE_AFTER_OUTPUT)
    }
  }, [scheduleNext])

  const typeNextChar = useCallback(() => {
    if (isPausedRef.current) {
      timerRef.current = setTimeout(typeNextChar, 100)
      return
    }

    const seq = SEQUENCES[seqIndexRef.current]
    const cmd = seq.command

    if (charIndexRef.current < cmd.length) {
      charIndexRef.current += 1
      setCurrentTyped(cmd.slice(0, charIndexRef.current))
      setIsTypingCommand(true)
      scheduleNext(typeNextChar, TYPING_SPEED)
    } else {
      // Command fully typed - commit it as a line
      setLines(prev => [...prev, { type: 'command', text: cmd }])
      setCurrentTyped('')
      setIsTypingCommand(false)
      phaseRef.current = 'output'
      outputIndexRef.current = 0
      scheduleNext(showNextOutputLine, OUTPUT_LINE_DELAY)
    }
  }, [scheduleNext, showNextOutputLine])

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 530)
    return () => clearInterval(interval)
  }, [])

  // Start the animation
  useEffect(() => {
    seqIndexRef.current = 0
    charIndexRef.current = 0
    outputIndexRef.current = 0
    phaseRef.current = 'typing'
    setLines([])
    setCurrentTyped('')

    const startTimer = setTimeout(() => {
      typeNextChar()
    }, 800)

    return () => {
      clearTimeout(startTimer)
      clearTimer()
    }
  }, [typeNextChar, clearTimer])

  const togglePause = () => {
    setIsPaused(prev => !prev)
  }

  return (
    <section className='px-4 py-12 sm:py-16'>
      <div className='mx-auto max-w-3xl'>
        {/* Terminal window */}
        <div
          className='overflow-hidden rounded-xl border border-gray-700/50'
          style={{
            boxShadow: '0 0 40px rgba(34, 197, 94, 0.12), 0 0 80px rgba(34, 197, 94, 0.06)',
            background: '#0d1117',
          }}
        >
          {/* Title bar */}
          <div className='flex items-center justify-between px-4 py-3' style={{ background: '#161b22' }}>
            <div className='flex items-center gap-2'>
              <span className='inline-block h-3 w-3 rounded-full' style={{ background: '#ff5f57' }} />
              <span className='inline-block h-3 w-3 rounded-full' style={{ background: '#febc2e' }} />
              <span className='inline-block h-3 w-3 rounded-full' style={{ background: '#28c840' }} />
            </div>
            <span className='text-xs text-gray-500 font-mono select-none'>openclaw &mdash; zsh</span>
            <button
              onClick={togglePause}
              className='rounded px-2 py-0.5 text-xs text-gray-400 transition-colors hover:bg-gray-700 hover:text-gray-200'
              aria-label={isPaused ? 'Resume animation' : 'Pause animation'}
              type='button'
            >
              {isPaused ? '\u25b6 Resume' : '\u23f8 Pause'}
            </button>
          </div>

          {/* Terminal body */}
          <div className='overflow-x-auto p-4 sm:p-6 font-mono text-sm leading-relaxed sm:text-base' style={{ minHeight: '260px' }}>
            {/* Rendered lines */}
            {lines.map((line, i) => (
              <div key={i} className='whitespace-pre-wrap'>
                {line.type === 'command' ? (
                  <span>
                    <span style={{ color: '#7ee787' }}>$ </span>
                    <span style={{ color: '#e6edf3' }}>{line.text}</span>
                  </span>
                ) : (
                  <span style={{ color: '#8b949e' }}>{line.text}</span>
                )}
              </div>
            ))}

            {/* Currently typing line */}
            {(isTypingCommand || currentTyped) && (
              <div className='whitespace-pre-wrap'>
                <span style={{ color: '#7ee787' }}>$ </span>
                <span style={{ color: '#e6edf3' }}>{currentTyped}</span>
                <span
                  className='inline-block w-[8px] translate-y-[1px]'
                  style={{
                    height: '1.15em',
                    background: showCursor ? '#7ee787' : 'transparent',
                    marginLeft: '1px',
                  }}
                />
              </div>
            )}

            {/* Idle cursor (when nothing is typing) */}
            {!isTypingCommand && !currentTyped && lines.length === 0 && (
              <div className='whitespace-pre-wrap'>
                <span style={{ color: '#7ee787' }}>$ </span>
                <span
                  className='inline-block w-[8px] translate-y-[1px]'
                  style={{
                    height: '1.15em',
                    background: showCursor ? '#7ee787' : 'transparent',
                    marginLeft: '1px',
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
