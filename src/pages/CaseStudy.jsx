import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight, Github, Star } from 'lucide-react'
import ArchitectureFlow from '../components/ArchitectureFlow'
import { PROJECTS, isLiveDemo } from '../data/projects.js'
import { CASE_STUDIES, CASE_STUDY_ORDER } from '../data/caseStudies.js'
import { Link, goToSection } from '../lib/router.jsx'
import { useGithubRepos } from '../lib/github.js'
import { trackEvent } from '../lib/analytics.js'
import { scrollToTop } from '../components/SmoothScroll'

const ease = [0.22, 1, 0.36, 1]
const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease },
})

function useDocumentMeta(title, description) {
  useEffect(() => {
    const prevTitle = document.title
    const meta = document.querySelector('meta[name="description"]')
    const prevDesc = meta?.getAttribute('content')
    document.title = title
    if (meta && description) meta.setAttribute('content', description)
    return () => {
      document.title = prevTitle
      if (meta && prevDesc) meta.setAttribute('content', prevDesc)
    }
  }, [title, description])
}

const Section = ({ eyebrow, title, children }) => (
  <motion.section
    className="border-t border-line pt-8"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.55, ease }}
  >
    <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">{eyebrow}</p>
    {title ? <h2 className="mt-2 font-display text-3xl tracking-tight text-ink">{title}</h2> : null}
    <div className="mt-4">{children}</div>
  </motion.section>
)

function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-start justify-center px-5 pt-28 sm:px-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">404</p>
      <h1 className="mt-3 font-display text-5xl text-ink">That case study doesn&apos;t exist.</h1>
      <button
        type="button"
        onClick={() => goToSection('projects')}
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper"
      >
        <ArrowLeft size={15} />
        See all work
      </button>
    </main>
  )
}

