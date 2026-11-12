import React, { useMemo } from 'react'
import { motion } from 'framer-motion'

/**
 * PetalBurst — a one-shot radial spray of petals/sparkles.
 * Render it (e.g. when `active` is true) and it animates once.
 * Positioned absolutely from its parent's center by default.
 */
const PIECES = ['🌸', '✿', '❀', '🌷', '💕', '✦', '✧', '🌼']

const PetalBurst = ({ count = 22 }) => {
  const pieces = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4
      const distance = 90 + Math.random() * 150
      return {
        id: i,
        char: PIECES[Math.floor(Math.random() * PIECES.length)],
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance - 40, // bias upward for a "pop"
        rotate: (Math.random() - 0.5) * 540,
        scale: 0.7 + Math.random() * 0.9,
        duration: 1 + Math.random() * 0.8,
      }
    })
  }, [count])

  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 z-40" aria-hidden="true">
      {pieces.map((p) => (
        <motion.span
          key={p.id}
          className="absolute select-none"
          style={{ fontSize: `${18 * p.scale}px`, textShadow: '0 0 8px rgba(255,90,0,0.6)' }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0.3, rotate: 0 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: p.scale, rotate: p.rotate }}
          transition={{ duration: p.duration, ease: 'easeOut' }}
        >
          {p.char}
        </motion.span>
      ))}
    </div>
  )
}

export default PetalBurst
