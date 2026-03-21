import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useHistory } from '@docusaurus/router'
import Translate, { translate } from '@docusaurus/Translate'
import useBaseUrl from '@docusaurus/useBaseUrl'

// ─── Command registry (~30 key pages) ───────────────────────────────
const COMMANDS = [
  // 📚 Course Modules
  { title: 'MasterClass Overview', path: '/docs/masterclass/overview', category: 'modules', icon: '📚' },
  { title: 'Module 1 — Foundations', path: '/docs/masterclass/module-01-foundations', category: 'modules', icon: '📚' },
  { title: 'Module 2 — Gateway', path: '/docs/masterclass/module-02-gateway', category: 'modules', icon: '📚' },
  { title: 'Module 3 — Skills System', path: '/docs/masterclass/module-03-skills-system', category: 'modules', icon: '📚' },
  { title: 'Module 4 — ClawHub', path: '/docs/masterclass/module-04-clawhub', category: 'modules', icon: '📚' },
  { title: 'Module 5 — Memory', path: '/docs/masterclass/module-05-memory', category: 'modules', icon: '📚' },
  { title: 'Module 6 — Automation', path: '/docs/masterclass/module-06-automation', category: 'modules', icon: '📚' },
  { title: 'Module 7 — Browser', path: '/docs/masterclass/module-07-browser', category: 'modules', icon: '📚' },
  { title: 'Module 8 — Multi-Agent', path: '/docs/masterclass/module-08-multi-agent', category: 'modules', icon: '📚' },
  { title: 'Module 9 — Security', path: '/docs/masterclass/module-09-security', category: 'modules', icon: '📚' },
  { title: 'Module 10 — Production', path: '/docs/masterclass/module-10-production', category: 'modules', icon: '📚' },
  { title: 'Module 11 — Voice & Canvas', path: '/docs/masterclass/module-11-voice-canvas', category: 'modules', icon: '📚' },
  { title: 'Module 12 — Enterprise', path: '/docs/masterclass/module-12-enterprise', category: 'modules', icon: '📚' },

  // 🏆 Top 50 Skills
  { title: 'Top 50 Skills Overview', path: '/docs/top-50-skills/overview', category: 'skills', icon: '🏆' },
  { title: 'Skills — AI & ML', path: '/docs/top-50-skills/ai-ml', category: 'skills', icon: '🏆' },
  { title: 'Skills — Automation', path: '/docs/top-50-skills/automation', category: 'skills', icon: '🏆' },
  { title: 'Skills — Communication', path: '/docs/top-50-skills/communication', category: 'skills', icon: '🏆' },
  { title: 'Skills — Data', path: '/docs/top-50-skills/data', category: 'skills', icon: '🏆' },
  { title: 'Skills — Development', path: '/docs/top-50-skills/development', category: 'skills', icon: '🏆' },
  { title: 'Skills — Media', path: '/docs/top-50-skills/media', category: 'skills', icon: '🏆' },
  { title: 'Skills — Productivity', path: '/docs/top-50-skills/productivity', category: 'skills', icon: '🏆' },
  { title: 'Skills — Research', path: '/docs/top-50-skills/research', category: 'skills', icon: '🏆' },
  { title: 'Skills — Smart Home', path: '/docs/top-50-skills/smart-home', category: 'skills', icon: '🏆' },
  { title: 'Skills — Safety Guide', path: '/docs/top-50-skills/safety-guide', category: 'skills', icon: '🏆' },

  // 📖 Guides
  { title: 'Getting Started — Installation', path: '/docs/getting-started/installation', category: 'guides', icon: '📖' },
  { title: 'Getting Started — First Setup', path: '/docs/getting-started/first-setup', category: 'guides', icon: '📖' },
  { title: 'Getting Started — Choose LLM', path: '/docs/getting-started/choose-llm', category: 'guides', icon: '📖' },
  { title: 'Getting Started — Connect Channels', path: '/docs/getting-started/connect-channels', category: 'guides', icon: '📖' },
  { title: 'Getting Started — Soul MD Config', path: '/docs/getting-started/soul-md-config', category: 'guides', icon: '📖' },
  { title: 'Security — Best Practices', path: '/docs/security/best-practices', category: 'guides', icon: '📖' },
  { title: 'Security — Threat Model', path: '/docs/security/threat-model', category: 'guides', icon: '📖' },
  { title: 'Security — Skill Audit Checklist', path: '/docs/security/skill-audit-checklist', category: 'guides', icon: '📖' },
  { title: 'FAQ', path: '/docs/faq', category: 'guides', icon: '📖' },
  { title: 'Glossary', path: '/docs/glossary', category: 'guides', icon: '📖' },
  { title: "What's New", path: '/docs/whats-new', category: 'guides', icon: '📖' },

  // 🌐 Communities
  { title: 'Communities — How to Engage', path: '/docs/communities/how-to-engage', category: 'communities', icon: '🌐' },
  { title: 'Communities — Top 10', path: '/docs/communities/top-10', category: 'communities', icon: '🌐' },
  { title: 'Reddit — Discussion Hacks', path: '/docs/reddit/discussion-hacks', category: 'communities', icon: '🌐' },
  { title: 'Reddit — Top 30 Showcases', path: '/docs/reddit/top-30-showcases', category: 'communities', icon: '🌐' },

  // 📰 Blog
  { title: 'Blog — Welcome', path: '/blog/2026/03/20/openclaw-masterclass-welcome', category: 'blog', icon: '📰' },
  { title: 'Blog — OpenClaw History', path: '/blog/2026/03/20/openclaw-history', category: 'blog', icon: '📰' },
  { title: 'Blog — Security Guide', path: '/blog/2026/03/20/security-guide', category: 'blog', icon: '📰' },
]

