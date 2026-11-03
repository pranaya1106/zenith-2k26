import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/*
  One scrubbed timeline over the runway (the section's tall wrapper), 0 to 1:

    0.00 - 0.35  the light comes up and the headline lines rise in
    0.25 - 0.45  the pink star pops in over the middle of the text, then keeps
                 turning slowly for the rest of the scroll
    0.05 - 0.55  the green form rises from below the screen and settles
                 flush on the bottom edge, overlapping the last line
    0.60 - 0.82  once everything above has played, scrolling on closes four
                 purple corner pieces in until only a four-point star is
                 left open at the centre
    0.90 - 1.18  the same motion carries on: the star closes and the whole
                 screen is purple. It never opens again; the 3D story
                 (AboutStory) is the next sticky stage on the same purple
    1.18 - 1.23  hold

  The stage is position: sticky, so it stays on screen while this plays.
  Every element animates FROM an offset state; the resting CSS is the finished
  composition (without the form over the text), which is what reduced-motion
  visitors get.
*/
export function useAboutZenithScroll(runwayRef) {
  useLayoutEffect(() => {
    const runway = runwayRef.current
    if (!runway) return undefined

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // The form always ends flush with the bottom edge of the screen (its
        // CSS resting position); how far up it reaches comes from its width
        // in the CSS. It starts fully below the screen.
        const shape = runway.querySelector('.zenith__shape')

        // The star cut-out in the purple sheet. The sheet's 100-unit box is
        // fitted to the screen's shorter side, so a star of half-size 50 has
        // its four tips on the edges of that side and keeps the same regular
        // shape on every screen. At scale 10 it is wide open (no purple).
        const hole = runway.querySelector('.zenith__hole')
        const burst = { k: 10 }
        const drawHole = () => {
          hole.setAttribute('transform', `translate(50 50) scale(${50 * burst.k})`)
        }

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: runway,
            start: 'top 75%',
            end: 'bottom bottom',
            scrub: 0.4,
            invalidateOnRefresh: true,
          },
        })

        tl.fromTo(
          '.zenith__light',
          { autoAlpha: 0 },
          { autoAlpha: 1, ease: 'power2.out', duration: 0.35 },
          0,
        )
          .fromTo(
            '.zenith__line',
            { y: 40, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, ease: 'power2.out', duration: 0.2, stagger: 0.04 },
            0.05,
          )
          .fromTo(
            '.zenith__star img',
            { scale: 0.5, rotation: -24, autoAlpha: 0 },
            { scale: 1, rotation: 0, autoAlpha: 1, ease: 'back.out(1.6)', duration: 0.2 },
            0.25,
          )
          .to('.zenith__star img', { rotation: 24, duration: 0.55, immediateRender: false }, 0.45)
          .fromTo(
            shape,
            { y: () => shape.offsetHeight + 40 },
            { y: 0, ease: 'power2.out', duration: 0.5 },
            0.05,
          )
          .fromTo(
            burst,
            // k = 5 is just wide enough that no purple shows, even on a
            // wide screen, so the corner pieces start entering right away
            // and move in step with the scroll (no easing, no dead stretch).
            { k: 5 },
            { k: 1, ease: 'none', duration: 0.22, onUpdate: drawHole },
            0.6,
          )
          // The star is complete at 0.82. A short pause, then the same motion
          // carries on until the star has closed and the screen is all purple.
          .to(burst, { k: 0, ease: 'none', duration: 0.28, onUpdate: drawHole }, 0.9)
          .to({}, { duration: 0.05 }, 1.18)

        return () => {
          burst.k = 10
          drawHole()
        }
      })
    }, runway)

    return () => ctx.revert()
  }, [runwayRef])
}
