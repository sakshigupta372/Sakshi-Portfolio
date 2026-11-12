// Tiny History-API router: the site only has "/" and "/work/:slug", so a
// dependency like react-router would be overkill.
import React, { useEffect, useState } from 'react'
import { scrollToId } from '../components/SmoothScroll'

const EVENT = 'sg:navigate'
let pendingSection = null

const current = () => window.location.pathname.replace(/\/+$/, '') || '/'

export function navigate(to, { replace = false } = {}) {
  if (to === current()) return
  window.history[replace ? 'replaceState' : 'pushState']({}, '', to)
  window.dispatchEvent(new Event(EVENT))
}

export function usePath() {
  const [path, setPath] = useState(current)
  useEffect(() => {
    const update = () => setPath(current())
    window.addEventListener('popstate', update)
    window.addEventListener(EVENT, update)
    return () => {
      window.removeEventListener('popstate', update)
      window.removeEventListener(EVENT, update)
    }
  }, [])
  return path
}

// Scroll to a home-page section from anywhere. On another page, go home first
// and let the home page finish the scroll once it has rendered.
export function goToSection(id) {
  if (current() === '/') {
    scrollToId(id)
    return
  }
  pendingSection = id
  navigate('/')
}

export const peekPendingSection = () => pendingSection

export function takePendingSection() {
  const id = pendingSection
  pendingSection = null
  return id
}

export function matchCaseStudy(path) {
  const m = path.match(/^\/work\/([a-z0-9-]+)$/)
  return m ? m[1] : null
}

// <a> that navigates client-side but stays a real link (new tab, copy link, SEO).
export function Link({ to, onClick, children, ...rest }) {
  const handle = (e) => {
    onClick?.(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    navigate(to)
  }
  return (
    <a href={to} onClick={handle} {...rest}>
      {children}
    </a>
  )
}
