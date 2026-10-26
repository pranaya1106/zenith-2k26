/**
 * Parallax layers — adapted from the Osmo / 21st.dev ParallaxComponent.
 *
 * Instead of a fixed demo markup, this hook drives any element inside `scopeRef`
 * through data attributes, so it can be dropped onto an existing section:
 *
 *   data-parallax-speed="40"   yPercent travelled while the section scrolls out
 *                              (positive = lags behind / far away,
 *                               negative = rushes ahead / close to the viewer)
 *   data-parallax-spin="90"    degrees rotated over the same scroll distance
 *   data-parallax-depth="50"   px the element drifts toward the mouse pointer
 *
 * Everything is skipped under prefers-reduced-motion, and the pointer drift only
 * runs on devices with a fine, hovering pointer.
 */
import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const MOTION_OK = '(prefers-reduced-motion: no-preference)'

export function useParallax(scopeRef) {
  useEffect(() => {
    const scope = scopeRef.current
    if (!scope) return undefined

    const mm = gsap.matchMedia()

    // Scroll-linked layers
    mm.add(MOTION_OK, () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scope,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      scope.querySelectorAll('[data-parallax-speed]').forEach((el) => {
        tl.to(el, { yPercent: parseFloat(el.dataset.parallaxSpeed), ease: 'none' }, 0)
      })
      scope.querySelectorAll('[data-parallax-spin]').forEach((el) => {
        tl.to(el, { rotation: `+=${parseFloat(el.dataset.parallaxSpin)}`, ease: 'none' }, 0)
      })
    })

    // Pointer-linked drift
    mm.add(`${MOTION_OK} and (hover: hover) and (pointer: fine)`, () => {
      const items = [...scope.querySelectorAll('[data-parallax-depth]')].map((el) => ({
        depth: parseFloat(el.dataset.parallaxDepth),
        x: gsap.quickTo(el, 'x', { duration: 1.1, ease: 'power3.out' }),
        y: gsap.quickTo(el, 'y', { duration: 1.1, ease: 'power3.out' }),
      }))

      const onMove = (event) => {
        const rect = scope.getBoundingClientRect()
        const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1
        const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1
        items.forEach((item) => {
          item.x(nx * item.depth)
          item.y(ny * item.depth)
        })
      }
      const onLeave = () => items.forEach((item) => { item.x(0); item.y(0) })

      scope.addEventListener('pointermove', onMove)
      scope.addEventListener('pointerleave', onLeave)
      return () => {
        scope.removeEventListener('pointermove', onMove)
        scope.removeEventListener('pointerleave', onLeave)
      }
    })

    // Reverts every tween, ScrollTrigger and listener created above.
    return () => mm.revert()
  }, [scopeRef])
}
