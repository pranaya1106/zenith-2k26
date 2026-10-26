import { event, links, navLinks } from '../data/site'
import { ArrowUpRight } from './ui/Icons'
import './Footer.css'

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

const socials = [
  { label: 'Instagram', href: links.social.instagram },
  { label: 'LinkedIn', href: links.social.linkedin },
  { label: 'X / Twitter', href: links.social.x },
  { label: 'GitHub', href: links.social.github },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <a className="footer__lockup-link" href="#top" aria-label="ZENITH ’26 — back to top">
              <img
                className="footer__lockup"
                src="/assets/brand/zenith-lockup.webp"
                alt="ZENITH ’26 — The Year of 2K26, The AI Voyage"
                width="1800"
                height="929"
                loading="lazy"
              />
            </a>
            <p className="footer__desc">
              A national-level hackathon by {event.organiser} at {event.institution},
              Hyderabad.
            </p>
            <p className="footer__dates">
              <span>{event.dates.compact}</span>
              <span aria-hidden="true">/</span>
              <span>{event.city}, IN</span>
            </p>
          </div>

          <div className="footer__cols">
            <nav className="footer__col" aria-label="Footer sections">
              <h2>Explore</h2>
              <ul>
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="footer__col">
              <h2>Resources</h2>
              <ul>
                <li>
                  <a
                    href={links.problemStatementsArchive}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ’25 problem statements
                    <ArrowUpRight />
                  </a>
                </li>
                <li>
                  <a href={links.itineraryArchive} target="_blank" rel="noopener noreferrer">
                    ’25 itinerary
                    <ArrowUpRight />
                  </a>
                </li>
                <li>
                  <a href="#faq">FAQ</a>
                </li>
                <li>
                  <a href="#contact">Registration</a>
                </li>
              </ul>
            </div>

            <div className="footer__col">
              <h2>Follow</h2>
              <ul>
                {socials.map((social) => (
                  <li key={social.label}>
                    <a href={social.href} target="_blank" rel="noopener noreferrer">
                      {social.label}
                      <ArrowUpRight />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="footer__orgs">
          <div className="footer__orgs-head">
            <span className="label label--plain">Organised by</span>
            <p>SCOPE Club, MLR Institute of Technology · in collaboration with AWS</p>
          </div>
          <ul className="footer__org-logos">
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
        </div>

        <div className="footer__legal">
          <p>© 2026 SCOPE Club. All rights reserved.</p>
          <p className="footer__legal-mid">
            ZENITH is a national-level hackathon by SCOPE Club at MLR Institute of Technology.
          </p>
          <a className="footer__to-top" href="#top">
            Back to top <span aria-hidden="true">↑</span>
          </a>
        </div>
      </div>

      <div className="footer__mark" aria-hidden="true">
        <img src="/assets/brand/zenith-wordmark.webp" alt="" width="2000" height="816" loading="lazy" />
      </div>
    </footer>
  )
}
