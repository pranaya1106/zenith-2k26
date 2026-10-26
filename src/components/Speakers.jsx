import { speakers } from '../data/site'
import SectionHead from './ui/SectionHead'
import { ArrowUpRight } from './ui/Icons'
import './Speakers.css'

const initialsOf = (name) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)

export default function Speakers() {
  return (
    <section className="section speakers tone-dark" id="speakers" aria-labelledby="speakers-title">
      <div className="speakers__shape" aria-hidden="true">
        <img src="/assets/shapes/mint-clover.webp" alt="" loading="lazy" />
      </div>

      <div className="container section__inner">
        <SectionHead
          index="05"
          label="Speakers"
          id="speakers-title"
          title={
            <>
              The <em>lineup</em>
            </>
          }
          note={
            <>
              <span className="chip">’25 edition</span>
              <span className="speakers__note"> {speakers.note}</span>
            </>
          }
        />

        <ol className="speakers__list">
          {speakers.people.map((person, index) => (
            <li
              className={`speaker speaker--${person.accent}`}
              key={person.name}
              data-reveal
              style={{ '--reveal-delay': `${index * 55}ms` }}
            >
              <a
                className="speaker__link"
                href={person.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${person.name} — LinkedIn profile (opens in a new tab)`}
              >
                <span className="speaker__idx">{String(index + 1).padStart(2, '0')}</span>

                <span className="speaker__main">
                  <span className="speaker__name">{person.name}</span>
                  <span className="speaker__role">{person.role}</span>
                </span>

                <span className="speaker__mono" aria-hidden="true">
                  {initialsOf(person.name)}
                </span>

                <span className="speaker__arrow" aria-hidden="true">
                  <ArrowUpRight />
                </span>
              </a>
            </li>
          ))}
        </ol>

        <p className="speakers__foot" data-reveal>
          <span className="label label--plain">Mentors &amp; jury</span>
          <span>Announcements for the ’26 edition will appear here first.</span>
        </p>
      </div>
    </section>
  )
}
