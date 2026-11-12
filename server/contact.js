// POST /api/contact  { name, email, message, company? }
// Delivers the message to Sakshi's inbox through Resend (https://resend.com).
import { clientIp, rateLimit, readBody, sameOrigin, sendJson, str } from './http.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const escapeHtml = (s) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

export async function handleContact(req, res, env = process.env) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return sendJson(res, 405, { error: 'Method not allowed' })
  }
  if (!sameOrigin(req)) return sendJson(res, 403, { error: 'Forbidden' })

  const limited = rateLimit(`contact:${clientIp(req)}`, { limit: 5, windowMs: 10 * 60 * 1000 })
  if (!limited.ok) {
    res.setHeader('Retry-After', String(limited.retryAfter))
    return sendJson(res, 429, { error: 'Too many messages. Please try again in a few minutes.' })
  }

  const body = readBody(req)
  if (!body) return sendJson(res, 400, { error: 'Invalid request' })

  // Honeypot: real visitors never see or fill this field. Pretend success so bots move on.
  if (str(body.company, 200)) return sendJson(res, 200, { ok: true })

  const name = str(body.name, 100)
  const email = str(body.email, 200)
  const message = str(body.message, 5000)
  const errors = {}
  if (!name) errors.name = 'Name is required'
  if (!EMAIL_RE.test(email)) errors.email = 'Enter a valid email'
  if (message.length < 10) errors.message = 'At least 10 characters'
  if (Object.keys(errors).length) return sendJson(res, 422, { error: 'Please check the form', fields: errors })

  const apiKey = env.RESEND_API_KEY
  if (!apiKey) return sendJson(res, 503, { error: 'Contact form is not configured', code: 'not_configured' })

  const to = env.CONTACT_TO_EMAIL || 'sg6227174@gmail.com'
  const from = env.CONTACT_FROM_EMAIL || 'Portfolio <onboarding@resend.dev>'
  // Strip CR/LF so the visitor's name can't inject extra email headers.
  const safeName = name.replace(/[\r\n]+/g, ' ')

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;font-size:15px;line-height:1.6;color:#0E1120">
      <p style="margin:0 0 4px;color:#646A7E;font-size:12px;letter-spacing:.12em;text-transform:uppercase">New portfolio message</p>
      <p style="margin:0 0 16px"><strong>${escapeHtml(safeName)}</strong> &lt;${escapeHtml(email)}&gt;</p>
      <div style="white-space:pre-wrap;border-left:3px solid #4F46E5;padding:4px 0 4px 14px">${escapeHtml(message)}</div>
      <p style="margin:20px 0 0;color:#646A7E;font-size:12px">Reply to this email to answer ${escapeHtml(safeName)} directly.</p>
    </div>`

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Portfolio: message from ${safeName}`,
        html,
        text: `${message}\n\n— ${safeName} <${email}>`,
      }),
    })
    if (!r.ok) {
      console.error('Resend error', r.status, await r.text().catch(() => ''))
      return sendJson(res, 502, { error: 'Could not send right now', code: 'provider_error' })
    }
    return sendJson(res, 200, { ok: true })
  } catch (err) {
    console.error('Resend request failed', err)
    return sendJson(res, 502, { error: 'Could not send right now', code: 'provider_error' })
  }
}
