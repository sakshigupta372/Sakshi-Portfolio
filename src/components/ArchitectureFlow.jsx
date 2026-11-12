import React, { useEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'

const STEP_MS = 900

// Vertical pipeline of an agent/system. A pulse walks down the steps on a loop
// while the diagram is on screen, lighting up the active step.
const ArchitectureFlow = ({ steps, className = '' }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { margin: '-80px' })
  const reduce = useReducedMotion()
  const [active, setActive] = useState(reduce ? -1 : 0)

  useEffect(() => {
    if (!inView || reduce) return undefined
    const t = setInterval(() => setActive((i) => (i + 1) % (steps.length + 1)), STEP_MS)
    return () => clearInterval(t)
  }, [inView, reduce, steps.length])

  return (
    <ol ref={ref} className={`relative ${className}`} aria-label="Architecture, step by step">
      {steps.map((step, i) => {
        const lit = !reduce && i === active
        const passed = !reduce && i < active
        return (
          <li key={step.label} className="relative pb-3 pl-9 last:pb-0">
            {/* connector to the next step */}
            {i < steps.length - 1 ? (
              <span className="absolute bottom-0 left-[11px] top-6 w-px bg-line" aria-hidden="true">
                <motion.span
                  className="absolute inset-x-0 top-0 block bg-accent"
                  initial={false}
                  animate={{ height: passed ? '100%' : '0%' }}
                  transition={{ duration: STEP_MS / 1000 - 0.25, ease: 'easeInOut' }}
                />
              </span>
            ) : null}

            {/* node dot */}
            <span
              className={`absolute left-0 top-1.5 flex h-[23px] w-[23px] items-center justify-center rounded-full border font-mono text-[10px] transition-colors duration-300 ${
                lit || passed ? 'border-accent bg-accent text-accent-fg' : 'border-line bg-surface text-muted'
              }`}
              aria-hidden="true"
            >
              {i + 1}
            </span>

            <div
              className={`rounded-xl border px-3.5 py-2.5 transition-[border-color,box-shadow,background-color] duration-300 ${
                lit
                  ? 'border-accent bg-surface shadow-[0_10px_30px_-14px_rgb(var(--accent)/0.6)]'
                  : 'border-line bg-surface'
              }`}
            >
              <p className="text-sm font-medium text-ink">{step.label}</p>
              {step.detail ? <p className="mt-0.5 font-mono text-[11px] text-muted">{step.detail}</p> : null}
              {step.branch ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {step.branch.map((b, bi) => (
                    <span
                      key={b}
                      className={`rounded-md border px-2 py-1 font-mono text-[11px] transition-colors duration-300 ${
                        lit && bi === 0 ? 'border-accent text-accent' : 'border-line text-muted'
                      }`}
                    >
                      {b}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export default ArchitectureFlow
