// Shared helpers for the serverless handlers in /api (and the Vite dev bridge).

// Best-effort per-IP rate limit. Serverless instances don't share memory, so
// this caps bursts per instance rather than being a hard global limit.
const buckets = new Map()

export function rateLimit(key, { limit, windowMs }) {
  const now = Date.now()
  const bucket = buckets.get(key)
  if (!bucket || now > bucket.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs })
    if (buckets.size > 5000) {
      for (const [k, v] of buckets) if (now > v.reset) buckets.delete(k)
    }
    return { ok: true }
  }
  bucket.count += 1
  return bucket.count > limit ? { ok: false, retryAfter: Math.ceil((bucket.reset - now) / 1000) } : { ok: true }
}

export function clientIp(req) {
  const fwd = req.headers['x-forwarded-for']
  return (Array.isArray(fwd) ? fwd[0] : fwd || '').split(',')[0].trim() || req.socket?.remoteAddress || 'unknown'
}

// Only accept requests from this site's own pages (blocks other sites from
// using these endpoints from a browser). Requests with no Origin are allowed
// to keep same-origin GETs and curl tests working; rate limits still apply.
export function sameOrigin(req) {
  const origin = req.headers.origin
  if (!origin) return true
  try {
    const host = req.headers['x-forwarded-host'] || req.headers.host
    return new URL(origin).host === host
  } catch {
    return false
  }
}

export function sendJson(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(body))
}

// Vercel pre-parses JSON into req.body; the dev bridge passes it the same way.
export function readBody(req) {
  const body = req.body
  if (body && typeof body === 'object') return body
  if (typeof body === 'string') {
    try {
      return JSON.parse(body)
    } catch {
      return null
    }
  }
  return null
}

export const str = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
