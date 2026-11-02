import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/*
  Leaving the hero: the composition recedes rather than cutting away.
  0.35 matches the depth the rest of the page fades to on scroll
  (useSectionTransitions), so the hero leaves like every other section.
*/
export function useHeroDepart(heroRef) {
  useLayoutEffect(() => {
    const root = heroRef.current
    if (!root) return undefined

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const depart = gsap.to('.hero__inner', {
          autoAlpha: 0.35,
          ease: 'none',
          scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
        })

        return () => depart.kill()
      })
    }, root)

    return () => ctx.revert()
  }, [heroRef])
}
