/**
 * Horizontal scroll timeline — adapted from Hyperiux Vault's Timeline
 * (https://vault.hyperiux.com) for this plain React + CSS project.
 *
 * The section pins while the track slides sideways. The rail line draws in,
 * and each milestone grows its stem and dot, then reveals its text line by
 * line as it reaches the viewport. Items alternate above and below the rail.
 *
 * Under prefers-reduced-motion nothing pins or animates: the track becomes a
 * normal horizontally scrollable strip with everything visible.
 */
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import './timeline.css'

gsap.registerPlugin(ScrollTrigger, SplitText)

export default function ScrollTimeline({
  id,
  titleId,
  label,
  title,
  note,
  items,
  imageSrc,
  imageAlt = '',
  className = '',
}) {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return undefined

    let mm = null
    let cancelled = false

    const build = () => {
      if (cancelled) return
      mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const travel = () => Math.max(0, track.scrollWidth - window.innerWidth)

        // Pin the section and slide the track by exactly its overflow.
        const move = gsap.to(track, {
          x: () => -travel(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${travel()}`,
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
          },
        })

        // The rail line draws in as the rail crosses the screen.
        const rail = section.querySelector('.stl__rail')
        gsap.fromTo(
          section.querySelector('.stl__line-fill'),
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: rail,
              containerAnimation: move,
              start: 'left 70%',
              end: 'right 100%',
              scrub: true,
            },
          },
        )

        // Per-milestone reveal: dot pops, stem grows, text rises line by line.
        const splits = []
        section.querySelectorAll('.stl__item').forEach((item) => {
          const split = new SplitText(
            item.querySelectorAll('.stl__date, .stl__item-title, .stl__copy'),
            { type: 'lines', mask: 'lines' },
          )
          splits.push(split)

          gsap
            .timeline({
              scrollTrigger: {
                trigger: item,
                containerAnimation: move,
                start: 'left 85%',
                end: 'left 50%',
                scrub: true,
              },
            })
            .fromTo(item.querySelector('.stl__dot'), { scale: 0 }, { scale: 1, duration: 0.3 }, 0)
            .fromTo(item.querySelector('.stl__stem'), { scaleY: 0 }, { scaleY: 1, duration: 0.5 }, 0)
            .fromTo(
              split.lines,
              { yPercent: 110 },
              { yPercent: 0, duration: 0.6, stagger: 0.06, ease: 'power2.out' },
              0.25,
            )
        })

        return () => splits.forEach((split) => split.revert())
      })

      ScrollTrigger.refresh()
    }

    // Split text only after web fonts load, so line breaks are measured correctly.
    ;(document.fonts?.ready ?? Promise.resolve()).then(build)

    return () => {
      cancelled = true
      mm?.revert()
    }
  }, [items])

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`stl ${className}`}
      aria-labelledby={titleId}
    >
      <div ref={trackRef} className="stl__track">
        <div className="stl__intro">
          {label ? <span className="label">{label}</span> : null}
          <h2 className="stl__title" id={titleId}>
            {title}
          </h2>
          {note ? <p className="stl__note">{note}</p> : null}
          {imageSrc ? (
            <div className="stl__media">
              <img src={imageSrc} alt={imageAlt} loading="lazy" draggable={false} />
            </div>
          ) : null}
        </div>

        <div className="stl__rail">
          <div className="stl__line" aria-hidden="true">
            <span className="stl__cap" />
            <span className="stl__line-fill" />
            <span className="stl__cap" />
          </div>

          <ol className="stl__items">
            {items.map((item, index) => (
              <li
                key={`${item.title}-${index}`}
                className={`stl__item ${index % 2 ? 'is-bottom' : 'is-top'}${
                  index === items.length - 1 ? ' is-final' : ''
                }`}
              >
                <span className="stl__stem" aria-hidden="true" />
                <span className="stl__dot" aria-hidden="true" />
                <div className="stl__text">
                  <p className="stl__date">
                    <span className="stl__index">{String(index + 1).padStart(2, '0')}</span>
                    {item.date}
                    {item.year ? <sup>{item.year}</sup> : null}
                  </p>
                  <h3 className="stl__item-title">{item.title}</h3>
                  <p className="stl__copy">{item.copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
