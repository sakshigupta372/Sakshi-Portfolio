import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useInView } from 'framer-motion'

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()'

const DecryptedText = ({
  text = '',
  className = '',
  speed = 50,
  revealDelay = 0,
  sequential = true,
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [displayText, setDisplayText] = useState('')
  const [revealed, setRevealed] = useState(false)

  const decrypt = useCallback(() => {
    const length = text.length
    let iteration = 0
    const maxIterations = sequential ? length * 3 : length * 2

    const interval = setInterval(() => {
      setDisplayText(() => {
        return text
          .split('')
          .map((char, i) => {
            if (char === ' ') return ' '
            const revealIndex = sequential
              ? Math.floor(iteration / 3)
              : iteration > length
                ? i
                : -1
            if (i < revealIndex || iteration >= maxIterations) return char
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join('')
      })

      iteration++
      if (iteration >= maxIterations) {
        clearInterval(interval)
        setDisplayText(text)
        setRevealed(true)
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed, sequential])

  useEffect(() => {
    if (!isInView || revealed) return
    const timeout = setTimeout(decrypt, revealDelay)
    return () => clearTimeout(timeout)
  }, [isInView, revealed, decrypt, revealDelay])

  useEffect(() => {
    if (!isInView) {
      setDisplayText(text.split('').map((c) => (c === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)])).join(''))
    }
  }, [isInView, text])

  return (
    <span ref={ref} className={`font-mono ${className}`}>
      {displayText || text.replace(/[^ ]/g, '•')}
    </span>
  )
}

export default DecryptedText
