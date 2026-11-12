import React, { useMemo } from 'react'

/**
 * FallingPetals — a dreamy layer of slowly drifting petals and
 * twinkling sparkles. Pure CSS animation, pointer-events disabled,
 * so it never interferes with interaction.
 */
const EMOJIS = ['🌸', '✿']

const FallingPetals = ({ count = 8 }) => {
  const petals = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const left = Math.random() * 100
      const size = 9 + Math.random() * 10
      const duration = 14 + Math.random() * 12
      const delay = -Math.random() * 20
      const drift = (Math.random() * 2 - 1) * 40
      const char = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
      const opacity = 0.12 + Math.random() * 0.18
      return { id: i, left, size, duration, delay, drift, char, opacity }
    })
  }, [count])

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden" aria-hidden="true">
      {petals.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 select-none"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}px`,
            opacity: p.opacity,
            color: '#FF7A33',
            animation: `fall ${p.duration}s linear ${p.delay}s infinite`,
            '--drift': `${p.drift}px`,
            textShadow: '0 0 8px rgba(255, 90, 0, 0.5)',
          }}
        >
          {p.char}
        </span>
      ))}
    </div>
  )
}

export default FallingPetals
