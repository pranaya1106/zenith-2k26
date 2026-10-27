/**
 * Site-wide smooth scrolling (Lenis) driven by the GSAP ticker so that
 * ScrollTrigger-based parallax stays perfectly in sync with the scroll.
 */
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenis = null

// Fast start, long soft landing — used for in-page link jumps.
const easeOutExpo = (t) => (t === 1 ? 1 : 1 - 2 ** (-10 * t))

/** The active Lenis instance, or null (reduced motion / not started). */
export const getLenis = () => lenis

/** Scrolls to a position or element, smoothly when Lenis is running. */
export function scrollToTarget(target) {
  if (lenis) lenis.scrollTo(target, { force: true, duration: 1.4, easing: easeOutExpo })
  else if (typeof target === 'number') window.scrollTo({ top: target, behavior: 'smooth' })
  else target.scrollIntoView({ behavior: 'smooth' })
}

/** Starts Lenis once. Returns a cleanup function. */
export function startSmoothScroll() {
  if (lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return () => {}
  }

  lenis = new Lenis({
    // Lower lerp = more glide. 0.07 feels weighty without lagging behind input.
    lerp: 0.07,
    smoothWheel: true,
    wheelMultiplier: 0.9,
    // Touch keeps native momentum (smoothing it on phones feels laggy).
    syncTouch: false,
  })
  lenis.on('scroll', ScrollTrigger.update)

  const tick = (time) => lenis.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)

  // In-page links (#about, #faq, skip link…): cancel the native jump so it can't
  // fight Lenis, glide there instead (Lenis honours scroll-padding-top), then move
  // focus like a native hash navigation would.
  const onClick = (event) => {
    if (event.defaultPrevented || event.button !== 0) return
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const link = event.target.closest?.('a[href^="#"]')
    const hash = link?.getAttribute('href')
    if (!hash || hash === '#') return
    const target = document.getElementById(decodeURIComponent(hash.slice(1)))
    if (!target) return

    event.preventDefault()
    // force: the mobile menu unlocks scrolling in this same click, before Lenis
    // has been told to start again.
    lenis.scrollTo(target, { force: true, duration: 1.4, easing: easeOutExpo })
    history.pushState(null, '', hash)
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
    target.focus({ preventScroll: true })
  }
  document.addEventListener('click', onClick)

  // The mobile menu and dialog lock scrolling via `overflow: hidden` on <html>.
  // Pause Lenis while that lock is on so the page behind them can't move.
  const root = document.documentElement
  const syncLock = () => (root.style.overflow === 'hidden' ? lenis.stop() : lenis.start())
  const observer = new MutationObserver(syncLock)
  observer.observe(root, { attributes: true, attributeFilter: ['style'] })

  return () => {
    observer.disconnect()
    document.removeEventListener('click', onClick)
    gsap.ticker.remove(tick)
    gsap.ticker.lagSmoothing(500, 33)
    lenis.destroy()
    lenis = null
  }
}
