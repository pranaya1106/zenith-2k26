import './Ticker.css'

const ITEMS = [
  'AWS Student Community Day',
  '2-day national hackathon',
  'AI for Healthcare',
  'AI for Education',
  'AI for Security',
  'MLRIT · Hyderabad',
  '17—19 Dec 2026',
]

function Group({ hidden = false }) {
  return (
    <ul className="ticker__group" aria-hidden={hidden ? 'true' : undefined}>
      {ITEMS.map((item) => (
        <li key={item}>
          <span className="ticker__star" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  )
}

export default function Ticker() {
  return (
    <div className="ticker">
      <p className="sr-only">
        ZENITH ’26: an AWS Student Community Day and a two-day national hackathon on AI for Healthcare,
        AI for Education and AI for Security. 17 to 19 December 2026 at MLR Institute of Technology, Hyderabad.
      </p>
      <div className="ticker__viewport" aria-hidden="true">
        <div className="ticker__track">
          <Group />
          <Group hidden />
        </div>
      </div>
    </div>
  )
}
