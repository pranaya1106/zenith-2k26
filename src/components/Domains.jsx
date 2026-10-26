import { domains, links } from '../data/site'
import { useDialog } from './ui/Dialog'
import SectionHead from './ui/SectionHead'
import { ArrowUpRight } from './ui/Icons'
import './Domains.css'

export default function Domains() {
  const openDialog = useDialog()

  const openProblemStatements = () =>
    openDialog({
      kicker: 'Problem statements · 2K26',
      title: 'The briefs land before kickoff.',
      body: 'The three ’26 problem statements — HealthTech, EduTech and AgriTech — will be published here ahead of the hackathon. The previous edition’s statements remain online as an archive.',
    })

  return (
    <section className="section domains tone-dark" id="domains" aria-labelledby="domains-title">
      <div className="container section__inner">
        <SectionHead
          index="03"
          label="Track selection"
          id="domains-title"
          title={
            <>
              Hackathon <em>domains</em>
            </>
          }
          note="Three problem spaces, one weekend. Pick the frontier you can’t stop thinking about."
        />

        <div className="domains__list">
          {domains.map((domain, index) => (
            <article
              className={`domain domain--${domain.accent}`}
              key={domain.name}
              data-reveal
              style={{ '--reveal-delay': `${index * 70}ms` }}
            >
              <div className="domain__panel" aria-hidden="true">
                <span className="domain__tag">{domain.short} / 26</span>
                <span className="domain__num">{domain.index}</span>
              </div>

              <div className="domain__body">
                <div className="domain__kicker">
                  <span>Domain {domain.index}</span>
                  <span>{domain.name}</span>
                </div>
                <h3 className="domain__title">{domain.name}</h3>
                <p className="domain__copy">{domain.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="domains__cta" data-reveal>
          <div className="domains__cta-text">
            <span className="label label--pink">Next step</span>
            <p>
              The ’26 problem statements land here before kickoff. Until then, read the briefs
              the last cohort worked from.
            </p>
          </div>
          <div className="domains__cta-actions">
            <button type="button" className="btn btn--primary" onClick={openProblemStatements}>
              Problem statements
              <ArrowUpRight />
            </button>
            <a
              className="arrow-link"
              href={links.problemStatementsArchive}
              target="_blank"
              rel="noopener noreferrer"
            >
              ’25 archive
              <ArrowUpRight />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
