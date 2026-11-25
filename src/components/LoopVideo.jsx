import React, { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * A silent looping clip that only decodes while it is on screen, and holds
 * on its poster (the film's first frame) for people who prefer reduced motion.
 */
const LoopVideo = ({ src, poster, label, className = '' }) => {
  const videoRef = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const video = videoRef.current
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !reduced) video.play().catch(() => {})
        else video.pause()
      },
      { threshold: 0.05 }
    )
    io.observe(video)
    return () => io.disconnect()
  }, [reduced])

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
      tabIndex={-1}
      className={className}
    />
  )
}

export default LoopVideo
