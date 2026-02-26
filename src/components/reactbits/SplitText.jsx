import React, { useMemo } from 'react'
import { motion } from 'framer-motion'

const SplitText = ({
  text = '',
  className = '',
  delay = 0,
  letterSpacing = 0.03,
  duration = 0.5,
  ease = [0.22, 1, 0.36, 1],
  once = true,
}) => {
  const characters = useMemo(() => {
    return text.split('').map((char) => (char === ' ' ? '\u00A0' : char))
  }, [text])

  return (
    <span className={className} aria-label={text}>
      {characters.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 40, filter: 'blur(12px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once }}
          transition={{
            duration,
            delay: delay + i * letterSpacing,
            ease,
          }}
          style={{ display: 'inline-block', willChange: 'transform, opacity, filter' }}
        >
          {char}
        </motion.span>
      ))}
    </span>
  )
}

export default SplitText
