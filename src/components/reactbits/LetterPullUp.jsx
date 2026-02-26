import React, { useMemo } from 'react'
import { motion } from 'framer-motion'

const LetterPullUp = ({
  text = '',
  className = '',
  delay = 0,
}) => {
  const words = useMemo(() => text.split(' '), [text])

  const pullUpVariant = {
    initial: { y: 20, opacity: 0 },
    animate: (i) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: delay + i * 0.05,
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  }

  return (
    <span className={className}>
      {words.map((word, wordIdx) => (
        <span key={wordIdx} className="inline-block">
          {word.split('').map((char, charIdx) => {
            const globalIdx = words.slice(0, wordIdx).join(' ').length + charIdx + (wordIdx > 0 ? 1 : 0)
            return (
              <motion.span
                key={charIdx}
                variants={pullUpVariant}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                custom={globalIdx}
                className="inline-block"
              >
                {char}
              </motion.span>
            )
          })}
          {wordIdx < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </span>
  )
}

export default LetterPullUp
