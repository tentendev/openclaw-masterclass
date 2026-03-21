import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useLocation } from '@docusaurus/router'

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0)
  const rafRef = useRef(null)
  const location = useLocation()

  const isDocsPage = location.pathname.startsWith('/docs')

  const handleScroll = useCallback(() => {
    if (rafRef.current) return

    rafRef.current = requestAnimationFrame(() => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight

      if (docHeight <= 0) {
        setProgress(0)
      } else {
        setProgress(Math.min((scrollTop / docHeight) * 100, 100))
      }

      rafRef.current = null
    })
  }, [])

  useEffect(() => {
    if (!isDocsPage) {
      setProgress(0)
      return
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [isDocsPage, handleScroll])

  if (!isDocsPage || progress === 0) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: `${progress}%`,
        height: '3px',
        background: 'linear-gradient(90deg, #E74C3C 0%, #FF6B58 50%, #E74C3C 100%)',
        backgroundSize: '200% 100%',
        zIndex: 9999,
        transition: 'width 0.15s ease-out',
        boxShadow: '0 0 4px rgba(231, 76, 60, 0.4)',
      }}
    />
  )
}
