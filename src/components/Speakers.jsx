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
        />

        <div className="speakers__empty" data-reveal>
          <span>Revealing Soon</span>
        </div>
      </div>
    </section>
  )
}
