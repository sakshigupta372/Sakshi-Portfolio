import React, { useEffect, useRef, useState } from 'react'
import ThemeToggle from './ThemeToggle'
import { useTheme } from '../theme/ThemeProvider'
import { EmberEngine } from '../scrolltide/ember/components/ember/engine.ts'
import '../scrolltide/ember/components/ember/ember.css'

/** Light/dark switch drawn in light: tap it, or drag the knob. Falls back to the icon button without WebGL2. */
const EmberToggle = () => {
  const { mode, setMode } = useTheme()
  const root = useRef(null)
  const engine = useRef(null)
  const [flat, setFlat] = useState(false)
  // setMode changes with the theme; the engine keeps one callback for its whole life
  const choose = useRef(null)
  choose.current = (day) => {
    const r = root.current.getBoundingClientRect()
    setMode(day ? 'light' : 'dark', { x: r.left + r.width / 2, y: r.top + r.height / 2 })
  }

  useEffect(() => {
    const el = root.current
    // a fresh canvas per mount: destroy() releases the WebGL context for good
    const canvas = document.createElement('canvas')
    canvas.className = 'em-gl'
    canvas.setAttribute('aria-hidden', 'true')
    el.prepend(canvas)
    const e = new EmberEngine(el, canvas, el.querySelector('.em-hit'), {
      day: !document.documentElement.classList.contains('dark'),
      onChange: (day) => choose.current(day),
    })
    engine.current = e
    if (el.classList.contains('em--flat')) setFlat(true)
    return () => {
      engine.current = null
      e.destroy()
      canvas.remove()
    }
  }, [])

  // the command palette can change the theme too
  useEffect(() => engine.current?.setDay(mode === 'light'), [mode])

  if (flat) return <ThemeToggle />

  return (
    <div ref={root} className="em h-9 w-[68px] shrink-0 rounded-[13px] border border-line">
      <button className="em-hit" type="button" role="switch" aria-checked="false" aria-label="Night theme. Switch to day" />
    </div>
  )
}

export default EmberToggle
