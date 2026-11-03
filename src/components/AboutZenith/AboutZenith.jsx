import { useRef } from 'react'
import AboutStory from './AboutStory'
import { useAboutZenithScroll } from './useAboutZenithScroll'
import './AboutZenith.css'

/*
  "About ZENITH": the section right after the hero.

  A tall runway holds a sticky, full-screen stage. Scrolling through the
  runway dims a small light behind the headline, brings in the headline and the
  pink star, and raises the green 3D form from the bottom edge up over the last
  line (see useAboutZenithScroll.js).
*/
export default function AboutZenith() {
  const runwayRef = useRef(null)
  useAboutZenithScroll(runwayRef)

  return (
    <section className="zenith" id="about-zenith" aria-labelledby="zenith-title">
      <div className="zenith__runway" ref={runwayRef}>
        <div className="zenith__stage">
          {/* A low, small light on the middle of the text */}
          <span className="zenith__light" aria-hidden="true" />

          <h2 className="zenith__title" id="zenith-title">
            <span className="zenith__line">Get</span>
            <span className="zenith__line">Ready</span>
            <span className="zenith__line">for the</span>
            {/* Desktop: HACK VERSE share a line. Phones: one word per line. */}
            <span className="zenith__row">
              <span className="zenith__line">
                H<span className="zenith__alt">A</span>C<span className="zenith__alt">K</span>
              </span>
              <span className="zenith__line zenith__line--last">Verse</span>
            </span>
          </h2>

          <div className="zenith__star" aria-hidden="true">
            <img src="/assets/ai/star-pink.webp" alt="" width="700" height="654" />
          </div>

          <div className="zenith__shape" aria-hidden="true">
            <img src="/assets/about-zenith/green-shape-bottom.png" alt="" width="1800" height="714" />
          </div>

          {/* Four purple corner pieces, drawn as one purple sheet with a four-point
              star cut out of it. At the end of the section's scroll the cut-out
              shrinks so the pieces close in from the corners and stay. The resting
              size (scale 10) is wide open. The 100 x 100 box is fitted to the
              screen's shorter side (not stretched), so the star keeps its
              proportions on any screen; the sheet reaches far outside the box to
              cover the longer side. */}
          <svg
            className="zenith__burst"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <defs>
              <mask
                id="zenith-burst-mask"
                maskUnits="userSpaceOnUse"
                x="-1000"
                y="-1000"
                width="2100"
                height="2100"
              >
                <rect x="-1000" y="-1000" width="2100" height="2100" fill="#fff" />
                <path
                  className="zenith__hole"
                  fill="#000"
                  transform="translate(50 50) scale(500)"
                  d="M-1 0 Q-0.2 -0.2 0 -1 Q0.2 -0.2 1 0 Q0.2 0.2 0 1 Q-0.2 0.2 -1 0Z"
                />
              </mask>
            </defs>
            <rect
              x="-1000"
              y="-1000"
              width="2100"
              height="2100"
              fill="var(--purple)"
              mask="url(#zenith-burst-mask)"
            />
          </svg>
        </div>
      </div>

      <AboutStory />
    </section>
  )
}
