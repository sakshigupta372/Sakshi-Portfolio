import React from 'react'
import { motion } from 'framer-motion'
import { scrollToId } from './SmoothScroll'

const ScrollCue = ({ targetId = 'about', label = 'Scroll' }) => {
  const handleClick = () => {
    scrollToId(targetId)
  }

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      aria-label="Scroll down"
      className="group flex flex-col items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.4, duration: 0.8 }}
    >
      <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted group-hover:text-ink">
        {label}
      </span>
      <div className="relative flex h-10 w-6 items-start justify-center rounded-full border border-ink/25 p-1.5 group-hover:border-ink">
        <motion.span
          className="h-1.5 w-1.5 rounded-full bg-ink"
          animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </motion.button>
  )
}

export default ScrollCue
