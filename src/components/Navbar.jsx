import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Github, Linkedin, Menu, Search, X } from 'lucide-react'
import Magnet from './reactbits/Magnet'
import ThemeToggle from './ThemeToggle'
import { scrollToTop } from './SmoothScroll'
import { EMAIL, LINKS, isMac, togglePalette } from '../lib/ui'
import { goToSection, navigate, usePath } from '../lib/router.jsx'

// Order matches the page top to bottom.
const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Work' },
  { id: 'stack', label: 'Stack' },
  { id: 'journey', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
]

const HIDE_AFTER = 240 // px scrolled before the bar is allowed to hide
const DELTA = 6 // ignore tiny scroll jitters

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [mac, setMac] = useState(false)
  const lastY = useRef(0)
  const openRef = useRef(false)
  const path = usePath()

  useEffect(() => setMac(isMac()), [])
  useEffect(() => {
    openRef.current = open
  }, [open])

  const scrollTo = (id) => {
    setOpen(false)
    // Wait a beat so the overlay can close before the page starts moving.
    setTimeout(() => goToSection(id), open ? 120 : 0)
  }

  const goHome = () => (path === '/' ? scrollToTop() : navigate('/'))

  // Shrink the pill after the first scroll; hide on the way down, show on the way up.
  useEffect(() => {
    lastY.current = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      if (y < 160) setActive('')
      if (openRef.current) return
      const diff = y - lastY.current
      if (Math.abs(diff) < DELTA) return
      setHidden(diff > 0 && y > HIDE_AFTER)
      lastY.current = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setActive('')
    if (path !== '/') return undefined
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(Boolean)
    if (!sections.length) return undefined

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target?.id) setActive(visible.target.id)
      },
      { rootMargin: '-35% 0px -50% 0px', threshold: [0.1, 0.25, 0.5] }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [path])

  // Freeze page scroll (Lenis + native) while the full-screen menu is open.
  useEffect(() => {
    if (!open) return undefined
    window.lenis?.stop?.()
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      window.lenis?.start?.()
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <motion.header
        className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: hidden && !open ? -110 : 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav
          aria-label="Primary"
          className={`pointer-events-auto mx-auto flex items-center justify-between gap-2 rounded-full border px-3 transition-[max-width,height,background-color,border-color,box-shadow] duration-500 ease-out sm:px-4 ${
            scrolled
              ? 'h-12 max-w-[50rem] border-line bg-surface/80 shadow-[0_12px_32px_-14px_rgb(var(--ink)/0.35)] backdrop-blur-xl'
              : 'h-14 max-w-[62rem] border-transparent bg-transparent'
          }`}
        >
          <button
            type="button"
            onClick={goHome}
            className="pl-2 font-display text-[22px] leading-none tracking-tight text-ink"
            aria-label={path === '/' ? 'Back to top' : 'Home'}
          >
            Sakshi<span className="text-accent">.</span>
          </button>

          <ul className="hidden items-center gap-0.5 md:flex">
            {NAV_ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => scrollTo(item.id)}
                  aria-current={active === item.id ? 'true' : undefined}
                  className={`relative rounded-full px-3.5 py-1.5 text-[12px] uppercase tracking-[0.14em] transition-colors ${
                    active === item.id ? 'text-ink' : 'text-muted hover:text-ink'
                  }`}
                >
                  {active === item.id ? (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-ink/[0.08]"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  ) : null}
                  <span className="relative">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={togglePalette}
              aria-label="Open command palette"
              className="hidden items-center gap-2 rounded-full border border-line bg-paper/60 py-1.5 pl-3 pr-2 text-[12px] text-muted transition-colors hover:border-ink/30 hover:text-ink lg:flex"
            >
              <Search size={13} />
              <span>Search</span>
              <kbd className="rounded-md border border-line bg-surface px-1.5 py-0.5 font-mono text-[10px] leading-none text-muted">
                {mac ? '⌘' : 'Ctrl'} K
              </kbd>
            </button>

            <button
              type="button"
              onClick={togglePalette}
              aria-label="Open command palette"
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink/80 transition-colors hover:bg-ink/10 hover:text-ink md:flex lg:hidden"
            >
              <Search size={16} />
            </button>

            <ThemeToggle />

            <Magnet strength={0.25} range={90} className="hidden sm:block">
              <a
                href={`mailto:${EMAIL}`}
                className="group inline-flex items-center gap-1 rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-paper transition-opacity hover:opacity-85"
              >
                Hire me
                <ArrowUpRight
                  size={14}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </Magnet>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-ink/10 md:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="mobile-menu"
            className="fixed inset-0 z-[45] flex flex-col bg-paper px-6 pb-8 pt-28 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <ul className="flex-1 space-y-1">
              {NAV_ITEMS.map((item, index) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + index * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <button
                    type="button"
                    onClick={() => scrollTo(item.id)}
                    className="flex w-full items-baseline gap-4 border-b border-line py-4 text-left"
                  >
                    <span className="font-mono text-[11px] text-muted">0{index + 1}</span>
                    <span
                      className={`font-display text-4xl tracking-tight ${
                        active === item.id ? 'text-accent' : 'text-ink'
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                </motion.li>
              ))}
            </ul>

            <motion.div
              className="space-y-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
            >
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center justify-between rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-paper"
              >
                Hire me
                <ArrowUpRight size={16} />
              </a>
              <div className="flex items-center justify-between text-muted">
                <span className="text-sm">{EMAIL}</span>
                <div className="flex items-center gap-4">
                  <a href={LINKS.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <Github size={18} />
                  </a>
                  <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <Linkedin size={18} />
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}

export default Navbar
