import { useRef } from 'react'
import { event } from '../data/site'
import RegisterButton from './RegisterButton'
import { ArrowDown } from './ui/Icons'
import { TiltCard, TiltCardItem } from './TiltCard'
import { useParallax } from './ui/parallax-scrolling'
import './Hero.css'

export default function Hero() {
  const heroRef = useRef(null)
  useParallax(heroRef)

  return (
    <section className="hero" id="top" aria-labelledby="hero-title" ref={heroRef}>
      {/*
        Parallax layers (see ui/parallax-scrolling.jsx):
        speed = scroll travel (+ lags / far, − rushes / near), spin = degrees,
        depth = px of drift toward the mouse.
      */}
      <div className="hero__stage" aria-hidden="true">
        <img className="hero__light-left" src="/assets/left-lighting-effect.png" alt="" data-parallax-speed="25" />
        <img className="hero__light-right" src="/assets/right-lighting-effect.png" alt="" data-parallax-speed="25" />
        <img
          className="hero__star"
          src="/assets/shapes/purple-star.webp"
          alt=""
          data-parallax-speed="18"
          data-parallax-spin="12"
          data-parallax-depth="12"
        />

        {/* Gemini */}
        <span className="hero__pink" data-parallax-speed="-90" data-parallax-spin="-70">
          <span className="hero__sym" data-parallax-depth="55">
            <img src="/assets/ai/star-pink.webp" alt="" />
          </span>
        </span>

        {/* Claude */}
        <span className="hero__bloom" data-parallax-speed="-140" data-parallax-spin="160">
          <span className="hero__sym" data-parallax-depth="40">
            <img src="/assets/ai/bloom-orange.webp" alt="" />
          </span>
        </span>

        <span className="hero__rule hero__rule--1" />
        <span className="hero__rule hero__rule--2" />
        <span className="hero__rule hero__rule--3" />
      </div>

      <div className="container hero__inner" data-parallax-speed="22">
        <div className="hero__lead">
          <div className="hero__mark" data-reveal style={{ '--reveal-delay': '80ms' }}>
            <h1 className="hero__title" id="hero-title">
              <img
                src="/assets/brand/zenith-wordmark.webp"
                alt="ZENITH '26 — The Year of 2K26"
                width="2000"
                height="816"
                decoding="async"
              />
            </h1>

            {/* Sign hanging from the H of ZENITH */}
            <div className="hang-sign">
              <div className="hang-sign__swing">
                <span className="hang-sign__pin" aria-hidden="true" />
                <svg className="hang-sign__string" viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true">
                  <polyline points="14,40 50,1 86,40" />
                </svg>
                <p className="hang-sign__board">
                  <span className="hang-sign__hole hang-sign__hole--l" aria-hidden="true" />
                  <span className="hang-sign__hole hang-sign__hole--r" aria-hidden="true" />
                  {event.theme}
                </p>
              </div>
            </div>
          </div>
        </div>

        <aside data-reveal style={{ '--reveal-delay': '330ms' }} aria-label="Event brief">
          <TiltCard className="event-card">
            <TiltCardItem depth={40}>
              <p className="event-card__title">Event Details</p>
            </TiltCardItem>
            <TiltCardItem depth={60}>
              <div className="event-card__rows">
                <div className="event-card__row">
                  <span className="event-card__label">Date</span>
                  <span className="event-card__value">{event.dates.display}</span>
                </div>
                <div className="event-card__row">
                  <span className="event-card__label">Venue</span>
                  <span className="event-card__value">MLRIT, Hyderabad</span>
                </div>
                <div className="event-card__row">
                  <span className="event-card__label">Format</span>
                  <span className="event-card__value">{event.format}</span>
                </div>
              </div>
            </TiltCardItem>
          </TiltCard>
        </aside>
      </div>

      <div className="container hero__actions" data-reveal style={{ '--reveal-delay': '270ms' }}>
        <RegisterButton />
        <a className="btn" href="#about">
          Explore the event
          <ArrowDown />
        </a>
      </div>
    </section>
  )
}
