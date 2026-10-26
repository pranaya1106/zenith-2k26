import { contact, event, links } from '../data/site'
import SectionHead from './ui/SectionHead'
import RegisterButton from './RegisterButton'
import { ArrowUpRight } from './ui/Icons'
import './Contact.css'

const socials = [
  { label: 'Instagram', href: links.social.instagram },
  { label: 'LinkedIn', href: links.social.linkedin },
  { label: 'X / Twitter', href: links.social.x },
  { label: 'GitHub', href: links.social.github },
]

export default function Contact() {
  return (
    <section className="section contact tone-purple" id="contact" aria-labelledby="contact-title">
      <div className="contact__shape" aria-hidden="true">
        <img src="/assets/shapes/purple-star.webp" alt="" loading="lazy" />
      </div>

      <div className="container section__inner">
        <SectionHead
          index="07"
          label="Contact"
          id="contact-title"
          title={
            <>
              Talk to <em>the crew</em>
            </>
          }
          note="Registration questions, sponsorship, mentoring or press — the SCOPE Club team handles it all from one inbox."
        />

        <div className="contact__grid">
          <div className="contact__primary">
            <a className="contact__email" href={`mailto:${contact.email}`}>
              <span className="contact__email-text">{contact.email}</span>
              <ArrowUpRight />
            </a>

            <div className="contact__people">
              {contact.people.map((person) => (
                <a className="contact__person" href={`tel:${person.tel}`} key={person.name}>
                  <span className="contact__person-name">{person.name}</span>
                  <span className="contact__person-phone">{person.phone}</span>
                </a>
              ))}
            </div>

            <div className="contact__meta">
              <div>
                <h3>Visit</h3>
                <address>
                  {contact.address.line1}
                  <br />
                  {contact.address.line2}
                  <br />
                  {contact.address.line3}
                  <br />
                  {contact.address.line4}
                </address>
              </div>

              <div>
                <h3>Follow</h3>
                <ul className="contact__socials">
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

          <aside className="contact__card" aria-label="Registration">
            <span className="label label--plain contact__card-label">Register</span>
            <p className="contact__card-title">
              Two days.
              <br />
              Three domains.
              <br />
              One voyage.
            </p>

            <dl className="contact__card-facts">
              <div>
                <dt>Dates</dt>
                <dd>{event.dates.compact}</dd>
              </div>
              <div>
                <dt>Entry</dt>
                <dd>{event.fee}</dd>
              </div>
              <div>
                <dt>Venue</dt>
                <dd>{event.institutionShort}, Hyderabad</dd>
              </div>
            </dl>

            <RegisterButton className="btn btn--primary btn--block">
              Register for ZENITH ’26
            </RegisterButton>

            <p className="contact__card-note">
              The portal opens shortly. Write to us and we’ll send the link the day it does.
            </p>
          </aside>
        </div>
      </div>
    </section>
  )
}
