/**
 * Event timeline — a 1:1 port of the zenith2k26.vercel.app timeline,
 * restyled with this project's palette.
 *
 * The tall section holds a sticky viewport. Scroll progress through the
 * section slides the track sideways and draws the accent rule; each
 * milestone "arms" (dot pops, stem grows, text lands) shortly after it
 * enters from the right.
 */
import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import { timeline } from '../data/site'
import './Timeline.css'

const items = timeline.items
const pad = (n) => String(n).padStart(2, '0')

// A milestone arms when its dot crosses this fraction of the viewport width
// (0.8 = 80% from the left, i.e. shortly after it enters on the right).
const ARM_AT = 0.8

// Two brand accents, alternating per milestone (purple-mid reads better than --purple on ink).
const accents = ['var(--pink)', 'var(--purple-mid)']

function Milestone({ item, index, total, above, armed, reduced, columnRef }) {
  const on = armed || reduced

  return (
    <div
      ref={columnRef}
      className={`tl__item ${above ? 'is-above' : 'is-below'}`}
      style={{ '--tl-accent': accents[index % accents.length] }}
    >
      <span
        aria-hidden="true"
        className="tl__dot"
        style={{ transform: `translateY(-50%) scale(${on ? 1 : 0})` }}
      />
      <span
        aria-hidden="true"
        className="tl__stem"
        style={{ transform: `scaleY(${on ? 1 : 0})`, transformOrigin: above ? 'bottom' : 'top' }}
      />
      <div
        className="tl__text"
        style={{
          opacity: on ? 1 : 0,
          transform: `translateY(${on ? 0 : above ? 16 : -16}px)`,
        }}
      >
        <span className="tl__date tl-display tl-accent-text">{item.date}</span>
        <h3 className="tl__title">{item.title}</h3>
        <p className="tl__copy">{item.copy}</p>
        <span className="tl-label tl__count">
          {pad(index + 1)} / {pad(total)}
        </span>
      </div>
    </div>
  )
}

export default function Timeline() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const columnRefs = useRef([])
  const reduced = !!useReducedMotion()
  const progress = useMotionValue(0)
  const [travel, setTravel] = useState(0)
  const armedRef = useRef(items.map(() => false))
  const [armed, setArmed] = useState(() => items.map(() => false))

  useEffect(() => {
    const update = () => {
      const section = sectionRef.current
      const track = trackRef.current
      if (!section || !track) return

      const vw = document.documentElement.clientWidth
      const rect = section.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight
      const p = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0
      progress.set(p)

      const distance = Math.max(0, track.offsetWidth - vw)
      setTravel((prev) => (prev === distance ? prev : distance))

      // Arm each milestone as soon as its dot (left edge) scrolls into the
      // right part of the viewport. Arming at the item's centre made the last
      // milestones land late — they'd sit on screen empty for a while, since
      // the track runs out of travel before their centres reach mid-screen.
      const trigger = vw * ARM_AT
      const next = armedRef.current.slice()
      let changed = false
      columnRefs.current.forEach((col, i) => {
        if (!col || next[i]) return
        const at = i === 0 || distance <= 0 ? 0 : Math.min(1, Math.max(0, (col.offsetLeft - trigger) / distance))
        if (p >= at) {
          next[i] = true
          changed = true
        }
      })
      if (changed) {
        armedRef.current = next
        setArmed(next)
      }
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [progress])

  const x = useTransform(progress, (p) => -travel * p)

  return (
    <section ref={sectionRef} id="schedule" className="tl" aria-labelledby="schedule-title">
      <div className="tl__sticky">
        <div className="tl__head">
          <div className="tl-label tl__sec">
            <span className="tl-accent-text">SEC. 04</span>
            <span aria-hidden="true" className="tl__sec-rule" />
            <span>Event Timeline</span>
          </div>
        </div>

        <motion.div ref={trackRef} className="tl__track" style={{ x, y: '-50%' }}>
          <div aria-hidden="true" className="tl__rule" />
          <motion.div aria-hidden="true" className="tl__rule-fill" style={{ scaleX: progress }} />

          <div className="tl__intro">
            <h2 id="schedule-title" className="tl-display tl__heading">
              The run
              <br />
              of show.
            </h2>
            <p className="tl-label tl__range">Nov 17 → Dec 19 · MLRIT</p>
            <p className="tl__lede">
              Five moments across three days. Keep scrolling — the track travels, the rule draws, and
              each milestone lands as it comes into view.
            </p>
          </div>

          {items.map((item, i) => (
            <Milestone
              key={`${item.date}-${item.title}`}
              item={item}
              index={i}
              total={items.length}
              above={i % 2 === 0}
              armed={armed[i] ?? false}
              reduced={reduced}
              columnRef={(el) => {
                columnRefs.current[i] = el
              }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
