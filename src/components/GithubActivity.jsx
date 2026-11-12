import React, { useMemo, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight, GitCommitHorizontal, Github, Star } from 'lucide-react'
import { RevealWords } from './Reveal'
import { GITHUB_USER, timeAgo, useContributions, useGithubActivity, useGithubRepos } from '../lib/github.js'

// Accent at increasing strength for contribution levels 0–4.
const LEVEL_CLASS = ['bg-ink/[0.06]', 'bg-accent/30', 'bg-accent/55', 'bg-accent/80', 'bg-accent']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Group days into week columns (Sunday first), padding the first week.
function toWeeks(days) {
  if (!days.length) return []
  const pad = new Date(`${days[0].date}T00:00:00`).getDay()
  const cells = [...Array(pad).fill(null), ...days]
  const weeks = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}

function Heatmap({ days }) {
  const weeks = useMemo(() => toWeeks(days), [days])
  // Month label above the first week that starts in a new month.
  const labels = weeks.map((week, i) => {
    const first = week.find(Boolean)
    if (!first) return null
    const m = new Date(`${first.date}T00:00:00`).getMonth()
    const prev = weeks[i - 1]?.find(Boolean)
    return !prev || new Date(`${prev.date}T00:00:00`).getMonth() !== m ? MONTHS[m] : null
  })

  return (
    <div className="overflow-x-auto pb-1" data-lenis-prevent>
      {/* Weeks stretch to fill the card; cells stay square with a 9px floor. */}
      <div
        className="grid min-w-[620px] gap-[3px]"
        style={{ gridTemplateColumns: `repeat(${weeks.length}, minmax(9px, 1fr))` }}
        role="img"
        aria-label="GitHub contribution calendar for the last year"
      >
        {labels.map((l, i) => (
          <span key={`m${i}`} className="h-4 overflow-visible whitespace-nowrap text-[10px] text-muted">
            {l || ''}
          </span>
        ))}
        {Array.from({ length: 7 }, (_, di) =>
          weeks.map((week, wi) => {
            const d = week[di]
            return d ? (
              <span
                key={`${wi}-${di}`}
                title={`${d.count} contribution${d.count === 1 ? '' : 's'} on ${d.date}`}
                className={`aspect-square w-full rounded-[3px] ${LEVEL_CLASS[d.level] || LEVEL_CLASS[0]}`}
              />
            ) : (
              <span key={`${wi}-${di}`} className="aspect-square w-full" />
            )
          })
        )}
      </div>
      <div className="mt-3 flex items-center justify-end gap-1.5 text-[10px] text-muted">
        Less
        {LEVEL_CLASS.map((c) => (
          <span key={c} className={`h-[10px] w-[10px] rounded-[3px] ${c}`} />
        ))}
        More
      </div>
    </div>
  )
}

const GithubActivity = () => {
  const ref = useRef(null)
  // Only call GitHub once the section is close to the viewport.
  const near = useInView(ref, { once: true, margin: '400px 0px' })
  const contrib = useContributions(near)
  const activity = useGithubActivity(near)
  const repos = useGithubRepos()

  const topRepos = useMemo(
    () =>
      Object.values(repos || {})
        .filter((r) => r.name.toLowerCase() !== GITHUB_USER)
        .sort((a, b) => b.stars - a.stars || new Date(b.pushedAt) - new Date(a.pushedAt))
        .slice(0, 4),
    [repos]
  )
  const totalStars = useMemo(() => Object.values(repos || {}).reduce((s, r) => s + r.stars, 0), [repos])
  const repoCount = repos ? Object.keys(repos).length : null

  // Hide the whole section if GitHub can't be reached at all.
  if (contrib.error && activity.error && !repos) return null

  return (
    <section ref={ref} id="github" className="scroll-mt-24 border-t border-line px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">Live — GitHub</p>
            <RevealWords as="h2" text="Shipping, in public" className="font-display text-4xl tracking-tight text-ink sm:text-5xl" />
          </div>
          <a
            href={`https://github.com/${GITHUB_USER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 self-start rounded-full border border-line px-4 py-2 text-sm text-ink transition-colors hover:border-ink sm:self-auto"
          >
            <Github size={15} />@{GITHUB_USER}
            <ArrowUpRight size={14} />
          </a>
        </div>

        <dl className="mb-10 grid grid-cols-3 gap-4 border-y border-line py-6">
          {[
            { label: 'Contributions, last 12 months', value: contrib.data?.total },
            { label: 'Public repositories', value: repoCount },
            { label: 'Stars earned', value: repos ? totalStars : null },
          ].map((s) => (
            <div key={s.label}>
              <dd className="font-display text-3xl text-ink sm:text-4xl">
                {s.value ?? <span className="inline-block h-8 w-12 animate-pulse rounded bg-ink/10 align-middle" />}
              </dd>
              <dt className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted">{s.label}</dt>
            </div>
          ))}
        </dl>

        {contrib.data ? (
          <motion.div
            className="rounded-2xl border border-line bg-surface p-5"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Heatmap days={contrib.data.days} />
          </motion.div>
        ) : !contrib.error ? (
          <div className="h-[150px] animate-pulse rounded-2xl border border-line bg-surface" />
        ) : null}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-line bg-surface p-5">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Recent activity</p>
            {activity.data?.length ? (
              <ul className="space-y-3">
                {activity.data.map((row) => (
                  <li key={`${row.repo}-${row.at}`} className="flex items-start gap-3 text-sm">
                    <GitCommitHorizontal size={16} className="mt-0.5 shrink-0 text-accent" />
                    <span className="min-w-0 flex-1">
                      <span className="text-muted">{row.action} </span>
                      <a href={row.url} target="_blank" rel="noopener noreferrer" className="font-medium text-ink hover:text-accent">
                        {row.repo}
                      </a>
                      {row.count > 1 ? <span className="text-muted"> · {row.count}×</span> : null}
                    </span>
                    <time dateTime={row.at} className="shrink-0 font-mono text-[11px] text-muted">
                      {timeAgo(row.at)}
                    </time>
                  </li>
                ))}
              </ul>
            ) : activity.error ? (
              <p className="text-sm text-muted">Activity is unavailable right now.</p>
            ) : (
              <div className="space-y-3">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-4 animate-pulse rounded bg-ink/10" />
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-line bg-surface p-5">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Top repositories</p>
            {topRepos.length ? (
              <ul className="divide-y divide-line">
                {topRepos.map((r) => (
                  <li key={r.name}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between gap-3 py-2.5 text-sm"
                    >
                      <span className="min-w-0">
                        <span className="block truncate font-medium text-ink group-hover:text-accent">{r.name}</span>
                        <span className="block truncate text-xs text-muted">
                          {r.language || 'Code'} · updated {timeAgo(r.pushedAt)}
                        </span>
                      </span>
                      <span className="inline-flex shrink-0 items-center gap-1 font-mono text-xs text-muted">
                        <Star size={12} className={r.stars ? 'fill-current text-accent' : ''} />
                        {r.stars}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="space-y-3">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="h-8 animate-pulse rounded bg-ink/10" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default GithubActivity
