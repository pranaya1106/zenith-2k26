import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Close } from './Icons'
import { contact } from '../../data/site'
import './Dialog.css'

const DialogContext = createContext(() => {})

export function useDialog() {
  return useContext(DialogContext)
}

/**
 * One native <dialog> for every "not published yet" destination.
 * Keeps CTAs honest: they either point at a real URL or explain the status.
 */
export function DialogProvider({ children }) {
  const ref = useRef(null)
  const [content, setContent] = useState(null)

  const open = useCallback((next) => {
    setContent(next)
    const node = ref.current
    if (node && !node.open) node.showModal()
  }, [])

  const close = useCallback(() => {
    const node = ref.current
    if (node?.open) node.close()
  }, [])

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const onClose = () => {
      setContent(null)
      // The mobile menu manages its own scroll lock; don't release it here.
      if (!document.getElementById('site-menu')?.classList.contains('is-open')) {
        document.documentElement.style.removeProperty('overflow')
      }
    }
    node.addEventListener('close', onClose)
    return () => node.removeEventListener('close', onClose)
  }, [])

  useEffect(() => {
    if (!ref.current?.open) return
    document.documentElement.style.overflow = 'hidden'
  }, [content])

  return (
    <DialogContext.Provider value={open}>
      {children}
      <dialog
        ref={ref}
        className="dialog"
        aria-labelledby="dialog-title"
        onClick={(event) => {
          if (event.target === ref.current) close()
        }}
      >
        <div className="dialog__panel">
          <div className="dialog__top">
            <span className="label label--purple">{content?.kicker ?? 'Status'}</span>
            <button type="button" className="dialog__close" onClick={close}>
              <span className="sr-only">Close dialog</span>
              <Close />
            </button>
          </div>
          <h2 className="dialog__title" id="dialog-title">
            {content?.title}
          </h2>
          <p className="dialog__body">{content?.body}</p>
          <div className="dialog__actions">
            <a className="btn btn--primary" href={`mailto:${contact.email}`}>
              Email the crew
              <ArrowUpRight />
            </a>
            <button type="button" className="btn" onClick={close}>
              Close
            </button>
          </div>
          <p className="dialog__meta">
            {contact.email} · {contact.people[0].phone}
          </p>
        </div>
      </dialog>
    </DialogContext.Provider>
  )
}
