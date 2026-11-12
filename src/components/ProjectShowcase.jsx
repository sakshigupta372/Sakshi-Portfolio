import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, BookOpen, Github, Star, X } from 'lucide-react'
import { RevealWords } from './Reveal'
import { PROJECTS, isLiveDemo } from '../data/projects.js'
import { useGithubRepos } from '../lib/github.js'
import { Link } from '../lib/router.jsx'
import { trackEvent } from '../lib/analytics.js'

export { PROJECTS }

const FILTERS = ['All', 'Agents', 'Infra', 'Apps']

const hasLive = isLiveDemo

function hostname(project) {
  if (!hasLive(project)) return 'github.com preview'
  try {
    return new URL(project.demoLink).hostname.replace('www.', '')
  } catch {
    return 'live preview'
  }
}

function ProjectImage({ project, className = '' }) {
  const [src, setSrc] = useState(project.image)
  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-line/40 ${className}`}>
        <span className="font-mono text-sm text-muted">{project.short}</span>
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={`${project.title} screenshot`}
      className={`h-full w-full object-cover object-top ${className}`}
      onError={() => setSrc(null)}
      loading="lazy"
    />
  )
}

function ActionLinks({ project }) {
  const track = (kind) => (e) => {
    e.stopPropagation()
    trackEvent('project_click', { project: project.short, kind })
  }
  return (
    <div className="flex flex-wrap gap-2">
      {project.slug ? (
        <Link
          to={`/work/${project.slug}`}
          onClick={track('case_study')}
          className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-fg hover:opacity-90"
        >
          <BookOpen className="h-3.5 w-3.5" />
          Case study
        </Link>
      ) : null}
      {hasLive(project) ? (
        <a
          href={project.demoLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={track('demo')}
          className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper hover:opacity-80"
        >
          Live demo
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      ) : null}
      <a
        href={project.githubLink}
        target="_blank"
        rel="noopener noreferrer"
        onClick={track('code')}
        className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink hover:border-ink"
      >
        <Github className="h-3.5 w-3.5" />
        Code
      </a>
    </div>
  )
}

// Live star count from GitHub; renders nothing until loaded or if the repo has 0.
function Stars({ project }) {
  const repos = useGithubRepos()
  const stars = project.repo ? repos?.[project.repo.toLowerCase()]?.stars : undefined
  if (!stars) return null
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-muted"
      title={`${stars} GitHub star${stars === 1 ? '' : 's'}`}
    >
      <Star className="h-3 w-3 fill-current text-accent" />
      {stars}
    </span>
  )
}

function ProjectCard({ project, index, selected, onOpen }) {
  const number = String(index + 1).padStart(2, '0')
  return (
    <div className="relative" style={{ minHeight: selected ? 380 : undefined }}>
      {!selected ? (
        <motion.article
          layoutId={`float-${project.id}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-line bg-surface text-left"
        >
            <button
            type="button"
            onClick={() => {
              trackEvent('project_click', { project: project.short, kind: 'preview' })
              onOpen(project.id)
            }}
            className="flex flex-1 flex-col text-left"
          >
            <motion.div
              className="relative h-48 overflow-hidden sm:h-56"
              initial={{ clipPath: 'inset(100% 0 0 0)' }}
              whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.85, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            >
              <ProjectImage project={project} className="transition-transform duration-700 group-hover:scale-[1.06]" />
            </motion.div>
            <div className="flex flex-1 flex-col p-5 pb-3">
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-[11px] tracking-[0.18em] text-muted">{number} · {project.type}</p>
                <span className="flex items-center gap-2">
                  <Stars project={project} />
                  <span className="text-[11px] text-muted opacity-0 transition-opacity group-hover:opacity-100">Preview →</span>
                </span>
              </div>
              <h3 className="mt-2 font-display text-3xl tracking-tight text-ink">{project.short}</h3>
              <p className="mt-1 text-sm text-muted">{project.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink/75">{project.built}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-muted">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </button>
          <div className="px-5 pb-5">
            <ActionLinks project={project} />
          </div>
        </motion.article>
      ) : (
        <div className="h-full min-h-[380px] rounded-2xl border border-dashed border-line bg-paper" />
      )}
    </div>
  )
}

