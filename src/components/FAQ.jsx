import { useId, useState } from 'react'
import { contact, faqs } from '../data/site'
import SectionHead from './ui/SectionHead'
import { ArrowUpRight, Plus } from './ui/Icons'
import './FAQ.css'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)
  const baseId = useId()

  return (
    <section className="section faq tone-paper" id="faq" aria-labelledby="faq-title">
      <div className="container section__inner">
        <div className="faq__grid">
          <div className="faq__aside">
            <SectionHead
              index="06"
              label="FAQ"
              id="faq-title"
              title={
                <>
                  Questions, <em>answered</em>
                </>
              }
            />

            <p className="faq__note">
              Everything we get asked before registration. Something missing? Write to the crew
              and we’ll point you in the right direction.
            </p>

            <a className="arrow-link faq__ask" href={`mailto:${contact.email}`}>
              Ask the crew
              <ArrowUpRight />
            </a>
          </div>

          <div className="faq__list">
            {faqs.map((item, index) => {
              const open = openIndex === index
              const panelId = `${baseId}-panel-${index}`
              const buttonId = `${baseId}-button-${index}`

              return (
                <div className={`faq__item${open ? ' is-open' : ''}`} key={item.q}>
                  <h3 className="faq__heading">
                    <button
                      type="button"
                      id={buttonId}
                      className="faq__trigger"
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => setOpenIndex(open ? -1 : index)}
                    >
                      <span className="faq__num" aria-hidden="true">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="faq__q">{item.q}</span>
                      <span className="faq__icon" aria-hidden="true">
                        <Plus />
                      </span>
                    </button>
                  </h3>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="faq__panel"
                    aria-hidden={!open}
                  >
                    <div className="faq__panel-inner">
                      <p>{item.a}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
