/**
 * Hackathon domains as an expanding panel gallery.
 *
 * One panel is open at a time; the others collapse to slim columns with a
 * vertical label. Desktop opens a panel on hover, every device on click/tap,
 * and the arrow keys move between panels. Inside the open panel the brand
 * shape drifts against the pointer for depth.
 * On narrow screens the panels stack vertically as an accordion.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { domains } from '../data/site'
import SectionHead from './ui/SectionHead'
import { ArrowUpRight } from './ui/Icons'
import './Domains.css'

// Brand shape per domain accent (from /public/assets/shapes)
const art = {
  pink: '/assets/shapes/pink-block.webp',
  mint: '/assets/shapes/mint-clover.webp',
  purple: '/assets/shapes/purple-notch.webp',
}

const pad = (n) => String(n).padStart(2, '0')
const HOVER_QUERY = '(hover: hover) and (pointer: fine)'

function DomainPanels({ items }) {
  const [active, setActive] = useState(0)
  const toggleRefs = useRef([])
  const hoverOpens = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia(HOVER_QUERY)
    const sync = () => {
      hoverOpens.current = mq.matches
    }
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  const onKeyDown = useCallback(
    (e, i) => {
      const last = items.length - 1
      const keys = {
        ArrowRight: i === last ? 0 : i + 1,
        ArrowDown: i === last ? 0 : i + 1,
        ArrowLeft: i === 0 ? last : i - 1,
        ArrowUp: i === 0 ? last : i - 1,
        Home: 0,
        End: last,
      }
      if (!(e.key in keys)) return
      e.preventDefault()
      const next = keys[e.key]
      setActive(next)
      toggleRefs.current[next]?.focus()
    },
    [items.length],
  )

  // Pointer position as CSS vars --px/--py (-0.5 … 0.5) for the shape drift.
  const onPointerMove = (e) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    el.style.setProperty('--px', (x - 0.5).toFixed(3))
    el.style.setProperty('--py', (y - 0.5).toFixed(3))
  }

  const onPointerLeave = (e) => {
    e.currentTarget.style.setProperty('--px', '0')
    e.currentTarget.style.setProperty('--py', '0')
  }

  return (
    <div className="dpanels" data-reveal>
      {items.map((domain, i) => {
        const open = i === active
        const bodyId = `domain-panel-${domain.short}`
        return (
          <article
            key={domain.name}
            className={`dpanel dpanel--${domain.accent}${open ? ' is-active' : ''}`}
            onPointerEnter={() => hoverOpens.current && setActive(i)}
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
          >
            <img
              className="dpanel__art"
              src={art[domain.accent]}
              alt=""
              aria-hidden="true"
              loading="lazy"
              draggable={false}
            />

            {/* Covers the whole panel so a click anywhere opens it */}
            <button
              ref={(el) => {
                toggleRefs.current[i] = el
              }}
              type="button"
              className="dpanel__toggle"
              aria-expanded={open}
              aria-controls={bodyId}
              onClick={() => setActive(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
            >
              <span className="dpanel__index">{pad(i + 1)}</span>
              <span className="dpanel__label">{domain.name}</span>
              <span className="dpanel__plus" aria-hidden="true" />
            </button>

            <div className="dpanel__body" id={bodyId} aria-hidden={!open}>
              <p className="dpanel__code">
                {domain.short} / 26 · Track {pad(i + 1)}
              </p>
              <h3 className="dpanel__name">{domain.name}</h3>
              <p className="dpanel__desc">{domain.description}</p>
              {domain.focus?.length ? (
                <ul className="dpanel__tags" aria-label={`${domain.name} focus areas`}>
                  {domain.focus.map((tag, t) => (
                    <li key={tag} style={{ '--t': t }}>
                      {tag}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </article>
        )
      })}
    </div>
  )
}

export default function Domains() {
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

        <DomainPanels items={domains} />

        <div className="domains__cta" data-reveal>
          <div className="domains__cta-text">
            <span className="label label--pink">Next step</span>
            <p>The ’26 problem statements land here before kickoff.</p>
          </div>
          <div className="domains__cta-actions">
            <a className="btn btn--primary" href="/problem-statements/">
              Problem statements
              <ArrowUpRight />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
