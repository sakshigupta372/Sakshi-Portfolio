import React from 'react'
import { motion, useReducedMotion, useScroll, useTime, useTransform } from 'framer-motion'
import { FACES, PHOTO, rig } from '../face/config.js'

const RING_WORDS = ['Agentic AI', 'MCP servers', 'RAG pipelines', 'Multi-agent systems', 'LLM backends']
const RING_RADIUS = 91
const RING_LENGTH = Math.floor(2 * Math.PI * RING_RADIUS)
const RING_PATH = `M ${100 - RING_RADIUS},100 a ${RING_RADIUS},${RING_RADIUS} 0 1,1 ${RING_RADIUS * 2},0 a ${RING_RADIUS},${RING_RADIUS} 0 1,1 -${RING_RADIUS * 2},0`

const pct = (value) => `${value * 100}%`
const { disc } = rig

// The ring drifts on its own and turns a little faster as the page scrolls.
function TextRing() {
  const reduceMotion = useReducedMotion()
  const time = useTime()
  const { scrollY } = useScroll()
  const rotate = useTransform([time, scrollY], ([t, s]) => (reduceMotion ? 0 : t * 0.008) + s * 0.08)

  return (
    // centred on the disc, which sits a little below the middle of the stage
    <div className="pointer-events-none absolute inset-0" style={{ top: pct(disc.y - 0.5) }} aria-hidden="true">
      <motion.svg viewBox="0 0 200 200" className="h-full w-full overflow-visible" style={{ rotate }}>
        <defs>
          <path id="portrait-ring" d={RING_PATH} />
        </defs>
        <text
          className="font-mono uppercase"
          fontSize="5.2"
          style={{ fill: 'rgb(var(--ink) / 0.6)' }}
          textLength={RING_LENGTH}
          lengthAdjust="spacing"
        >
          <textPath href="#portrait-ring" textLength={RING_LENGTH} lengthAdjust="spacing">
            {[0, 1].map((round) =>
              RING_WORDS.map((word) => (
                <React.Fragment key={`${round}-${word}`}>
                  {word}
                  <tspan style={{ fill: 'rgb(var(--accent))' }}>{' ✦ '}</tspan>
                </React.Fragment>
              ))
            )}
          </textPath>
        </text>
      </motion.svg>
    </div>
  )
}

/** A still copy of the portrait: shown until the renderer is ready, or if it can't run. */
function StillPortrait() {
  const photo = (clipPath) => (
    <div className="absolute inset-0" style={{ clipPath }}>
      <img
        src={FACES.base}
        alt=""
        draggable={false}
        fetchpriority="high"
        className="absolute max-w-none select-none"
        style={{ left: pct(PHOTO.x), top: pct(PHOTO.y), height: pct(PHOTO.h) }}
      />
    </div>
  )

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <div
        className="absolute rounded-full bg-accent"
        style={{ left: pct(disc.x - disc.r), top: pct(disc.y - disc.r), width: pct(disc.r * 2), height: pct(disc.r * 2) }}
      />
      {/* same rule as the shader: free above the disc's centre, cut by the disc below it */}
      {photo(`inset(0 0 ${pct(1 - disc.y)} 0)`)}
      {photo(`circle(${pct(disc.r)} at ${pct(disc.x)} ${pct(disc.y)})`)}
    </div>
  )
}

/** The square the pull-able portrait is drawn into. */
export const PortraitStage = React.forwardRef(function PortraitStage({ ready }, ref) {
  return (
    <div ref={ref} className="relative aspect-square w-[19rem] sm:w-[23rem] lg:w-[27rem]">
      <TextRing />
      {ready ? null : <StillPortrait />}
    </div>
  )
})

/** The handwritten hint laid over the stage, gone after the first pull. */
export function PortraitHint({ pulled }) {
  return (
    <p
      className={`pull-hint absolute left-[-3%] top-[14%] -rotate-6 font-display text-xl italic text-ink sm:left-[-8%] sm:text-2xl ${
        pulled ? 'translate-y-2 opacity-0' : ''
      }`}
    >
      pull my face
      <svg viewBox="0 0 60 40" className="ml-8 block h-8 w-12" fill="none" aria-hidden="true">
        <path d="M4 4c18 2 34 12 44 30" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M40 31l8 4 1-9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </p>
  )
}
