import { useEffect } from 'react'

/**
 * Reveals every `[data-reveal]` element once it enters the viewport.
 * Content is visible by default; the hidden start state only applies when
 * the `js` class is present (set in main.jsx), so a JS failure never hides copy.
 */
export function useReveal() {
  useEffect(() => {
    const pending = () => document.querySelectorAll('[data-reveal]:not(.is-visible)')

    if (!('IntersectionObserver' in window)) {
      pending().forEach((node) => node.classList.add('is-visible'))
      return undefined
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

    pending().forEach((node) => observer.observe(node))

    // Elements mounted after the first render (re-mounted components, hot
    // reloads) would otherwise stay at opacity 0 forever, so watch for them.
    const mutations = new MutationObserver(() => {
      pending().forEach((node) => observer.observe(node))
    })
    mutations.observe(document.body, { childList: true, subtree: true })

    return () => {
      mutations.disconnect()
      observer.disconnect()
    }
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
