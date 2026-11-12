// Public GitHub data, fetched from the browser (no token needed).
// Each request runs at most once per tab session: results are kept in memory
// and sessionStorage, which keeps us well under GitHub's 60 req/hour limit.
import { useEffect, useState } from 'react'

export const GITHUB_USER = 'sakshigupta372'
const TTL = 30 * 60 * 1000 // 30 min

const inflight = new Map()

function cached(key, loader) {
  if (inflight.has(key)) return inflight.get(key)
  try {
    const hit = JSON.parse(sessionStorage.getItem(key) || 'null')
    if (hit && Date.now() - hit.at < TTL) return Promise.resolve(hit.data)
  } catch {
    /* storage unavailable or corrupt */
  }
  const p = loader()
    .then((data) => {
      try {
        sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), data }))
      } catch {
        /* quota */
      }
      return data
    })
    .catch((err) => {
      inflight.delete(key) // allow a retry later
      throw err
    })
  inflight.set(key, p)
  return p
}

async function getJson(url) {
  const res = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } })
  if (!res.ok) throw new Error(`GitHub ${res.status}`)
  return res.json()
}

// { [lowercaseRepoName]: { name, stars, language, url, pushedAt, description } }
export const loadRepos = () =>
  cached('sg-gh-repos', async () => {
    const list = await getJson(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=pushed`)
    return Object.fromEntries(
      list
        .filter((r) => !r.fork)
        .map((r) => [
          r.name.toLowerCase(),
          {
            name: r.name,
            stars: r.stargazers_count,
            language: r.language,
            url: r.html_url,
            pushedAt: r.pushed_at,
            description: r.description,
          },
        ])
    )
  })

// Recent public activity, grouped so 5 pushes to one repo show as one row.
export const loadActivity = () =>
  cached('sg-gh-activity', async () => {
    const events = await getJson(`https://api.github.com/users/${GITHUB_USER}/events/public?per_page=50`)
    const rows = []
    for (const e of events) {
      const repo = e.repo?.name?.replace(`${GITHUB_USER}/`, '') || ''
      let action = null
      if (e.type === 'PushEvent') action = 'Pushed to'
      else if (e.type === 'CreateEvent') action = e.payload?.ref_type === 'repository' ? 'Created' : `Created ${e.payload?.ref_type || 'branch'} in`
      else if (e.type === 'PullRequestEvent') action = `${e.payload?.action === 'closed' ? 'Merged/closed' : 'Opened'} a PR in`
      else if (e.type === 'ReleaseEvent') action = 'Released'
      else if (e.type === 'PublicEvent') action = 'Open-sourced'
      else if (e.type === 'IssuesEvent') action = 'Updated an issue in'
      if (!action) continue

      const last = rows[rows.length - 1]
      if (last && last.action === action && last.repo === repo) {
        last.count += 1
        continue
      }
      rows.push({ action, repo, at: e.created_at, count: 1, url: `https://github.com/${e.repo?.name}` })
      if (rows.length >= 6) break
    }
    return rows
  })

// Contribution calendar. GitHub only exposes it via authenticated GraphQL, so
// this uses a small public read-only proxy; the section hides itself if it fails.
export const loadContributions = () =>
  cached('sg-gh-contrib', async () => {
    const data = await getJson(`https://github-contributions-api.jogruber.de/v4/${GITHUB_USER}?y=last`)
    return { total: data.total?.lastYear ?? 0, days: data.contributions || [] }
  })

function useLoader(loader, enabled = true) {
  const [state, setState] = useState({ data: null, error: null })
  useEffect(() => {
    if (!enabled) return undefined
    let alive = true
    loader()
      .then((data) => alive && setState({ data, error: null }))
      .catch((error) => alive && setState({ data: null, error }))
    return () => {
      alive = false
    }
  }, [loader, enabled])
  return state
}

export const useGithubRepos = () => useLoader(loadRepos).data
export const useGithubActivity = (enabled) => useLoader(loadActivity, enabled)
export const useContributions = (enabled) => useLoader(loadContributions, enabled)

export function timeAgo(iso) {
  const s = Math.max(1, (Date.now() - new Date(iso).getTime()) / 1000)
  const units = [
    ['y', 31536000],
    ['mo', 2592000],
    ['d', 86400],
    ['h', 3600],
    ['m', 60],
  ]
  for (const [u, n] of units) if (s >= n) return `${Math.floor(s / n)}${u} ago`
  return 'just now'
}
