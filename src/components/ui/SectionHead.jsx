import './SectionHead.css'

export default function SectionHead({ index, label, title, note, wide = false, id }) {
  return (
    <header className={`sec-head${wide ? ' sec-head--wide' : ''}`}>
      <div className="sec-head__top">
        <span className="label">
          {index} — {label}
        </span>
        {note ? <p className="sec-head__note">{note}</p> : null}
      </div>
      <h2 className="sec-head__title" id={id}>
        {title}
      </h2>
    </header>
  )
}
