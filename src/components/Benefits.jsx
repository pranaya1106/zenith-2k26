import { useRef } from 'react'
import { benefits } from '../data/site'
import SectionHead from './ui/SectionHead'
import { useParallax } from './ui/parallax-scrolling'
import './Benefits.css'

// yPercent travelled per card over the section's scroll. Alternating signs
// make neighbouring cards drift apart and back, deepening the scattered look.
const cardSpeeds = [-22, 14, -28, 10]

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
                    <img src="/assets/brand/zenith-wordmark.webp" alt="" width="2000" height="816" loading="lazy" />
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
