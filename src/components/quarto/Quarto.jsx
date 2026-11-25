import React, { useEffect, useRef } from 'react'
import { BOOK, PAGES } from './content.js'
import { QuartoEngine } from './engine.js'
import { isLiveDemo } from '../../data/projects.js'
import { Link } from '../../lib/router.jsx'
import { LINKS } from '../../lib/ui.js'
import { trackEvent } from '../../lib/analytics.js'
import './quarto.css'

/** Leaves: front cover, the inner boards (a page on each side), back cover. */
const LEAVES = [
  [{ kind: 'cover' }, { kind: 'end' }],
  ...Array.from({ length: PAGES.length / 2 }, (_, k) => [PAGES[2 * k], PAGES[2 * k + 1]]),
  [{ kind: 'end' }, { kind: 'back' }],
]

export default function Quarto() {
  const root = useRef(null)
  useEffect(() => {
    const e = new QuartoEngine(root.current)
    return () => e.destroy()
  }, [])
  return (
    <div
      ref={root}
      className="qt"
      tabIndex={0}
      data-step="0"
      data-state="closed"
      role="region"
      aria-roledescription="book"
      aria-label={`${BOOK.title}. Press Enter or the arrow keys to open and turn.`}
    >
      <div className="qt-stage">
        <div className="qt-floor" aria-hidden="true" />
        <div className="qt-world">
          <div className="qt-book">
            {LEAVES.map(([front, back], i) => (
              <div key={i} className={`qt-leaf${i === 0 || i === LEAVES.length - 1 ? ' qt-leaf--cover' : ''}`}>
                <div className="qt-face qt-front">
                  <FaceView f={front} />
                </div>
                <div className="qt-face qt-back">
                  <FaceView f={back} />
                </div>
                <div className="qt-edge qt-edge--fore" />
                <div className="qt-edge qt-edge--foot" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="qt-ui">
        <p className="qt-hint">
          <span data-for="closed">Tap the book to open it</span>
          <span data-for="open">Right page turns on · left page goes back</span>
          <span data-for="end">Tap again to close it</span>
        </p>
        <span className="qt-dots" aria-hidden="true">
          {Array.from({ length: LEAVES.length + 1 }, (_, i) => (
            <i key={i} className="qt-dot" data-on={i === 0 ? '' : undefined} />
          ))}
        </span>
      </div>
    </div>
  )
}

function Glyph() {
  return (
    <svg className="qt-glyph" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M18 20 32 32 48 17M32 32 22 48M32 32l16 14" />
      <circle cx="15" cy="17" r="5" />
      <circle cx="51" cy="14" r="5" />
      <circle cx="32" cy="32" r="7" />
      <circle cx="20" cy="51" r="5" />
      <circle cx="51" cy="49" r="5" />
    </svg>
  )
}

function FaceView({ f }) {
  if (f.kind === 'cover')
    return (
      <div className="qt-cover">
        <Glyph />
        <h3 className="qt-cover-title">{BOOK.title}</h3>
        <p className="qt-cover-sub">{BOOK.sub}</p>
      </div>
    )
  if (f.kind === 'end') return <div className="qt-end" />
  if (f.kind === 'back')
    return (
      <div className="qt-backc">
        <p>{BOOK.back}</p>
        <span className="qt-bar" aria-hidden="true" />
        <span className="qt-isbn">{BOOK.imprint}</span>
      </div>
    )
  const number = String(PAGES.indexOf(f) + 1).padStart(2, '0')
  if (f.kind === 'more')
    return (
      <div className="qt-page">
        <div className="qt-shot qt-shot--cloth">
          <Glyph />
        </div>
        <div className="qt-copy">
          <span className="qt-no">{number} · Next</span>
          <h4>More work</h4>
          <p>Repositories, experiments and recent activity are on GitHub.</p>
          <div className="qt-links">
            <a href={LINKS.github} target="_blank" rel="noopener noreferrer">
              GitHub profile ↗
            </a>
          </div>
        </div>
      </div>
    )
  return <ProjectPage project={f.project} number={number} />
}

function ProjectPage({ project, number }) {
  const track = (kind) => () => trackEvent('project_click', { project: project.short, kind })
  return (
    <div className="qt-page">
      <img
        className="qt-shot"
        src={project.image}
        alt={`${project.title} screenshot`}
        draggable={false}
        loading={Number(number) <= 3 ? 'eager' : 'lazy'}
      />
      <div className="qt-copy">
        <span className="qt-no">
          {number} · {project.type}
        </span>
        <h4>{project.short}</h4>
        <p>{project.built}</p>
        <span className="qt-tags">{project.tags.join(' · ')}</span>
        <div className="qt-links">
          {project.slug ? (
            <Link to={`/work/${project.slug}`} onClick={track('case_study')}>
              Case study
            </Link>
          ) : null}
          {isLiveDemo(project) ? (
            <a href={project.demoLink} target="_blank" rel="noopener noreferrer" onClick={track('demo')}>
              Live demo ↗
            </a>
          ) : null}
          {project.githubLink ? (
            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" onClick={track('code')}>
              Code
            </a>
          ) : null}
        </div>
      </div>
    </div>
  )
}
