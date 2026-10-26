import { timeline } from '../data/site'
import SectionHead from './ui/SectionHead'
import './Timeline.css'

export default function Timeline() {
  return (
    <section
      className="section timeline tone-charcoal"
      id="schedule"
      aria-labelledby="schedule-title"
    >
      <div className="container section__inner">
        <SectionHead
          index="04"
          label="Run of show"
          id="schedule-title"
          title={
            <>
              The <em>route</em>
            </>
          }
          note={
            <>
              <span className="chip">Provisional</span>
              <span className="timeline__note"> {timeline.note}</span>
            </>
          }
        />

        <ol className="tl">
          {timeline.items.map((item, index) => (
            <li
              className={`tl__item${index === timeline.items.length - 1 ? ' is-final' : ''}`}
              key={`${item.title}-${index}`}
              data-reveal
              style={{ '--reveal-delay': `${index * 70}ms` }}
            >
              <span className="tl__node" aria-hidden="true" />
              <div className="tl__content">
                <span className="tl__meta">
                  <span className="tl__index">{String(index + 1).padStart(2, '0')}</span>
                  <span className="tl__date">
                    {item.date}
                    <sup>{item.year}</sup>
                  </span>
                </span>
                <h3 className="tl__title">{item.title}</h3>
                <p className="tl__copy">{item.copy}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