const CaseStudy = ({ slug }) => {
  const project = PROJECTS.find((p) => p.slug === slug)
  const cs = CASE_STUDIES[slug]
  const repos = useGithubRepos()
  const stars = project?.repo ? repos?.[project.repo.toLowerCase()]?.stars : undefined

  useDocumentMeta(
    project ? `${project.short} — Case study | Sakshi Gupta` : 'Not found | Sakshi Gupta',
    cs?.tagline
  )

  useEffect(() => {
    scrollToTop({ immediate: true })
    if (project) trackEvent('case_study_view', { project: project.short })
  }, [slug, project])

  if (!project || !cs) return <NotFound />

  const order = CASE_STUDY_ORDER
  const next = order[(order.indexOf(slug) + 1) % order.length]
  const nextProject = PROJECTS.find((p) => p.slug === next)
  const live = isLiveDemo(project)

  return (
    <main className="px-5 pb-24 pt-28 sm:px-8 sm:pt-32">
      <article className="mx-auto max-w-6xl">
        <motion.button
          type="button"
          onClick={() => goToSection('projects')}
          className="group mb-10 inline-flex items-center gap-2 text-sm text-muted hover:text-ink"
          {...fade(0)}
        >
          <ArrowLeft size={15} className="transition-transform group-hover:-translate-x-0.5" />
          All work
        </motion.button>

        <header className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <motion.p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted" {...fade(0.05)}>
              Case study · {project.type}
            </motion.p>
            <motion.h1
              className="mt-4 font-display text-5xl leading-[0.95] tracking-tight text-ink sm:text-6xl lg:text-7xl"
              {...fade(0.1)}
            >
              {project.short}
            </motion.h1>
            <motion.p className="mt-4 font-display text-2xl italic text-accent sm:text-3xl" {...fade(0.15)}>
              {cs.tagline}
            </motion.p>
          </div>
          <motion.div className="space-y-5" {...fade(0.2)}>
            <dl className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Role</dt>
                <dd className="mt-1 text-ink">{cs.role}</dd>
              </div>
              <div>
                <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">Built with</dt>
                <dd className="mt-1 text-ink">{project.tags.join(', ')}</dd>
              </div>
            </dl>
            <div className="flex flex-wrap gap-2">
              {live ? (
                <a
                  href={project.demoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent('project_click', { project: project.short, kind: 'demo' })}
                  className="inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper hover:opacity-85"
                >
                  Live demo
                  <ArrowUpRight size={15} />
                </a>
              ) : null}
              <a
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('project_click', { project: project.short, kind: 'code' })}
                className="inline-flex items-center gap-1.5 rounded-full border border-line px-5 py-2.5 text-sm font-medium text-ink hover:border-ink"
              >
                <Github size={15} />
                Source
                {stars ? (
                  <span className="ml-1 inline-flex items-center gap-0.5 font-mono text-xs text-muted">
                    <Star size={11} className="fill-current text-accent" />
                    {stars}
                  </span>
                ) : null}
              </a>
            </div>
          </motion.div>
        </header>

        <motion.figure
          className="mt-12 overflow-hidden rounded-2xl border border-line bg-surface"
          initial={{ opacity: 0, y: 24, clipPath: 'inset(8% 4% 8% 4% round 16px)' }}
          animate={{ opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0% round 16px)' }}
          transition={{ duration: 0.9, delay: 0.25, ease }}
        >
          <img
            src={project.image}
            alt={`${project.title} screenshot`}
            width={1400}
            height={875}
            className="aspect-[16/10] w-full object-cover object-top"
            fetchpriority="high"
          />
        </motion.figure>

        {cs.metrics.length ? (
          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 border-y border-line py-8 sm:grid-cols-3 lg:grid-cols-6">
            {cs.metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
              >
                <dd className="font-display text-3xl tracking-tight text-ink sm:text-4xl">{m.value}</dd>
                <dt className="mt-1 text-xs leading-snug text-muted">{m.label}</dt>
              </motion.div>
            ))}
          </dl>
        ) : null}

        <div className="mt-16 grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">How it works</p>
            <h2 className="mb-6 mt-2 font-display text-3xl tracking-tight text-ink">Architecture</h2>
            <ArchitectureFlow steps={cs.flow} />
          </aside>

          <div className="space-y-14">
            <Section eyebrow="01 — Overview">
              <p className="text-lg leading-relaxed text-ink/85">{cs.overview}</p>
            </Section>

            <Section eyebrow="02 — The problem" title="Why it needed to exist">
              <div className="space-y-4 text-base leading-relaxed text-muted">
                {cs.problem.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>
            </Section>

            <Section eyebrow="03 — Key decisions" title="How I built it">
              <ul className="grid gap-4 sm:grid-cols-2">
                {cs.decisions.map((d, i) => (
                  <li key={d.title} className="rounded-xl border border-line bg-surface p-5">
                    <p className="font-mono text-[11px] text-accent">0{i + 1}</p>
                    <h3 className="mt-2 font-medium text-ink">{d.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{d.body}</p>
                  </li>
                ))}
              </ul>
            </Section>

            <Section eyebrow="04 — Outcome" title="Result">
              <p className="text-base leading-relaxed text-muted">{project.result}</p>
            </Section>

            <Section eyebrow="05 — Stack">
              <div className="flex flex-wrap gap-2">
                {cs.stack.map((t) => (
                  <span key={t} className="rounded-full border border-line bg-surface px-3 py-1.5 text-sm text-ink">
                    {t}
                  </span>
                ))}
              </div>
            </Section>
          </div>
        </div>

        {nextProject && next !== slug ? (
          <Link
            to={`/work/${next}`}
            className="group mt-24 flex items-center justify-between gap-6 rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-accent sm:p-8"
          >
            <span>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">Next case study</span>
              <span className="mt-2 block font-display text-3xl tracking-tight text-ink sm:text-4xl">{nextProject.short}</span>
              <span className="mt-1 block text-sm text-muted">{CASE_STUDIES[next].tagline}</span>
            </span>
            <ArrowRight size={28} className="shrink-0 text-ink transition-transform group-hover:translate-x-1 group-hover:text-accent" />
          </Link>
        ) : null}
      </article>
    </main>
  )
}

export default CaseStudy
