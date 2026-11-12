// Vercel Web Analytics wrapper.
// Page views work on every Vercel plan. Custom events (trackEvent) are only
// recorded on Pro/Enterprise; on Hobby they are silently dropped, which is fine.
import { track } from '@vercel/analytics'

export function trackEvent(name, props) {
  try {
    track(name, props)
  } catch {
    /* analytics must never break the UI */
  }
}
