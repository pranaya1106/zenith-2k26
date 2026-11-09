/**
 * Standalone problem statements page, served at /problem-statements/.
 *
 * Statements come from `problemStatements` in data/site.js, grouped under
 * each hackathon domain. Domains with no statements yet show a placeholder,
 * so the page is ready to publish before the briefs are written.
 */
import { useState } from 'react'
import { contact, domains, problemStatements } from '../data/site'
import SectionHead from '../components/ui/SectionHead'
import { ArrowRight, ArrowUpRight } from '../components/ui/Icons'
import '../App.css'
import './ProblemStatements.css'

const NOTICE =
  'Detailed versions of the selected problem statements will be shared before the hackathon begins.'

function StatementCard({ statement }) {
  const [open, setOpen] = useState(false)
  const detailId = `${statement.id}-detail`
  const hasDetail = Boolean(statement.description || statement.objective)

  return (
    <li className={`ps-card${open ? ' is-open' : ''}`}>
      <span className="ps-card__id">{statement.id}</span>
      <h3 className="ps-card__title">{statement.title}</h3>
      {statement.summary ? <p className="ps-card__summary">{statement.summary}</p> : null}

      {hasDetail ? (
        <>
          {/* Collapsed with grid rows so the height animates without JS measuring */}
          <div className="ps-card__detail" id={detailId} aria-hidden={!open} inert={!open ? '' : undefined}>
            <div className="ps-card__detail-inner">
              {statement.description ? (
                <section>
                  <h4>Problem description</h4>
                  <p>{statement.description}</p>
                </section>
              ) : null}
              {statement.objective ? (
                <section>
                  <h4>Objective</h4>
                  <p>{statement.objective}</p>
                </section>
              ) : null}
            </div>
          </div>

          <button
            type="button"
            className="ps-card__toggle"
            aria-expanded={open}
            aria-controls={detailId}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? 'Hide full statement' : 'Read full statement'}
            <span className="ps-card__chev" aria-hidden="true" />
          </button>
        </>
      ) : null}

      {statement.link ? (
        <a className="arrow-link ps-card__link" href={statement.link} target="_blank" rel="noopener noreferrer">
          Read the full brief
          <ArrowUpRight />
        </a>
      ) : null}
    </li>
  )
}

export default function ProblemStatements() {
  const total = problemStatements.length

  return (
    <div className="app ps-page tone-dark">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="ps-bar">
        <div className="container ps-bar__inner">
          <a className="ps-bar__back" href="/#domains">
            <ArrowRight className="ps-bar__back-icon" />
            Back to ZENITH ’26
          </a>
          <a className="ps-bar__brand" href="/" aria-label="ZENITH ’26 home">
            <img src="/assets/brand/zenith-wordmark.webp" alt="ZENITH ’26" width="2000" height="816" />
          </a>
        </div>
      </header>

      <main id="main" className="section ps-main">
        <div className="container">
          <SectionHead
            index="2K26"
            label="Hackathon briefs"
            id="ps-title"
            title={
              <>
                Problem <em>statements</em>
              </>
            }
            note={
              total
                ? `${total} statement${total === 1 ? '' : 's'} across ${domains.length} domains. Pick one, form your team and build.`
                : 'The ’26 problem statements are published here ahead of kickoff. Check back soon.'
            }
            wide
          />

          <p className="ps-notice ps-notice--top">{NOTICE}</p>

          <div className="ps-domains">
            {domains.map((domain) => {
              const items = problemStatements.filter((s) => s.domain === domain.name)
              return (
                <section
                  key={domain.name}
                  className={`ps-domain ps-domain--${domain.accent}`}
                  aria-labelledby={`ps-${domain.short}`}
                >
                  <div className="ps-domain__head">
                    <span className="ps-domain__index">{domain.index}</span>
                    <h2 className="ps-domain__name" id={`ps-${domain.short}`}>
                      {domain.name}
                    </h2>
                    <p className="ps-domain__desc">{domain.description}</p>
                  </div>

                  {items.length ? (
                    <ul className="ps-list">
                      {items.map((statement) => (
                        <StatementCard key={statement.id ?? statement.title} statement={statement} />
                      ))}
                    </ul>
                  ) : (
                    <div className="ps-empty">
                      <span>Releasing soon</span>
                    </div>
                  )}
                </section>
              )
            })}
          </div>

          <p className="ps-notice">{NOTICE}</p>

          <p className="ps-contact">
            Questions about a brief? Write to{' '}
            <a href={`mailto:${contact.email}`}>{contact.email}</a>.
          </p>
        </div>
      </main>
    </div>
  )
}
