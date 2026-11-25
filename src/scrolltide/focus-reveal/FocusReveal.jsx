import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import './FocusReveal.css'

/* useLayoutEffect warns during SSR (Next.js, Remix); fall back on the server. */
const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export default function FocusReveal({
  sentence = 'Focus Reveal',
  /* false cycles the words on a timer; true hands control to the pointer. */
  manual = false,
  blur = 5,
  borderColor = '#150cc7',
  color = '#ffffff',
  /* How long the frame takes to travel between words, and how long it rests
     on each one before moving on. */
  duration = 500,
  pause = 1000,
  easing = 'cubic-bezier(0.22, 1, 0.36, 1)',
  /* Frame inset around each word, in em. */
  padding = [0.2, 0.15],
  dim = 0.6,
  gap = 0.4,
  /* Typography — omit any of these to inherit from your page. */
  fontFamily,
  fontSize,
  lineHeight = 1.2,
  letterSpacing,
  as: Tag = 'p',
  className = '',
  style,
  ...rest
}) {
  const words = sentence.split(/\s+/).filter(Boolean)

  const rootRef = useRef(null)
  const wordRefs = useRef([])
  const [boxes, setBoxes] = useState([])
  const [active, setActive] = useState(0)

  /* The frame is positioned from measured word boxes rather than CSS, so it
     tracks any font, size or wrap without the geometry being hard-coded. */
  const measure = useCallback(() => {
    const root = rootRef.current
    if (!root) return
    const fs = parseFloat(getComputedStyle(root).fontSize) || 16
    const padX = fs * padding[0]
    const padY = fs * padding[1]

    setBoxes(
      wordRefs.current.slice(0, words.length).map((el) =>
        el
          ? {
              x: el.offsetLeft - padX,
              y: el.offsetTop - padY,
              w: el.offsetWidth + padX * 2,
              h: el.offsetHeight + padY * 2,
            }
          : null
      )
    )
  }, [padding[0], padding[1], words.length])

  useIsoLayoutEffect(() => {
    measure()

    /* Webfonts land after first paint and change every word's width, so the
       first measurement is almost always stale without this. */
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(measure).catch(() => {})
    }

    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(measure)
    if (rootRef.current) ro.observe(rootRef.current)
    return () => ro.disconnect()
  }, [measure, sentence])

  useEffect(() => {
    if (manual || words.length < 2 || prefersReducedMotion()) return
    const id = setInterval(
      () => setActive((i) => (i + 1) % words.length),
      duration + pause
    )
    return () => clearInterval(id)
  }, [manual, words.length, duration, pause])

  const box = boxes[active]

  const vars = {
    '--fr-blur': `${blur}px`,
    '--fr-border': borderColor,
    '--fr-color': color,
    '--fr-dur': `${duration}ms`,
    '--fr-ease': easing,
    '--fr-dim': dim,
    '--fr-gap': `${gap}em`,
    ...(fontFamily ? { fontFamily } : null),
    ...(fontSize ? { fontSize: typeof fontSize === 'number' ? `${fontSize}px` : fontSize } : null),
    ...(letterSpacing != null
      ? { letterSpacing: typeof letterSpacing === 'number' ? `${letterSpacing}em` : letterSpacing }
      : null),
    lineHeight,
    ...style,
  }

  return (
    <Tag
      ref={rootRef}
      className={`fr${className ? ` ${className}` : ''}`}
      style={vars}
      {...rest}
    >
      {box && (
        <span
          className="fr-frame"
          aria-hidden="true"
          style={{
            transform: `translate3d(${box.x}px, ${box.y}px, 0)`,
            width: `${box.w}px`,
            height: `${box.h}px`,
          }}
        >
          <i />
          <i />
          <i />
          <i />
        </span>
      )}

      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          ref={(el) => (wordRefs.current[i] = el)}
          className={`fr-word${i === active ? ' is-on' : ''}`}
          onMouseEnter={manual ? () => setActive(i) : undefined}
          onFocus={manual ? () => setActive(i) : undefined}
          tabIndex={manual ? 0 : undefined}
        >
          {word}
        </span>
      ))}
    </Tag>
  )
}
