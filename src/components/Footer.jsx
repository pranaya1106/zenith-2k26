import { navLinks } from '../data/site'
import './Footer.css'

// Email, phones, address, socials, dates and registration all live in the
// Contact section directly above, so the footer only carries brand, quick
// navigation, the organisers and the legal line.
const orgs = [
  {
    src: '/assets/brand/mlrit-white.webp',
    alt: 'MLR Institute of Technology',
    width: 700,
    height: 175,
    className: 'footer__org--mlrit',
  },
  {
    src: '/assets/brand/scope-club-white.webp',
    alt: 'SCOPE Club — School of Programming Excellence',
    width: 700,
    height: 255,
    className: 'footer__org--scope',
  },
  {
    src: '/assets/brand/aws-sbg-white.webp',
    alt: 'AWS Student Builder Group at MLR Institute of Technology',
    width: 700,
    height: 165,
    className: 'footer__org--aws',
  },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__top">
          <nav aria-label="Footer sections">
            <ul className="footer__nav">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Oversized ZENITH ’26 wordmark. ZENITH is cut from the logo artwork
            and used as a CSS mask; ’26 is plain text in the same colour. */}
        <a className="footer__wordmark" href="#top" aria-label="ZENITH ’26 — back to top">
          <span className="footer__wordmark-zenith" aria-hidden="true" />
          <span className="footer__wordmark-year" aria-hidden="true">’26</span>
        </a>

        <div className="footer__bottom">
          <ul className="footer__org-logos" aria-label="Organised by">
            {orgs.map((org) => (
              <li key={org.src}>
                <img
                  className={org.className}
                  src={org.src}
                  alt={org.alt}
                  width={org.width}
                  height={org.height}
                  loading="lazy"
                />
              </li>
            ))}
          </ul>
          <p className="footer__legal">© 2026 SCOPE Club. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
