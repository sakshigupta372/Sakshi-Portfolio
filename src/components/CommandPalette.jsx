import React, { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowUpRight,
  BookOpen,
  Briefcase,
  CornerDownLeft,
  Copy,
  Download,
  FileText,
  Github,
  Layers,
  Linkedin,
  Mail,
  Moon,
  Palette,
  Route,
  Search,
  Sparkles,
  Sun,
  User,
} from 'lucide-react'
import { PROJECTS, isLiveDemo } from '../data/projects.js'
import { CASE_STUDIES, CASE_STUDY_ORDER } from '../data/caseStudies.js'
import { PALETTES, useTheme } from '../theme/ThemeProvider'
import { EMAIL, EVENTS, LINKS, isMac, openChat, showToast } from '../lib/ui'
import { goToSection, navigate } from '../lib/router.jsx'
import { trackEvent } from '../lib/analytics.js'

const isLive = isLiveDemo

// ---------------------------------------------------------------------------
// Palette
// ---------------------------------------------------------------------------
const CommandPalette = () => {
  const { mode, setMode, setPalette } = useTheme()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const [mac, setMac] = useState(false)

  useEffect(() => setMac(isMac()), [])

  const close = () => setOpen(false)

  const items = useMemo(() => {
    const go = (id) => () => goToSection(id)
    const link = (href) => () => window.open(href, '_blank', 'noopener,noreferrer')

    const nav = [
      { label: 'About', hint: 'Section', icon: User, run: go('about'), words: 'bio intro who' },
      { label: 'Work', hint: 'Section', icon: Briefcase, run: go('projects'), words: 'projects portfolio' },
      { label: 'Tech stack', hint: 'Section', icon: Layers, run: go('stack'), words: 'skills tools languages' },
      { label: 'GitHub activity', hint: 'Section', icon: Github, run: go('github'), words: 'contributions commits repos' },
      { label: 'Journey', hint: 'Section', icon: Route, run: go('journey'), words: 'experience education timeline' },
      { label: 'Contact', hint: 'Section', icon: Mail, run: go('contact'), words: 'form message reach' },
    ].map((i) => ({ ...i, group: 'Go to' }))

    const caseStudies = CASE_STUDY_ORDER.map((slug) => {
      const p = PROJECTS.find((x) => x.slug === slug)
      return {
        group: 'Case studies',
        label: `${p.short} case study`,
        hint: 'Read',
        icon: BookOpen,
        words: `${p.title} ${p.tags.join(' ')} ${CASE_STUDIES[slug].tagline} architecture`,
        run: () => navigate(`/work/${slug}`),
      }
    })

    const projects = PROJECTS.map((p) => ({
      group: 'Projects',
      label: p.short,
      hint: isLive(p) ? 'Live demo' : 'GitHub',
      icon: ArrowUpRight,
      words: `${p.title} ${p.tags.join(' ')} ${p.type}`,
      run: () => {
        trackEvent('project_click', { project: p.short, kind: 'palette' })
        link(isLive(p) ? p.demoLink : p.githubLink)()
      },
    }))

    const actions = [
      { label: 'Ask my agent', hint: 'Chat', icon: Sparkles, words: 'chat ai assistant question', run: () => openChat() },
      {
        label: 'Download resume',
        hint: 'PDF',
        icon: Download,
        words: 'cv',
        run: () => {
          const a = document.createElement('a')
          a.href = '/resume.pdf'
          a.download = 'Sakshi_Gupta_Resume.pdf'
          a.click()
        },
      },
      { label: 'Send email', hint: EMAIL, icon: Mail, words: 'hire contact', run: () => (window.location.href = `mailto:${EMAIL}`) },
      {
        label: 'Copy email address',
        hint: 'Clipboard',
        icon: Copy,
        words: 'clipboard',
        run: async () => {
          try {
            await navigator.clipboard.writeText(EMAIL)
            showToast('Email copied')
          } catch {
            showToast(EMAIL)
          }
        },
      },
      { label: 'GitHub', hint: 'Profile', icon: Github, run: link(LINKS.github) },
      { label: 'LinkedIn', hint: 'Profile', icon: Linkedin, run: link(LINKS.linkedin) },
      { label: 'Resume (view)', hint: 'PDF', icon: FileText, run: link('/resume.pdf') },
    ].map((i) => ({ ...i, group: 'Actions' }))

    const theme = [
      {
        label: mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
        hint: 'Theme',
        icon: mode === 'dark' ? Sun : Moon,
        words: 'dark light theme appearance',
        run: () => setMode(mode === 'dark' ? 'light' : 'dark'),
      },
      ...PALETTES.map((p) => ({
        label: `Accent: ${p.label}`,
        hint: 'Palette',
        icon: Palette,
        swatch: p.swatch,
        words: 'color colour theme palette accent',
        run: () => {
          setPalette(p.id)
          showToast(`${p.label} palette`)
        },
      })),
    ].map((i) => ({ ...i, group: 'Theme' }))

    return [...nav, ...caseStudies, ...projects, ...actions, ...theme]
  }, [mode, setMode, setPalette])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    const parts = q.split(/\s+/)
    return items.filter((i) => {
      const hay = `${i.label} ${i.group} ${i.words || ''}`.toLowerCase()
      return parts.every((p) => hay.includes(p))
    })
  }, [items, query])

  useEffect(() => setCursor(0), [query, open])

  // Global shortcut + external toggle.
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    const onToggle = () => setOpen((v) => !v)
    window.addEventListener('keydown', onKey)
    window.addEventListener(EVENTS.togglePalette, onToggle)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener(EVENTS.togglePalette, onToggle)
    }
  }, [])

  // Lock scroll while open and focus the input.
  useEffect(() => {
    if (!open) return undefined
    setQuery('')
    window.lenis?.stop?.()
    const t = setTimeout(() => inputRef.current?.focus(), 30)
    return () => {
      clearTimeout(t)
      window.lenis?.start?.()
    }
  }, [open])

  // Keep the highlighted row in view.
  useEffect(() => {
    listRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [cursor, results])

  const run = (item) => {
    if (!item) return
    close()
    // Let the dialog start closing before the action moves the page.
    setTimeout(() => item.run(), 120)
  }

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      close()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCursor((c) => (results.length ? (c + 1) % results.length : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCursor((c) => (results.length ? (c - 1 + results.length) % results.length : 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      run(results[cursor])
    }
  }

  // Group headings appear whenever the group changes between rows.
  let lastGroup = ''

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="palette"
          className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[14vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
        >
          <button
            type="button"
            aria-label="Close command palette"
            onClick={close}
            className="absolute inset-0 cursor-default bg-ink/40 backdrop-blur-sm"
            tabIndex={-1}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_40px_90px_-20px_rgb(var(--ink)/0.55)]"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onKeyDown={onKeyDown}
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search size={16} className="text-muted" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search sections, projects, actions…"
                aria-label="Search commands"
                className="h-14 w-full bg-transparent text-[15px] text-ink placeholder:text-muted/70 focus:outline-none"
              />
              <kbd className="rounded-md border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted">Esc</kbd>
            </div>

            <ul ref={listRef} role="listbox" className="max-h-[52vh] overflow-y-auto p-2" data-lenis-prevent>
              {results.length === 0 ? (
                <li className="px-4 py-10 text-center text-sm text-muted">
                  No matches. Try &ldquo;resume&rdquo;, &ldquo;dark&rdquo; or a project name.
                </li>
              ) : (
                results.map((item, index) => {
                  const heading = item.group !== lastGroup ? item.group : null
                  lastGroup = item.group
                  const active = index === cursor
                  const Icon = item.icon
                  return (
                    <React.Fragment key={`${item.group}-${item.label}`}>
                      {heading ? (
                        <li
                          role="presentation"
                          className="px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted first:pt-1"
                        >
                          {heading}
                        </li>
                      ) : null}
                      <li
                        role="option"
                        aria-selected={active}
                        data-active={active}
                        onMouseMove={() => setCursor(index)}
                        onClick={() => run(item)}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                          active ? 'bg-ink/[0.07] text-ink' : 'text-ink/80'
                        }`}
                      >
                        {item.swatch ? (
                          <span
                            className="flex h-4 w-4 items-center justify-center rounded-full"
                            style={{ background: item.swatch }}
                          />
                        ) : (
                          <Icon size={16} className={active ? 'text-accent' : 'text-muted'} />
                        )}
                        <span className="flex-1 truncate">{item.label}</span>
                        <span className="truncate text-xs text-muted">{item.hint}</span>
                        {active ? <CornerDownLeft size={13} className="text-muted" /> : null}
                      </li>
                    </React.Fragment>
                  )
                })
              )}
            </ul>

            <div className="flex items-center justify-between border-t border-line px-4 py-2.5 text-[11px] text-muted">
              <span className="flex items-center gap-3">
                <span>
                  <kbd className="font-mono">↑↓</kbd> navigate
                </span>
                <span>
                  <kbd className="font-mono">↵</kbd> select
                </span>
              </span>
              <span>
                <kbd className="font-mono">{mac ? '⌘' : 'Ctrl'} K</kbd> toggle
              </span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default CommandPalette
