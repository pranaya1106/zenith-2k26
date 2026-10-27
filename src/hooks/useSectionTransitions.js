import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Scroll-linked hand-off between sections.
 *
 * Each `.section` (except pinned/sticky ones) has its inner content rise and
 * fade in as it enters, scrubbed to the scroll so it moves with Lenis instead
 * of firing once. Only `.section__inner` is animated — never the section
 * itself — so pinning, sticky children and ScrollTrigger measurements stay
 * correct.
 */
export function useSectionTransitions() {
  useEffect(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      document.querySelectorAll('main .section').forEach((section) => {
        const inners = section.querySelectorAll(':scope > .section__inner')
        if (!inners.length) return

        gsap.fromTo(
          inners,
          { y: 70, opacity: 0.35 },
          {
            y: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'top 45%',
              scrub: true,
            },
          },
        )
      })

      // Sections above may change height after fonts load
      ScrollTrigger.refresh()
    })

    return () => mm.revert()
  }, [])
}
