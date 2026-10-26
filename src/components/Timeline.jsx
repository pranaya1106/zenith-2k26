import { timeline } from '../data/site'
import ScrollTimeline from './ui/timeline'

export default function Timeline() {
  return (
    <ScrollTimeline
      id="schedule"
      titleId="schedule-title"
      className="tone-charcoal"
      label="04 — Run of show"
      title={
        <>
          The <em>route</em>
        </>
      }
      note={
        <>
          <span className="chip">Provisional</span>
          {timeline.note}
        </>
      }
      items={timeline.items}
      imageSrc="/assets/brand/zenith-lockup.webp"
      imageAlt="ZENITH ’26"
    />
  )
}
