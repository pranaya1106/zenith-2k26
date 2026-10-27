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

/**
 * @param scopeRef  section whose descendants carry the data attributes
 * @param options   { start, end } ScrollTrigger range. The default suits a
 *                  section at the top of the page (the hero); for sections
 *                  further down use { start: 'top bottom', end: 'bottom top' }.
 *                  `centered: true` travels from -speed/2 to +speed/2, so
 *                  layers sit at their CSS position mid-scroll instead of
 *                  starting there. `media` adds an extra media query gate.
 */
export function useParallax(
  scopeRef,
  { start = 'top top', end = 'bottom top', centered = false, media = '' } = {},
) {
  useEffect(() => {
    const scope = scopeRef.current
    if (!scope) return undefined

    const mm = gsap.matchMedia()
    const scrollQuery = media ? `${MOTION_OK} and ${media}` : MOTION_OK

    // Scroll-linked layers
    mm.add(scrollQuery, () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scope,
          start,
          end,
          scrub: true,
        },
      })

      scope.querySelectorAll('[data-parallax-speed]').forEach((el) => {
        const speed = parseFloat(el.dataset.parallaxSpeed)
        if (centered) {
          tl.fromTo(el, { yPercent: -speed / 2 }, { yPercent: speed / 2, ease: 'none' }, 0)
        } else {
          tl.to(el, { yPercent: speed, ease: 'none' }, 0)
        }
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
  }, [scopeRef, start, end, centered, media])
}
