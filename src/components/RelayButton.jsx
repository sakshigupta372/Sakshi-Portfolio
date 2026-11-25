import React, { useEffect, useRef } from 'react'
import { RelayEngine } from '../scrolltide/relay/relayEngine.js'
import '../scrolltide/relay/relay.css'

const ANNOUNCE = { idle: '', sending: 'Sending your message', done: 'Message sent' }

/** Submit button: the label rolls into a progress groove, then into a check. */
const RelayButton = ({ phase = 'idle', label = 'Send message', doneLabel = 'Sent' }) => {
  const root = useRef(null)
  const engine = useRef(null)

  useEffect(() => {
    engine.current = new RelayEngine(root.current)
    return () => engine.current.destroy()
  }, [])

  useEffect(() => engine.current.set(phase), [phase])

  return (
    <div ref={root}>
      <button type="submit" className="rl-btn" disabled={phase !== 'idle'} aria-label={phase === 'idle' ? label : ANNOUNCE[phase]}>
        <span className="rl-label" data-on="true" aria-hidden="true">
          {label}
        </span>
        <span className="rl-track" data-on="false" aria-hidden="true">
          <i />
        </span>
        <span className="rl-done" data-on="false" aria-hidden="true">
          <span className="rl-tick">
            <svg viewBox="0 0 16 16">
              <path d="M4.6 8.4 7 10.7l4.6-5" />
            </svg>
          </span>
          <span className="rl-word">{doneLabel}</span>
        </span>
      </button>
      <p className="sr-only" aria-live="polite">
        {ANNOUNCE[phase]}
      </p>
    </div>
  )
}

export default RelayButton
