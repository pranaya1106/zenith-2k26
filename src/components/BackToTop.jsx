import { useEffect, useState } from 'react'
import './BackToTop.css'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 900)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      className={`to-top${visible ? ' is-visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      aria-label="Back to top"
    >
      <span className="to-top__label">Top</span>
      <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path d="M8 13V3M8 3L3.5 7.5M8 3L12.5 7.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </button>
  )
}
