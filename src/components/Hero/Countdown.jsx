import { useEffect, useRef, useState } from 'react'
import { event } from '../../data/site'
import { getCountdown } from '../../hooks/useReveal'
import RegisterButton from '../RegisterButton'
import './Countdown.css'

/**
 * "The voyage begins in" — a live countdown to the first day of ZENITH ’26.
 *
 * Built from the same parts as the hero's date / location band so the two read
 * as one system: flat square cells butted together, the indigo lead cell, the
 * charcoal data cells, and a single violet cell for the seconds (the one that
 * is visibly alive).
 *
 * Motion: when a number changes, only the digit that changed rolls up into
 * place. Unchanged digits do not move. There is no entrance animation of its
 * own (the hero's opening sequence fades the whole component in), no looping
 * effect, and under prefers-reduced-motion the digits simply swap.
 */

const UNITS = [
  { key: 'days', label: 'Days' },
  { key: 'hours', label: 'Hours' },
  { key: 'minutes', label: 'Mins' },
  { key: 'seconds', label: 'Secs' },
]

const pad = (n) => String(n).padStart(2, '0')

/**
 * Ticks on the second boundary, so the seconds cell changes exactly when a
 * wall clock would instead of drifting. Pauses while the tab is hidden or the
 * component is scrolled out of view, and recomputes immediately on resume.
 */
function useCountdown(targetISO, rootRef) {
  const [time, setTime] = useState(() => getCountdown(targetISO))

  useEffect(() => {
    const root = rootRef.current
    let timer = 0
    let inView = true

    const update = () => setTime(getCountdown(targetISO))

    const stop = () => {
      window.clearTimeout(timer)
      timer = 0
    }

    const tick = () => {
      update()
      timer = window.setTimeout(tick, 1000 - (Date.now() % 1000))
    }

    const sync = () => {
      stop()
      if (!document.hidden && inView) tick()
    }

    let observer
    if (root && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          inView = entry.isIntersecting
          sync()
        },
        { threshold: 0 },
      )
      observer.observe(root)
    }

    document.addEventListener('visibilitychange', sync)
    sync()

    return () => {
      stop()
      observer?.disconnect()
      document.removeEventListener('visibilitychange', sync)
    }
  }, [targetISO, rootRef])

  return time
}

/**
 * One digit. Whether it should roll in is decided once, when it is created:
 * a digit that exists on first paint never animates, and a digit that appears
 * later (because its value changed, which changes its key) does. Freezing the
 * flag in state stops an unchanged digit from replaying when the parent
 * re-renders.
 */
function Digit({ char, roll }) {
  const [animate] = useState(roll)
  return <span className={`countdown__digit${animate ? ' is-roll' : ''}`}>{char}</span>
}

export default function Countdown({ className = '' }) {
  const rootRef = useRef(null)
  const time = useCountdown(event.dates.startISO, rootRef)

  // Digits created on the first render are static; later ones roll.
  const [armed, setArmed] = useState(false)
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setArmed(true))
    return () => window.cancelAnimationFrame(frame)
  }, [])

  // Spoken once a minute, never every second.
  const spoken = time.done
    ? 'ZENITH ’26 is live now.'
    : `${time.days} days, ${time.hours} hours and ${time.minutes} minutes until ZENITH ’26 begins.`

  return (
    <div ref={rootRef} className={`countdown ${className}`.trim()}>
      {/* The clock itself. display: contents (see the CSS) keeps its cells in
          the same grid as the register tile, while the timer role stays on a
          wrapper that does not contain the link. */}
      <div className="countdown__clock" role="timer" aria-label="Countdown to ZENITH ’26">
        <p className="countdown__lead">
          {time.done ? 'The voyage is underway' : 'The voyage begins in'}
        </p>

        <p className="sr-only">{spoken}</p>

        <ul className="countdown__cells" aria-hidden="true">
          {UNITS.map(({ key, label }) => (
            <li className={`countdown__cell countdown__cell--${key}`} key={key}>
              <span className="countdown__label">{label}</span>
              <span className="countdown__value">
                {pad(time[key])
                  .split('')
                  .map((char, index) => (
                    <Digit key={`${index}-${char}`} char={char} roll={armed} />
                  ))}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Register tile: a white cell with an arrow, at the end of the strip.
          RegisterButton adds the arrow icon itself and decides between a real
          link (once links.registration is set) and the "opening shortly"
          dialog. */}
      <RegisterButton className="countdown__cta">
        <span className="countdown__cta-label">Register now</span>
      </RegisterButton>
    </div>
  )
}
