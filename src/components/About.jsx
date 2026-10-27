import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { about, event } from '../data/site'
import SectionHead from './ui/SectionHead'

gsap.registerPlugin(ScrollTrigger)
import './About.css'

// Brand shapes per stat, in data order: Days, Domains, Hours (tall), Community Day (wide)
const tileShapes = [
  '/assets/shapes/shapes-v4.png',
  '/assets/shapes/shapes-v3.png',
  '/assets/shapes/shapes-v1.png',
  '/assets/shapes/shapes-v2.png',
]

// Feeds the pointer position to CSS so the tile's spotlight follows the cursor.
function trackPointer(e) {
  const tile = e.currentTarget
  const rect = tile.getBoundingClientRect()
  tile.style.setProperty('--mx', `${e.clientX - rect.left}px`)
  tile.style.setProperty('--my', `${e.clientY - rect.top}px`)
}

export default function About() {
  const sectionRef = useRef(null)
  const knotRef = useRef(null)

  // The knot starts at the section's top-left and glides down to settle at the
  // bottom-right as the section is scrolled through.
  useEffect(() => {
    const section = sectionRef.current
    const knot = knotRef.current
    if (!section || !knot) return undefined

    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Distance from the top-left resting spot to the bottom-right one
      const dx = () => section.clientWidth - knot.offsetWidth - knot.offsetLeft * 2
      const dy = () => section.clientHeight - knot.offsetHeight - knot.offsetTop * 2

      gsap.fromTo(
        knot,
        { x: 0, y: 0, rotation: 0 },
        {
          x: dx,
          y: dy,
          // Roll like a wheel: one full turn per circumference travelled
          // (path length / (π × diameter) × 360°), clockwise for a rightward roll.
          // Slightly under true rolling (0.75×) — fewer degrees per frame reads smoother.
          rotation: () => (Math.hypot(dx(), dy()) / (Math.PI * knot.offsetWidth)) * 360 * 0.75,
          // Linear + tied to the span where the section fills the screen, so the
          // knot always outpaces the page and visibly travels down the viewport:
          // top-left when the section's top hits the top, bottom-right when its
          // bottom reaches the bottom. (Lenis already smooths the scroll.)
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            // Guard for screens taller than the section
            end: () => `+=${Math.max(window.innerHeight * 0.6, section.offsetHeight - window.innerHeight)}`,
            // Catch-up glide: the knot eases toward the scroll position over
            // ~0.8s instead of snapping each frame. The path stays linear
            // (ease: 'none'), so it still only ever travels downward.
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
          force3D: true,
        },
      )
    })

    return () => mm.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="section about tone-dark"
      id="about"
      aria-labelledby="about-title"
    >
      {/* OpenAI knot — travels top-left → bottom-right on scroll */}
      <div className="about__knot" aria-hidden="true" ref={knotRef}>
        <img src="/assets/ai/knot-white.webp" alt="" />
      </div>

      <div className="container section__inner">
        <SectionHead
          index="02"
          label="About ZENITH"
          id="about-title"
          title={
            <>
              The voyage, <em>briefly</em>
            </>
          }
          note={`A national-level hackathon by ${event.organiser}, hosted at ${event.institution}, Hyderabad.`}
          wide
        />

        <div className="about__grid">
          <div className="about__manifesto">
            <p className="about__mission">
              Zenith is a <mark>3-day national event</mark> featuring the AWS Community Day
              followed by a <mark>24-hour hackathon</mark>. It focuses mainly on{' '}
              <mark>HealthTech</mark>, with additional domains in EduTech and AgriTech,
              encouraging students to develop innovative solutions using technologies like AI, ML
              and other Technologies to solve real-world problems.
            </p>
            <p className="about__caption">Mission statement · ZENITH ’25 edition</p>
          </div>

          <aside className="about__aside">
            <ul className="about__bento">
              {event.stats.map((stat, index) => (
                <li
                  key={stat.label}
                  className={`about__tile about__tile--${index + 1}`}
                  onPointerMove={trackPointer}
                >
                  <img
                    className="about__tile-shape"
                    src={tileShapes[index]}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    draggable={false}
                  />
                  <b>{stat.value}</b>
                  <span>{stat.label}</span>
                </li>
              ))}
            </ul>

            <div className="about__partner">
              <span className="label label--plain">In collaboration with</span>
              <img
                src="/assets/brand/aws-student-builder.webp"
                alt="AWS Student Builder Group at MLR Institute of Technology"
                width="760"
                height="212"
                loading="lazy"
              />
            </div>
          </aside>
        </div>

        <div className="about__objectives">
          <div className="about__obj-head">
            <h3>Key objectives</h3>
            <span className="label label--plain">06 targets</span>
          </div>
          <ol>
            {about.objectives.map((objective, index) => (
              <li key={objective}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                {objective}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
