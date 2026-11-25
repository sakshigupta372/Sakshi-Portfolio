/** Calls `fn(visible)` whenever the element enters or leaves the viewport; returns the disconnect. */
export function watchVisible(el, fn, threshold = 0) {
  const io = new IntersectionObserver(([e]) => fn(e.isIntersecting && e.intersectionRatio >= threshold), { threshold })
  io.observe(el)
  return () => io.disconnect()
}

export const prefersReducedMotion = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
