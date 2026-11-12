import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../theme/ThemeProvider'

const ThemeToggle = ({ className = '' }) => {
  const { mode, toggleMode } = useTheme()
  const dark = mode === 'dark'

  const onClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    toggleMode({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={dark ? 'Light mode' : 'Dark mode'}
      className={`relative flex h-9 w-9 items-center justify-center rounded-full text-ink/80 transition-colors hover:bg-ink/10 hover:text-ink ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={dark ? 'moon' : 'sun'}
          initial={{ rotate: -80, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 80, opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.22 }}
          className="flex"
        >
          {dark ? <Moon size={16} /> : <Sun size={16} />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

export default ThemeToggle
