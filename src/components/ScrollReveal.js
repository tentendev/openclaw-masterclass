import React, { useEffect, useRef, useState } from 'react'

const getTransform = (direction) => {
  switch (direction) {
    case 'left':
      return 'translateX(-40px)'
    case 'right':
      return 'translateX(40px)'
    case 'up':
    default:
      return 'translateY(40px)'
  }
}

export default function ScrollReveal({
  children,
  delay = 0,
  direction = 'up',
  duration = 600,
}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mq.matches)

    if (mq.matches) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )

    const el = ref.current
    if (el) {
      observer.observe(el)
    }

    return () => {
      if (el) {
        observer.unobserve(el)
      }
    }
  }, [])

  const style = prefersReducedMotion
    ? {}
    : {
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'none' : getTransform(direction),
        transition: `opacity ${duration}ms ease ${delay}ms, transform ${duration}ms ease ${delay}ms`,
        willChange: 'opacity, transform',
      }

  return (
    <div ref={ref} style={style}>
      {children}
    </div>
  )
}
