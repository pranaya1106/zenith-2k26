import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { benefits } from '../data/site'
import SectionHead from './ui/SectionHead'
import { useParallax } from './ui/parallax-scrolling'
import './Benefits.css'

// yPercent travelled per card over the section's scroll. Alternating signs
// make neighbouring cards drift apart and back, deepening the scattered look.
const cardSpeeds = [-22, 14, -28, 10]

// Duotone icons per card, keyed by benefit index: a soft tinted fill under a
// crisp outline, both in currentColor. Plain, literal symbols, no effects.
const iconProps = {
  viewBox: '0 0 32 32',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

const tint = { fill: 'currentColor', fillOpacity: 0.18, stroke: 'none' }

const perkIcons = {
  // Network: two people
  '01': (
    <svg {...iconProps}>
      <circle cx="11.5" cy="11" r="4" {...tint} />
      <path d="M4.5 26c0-4.4 3.1-7.5 7-7.5s7 3.1 7 7.5Z" {...tint} />
      <circle cx="11.5" cy="11" r="4" />
      <path d="M4.5 26c0-4.4 3.1-7.5 7-7.5s7 3.1 7 7.5" />
      <circle cx="21.5" cy="9.5" r="3.2" />
      <path d="M20.5 17.2c.3 0 .7-.1 1-.1 3.6 0 6 2.8 6 6.9" />
    </svg>
  ),
  // Workshops: presentation board on a stand
  '02': (
    <svg {...iconProps}>
      <rect x="4.5" y="5" width="23" height="15" rx="2" {...tint} />
      <rect x="4.5" y="5" width="23" height="15" rx="2" />
      <path d="M9 15.5l4-4 3 3 5.5-5.5M16 20v4M11 27.5l5-3.5 5 3.5" />
    </svg>
  ),
  // Prize pool: trophy
  '03': (
    <svg {...iconProps}>
      <path d="M10 5h12v7.5a6 6 0 0 1-12 0V5Z" {...tint} />
      <path d="M10 5h12v7.5a6 6 0 0 1-12 0V5Z" />
      <path d="M10 7.5H6.5a3.5 3.5 0 0 0 4 4.4M22 7.5h3.5a3.5 3.5 0 0 1-4 4.4M16 18.5v4M11 27h10M12.5 27l.8-4.5h5.4l.8 4.5" />
    </svg>
  ),
  // Recognition: certificate with a seal and ribbon
  '04': (
    <svg {...iconProps}>
      <rect x="4" y="6" width="24" height="16" rx="2" {...tint} />
      <rect x="4" y="6" width="24" height="16" rx="2" />
      <path d="M8.5 11h9M8.5 15h6" />
      <circle cx="22" cy="17" r="3.2" />
      <path d="M20.2 19.7 19.5 27l2.5-1.6 2.5 1.6-.7-7.3" />
    </svg>
  ),
}

gsap.registerPlugin(ScrollTrigger)

// Mobile single-column breakpoint (matches the 520px rule in Benefits.css)
const WIRE_MEDIA = '(max-width: 520px)'
const MOTION_OK = '(prefers-reduced-motion: no-preference)'

/**
 * One continuous path through every gap: from each card's bottom-centre to
 * the next card's top-centre. Each segment is a cubic S-curve whose control
 * points swing out sideways (alternating left/right) at the same height as
 * the endpoints, so it leaves and enters each card vertically.
 * Coordinates are relative to `box` (the .perks container).
 */
// Layout position of `el` inside `box`, ignoring CSS transforms (the cards'
// tilt and the reveal slide-in), so the path is stable while they animate.
function offsetWithin(el, box) {
  let x = 0
  let y = 0
  let node = el
  while (node && node !== box) {
    x += node.offsetLeft
    y += node.offsetTop
    node = node.offsetParent
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight }
}

function buildWirePath(cards, box) {
  const swing = Math.min(box.clientWidth * 0.42, 150)
  let d = ''
  for (let i = 0; i < cards.length - 1; i += 1) {
    const a = offsetWithin(cards[i], box)
    const c = offsetWithin(cards[i + 1], box)
    // Start/end a little inside the cards so the line tucks under their edges
    const x1 = a.x + a.w / 2
    const y1 = a.y + a.h - 14
    const x2 = c.x + c.w / 2
    const y2 = c.y + 14
    const dir = i % 2 ? -1 : 1
    const mid = (y1 + y2) / 2
    d += `${i ? ' ' : ''}M${x1.toFixed(1)} ${y1.toFixed(1)}`
    d += ` C${(x1 + swing * dir).toFixed(1)} ${mid.toFixed(1)} ${(x2 - swing * dir).toFixed(1)} ${mid.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`
  }
  return d
}

// Hoisted so the hook's effect deps stay stable between renders
const PARALLAX_OPTIONS = {
  start: 'top bottom',
  end: 'bottom top',
  centered: true,
  // Only for the overlapping desktop fan; the stacked mobile grid stays static
  media: '(min-width: 861px)',
}

export default function Benefits() {
  const sectionRef = useRef(null)
  useParallax(sectionRef, PARALLAX_OPTIONS)

  const wireRef = useRef(null)

  // Mobile: measure the stacked cards, build the connector, draw it on scroll.
  useEffect(() => {
    const svg = wireRef.current
    const box = svg?.parentElement
    const path = svg?.querySelector('path')
    if (!svg || !box || !path) return undefined

    const mm = gsap.matchMedia()
    mm.add(WIRE_MEDIA, () => {
      const cards = [...box.querySelectorAll('.perk__card')]
      let length = 1

      const layout = () => {
        svg.setAttribute('viewBox', `0 0 ${box.clientWidth} ${box.clientHeight}`)
        path.setAttribute('d', buildWirePath(cards, box))
        length = path.getTotalLength() || 1
        path.style.strokeDasharray = `${length}`
      }
      layout()

      // Scroll-drawn unless the user prefers reduced motion
      let tween = null
      if (window.matchMedia(MOTION_OK).matches) {
        tween = gsap.fromTo(
          path,
          { strokeDashoffset: () => length },
          {
            strokeDashoffset: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: box,
              start: 'top 70%',
              end: 'bottom 75%',
              scrub: 0.6,
              invalidateOnRefresh: true,
              onRefreshInit: layout,
            },
          },
        )
      } else {
        path.style.strokeDashoffset = '0'
      }

      // Cards can resize after fonts/images load
      const ro = new ResizeObserver(() => ScrollTrigger.refresh())
      ro.observe(box)

      return () => {
        ro.disconnect()
        tween?.kill()
        path.removeAttribute('d')
        path.style.removeProperty('stroke-dasharray')
        path.style.removeProperty('stroke-dashoffset')
      }
    })
    return () => mm.revert()
  }, [])

  return (
    <section ref={sectionRef} className="section benefits tone-dark" id="why" aria-labelledby="why-title">
      <div className="benefits__grid-bg" aria-hidden="true" />

      <div className="container section__inner">
        <SectionHead
          index="01"
          label="Why join"
          id="why-title"
          title={
            <>
              Why you can’t miss <em>ZENITH ’26</em>
            </>
          }
          wide
        />

        <div className="perks">
          {/* Thin glowing swooshes: some pass behind the cards, some in front.
              The gradient fades each stroke out at both ends. */}
          <svg className="perks__swoosh perks__swoosh--back" data-parallax-speed="12" viewBox="0 0 1000 620" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="swoosh-a" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0" stopColor="#20e399" stopOpacity="0" />
                <stop offset="0.5" stopColor="#20e399" />
                <stop offset="1" stopColor="#20e399" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M330 30 C 250 80, 180 170, 150 270" stroke="url(#swoosh-a)" />
            <path d="M880 10 C 800 50, 740 110, 710 190" stroke="url(#swoosh-a)" />
            <path d="M975 280 C 1000 370, 975 450, 905 490" stroke="url(#swoosh-a)" />
          </svg>

          {/* Mobile-only connector: one path measured from the real card
              positions, drawn on scroll. Hidden above 520px. */}
          <svg ref={wireRef} className="perks__wire" aria-hidden="true">
            <path />
          </svg>

          <ol className="perks__list">
            {benefits.map((benefit, index) => (
              <li
                className="perk"
                key={benefit.index}
                data-reveal
                style={{ '--reveal-delay': `${index * 90}ms` }}
              >
                {/* Parallax lives on a wrapper so it doesn't fight the li's
                    reveal transform or the card's tilt/hover transform */}
                <div className="perk__parallax" data-parallax-speed={cardSpeeds[index % cardSpeeds.length]}>
                <article className="perk__card">
                  <h3 className="perk__title">{benefit.title}</h3>
                  <div className="perk__logo" aria-hidden="true">
                    {perkIcons[benefit.index]}
                  </div>
                  <p className="perk__copy">{benefit.copy}</p>
                </article>
                </div>
              </li>
            ))}
          </ol>

          <svg className="perks__swoosh perks__swoosh--front" data-parallax-speed="-14" viewBox="0 0 1000 620" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="swoosh-b" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stopColor="#20e399" stopOpacity="0" />
                <stop offset="0.45" stopColor="#20e399" />
                <stop offset="1" stopColor="#20e399" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M40 400 C 60 520, 240 570, 340 500" stroke="url(#swoosh-b)" />
            <path d="M470 610 C 610 615, 770 585, 815 515" stroke="url(#swoosh-b)" />
          </svg>
        </div>
      </div>
    </section>
  )
}
