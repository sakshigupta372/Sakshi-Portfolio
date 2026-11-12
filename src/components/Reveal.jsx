import React from 'react'
import { motion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
}

export const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

export function Reveal({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: { opacity: 0, y: 28 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, delay, ease } },
      }}
    >
      {children}
    </motion.div>
  )
}

export function RevealWords({ text, className = '', delay = 0, as: Tag = 'span' }) {
  const words = text.split(' ')

  return (
    <Tag className={className}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="mr-[0.28em] inline-block"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55, delay: delay + index * 0.04, ease }}
        >
          {word}{' '}
        </motion.span>
      ))}
    </Tag>
  )
}

export function RevealLine({ className = '', delay = 0 }) {
  return (
    <motion.span
      className={`block h-px origin-left bg-line ${className}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.9, delay, ease }}
    />
  )
}
