/**
 * TiltCard — adapted from Spectrum UI's tilt-card component.
 * A 3D perspective tilt card. The surface rotates toward the pointer with
 * spring smoothing, and a glare highlight follows the pointer across the card.
 * Tilt activates when the pointer is near the card, not just directly on it.
 *
 * Source: https://github.com/arihantcodes/spectrum-ui
 * License: MIT
 */

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import './TiltCard.css'

// Smoother, softer springs for buttery movement
const TRACK_SPRING = { type: 'spring', stiffness: 120, damping: 20, mass: 0.8 }
const RESET_SPRING = { type: 'spring', stiffness: 80, damping: 16, mass: 1.2 }
const REST_POINT = 0.5

const TiltCardContext = createContext({ hovered: false })

export function TiltCard({
  children,
  maxTilt = 14,
  tiltReverse = false,
  scale = 1.03,
  perspective = 1000,
  glare = true,
  glareColor = 'rgba(255, 255, 255, 0.25)',
  proximity = 120,
  className = '',
}) {
  const shouldReduceMotion = useReducedMotion()
  const [hovered, setHovered] = useState(false)
  const cardRef = useRef(null)

  const tiltX = useMotionValue(REST_POINT)
  const tiltY = useMotionValue(REST_POINT)
  const cardScale = useSpring(1, TRACK_SPRING)

  const tiltSign = tiltReverse ? -1 : 1
  const rotateX = useTransform(tiltY, [0, 1], [maxTilt * tiltSign, -maxTilt * tiltSign])
  const rotateY = useTransform(tiltX, [0, 1], [-maxTilt * tiltSign, maxTilt * tiltSign])
  const glarePosX = useTransform(tiltX, (v) => v * 100)
  const glarePosY = useTransform(tiltY, (v) => v * 100)
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glarePosX}% ${glarePosY}%, ${glareColor}, transparent 65%)`

  useEffect(() => () => { tiltX.stop(); tiltY.stop() }, [tiltX, tiltY])

  // Track mouse globally so the card reacts even when the pointer is nearby
  useEffect(() => {
    if (shouldReduceMotion) return

    const onMouseMove = (e) => {
      const el = cardRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()

      // Expand the rect by the proximity distance
      const expandedLeft = rect.left - proximity
      const expandedTop = rect.top - proximity
      const expandedRight = rect.right + proximity
      const expandedBottom = rect.bottom + proximity
      const expandedWidth = expandedRight - expandedLeft
      const expandedHeight = expandedBottom - expandedTop

      const isNear =
        e.clientX >= expandedLeft &&
        e.clientX <= expandedRight &&
        e.clientY >= expandedTop &&
        e.clientY <= expandedBottom

      if (isNear) {
        if (!hovered) setHovered(true)
        // Normalize pointer position relative to the expanded area
        const normX = (e.clientX - expandedLeft) / expandedWidth
        const normY = (e.clientY - expandedTop) / expandedHeight
        animate(tiltX, normX, TRACK_SPRING)
        animate(tiltY, normY, TRACK_SPRING)
        cardScale.set(scale)
      } else if (hovered) {
        setHovered(false)
        cardScale.set(1)
        animate(tiltX, REST_POINT, RESET_SPRING)
        animate(tiltY, REST_POINT, RESET_SPRING)
      }
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [shouldReduceMotion, hovered, proximity, scale, tiltX, tiltY, cardScale])

  return (
    <div className="tilt-card__perspective" style={{ perspective: `${perspective}px` }}>
      <motion.div
        ref={cardRef}
        style={{
          rotateX: shouldReduceMotion ? 0 : rotateX,
          rotateY: shouldReduceMotion ? 0 : rotateY,
          scale: cardScale,
          transformStyle: 'preserve-3d',
        }}
        className={`tilt-card ${className}`}
      >
        <TiltCardContext.Provider value={{ hovered }}>
          <div style={{ transformStyle: 'preserve-3d' }}>{children}</div>
        </TiltCardContext.Provider>

        {glare && !shouldReduceMotion && (
          <motion.div
            aria-hidden="true"
            className="tilt-card__glare"
            style={{ background: glareBackground, transform: 'translateZ(1px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        )}
      </motion.div>
    </div>
  )
}

export function TiltCardItem({ children, depth = 0, className = '' }) {
  const shouldReduceMotion = useReducedMotion()
  const { hovered } = useContext(TiltCardContext)
  const lifted = hovered && !shouldReduceMotion

  return (
    <div
      className={`tilt-card__item ${className}`}
      style={{
        transform: lifted ? `translateZ(${depth}px)` : 'translateZ(0px)',
        transformStyle: 'preserve-3d',
      }}
    >
      {children}
    </div>
  )
}
