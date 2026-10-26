import { about, event } from '../data/site'
import SectionHead from './ui/SectionHead'
import './About.css'

export default function About() {
  return (
    <section className="section about tone-purple" id="about" aria-labelledby="about-title">
      <div className="about__knot" aria-hidden="true">
        <img src="/assets/ai/knot-white.webp" alt="" />
      </div>

      <div className="container section__inner">
        <SectionHead
          index="02"
          label="About ZENITH"
          id="about-title"
          title={
            <>
              The voyage, <em>briefly</em>
            </>
          }
          note={`A national-level hackathon by ${event.organiser}, hosted at ${event.institution}, Hyderabad.`}
          wide
        />

        <div className="about__grid">
          <div className="about__manifesto">
            <p className="about__mission">
              Zenith is a <mark>3-day national event</mark> featuring the AWS Community Day
              followed by a <mark>24-hour hackathon</mark>. It focuses mainly on{' '}
              <mark>HealthTech</mark>, with additional domains in EduTech and AgriTech,
              encouraging students to develop innovative solutions using technologies like AI, ML
              and other Technologies to solve real-world problems.
            </p>
            <p className="about__caption">Mission statement · ZENITH ’25 edition</p>
          </div>

          <aside className="about__aside">
            <div className="about__stats">
              {event.stats.map((stat) => (
                <div key={stat.label}>
                  <b>{stat.value}</b>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>

            <div className="about__partner">
              <span className="label label--plain">In collaboration with</span>
              <img
                src="/assets/brand/aws-student-builder.webp"
                alt="AWS Student Builder Group at MLR Institute of Technology"
                width="760"
                height="212"
                loading="lazy"
              />
            </div>

            <p className="about__venue">Held at {event.venue}.</p>
          </aside>
        </div>

        <div className="about__objectives">
          <div className="about__obj-head">
            <h3>Key objectives</h3>
            <span className="label label--plain">06 targets</span>
          </div>
          <ol>
            {about.objectives.map((objective, index) => (
              <li key={objective}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                {objective}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
