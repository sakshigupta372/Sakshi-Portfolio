import {useEffect, useState, type RefObject} from 'react';

/**
 * True while the element is within `margin` of the viewport. Sections mount their component only while
 * near, so the page never holds more than two or three WebGL contexts at once.
 */
export function useNear(ref: RefObject<HTMLElement | null>, margin = '60% 0px') {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), {rootMargin: margin});
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin]);
  return near;
}

/** Calls `fn(visible)` whenever the element enters or leaves the viewport; returns the disconnect. */
export function watchVisible(el: Element, fn: (visible: boolean) => void, threshold = 0) {
  const io = new IntersectionObserver(([e]) => fn(e.isIntersecting && e.intersectionRatio >= threshold), {threshold});
  io.observe(el);
  return () => io.disconnect();
}

export const prefersReducedMotion = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
