import React, { useEffect, useRef, useState } from 'react'
import { PipEngine } from '../scrolltide/pip/components/pip/engine.ts'
import './pipMascot.css'

// bun shape, dot eyes, satin finish, lilac
const LOOK = { shape: 0, eyes: 0, finish: 1, colour: 3 }

/**
 * A small figure that watches the pointer, hops when tapped and dozes off after
 * half a minute without input. Decorative: the button around it carries the label.
 */
const PipMascot = () => {
  const root = useRef(null)
  const [asleep, setAsleep] = useState(false)

  useEffect(() => {
    const el = root.current
    const canvas = document.createElement('canvas')
    canvas.className = 'pip-gl'
    el.prepend(canvas)
    const engine = new PipEngine(el, canvas, LOOK)
    engine.onSleep = setAsleep
    return () => {
      engine.destroy()
      canvas.remove()
    }
  }, [])

  return (
    <span ref={root} className="pip" data-asleep={asleep} aria-hidden="true">
      <span className="pip-z">
        <b>z</b>
        <b>z</b>
        <b>z</b>
      </span>
    </span>
  )
}

export default PipMascot
