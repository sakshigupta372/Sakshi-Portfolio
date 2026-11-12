import React, { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

/**
 * TiltCard — wraps children in a 3D card that tilts toward the cursor,
 * with a soft rose glow and a moving highlight. Pure presentational;
 * pass className for sizing/shape.
 */
const TiltCard = ({ children, className = '', max = 12, glow = true }) => {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [max, -max]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-max, max]), { stiffness: 200, damping: 20 })

  // Highlight position follows cursor
  const glowX = useTransform(x, [-0.5, 0.5], ['0%', '100%'])
  const glowY = useTransform(y, [-0.5, 0.5], ['0%', '100%'])

  const handleMouseMove = (e) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    x.set(px)
    y.set(py)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000, transformStyle: 'preserve-3d' }}
      whileHover={glow ? { boxShadow: '0 20px 60px rgba(255,90,0,0.25)' } : undefined}
      className={`relative ${className}`}
    >
      {glow && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: useTransform(
              [glowX, glowY],
              ([gx, gy]) => `radial-gradient(240px circle at ${gx} ${gy}, rgba(255,90,0,0.18), transparent 70%)`
            ),
          }}
        />
      )}
      {children}
    </motion.div>
  )
}

export default TiltCard
