import { useEffect } from 'react'

/**
 * Reveals every `[data-reveal]` element once it enters the viewport.
 * Content is visible by default; the hidden start state only applies when
 * the `js` class is present (set in main.jsx), so a JS failure never hides copy.
 */
export function useReveal() {
  useEffect(() => {
    const nodes = document.querySelectorAll('[data-reveal]:not(.is-visible)')
    if (!nodes.length) return

    if (!('IntersectionObserver' in window)) {
      nodes.forEach((node) => node.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])
}

/** Countdown to an ISO timestamp. Always returns zeroed units once passed. */
export function getCountdown(targetISO, now = Date.now()) {
  const diff = Math.max(0, new Date(targetISO).getTime() - now)
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    done: diff === 0,
  }
}
