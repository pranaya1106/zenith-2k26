import { links } from '../data/site'
import { useDialog } from './ui/Dialog'
import { ArrowUpRight } from './ui/Icons'

/**
 * Points at the live registration URL when one exists.
 * Until then it explains the status instead of linking to a dead destination.
 */
export default function RegisterButton({
  className = 'btn btn--primary',
  children = 'Register for ZENITH ’26',
  short = false,
}) {
  const openDialog = useDialog()

  if (links.registration) {
    return (
      <a
        className={className}
        href={links.registration}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
        <ArrowUpRight />
      </a>
    )
  }

  return (
    <button
      type="button"
      className={className}
      onClick={() =>
        openDialog({
          kicker: 'Registration · 2K26',
          title: 'The portal opens shortly.',
          body: short
            ? 'Registration details for ZENITH ’26 are being finalised. Write to the crew and we will send the link the moment it goes live.'
            : 'Registration details for ZENITH ’26 are being finalised. Write to the SCOPE Club crew and we will send you the registration link, fee details and deadlines the moment they are published.',
        })
      }
    >
      {children}
      <ArrowUpRight />
    </button>
  )
}
