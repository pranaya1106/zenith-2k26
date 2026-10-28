import { useCallback, useEffect, useRef, useState } from 'react'
import { contact, event, links, navLinks } from '../data/site'
import { Close } from './ui/Icons'
import RegisterButton from './RegisterButton'
import './Navbar.css'

function useActiveSection() {
  const [active, setActive] = useState('')

  useEffect(() => {
    const sections = navLinks
      .map((link) => document.querySelector(link.href))
      .filter(Boolean)
    if (!sections.length || !('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`)
        })
      },
      { rootMargin: '-42% 0px -52% 0px', threshold: 0 },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return active
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const active = useActiveSection()
  const menuRef = useRef(null)
  const closeRef = useRef(null)
  const toggleRef = useRef(null)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY
      setScrolled(currentY > 24)
      if (currentY > 80) {
        setHidden(currentY > lastScrollY.current)
      } else {
        setHidden(false)
      }
      lastScrollY.current = currentY
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = useCallback(() => {
    setOpen(false)
    document.documentElement.style.removeProperty('overflow')
    toggleRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!open) return undefined

    document.documentElement.style.overflow = 'hidden'
    const frame = window.requestAnimationFrame(() => closeRef.current?.focus())

    const onKeyDown = (keyEvent) => {
      if (keyEvent.key === 'Escape') {
        closeMenu()
        return
      }
      if (keyEvent.key !== 'Tab') return

      const focusables = menuRef.current?.querySelectorAll(
        'a[href], button:not([disabled])',
      )
      if (!focusables?.length) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]

      if (keyEvent.shiftKey && document.activeElement === first) {
        keyEvent.preventDefault()
        last.focus()
      } else if (!keyEvent.shiftKey && document.activeElement === last) {
        keyEvent.preventDefault()
        first.focus()
      }
    }

    const desktop = window.matchMedia('(min-width: 960px)')
    const onDesktop = () => {
      if (desktop.matches) {
        setOpen(false)
        document.documentElement.style.removeProperty('overflow')
      }
    }

    document.addEventListener('keydown', onKeyDown)
    desktop.addEventListener('change', onDesktop)
    return () => {
      window.cancelAnimationFrame(frame)
      document.removeEventListener('keydown', onKeyDown)
      desktop.removeEventListener('change', onDesktop)
      document.documentElement.style.removeProperty('overflow')
    }
  }, [open, closeMenu])

  return (
    <>
      <header className={`nav${scrolled ? ' is-scrolled' : ''}${hidden ? ' is-hidden' : ''}`}>
        <div className="container nav__inner">
          <div className="nav__logos-left">
            <img src="/assets/brand/scope-club-white.webp" alt="SCOPE Club" />
            <img src="/assets/brand/aws-sbg-white.webp" alt="AWS Student Builder Group" />
          </div>

          <nav className="nav__links" aria-label="Primary">
            <ul>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    className={`nav__link${active === link.href ? ' is-active' : ''}`}
                    href={link.href}
                    aria-current={active === link.href ? 'true' : undefined}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="nav__logos-right">
            <img src="/assets/brand/mlrit-white.webp" alt="MLR Institute of Technology" />
          </div>

          <div className="nav__actions">
            <RegisterButton className="btn btn--sm btn--primary nav__cta">Register</RegisterButton>
            <button
              ref={toggleRef}
              type="button"
              className="nav__toggle"
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => (open ? closeMenu() : setOpen(true))}
            >
              <span className="nav__toggle-label">Menu</span>
              <span className="nav__bars" aria-hidden="true">
                <span />
                <span />
              </span>
            </button>
          </div>
        </div>
      </header>

      <div
        id="site-menu"
        ref={menuRef}
        className={`menu${open ? ' is-open' : ''}`}
        aria-hidden={!open}
        {...(open ? { role: 'dialog', 'aria-modal': 'true' } : {})}
        aria-labelledby="menu-title"
      >
        <div className="menu__top container">
          <p className="menu__title label" id="menu-title">
            {event.name} ’26
          </p>
          <button ref={closeRef} type="button" className="menu__close" onClick={closeMenu} tabIndex={open ? 0 : -1}>
            <span>Close</span>
            <Close />
          </button>
        </div>

        <nav className="menu__nav container" aria-label="Site sections">
          <ol>
            {navLinks.map((link, index) => (
              <li key={link.href} style={{ '--i': index }}>
                <a
                  href={link.href}
                  onClick={closeMenu}
                  tabIndex={open ? 0 : -1}
                  className={active === link.href ? 'is-active' : undefined}
                >
                  <span className="menu__index">{String(index + 1).padStart(2, '0')}</span>
                  <span className="menu__label">{link.label}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="menu__foot container">
          <div className="menu__contact">
            <a href={`mailto:${contact.email}`} tabIndex={open ? 0 : -1}>
              {contact.email}
            </a>
            <div className="menu__socials">
              <a href={links.social.instagram} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1}>
                Instagram
              </a>
              <a href={links.social.linkedin} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1}>
                LinkedIn
              </a>
              <a href={links.social.x} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1}>
                X
              </a>
            </div>
          </div>
          <RegisterButton className="btn btn--primary menu__cta">Register</RegisterButton>
        </div>
      </div>
    </>
  )
}