function FloatingWindow({ project, onClose }) {
  const live = hasLive(project)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <motion.div
      className="fixed inset-0 z-[80] flex items-center justify-center px-3 py-6 sm:px-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <button
        type="button"
        aria-label="Close preview"
        onClick={onClose}
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
      />
      <motion.div
        layoutId={`float-${project.id}`}
        role="dialog"
        aria-modal="true"
        aria-label={`${project.short} live preview`}
        className="relative z-10 flex h-[min(88vh,860px)] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_40px_80px_rgb(var(--ink)/0.18)]"
        initial={{ y: 30 }}
        animate={{ y: 0 }}
        exit={{ y: 24, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
      >
        <div className="flex items-center gap-3 border-b border-line bg-paper px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="min-w-0 flex-1 truncate rounded-md bg-line/50 px-3 py-1 text-center font-mono text-[11px] text-muted">
            {hostname(project)}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-muted hover:bg-line hover:text-ink"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid min-h-0 flex-1 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="relative min-h-[240px] bg-ink">
            {live ? (
              <iframe
                src={project.demoLink}
                title={`${project.short} live preview`}
                className="h-full w-full border-0 bg-white"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              />
            ) : (
              <ProjectImage project={project} />
            )}
          </div>
          <div className="flex flex-col overflow-y-auto border-t border-line p-5 sm:p-6 lg:border-l lg:border-t-0">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">{project.type}</span>
            <h3 className="mt-3 font-display text-3xl text-ink">{project.short}</h3>
            <p className="mt-1 text-sm text-muted">{project.title}</p>
            <dl className="mt-5 space-y-4 text-sm leading-relaxed">
              <div>
                <dt className="font-mono text-[10px] tracking-[0.2em] text-muted">PROBLEM</dt>
                <dd className="mt-1 text-ink/80">{project.problem}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] tracking-[0.2em] text-muted">WHAT I BUILT</dt>
                <dd className="mt-1 text-ink/80">{project.built}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] tracking-[0.2em] text-muted">RESULT</dt>
                <dd className="mt-1 text-ink/80">{project.result}</dd>
              </div>
            </dl>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-muted">
                  {tag}
                </span>
              ))}
            </div>
            <div className="mt-6">
              <ActionLinks project={project} />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

const ProjectShowcase = () => {
  const [filter, setFilter] = useState('All')
  const [openId, setOpenId] = useState(null)
  const visible = PROJECTS.filter((p) => filter === 'All' || p.category === filter)
  const openProject = PROJECTS.find((p) => p.id === openId) || null

  return (
    <section id="projects" className="relative scroll-mt-24 border-t border-line px-5 py-24 sm:px-8">
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <motion.header
          className="mb-10 flex flex-col gap-6 sm:mb-12 lg:flex-row lg:items-end lg:justify-between"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55 }}
        >
          <div>
            <p className="mb-4 font-mono text-[11px] tracking-[0.22em] text-muted">02 — Work</p>
            <div className="flex items-start gap-2">
              <RevealWords
                as="h2"
                text="Selected work"
                className="font-display text-4xl tracking-tight text-ink sm:text-5xl"
              />
              <span className="mt-1 font-sans text-base text-muted">{PROJECTS.length}</span>
            </div>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
              Click a card for a live preview, or open a case study for the full story.
            </p>
          </div>
          <div className="flex flex-wrap gap-1">
            {FILTERS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`px-3 py-1.5 text-sm transition-colors ${
                  filter === item ? 'text-ink' : 'text-muted hover:text-ink'
                }`}
              >
                {item}
                {filter === item ? <span className="ml-1">—</span> : null}
              </button>
            ))}
          </div>
        </motion.header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {visible.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              selected={openId === project.id}
              onOpen={setOpenId}
            />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {openProject ? <FloatingWindow project={openProject} onClose={() => setOpenId(null)} /> : null}
      </AnimatePresence>
    </section>
  )
}

export default ProjectShowcase
