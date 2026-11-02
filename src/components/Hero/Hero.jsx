import { useRef } from 'react'
import { event } from '../../data/site'
import { useParallax } from '../ui/parallax-scrolling'
import Countdown from './Countdown'
import { useHeroIntro } from './useHeroIntro'
import { useHeroDepart } from './useHeroDepart'
import './Hero.css'
import './HeroIntro.css'

export default function Hero() {
  const heroRef = useRef(null)

  // Scroll travel and pointer drift for the background forms.
  useParallax(heroRef)
  // Opening sequence (see useHeroIntro.js) and the recede on scroll.
  useHeroIntro(heroRef)
  useHeroDepart(heroRef)

  return (
    <section className="hero" id="top" aria-labelledby="hero-title" ref={heroRef}>
      {/*
        The stage, back to front: textured ground, the three 3D background
        forms, then the studio lights in the top corners. Decorative, so the
        whole layer is hidden from assistive tech.

        data-parallax-* is read by useParallax: speed = scroll travel
        (+ lags behind, − rushes ahead), depth = px of drift toward the pointer.
      */}
      <div className="hero__stage" aria-hidden="true">
        <span className="hero__texture" />

        {/* Studio lights: CSS gradients only (see Hero.css), one per top corner */}
        <span className="hero__light hero__light--left" data-parallax-speed="20" />
        <span className="hero__light hero__light--right" data-parallax-speed="20" />

        {/*
          Each form nests three layers so the motions never overwrite each
          other: the outer span carries scroll travel (yPercent), the inner
          span carries pointer drift (x/y), and the img carries its size and
          drop shadow. The opening sequence animates the outer span's x/y,
          which is why the drift lives on its own element.
        */}

        {/* Crimson ribbon, hanging from the top edge behind the nav */}
        <span className="hero__shape hero__shape--top" data-parallax-speed="8">
          <span className="hero__shape-float" data-parallax-depth="12">
            <img src="/assets/hero/bg-top.png" alt="" width="900" height="353" />
          </span>
        </span>

        {/* Violet fold, left edge */}
        <span className="hero__shape hero__shape--left" data-parallax-speed="-9">
          <span className="hero__shape-float" data-parallax-depth="16">
            <img src="/assets/hero/bg-left.png" alt="" width="340" height="1242" />
          </span>
        </span>

        {/* Mint ribbon stack, right edge */}
        <span className="hero__shape hero__shape--right" data-parallax-speed="-11">
          <span className="hero__shape-float" data-parallax-depth="18">
            <img src="/assets/hero/bg-right.png" alt="" width="560" height="810" />
          </span>
        </span>

        {/* Title clip: black ground, composited onto the stage with a screen
            blend so only the lettering shows. Hidden at rest; the opening
            sequence sizes, places and plays it. */}
        <video
          className="hero__intro-video"
          src="/assets/hero/title-animation.mp4"
          width="956"
          height="470"
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          tabIndex={-1}
        />
      </div>

      <div className="container hero__inner" data-parallax-speed="14">
        {/* Presenter credit: part of the brand lockup, sits with the wordmark */}
        <p className="hero__presents">
          <span className="hero__mask">
            <span className="hero__rise">
              <strong>SCOPE</strong> Club Presents
            </span>
          </span>
        </p>

        <h1 className="hero__title" id="hero-title">
          <span className="hero__mask">
            <span className="hero__rise hero__wordmark">
              <img
                src="/assets/brand/zenith-wordmark.webp"
                alt="ZENITH ’26 — The Year of 2K26"
                width="2000"
                height="816"
                decoding="async"
              />
              {/* Single highlight sweep across the wordmark's own alpha */}
              <span className="hero__sheen" aria-hidden="true">
                <span className="hero__sheen-bar" />
              </span>
            </span>
          </span>
        </h1>

        <p className="hero__theme">
          <span className="hero__mask">
            <span className="hero__rise">{event.theme}</span>
          </span>
        </p>

        <p className="hero__lede">
          <span className="hero__mask">
            <span className="hero__rise">
              Join us for a 2 Day National Hackathon and AWS Community Day.
            </span>
          </span>
        </p>

        {/* Live countdown to day one, between the title and the details band */}
        <Countdown className="hero__timer" />

        {/* Date / location band, as in the Figma header: one flat strip, two
            halves butted together, square violet bullet before each label. */}
        <dl className="hero__panels">
          <div className="hero__panel">
            <dt className="hero__panel-label">Date</dt>
            <dd className="hero__panel-value">
              17<sup>th</sup> – 18<sup>th</sup> December ‘26
            </dd>
          </div>
          <div className="hero__panel hero__panel--accent">
            <dt className="hero__panel-label">Location</dt>
            <dd className="hero__panel-value hero__panel-value--sm">
              {event.institution},<br />
              {event.city}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  )
}
