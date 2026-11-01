import { useLayoutEffect } from 'react'
import gsap from 'gsap'

const MOTION_OK = '(prefers-reduced-motion: no-preference)'

/*
  The title clip (public/assets/hero/title-animation.mp4, 956x470, black
  ground) builds the lockup letter by letter. It is trimmed to 5.4s and the
  lockup is fully formed by about 4.5s, so the page takes over at this moment
  of the clip. Raise it to hold the finished lockup longer.
*/
const HANDOFF_AT = 4.9

/*
  Where the clip's lockup lands relative to the static wordmark image, as
  fractions of the wordmark's rendered width W: the clip is 1.0194 W wide and
  its top-left corner sits at (-0.0199 W, -0.0124 W) from the wordmark's
  top-left. Measured on the 5s frame against zenith-wordmark.webp, so the two
  coincide and the hand-off is seamless.
*/
const CLIP = { width: 1.0194, left: -0.0199, top: -0.0124 }

/* Keys that would scroll the page; blocked while the intro plays. */
const SCROLL_KEYS = new Set([' ', 'PageDown', 'PageUp', 'End', 'Home', 'ArrowDown', 'ArrowUp'])

/*
  Opening sequence.

  1. Only the textured ground is lit. The studio lights, the 3D forms, the
     copy, the timer and the navbar are all off.
  2. The three forms slide in from the edges they sit on.
  3. The title clip plays, large, in the middle of the screen.
  4. The clip travels to the wordmark's place in the layout and gives way to
     the real wordmark. The lights come up, then the supporting line, the
     "Join us" line, the timer, the date / location band and the navbar
     arrive in turn.

  Everything animates FROM an offset state that GSAP sets at runtime, so the
  resting CSS is the finished hero: no JavaScript, a motion-reduced visitor,
  or a deep link (#section in the URL) still gets the whole composition.
  useLayoutEffect applies the start state before first paint. Click or
  Escape skips to the end.

  While it plays, <html> carries the `is-intro` class: Navbar.css keeps the
  bar off and HeroIntro.css lifts the phone ribbon to the top of the screen.
*/
export function useHeroIntro(heroRef) {
  useLayoutEffect(() => {
    const root = heroRef.current
    if (!root) return undefined

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add(MOTION_OK, () => {
        if (window.location.hash) return undefined

        const html = document.documentElement
        const video = root.querySelector('.hero__intro-video')
        const stage = root.querySelector('.hero__stage')
        const title = root.querySelector('.hero__title')

        // Start from the top, with the page held still and the navbar off
        if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
        window.scrollTo(0, 0)
        html.classList.add('is-intro')

        const block = (e) => e.preventDefault()
        const blockKeys = (e) => {
          if (SCROLL_KEYS.has(e.key) && !e.target.closest?.('input, textarea, select')) {
            e.preventDefault()
          }
        }
        const swallowWheel = (e) => {
          e.preventDefault()
          e.stopImmediatePropagation()
        }
        window.addEventListener('wheel', swallowWheel, { passive: false })
        window.addEventListener('touchmove', block, { passive: false })
        window.addEventListener('keydown', blockKeys)

        let unlocked = false
        const unlock = () => {
          if (unlocked) return
          unlocked = true
          html.classList.remove('is-intro')
          window.removeEventListener('wheel', swallowWheel)
          window.removeEventListener('touchmove', block)
          window.removeEventListener('keydown', blockKeys)
          window.removeEventListener('click', skip)
          window.removeEventListener('keydown', onKey)
        }

        /* ---- part A: shapes slide in (starts once fonts have settled) ---- */
        const enter = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } })
        enter
          .from('.hero__shape--top', { y: -520, duration: 1.7 }, 0)
          .from('.hero__shape--left', { x: -300, duration: 1.6 }, 0.1)
          .from('.hero__shape--right', { x: 460, duration: 1.6 }, 0.18)

        /* ---- part B: the hand-off (paused until the clip reaches HANDOFF_AT) ---- */
        const land = gsap.timeline({ paused: true, defaults: { ease: 'expo.out', duration: 1.1 } })
        land
          // the clip travels to the wordmark's place, then gives way to it
          .to(video, { x: 0, y: 0, scale: 1, duration: 1.15, ease: 'power3.inOut' }, 0)
          .to(video, { autoAlpha: 0, duration: 0.6, ease: 'power1.inOut' }, 0.9)
          .from('.hero__title .hero__rise', { autoAlpha: 0, duration: 0.6, ease: 'power1.inOut' }, 0.9)
          // the studio lights come up
          .from('.hero__light', { autoAlpha: 0, scale: 1.12, duration: 2.1, stagger: 0.14 }, 0.5)
          // one slow sheen across the metal, then gone
          .set('.hero__sheen', { autoAlpha: 1 }, 1.6)
          .fromTo(
            '.hero__sheen-bar',
            { xPercent: -190 },
            { xPercent: 430, duration: 2.8, ease: 'power1.inOut' },
            1.6,
          )
          .set('.hero__sheen', { autoAlpha: 0 }, 4.5)
          // supporting copy, timer, details
          .from('.hero__presents .hero__rise', { yPercent: 115, duration: 1.1 }, 1.0)
          .from('.hero__theme .hero__rise', { yPercent: 112, duration: 1.15 }, 1.15)
          .from('.hero__lede .hero__rise', { yPercent: 112, stagger: 0.08 }, 1.3)
          .from('.hero__timer', { y: 26, autoAlpha: 0, duration: 1.1 }, 1.45)
          .from('.hero__panels', { y: 30, autoAlpha: 0, duration: 1.1 }, 1.6)
          // navbar (its fade is a CSS transition on the is-intro class)
          .call(() => html.classList.remove('is-intro'), null, 1.55)
          .call(unlock, null, 2.9)

        /* ---- the clip ---- */
        let handed = false
        let ticking = null
        const stopTicking = () => {
          if (ticking) gsap.ticker.remove(ticking)
          ticking = null
        }

        const handOff = () => {
          if (handed) return
          handed = true
          stopTicking()
          video.pause()
          land.play(0)
        }

        // Size the clip over the wordmark and lift it to the middle of the screen
        const placeClip = () => {
          const s = stage.getBoundingClientRect()
          const t = title.getBoundingClientRect()
          const w = t.width
          gsap.set(video, {
            left: t.left - s.left + CLIP.left * w,
            top: t.top - s.top + CLIP.top * w,
            width: CLIP.width * w,
            height: 'auto',
          })
          const v = video.getBoundingClientRect()
          const startWidth = Math.max(v.width, Math.min(window.innerWidth * 0.8, 1000))
          gsap.set(video, {
            x: window.innerWidth / 2 - (v.left + v.width / 2),
            y: window.innerHeight / 2 - (v.top + v.height / 2),
            scale: startWidth / v.width,
            autoAlpha: 1,
          })
        }

        const playClip = () => {
          if (handed) return
          placeClip()
          const startedAt = performance.now()
          video.currentTime = 0
          video.play().catch(handOff)
          ticking = () => {
            const stalled = performance.now() - startedAt > HANDOFF_AT * 1000 + 4000
            if (video.currentTime >= HANDOFF_AT || video.ended || stalled) handOff()
          }
          gsap.ticker.add(ticking)
        }

        // Start the clip when the shapes are mostly in; if it cannot load or
        // play, skip it and let the page hand over without it.
        let giveUp = null
        const clipReady = new Promise((resolve) => {
          if (video.readyState >= 3) resolve(true)
          else {
            video.addEventListener('canplay', () => resolve(true), { once: true })
            video.addEventListener('error', () => resolve(false), { once: true })
            giveUp = window.setTimeout(() => resolve(false), 3000)
          }
        })

        let cancelled = false
        const fontsReady = Promise.race([
          document.fonts?.ready ?? Promise.resolve(),
          new Promise((resolve) => window.setTimeout(resolve, 1500)),
        ])

        fontsReady.then(() => {
          if (cancelled) return
          enter.play(0)
          // shapes get ~0.9s of the stage to themselves, then the clip starts
          Promise.all([clipReady, new Promise((r) => window.setTimeout(r, 900))]).then(([ok]) => {
            window.clearTimeout(giveUp)
            if (cancelled || handed) return
            if (ok) playClip()
            else handOff()
          })
        })

        // Click or Escape: jump to the finished hero
        function skip() {
          if (unlocked) return
          cancelled = true
          handed = true
          stopTicking()
          video.pause()
          gsap.set(video, { autoAlpha: 0 })
          enter.progress(1)
          land.progress(1)
          unlock()
        }
        function onKey(e) {
          if (e.key === 'Escape') skip()
        }
        window.addEventListener('click', skip)
        window.addEventListener('keydown', onKey)

        return () => {
          cancelled = true
          stopTicking()
          window.clearTimeout(giveUp)
          video.pause()
          enter.revert()
          land.revert()
          gsap.killTweensOf(video)
          gsap.set(video, { clearProps: 'all' })
          unlock()
        }
      })
    }, root)

    return () => ctx.revert()
  }, [heroRef])
}
