import { lazy, Suspense, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PATH_OVERRUN, storyChapters } from './storyChapters'
import './AboutStory.css'

gsap.registerPlugin(ScrollTrigger)

// three.js is only downloaded when the visitor is about a screen away from
// this part of the page.
const StoryCanvas = lazy(() => import('./StoryCanvas'))

const LAST = storyChapters.length - 1
const pad = (n) => String(n + 1).padStart(2, '0')

/*
  The scroll-driven 3D story that follows the purple fill.

  A tall runway holds a sticky, full-screen stage. Scrolling through the runway
  moves a camera along a 3D path (StoryCanvas.jsx) and swaps the text on the
  left for the stop the camera has reached. The scroll progress is shared with
  the canvas through `state` (a ref), so scrolling never re-renders React;
  only a change of stop does.
*/
export default function AboutStory() {
  const runwayRef = useRef(null)
  const state = useRef({ value: 0, visible: false })
  const [active, setActive] = useState(0)
  const [near, setNear] = useState(false)

  useLayoutEffect(() => {
    const runway = runwayRef.current
    if (!runway) return undefined

    const ctx = gsap.context(() => {
      // Start loading the 3D code a screen before the story is reached
      ScrollTrigger.create({
        trigger: runway,
        start: 'top bottom+=100%',
        once: true,
        onEnter: () => setNear(true),
      })

      // Only draw while any part of the story is on screen
      ScrollTrigger.create({
        trigger: runway,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => {
          state.current.visible = self.isActive
        },
      })

      ScrollTrigger.create({
        trigger: runway,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          state.current.value = self.progress
          const index = Math.min(LAST, Math.round(self.progress * (1 + PATH_OVERRUN) * LAST))
          setActive((current) => (current === index ? current : index))
        },
      })
    }, runway)

    return () => ctx.revert()
  }, [])

  const chapter = storyChapters[active]

  return (
    <div
      className="story"
      ref={runwayRef}
      style={{ '--stops': storyChapters.length }}
      role="region"
      aria-label="The ZENITH journey"
    >
      <div className="story__stage">
        {near && (
          <Suspense fallback={null}>
            <StoryCanvas state={state} count={storyChapters.length} />
          </Suspense>
        )}

        <div className="story__panel" aria-live="polite">
          <div className="story__copy" key={active}>
            <p className="story__meta">
              <span className="story__track">{chapter.track}</span>
              <span className="story__count">
                {pad(active)} <i>/</i> {pad(LAST)}
              </span>
            </p>

            <h3 className="story__title">{chapter.title}</h3>
            <p className="story__text">{chapter.copy}</p>

            {chapter.figure && <p className="story__figure">{chapter.figure}</p>}

            <ul className="story__chips">
              {chapter.chips.map((chip) => (
                <li key={chip}>{chip}</li>
              ))}
            </ul>
          </div>
        </div>

        <ol className="story__rail" aria-hidden="true">
          {storyChapters.map((item, index) => (
            <li
              key={item.title}
              className={
                index === active ? 'is-active' : index < active ? 'is-done' : undefined
              }
            />
          ))}
        </ol>
      </div>
    </div>
  )
}
