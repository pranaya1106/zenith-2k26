/**
 * Hackathon domains as stacked, sticky full-screen panels — ported from the
 * "Collection" StackedPanels on rave-photo.vercel.app.
 *
 * Each panel sticks to the viewport and the next one slides over it. While a
 * panel is in play its artwork drifts vertically (parallax), the domain name
 * glides sideways across the white band, and the band fades as the panel
 * leaves. A single rAF loop runs only while the stack is on screen.
 */
import { useEffect, useRef } from 'react'
import { domains } from '../data/site'
import { useDialog } from './ui/Dialog'
import SectionHead from './ui/SectionHead'
import { ArrowUpRight } from './ui/Icons'
import './Domains.css'

// Artwork per domain accent (brand shapes from /public/assets/shapes)
const art = {
  pink: '/assets/shapes/pink-block.webp',
  mint: '/assets/shapes/mint-clover.webp',
  purple: '/assets/shapes/purple-notch.webp',
}

const pad = (n) => String(n).padStart(2, '0')

function StackedDomains({ items }) {
  const rootRef = useRef(null)
  const panelRefs = useRef([])
  const artRefs = useRef([])
  const bandRefs = useRef([])
  const nameRefs = useRef([])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let running = false
    let disposed = false

    const tick = () => {
      if (disposed) {
        running = false
        return
      }
      const vh = window.innerHeight
      const vw = window.innerWidth
      const scrolled = -root.getBoundingClientRect().top

      panelRefs.current.forEach((_, i) => {
        // -1 = panel entering from below, 0 = settled, +1 = covered by the next
        const r = Math.max(-1.2, Math.min(1.2, scrolled / vh - i))
        const artEl = artRefs.current[i]
        const band = bandRefs.current[i]
        const name = nameRefs.current[i]

        if (reduced.matches) {
          if (artEl) artEl.style.transform = 'translate3d(0,0,0)'
          if (name) name.style.transform = 'translate3d(0,0,0)'
          if (band) band.style.opacity = '1'
          return
        }

        if (artEl) artEl.style.transform = `translate3d(0,${(-(0.18 * r * 50)).toFixed(2)}%,0)`
        if (name) name.style.transform = `translate3d(${(-(0.55 * r) * vw).toFixed(1)}px,0,0)`
        if (band) band.style.opacity = String(Math.max(0, Math.min(1, 1 - (Math.abs(r) - 0.62) / 0.3)))
      })

      frame = window.requestAnimationFrame(tick)
    }

    const start = () => {
      if (running || disposed) return
      running = true
      frame = window.requestAnimationFrame(tick)
    }
    const stop = () => {
      running = false
      window.cancelAnimationFrame(frame)
    }

    const observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), {
      threshold: 0,
    })
    observer.observe(root)
    start()

    return () => {
      disposed = true
      stop()
      observer.disconnect()
    }
  }, [])

  return (
    <div className="dstack" ref={rootRef}>
      {items.map((domain, i) => (
        <article
          key={domain.name}
          className={`dstack__panel dstack__panel--${domain.accent}`}
          ref={(el) => {
            panelRefs.current[i] = el
          }}
          aria-labelledby={`domain-${domain.index}`}
        >
          <div
            className="dstack__art"
            aria-hidden="true"
            ref={(el) => {
              artRefs.current[i] = el
            }}
          >
            <img src={art[domain.accent]} alt="" loading={i === 0 ? 'eager' : 'lazy'} draggable={false} />
          </div>

          <div
            className="dstack__band"
            ref={(el) => {
              bandRefs.current[i] = el
            }}
          >
            <div className="dstack__band-inner">
              <div className="dstack__meta">
                <p className="dstack__index">{pad(i + 1)}</p>
                <p className="dstack__blurb">{domain.description}</p>
              </div>
              <div
                className="dstack__name"
                ref={(el) => {
                  nameRefs.current[i] = el
                }}
              >
                <h3 id={`domain-${domain.index}`}>{domain.name}</h3>
                <span>{domain.short} / 26</span>
              </div>
            </div>
          </div>

          <p className="dstack__count" aria-hidden="true">
            {pad(i + 1)} / {pad(items.length)}
          </p>
        </article>
      ))}
    </div>
  )
}

export default function Domains() {
  const openDialog = useDialog()

  const openProblemStatements = () =>
    openDialog({
      kicker: 'Problem statements · 2K26',
      title: 'The briefs land before kickoff.',
      body: 'The three ’26 problem statements — HealthTech, EduTech and AgriTech — will be published here ahead of the hackathon.',
    })

  return (
    <section className="section domains tone-dark" id="domains" aria-labelledby="domains-title">
      <div className="container section__inner">
        <SectionHead
          index="03"
          label="Track selection"
          id="domains-title"
          title={
            <>
              Hackathon <em>domains</em>
            </>
          }
          note="Three problem spaces, one weekend. Pick the frontier you can’t stop thinking about."
        />
      </div>

      <StackedDomains items={domains} />

      <div className="container section__inner">
        <div className="domains__cta" data-reveal>
          <div className="domains__cta-text">
            <span className="label label--pink">Next step</span>
            <p>
              The ’26 problem statements land here before kickoff.
            </p>
          </div>
          <div className="domains__cta-actions">
            <button type="button" className="btn btn--primary" onClick={openProblemStatements}>
              Problem statements
              <ArrowUpRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
