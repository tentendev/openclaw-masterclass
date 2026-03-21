import React, { useState, useEffect, useMemo } from 'react'
import { translate } from '@docusaurus/Translate'
import { useLocation } from '@docusaurus/router'

const TIPS = [
  {
    id: 'floatingMolty.tip.bind',
    message: '記得綁定 127.0.0.1！',
    en: 'Remember to bind 127.0.0.1!',
  },
  {
    id: 'floatingMolty.tip.ratings',
    message: '安裝 Skill 前先看評分！',
    en: 'Check ratings before installing!',
  },
  {
    id: 'floatingMolty.tip.podman',
    message: '用 Podman 取代 Docker 更安全！',
    en: 'Podman is safer than Docker!',
  },
  {
    id: 'floatingMolty.tip.soul',
    message: 'SOUL.md 決定你的 Agent 人格！',
    en: "SOUL.md defines your agent's personality!",
  },
]

export default function FloatingMolty() {
  const location = useLocation()
  const [dismissed, setDismissed] = useState(false)
  const [hovered, setHovered] = useState(false)

  const isHomepage = location.pathname === '/' || location.pathname.match(/^\/[a-z]{2}(-[A-Za-z]+)?\/?$/)

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('molty-dismissed')) {
      setDismissed(true)
    }
  }, [])

  const randomTip = useMemo(() => {
    const tip = TIPS[Math.floor(Math.random() * TIPS.length)]
    return translate({ id: tip.id, message: tip.message })
  }, [])

  if (!isHomepage || dismissed) {
    return null
  }

  const handleDismiss = () => {
    setDismissed(true)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('molty-dismissed', '1')
    }
  }

  return (
    <div
      className="floating-molty"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleDismiss}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleDismiss() }}
      aria-label="Molty mascot - click to dismiss"
      style={{
        position: 'fixed',
        bottom: '80px',
        right: '24px',
        zIndex: 100,
        cursor: 'pointer',
        fontSize: '40px',
        lineHeight: 1,
        animation: 'molty-bob 2s ease-in-out infinite',
        transform: hovered ? 'scale(1.2)' : 'scale(1)',
        transition: 'transform 0.2s ease',
        userSelect: 'none',
      }}
    >
      {hovered && (
        <div className="molty-speech-bubble">
          {randomTip}
        </div>
      )}
      <span role="img" aria-label="lobster mascot">🦞</span>
    </div>
  )
}
