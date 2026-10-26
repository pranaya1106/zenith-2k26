import { benefits } from '../data/site'
import SectionHead from './ui/SectionHead'
import './Benefits.css'

export default function Benefits() {
  return (
    <section className="section benefits tone-charcoal" id="why" aria-labelledby="why-title">
      <div className="benefits__shape" aria-hidden="true">
        <img src="/assets/shapes/purple-notch.webp" alt="" />
      </div>

      <div className="container section__inner">
        <SectionHead
          index="01"
          label="Why join"
          id="why-title"
          title={
            <>
              Why join <em>ZENITH?</em>
            </>
          }
          note="Three days built around three things: what you learn, who you meet, and what you take home."
          wide
        />

        <ol className="benefits__list">
          {benefits.map((benefit, index) => (
            <li
              className="benefit"
              key={benefit.index}
              data-reveal
              style={{ '--reveal-delay': `${index * 80}ms` }}
            >
              <span className="benefit__index">{benefit.index}</span>
              <div className="benefit__lead">
                <h3 className="benefit__title">{benefit.title}</h3>
              </div>
              <div className="benefit__body">
                {benefit.highlight ? (
                  <span className="benefit__figure">{benefit.highlight}</span>
                ) : null}
                <p className="benefit__copy">{benefit.copy}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
