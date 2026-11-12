import { useEffect } from 'react'
import { ReactLenis, useLenis } from 'lenis/react'

let instance

export function scrollToId(id) {
  const el = typeof id === 'string' ? document.getElementById(id) : id
  if (!el) return
  if (instance) {
    instance.scrollTo(el, { offset: -72, duration: 1.15 })
    return
  }
  el.scrollIntoView({ behavior: 'smooth' })
}

export function scrollToTop({ immediate = false } = {}) {
  if (instance) {
    instance.scrollTo(0, immediate ? { immediate: true } : { duration: 1.15 })
    return
  }
  window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' })
}

function LenisSync() {
  const lenis = useLenis()

  useEffect(() => {
    instance = lenis
    window.lenis = lenis
    return () => {
      if (instance === lenis) instance = undefined
    }
  }, [lenis])

  return null
}

const SmoothScroll = ({ children }) => {
  const reduce = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (reduce) return children

  return (
    <ReactLenis root options={{ duration: 1.05, autoRaf: true, wheelMultiplier: 0.9 }}>
      <LenisSync />
      {children}
    </ReactLenis>
  )
}

export default SmoothScroll
