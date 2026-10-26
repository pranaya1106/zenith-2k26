import { speakers } from '../data/site'
import SectionHead from './ui/SectionHead'
import './Speakers.css'

export default function Speakers() {
  return (
    <section className="section speakers tone-dark" id="speakers" aria-labelledby="speakers-title">
      <div className="container section__inner">
        <SectionHead
          index="05"
          label="Speakers & mentors"
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

        <ul className="speakers__grid">
          {speakers.people.map((person, index) => (
            <li
              className={`speaker speaker--${person.accent}`}
              key={person.name}
              data-reveal
              style={{ '--reveal-delay': `${index * 60}ms` }}
            >
              <a
                className="speaker__link"
                href={person.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${person.name} on LinkedIn (opens in a new tab)`}
              >
                <span className="speaker__photo">
                  <img
                    src={person.photo}
                    alt=""
                    width="400"
                    height="400"
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <span className="speaker__name">{person.name}</span>
              </a>
              <p className="speaker__role">{person.role}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