const CATEGORY_LABELS = {
  modules: { id: 'commandPalette.category.modules', fallback: 'Course Modules' },
  skills: { id: 'commandPalette.category.skills', fallback: 'Top 50 Skills' },
  guides: { id: 'commandPalette.category.guides', fallback: 'Guides' },
  communities: { id: 'commandPalette.category.communities', fallback: 'Communities' },
  blog: { id: 'commandPalette.category.blog', fallback: 'Blog Posts' },
}

const CATEGORY_ORDER = ['modules', 'skills', 'guides', 'communities', 'blog']

// ─── Fuzzy-ish substring matching ────────────────────────────────────
function matchesQuery(item, query) {
  if (!query) return true
  const q = query.toLowerCase()
  return (
    item.title.toLowerCase().includes(q) ||
    item.path.toLowerCase().includes(q) ||
    item.category.toLowerCase().includes(q)
  )
}

// ─── Magnifying glass SVG ────────────────────────────────────────────
function SearchIcon() {
  return (
    <svg
      className="w-5 h-5 text-gray-400 dark:text-gray-500 shrink-0"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
      />
    </svg>
  )
}

// ─── Main component ──────────────────────────────────────────────────
export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const history = useHistory()
  const baseUrl = useBaseUrl('/')

  // Resolve full path with base URL
  const resolveUrl = useCallback(
    (path) => {
      // baseUrl already ends with /, path starts with /
      const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
      return base + path
    },
    [baseUrl]
  )

  // Filter commands
  const filtered = useMemo(() => {
    return COMMANDS.filter((item) => matchesQuery(item, query))
  }, [query])

  // Group by category in order
  const grouped = useMemo(() => {
    const groups = []
    for (const cat of CATEGORY_ORDER) {
      const items = filtered.filter((i) => i.category === cat)
      if (items.length > 0) {
        groups.push({ category: cat, items })
      }
    }
    return groups
  }, [filtered])

  // Flat list for keyboard nav
  const flatItems = useMemo(() => {
    return grouped.flatMap((g) => g.items)
  }, [grouped])

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    function onKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIndex(0)
      // Small delay to let the animation start
      requestAnimationFrame(() => {
        inputRef.current?.focus()
      })
    }
  }, [open])

  // Scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return
    const selected = listRef.current.querySelector('[data-selected="true"]')
    if (selected) {
      selected.scrollIntoView({ block: 'nearest' })
    }
  }, [selectedIndex])

  // Navigate to item
  const navigateTo = useCallback(
    (item) => {
      setOpen(false)
      history.push(resolveUrl(item.path))
    },
    [history, resolveUrl]
  )

  // Keyboard nav inside palette
  const onInputKeyDown = useCallback(
    (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((i) => Math.min(i + 1, flatItems.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (flatItems[selectedIndex]) {
          navigateTo(flatItems[selectedIndex])
        }
      } else if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
      }
    },
    [flatItems, selectedIndex, navigateTo]
  )

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  if (typeof document === 'undefined') return null

  // Track flat index across groups
  let flatIdx = 0

  return createPortal(
    <>
      {/* Overlay + Modal */}
      <div
        className={`
          fixed inset-0 z-[9999] flex items-start justify-center pt-[12vh]
          transition-all duration-200 ease-out
          ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={() => setOpen(false)}
        role="presentation"
      >
        {/* Backdrop */}
        <div
          className={`
            absolute inset-0 bg-black/50 backdrop-blur-sm
            transition-opacity duration-200
            ${open ? 'opacity-100' : 'opacity-0'}
          `}
        />

        {/* Card */}
        <div
          className={`
            relative w-full max-w-[640px] mx-4
            bg-white dark:bg-gray-900
            rounded-xl shadow-2xl
            border border-gray-200 dark:border-gray-700
            overflow-hidden
            transition-all duration-200 ease-out
            ${open ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 -translate-y-4'}
          `}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={translate({
            id: 'commandPalette.ariaLabel',
            message: 'Command Palette',
          })}
        >
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <SearchIcon />
            <input
              ref={inputRef}
              type="text"
              className="
                flex-1 bg-transparent outline-none
                text-base text-gray-900 dark:text-gray-100
                placeholder-gray-400 dark:placeholder-gray-500
              "
              placeholder={translate({
                id: 'commandPalette.placeholder',
                message: '搜尋頁面...',
                description: 'Command palette search placeholder',
              })}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onInputKeyDown}
            />
            <kbd className="
              hidden sm:inline-flex items-center gap-1
              px-1.5 py-0.5 rounded
              text-xs font-medium
              text-gray-400 dark:text-gray-500
              bg-gray-100 dark:bg-gray-800
              border border-gray-200 dark:border-gray-700
            ">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div
            ref={listRef}
            className="max-h-[60vh] overflow-y-auto overscroll-contain py-2"
          >
            {flatItems.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-400 dark:text-gray-500 text-sm">
                <Translate id="commandPalette.noResults">找不到結果</Translate>
              </div>
            ) : (
              grouped.map((group) => {
                const label = CATEGORY_LABELS[group.category]
                return (
                  <div key={group.category} className="mb-1">
                    {/* Category header */}
                    <div className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                      <Translate id={label.id}>{label.fallback}</Translate>
                    </div>
                    {/* Items */}
                    {group.items.map((item) => {
                      const idx = flatIdx++
                      const isSelected = idx === selectedIndex
                      // Build breadcrumb from path
                      const breadcrumb = item.path
                        .replace(/^\/docs\//, '')
                        .replace(/^\/blog\//, 'blog/')
                        .replace(/\//g, ' › ')
                      return (
                        <button
                          key={item.path}
                          data-selected={isSelected}
                          className={`
                            w-full flex items-center gap-3 px-4 py-2.5 text-left
                            transition-colors duration-75 cursor-pointer
                            ${
                              isSelected
                                ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }
                          `}
                          onClick={() => navigateTo(item)}
                          onMouseEnter={() => setSelectedIndex(idx)}
                        >
                          <span className="text-lg leading-none shrink-0">{item.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium truncate">{item.title}</div>
                            <div className="text-xs text-gray-400 dark:text-gray-500 truncate">
                              {breadcrumb}
                            </div>
                          </div>
                          {isSelected && (
                            <kbd className="
                              hidden sm:inline-flex items-center
                              px-1.5 py-0.5 rounded
                              text-[10px] font-medium
                              text-gray-400 dark:text-gray-500
                              bg-gray-100 dark:bg-gray-800
                              border border-gray-200 dark:border-gray-700
                            ">
                              Enter ↵
                            </kbd>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )
              })
            )}
          </div>

          {/* Footer hint */}
          <div className="flex items-center gap-4 px-4 py-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-400 dark:text-gray-500">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[10px]">↑↓</kbd>
              <Translate id="commandPalette.hint.navigate">瀏覽</Translate>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[10px]">↵</kbd>
              <Translate id="commandPalette.hint.open">開啟</Translate>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-[10px]">esc</kbd>
              <Translate id="commandPalette.hint.close">關閉</Translate>
            </span>
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}

// ─── Shortcut badge for navbar ───────────────────────────────────────
export function CommandPaletteHint() {
  const [isMac, setIsMac] = useState(true)

  useEffect(() => {
    setIsMac(
      typeof navigator !== 'undefined' &&
        /Mac|iPhone|iPad|iPod/.test(navigator.platform ?? navigator.userAgent)
    )
  }, [])

  const handleClick = useCallback(() => {
    // Dispatch Cmd+K / Ctrl+K to trigger the palette
    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'k',
        code: 'KeyK',
        metaKey: isMac,
        ctrlKey: !isMac,
        bubbles: true,
      })
    )
  }, [isMac])

  return (
    <button
      onClick={handleClick}
      className="
        hidden sm:inline-flex items-center gap-1.5
        px-2.5 py-1 ml-2 rounded-lg
        text-xs font-medium cursor-pointer
        text-gray-500 dark:text-gray-400
        bg-gray-100 dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        hover:bg-gray-200 dark:hover:bg-gray-700
        hover:text-gray-700 dark:hover:text-gray-200
        transition-colors duration-150
      "
      aria-label={translate({
        id: 'commandPalette.openHint',
        message: 'Open command palette',
      })}
      type="button"
    >
      <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
      </svg>
      <span>{isMac ? '⌘' : 'Ctrl+'}K</span>
    </button>
  )
}
