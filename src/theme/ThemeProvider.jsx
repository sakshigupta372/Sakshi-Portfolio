import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const MODE_KEY = 'sg-theme'
const PALETTE_KEY = 'sg-palette'

// `swatch` is only used to draw the picker dots; real colors live in index.css.
export const PALETTES = [
  { id: 'indigo', label: 'Indigo', swatch: '#4F46E5' },
  { id: 'emerald', label: 'Emerald', swatch: '#059669' },
  { id: 'violet', label: 'Violet', swatch: '#7C3AED' },
  { id: 'rose', label: 'Rose', swatch: '#E11D48' },
]

const ThemeContext = createContext(null)

function readStored(key, fallback) {
  try {
    return localStorage.getItem(key) || fallback
  } catch {
    return fallback
  }
}

function applyMode(mode) {
  document.documentElement.classList.toggle('dark', mode === 'dark')
}

function applyPalette(palette) {
  document.documentElement.setAttribute('data-palette', palette)
}

export function ThemeProvider({ children }) {
  const [mode, setModeState] = useState(() =>
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  )
  const [palette, setPaletteState] = useState(() => {
    const stored = readStored(PALETTE_KEY, 'indigo')
    return PALETTES.some((p) => p.id === stored) ? stored : 'indigo'
  })

  useEffect(() => {
    applyPalette(palette)
  }, [palette])

  const commitMode = useCallback((next) => {
    applyMode(next)
    setModeState(next)
    try {
      localStorage.setItem(MODE_KEY, next)
    } catch {
      /* storage can be blocked; theme still works for this visit */
    }
  }, [])

  // Optional origin lets the new theme grow out of the clicked button.
  const setMode = useCallback(
    (next, origin) => {
      if (next === mode) return
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (!document.startViewTransition || reduce) {
        commitMode(next)
        return
      }

      const x = origin?.x ?? window.innerWidth / 2
      const y = origin?.y ?? 0
      const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))

      const transition = document.startViewTransition(() => commitMode(next))
      transition.ready
        .then(() => {
          document.documentElement.animate(
            { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
            { duration: 650, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' }
          )
        })
        .catch(() => {})
    },
    [mode, commitMode]
  )

  const toggleMode = useCallback(
    (origin) => setMode(mode === 'dark' ? 'light' : 'dark', origin),
    [mode, setMode]
  )

  const setPalette = useCallback((next) => {
    setPaletteState(next)
    try {
      localStorage.setItem(PALETTE_KEY, next)
    } catch {
      /* ignore */
    }
  }, [])

  const value = useMemo(
    () => ({ mode, palette, setMode, toggleMode, setPalette }),
    [mode, palette, setMode, toggleMode, setPalette]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}
