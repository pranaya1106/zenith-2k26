import { useEffect, useState } from 'react'
import { event } from '../data/site'
import { getCountdown } from '../hooks/useReveal'
import RegisterButton from './RegisterButton'
import { ArrowDown } from './ui/Icons'
import './Hero.css'

function Countdown() {
  const [time, setTime] = useState(() => getCountdown(event.dates.startISO))

  useEffect(() => {
    const id = window.setInterval(
      () => setTime(getCountdown(event.dates.startISO)),
      1000,
    )
    return () => window.clearInterval(id)
  }, [])

  const pad = (value) => String(value).padStart(2, '0')
  const units = [
    { value: pad(time.days), label: 'D' },
    { value: pad(time.hours), label: 'H' },
    { value: pad(time.minutes), label: 'M' },
    { value: pad(time.seconds), label: 'S' },
  ]

  return (
    <div className="count">
      <span className="count__label">T-minus</span>
      <div className="count__units" aria-hidden="true">
        {units.map((unit) => (
          <span className="count__unit" key={unit.label}>
            <b>{unit.value}</b>
            <i>{unit.label}</i>
          </span>
        ))}
      </div>
      <span className="sr-only">
        ZENITH ’26 begins on 17 December 2026 at MLR Institute of Technology, Hyderabad.
      </span>
    </div>
  )
}

export default function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero__stage" aria-hidden="true">
        <span className="hero__glow" />
        <img className="hero__star" src="/assets/shapes/purple-star.webp" alt="" />
        <img className="hero__pink" src="/assets/ai/star-pink.webp" alt="" />
        <img className="hero__bloom" src="/assets/ai/bloom-orange.webp" alt="" />
        <span className="hero__rule hero__rule--1" />
        <span className="hero__rule hero__rule--2" />
        <span className="hero__rule hero__rule--3" />
      </div>

      <div className="container hero__inner">
        <div className="hero__lead">
          <p className="hero__eyebrow" data-reveal>
            <span className="hero__pulse" aria-hidden="true" />
            {event.organiser} · {event.kind}
          </p>

          <h1 className="hero__title" id="hero-title" data-reveal style={{ '--reveal-delay': '80ms' }}>
            <img
              src="/assets/brand/zenith-wordmark.webp"
              alt="ZENITH ’26 — The Year of 2K26"
              width="2000"
              height="816"
              decoding="async"
            />
          </h1>

          <p className="hero__tagline" data-reveal style={{ '--reveal-delay': '150ms' }}>
            <span className="hero__tagline-mark" aria-hidden="true" />
            {event.theme}
          </p>

          <p className="hero__facts" data-reveal style={{ '--reveal-delay': '185ms' }}>
            <span>{event.dates.compact}</span>
            <span aria-hidden="true">/</span>
            <span>MLRIT, Hyderabad</span>
          </p>

          <p className="hero__lede" data-reveal style={{ '--reveal-delay': '210ms' }}>
            Three days at MLR Institute of Technology: an AWS Community Day with cloud
            practitioners, then a 24-hour sprint to ship AI-powered answers to real problems
            in HealthTech, EduTech and AgriTech.
          </p>

          <div className="hero__actions" data-reveal style={{ '--reveal-delay': '270ms' }}>
            <RegisterButton />
            <a className="btn" href="#about">
              Explore the event
              <ArrowDown />
            </a>
          </div>
        </div>

        <aside className="brief" data-reveal style={{ '--reveal-delay': '330ms' }} aria-label="Event brief">
          <div className="brief__head">
            <span className="brief__kicker">Mission brief</span>
            <span className="brief__code">Z26 / HYD</span>
          </div>

          <dl className="brief__rows">
            <div className="brief__row">
              <dt>Date</dt>
              <dd>{event.dates.display}</dd>
            </div>
            <div className="brief__row">
              <dt>Venue</dt>
              <dd>MLRIT, Hyderabad</dd>
            </div>
            <div className="brief__row">
              <dt>Format</dt>
              <dd>
                {event.format}
              </dd>
            </div>
            <div className="brief__row">
              <dt>Prize pool</dt>
              <dd className="brief__figure">{event.prizePool}</dd>
            </div>
            <div className="brief__row">
              <dt>Registration</dt>
              <dd>{event.fee}</dd>
            </div>
          </dl>

          <p className="brief__foot">
            In collaboration with <span>{event.collaborator}</span>
          </p>
        </aside>
      </div>

      <div className="container hero__foot">
        <Countdown />
        <p className="hero__foot-note">
          MLRIT <span>·</span> Dundigal, Hyderabad
        </p>
        <a className="hero__scroll" href="#why">
          <span>Scroll</span>
          <span className="hero__scroll-line" aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}
