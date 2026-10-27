import { contact, sponsors } from '../data/site'
import SectionHead from './ui/SectionHead'
import './Sponsors.css'

function SponsorCard({ sponsor }) {
  const logo = (
    <img
      src={sponsor.logo}
      alt={sponsor.name}
      loading="lazy"
      decoding="async"
      draggable={false}
    />
  )

  return sponsor.url ? (
    <a
      className="sponsor-card"
      href={sponsor.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${sponsor.name} (opens in a new tab)`}
    >
      {logo}
    </a>
  ) : (
    <div className="sponsor-card">{logo}</div>
  )
}

function PlaceholderCard() {
  return (
    <div className="sponsor-card sponsor-card--empty">
      <span>Announcing soon</span>
    </div>
  )
}

export default function Sponsors() {
  return (
    <section className="section sponsors tone-dark" id="sponsors" aria-labelledby="sponsors-title">
      <div className="sponsors__grid-bg" aria-hidden="true" />

      <div className="container section__inner">
        <SectionHead
          index="06"
          label="Sponsors"
          id="sponsors-title"
          title={
            <>
              Our <em>sponsors</em>
            </>
          }
          note={
            <>
              Want your brand in front of builders from across the country? Write to{' '}
              <a className="sponsors__mail" href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
              .
            </>
          }
        />

        <div className="sponsors__tiers">
          {sponsors.tiers.map((tier) => {
            const empty = Math.max(0, tier.slots - tier.sponsors.length)
            return (
              <div className={`sponsors__tier sponsors__tier--${tier.size}`} key={tier.name} data-reveal>
                <h3 className="sponsors__tier-name">{tier.name}</h3>
                <ul className="sponsors__grid">
                  {tier.sponsors.map((sponsor) => (
                    <li key={sponsor.name}>
                      <SponsorCard sponsor={sponsor} />
                    </li>
                  ))}
                  {Array.from({ length: empty }, (_, i) => (
                    <li key={`empty-${i}`}>
                      <PlaceholderCard />
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
