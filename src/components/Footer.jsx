import React, { useState } from 'react'
import LoopVideo from './LoopVideo'
import { scrollToTop } from './SmoothScroll'
import { goToSection } from '../lib/router.jsx'
import { EMAIL, LINKS } from '../lib/ui.js'
import { trackEvent } from '../lib/analytics.js'

// The film's cream backdrop matches `bean-cream` in tailwind.config.js. Change
// one without the other and the edge of the clip shows.
const FILM = {
  src: '/naplabs/loop.mp4',
  poster: '/naplabs/poster.webp',
  label:
    'A clay figure with a mustard cube head and headphones dozes in a blue bean bag, jolts awake, types on a laptop, then nods off again.',
}

const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Work' },
  { id: 'stack', label: 'Stack' },
  { id: 'journey', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
]

const CONNECT = [
  { label: 'GitHub', href: LINKS.github },
  { label: 'LinkedIn', href: LINKS.linkedin },
  { label: 'X', href: LINKS.x },
  { label: 'Email', href: `mailto:${EMAIL}` },
  { label: 'Resume', href: '/resume.pdf', onClick: () => trackEvent('resume_download', { from: 'footer' }) },
]

const ICONS = {
  GitHub:
    'M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.4-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .8.1-.6.4-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2z',
  LinkedIn:
    'M4.5 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4zM2.8 8.6h3.4V21H2.8zM8.7 8.6H12v1.7c.5-.9 1.7-1.9 3.5-1.9 3.5 0 4.2 2.3 4.2 5.4V21h-3.4v-6.4c0-1.5 0-3.4-2.1-3.4s-2.1 1.6-2.1 3.3V21H8.7z',
  X: 'M17.6 3h3.1l-6.8 7.8L22 21h-6.3l-4.9-6.4L5.2 21H2.1l7.3-8.3L1.7 3h6.4l4.4 5.9zm-1.1 16.2h1.7L7.1 4.7H5.3z',
  Email: 'M3 5h18a1 1 0 0 1 1 1v.4l-10 6-10-6V6a1 1 0 0 1 1-1zm-1 3.7 10 6 10-6V18a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z',
}

const external = (href) => (href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const MESSAGES = {
  sending: 'Sending…',
  sent: 'Got it. I’ll be in touch.',
  invalid: 'That email looks half asleep. Try again?',
  limited: 'Too many tries. Please wait a few minutes.',
}

/** "Leave your email" box: delivered through the same route as the contact form. */
function SayHello() {
  const [status, setStatus] = useState('idle')

  async function onSubmit(e) {
    e.preventDefault()
    if (status === 'sending') return
    const form = e.currentTarget
    const data = new FormData(form)
    const email = String(data.get('email') ?? '').trim()
    if (!EMAIL_RE.test(email)) return setStatus('invalid')

    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: email.slice(0, 100),
          email,
          message: 'Please get in touch. I left my email in the footer of your portfolio.',
          company: data.get('company'),
        }),
      })
      if (res.ok) {
        form.reset()
        trackEvent('contact_submit', { result: 'sent', from: 'footer' })
        return setStatus('sent')
      }
      setStatus(res.status === 429 ? 'limited' : res.status === 422 ? 'invalid' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="flex flex-col">
      <h2 className="font-bean-display text-bean-news font-bold text-bean-ink">Leave your email</h2>
      <p className="mt-3 max-w-[22rem] text-bean-body text-bean-muted">
        Want an agent, MCP server or backend built? Leave your address and I’ll reply, usually within a day.
      </p>

      <form onSubmit={onSubmit} noValidate className="relative mt-7 max-w-[28rem]">
        <label htmlFor="footer-email" className="sr-only">
          Email address
        </label>
        <input
          id="footer-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Enter your email"
          aria-invalid={status === 'invalid'}
          aria-describedby="footer-email-status"
          onInput={() => status !== 'idle' && status !== 'sending' && setStatus('idle')}
          className="h-[3.25rem] w-full rounded-[0.85rem] border border-bean-line bg-bean-field pl-4 pr-[8.5rem] text-bean-body text-bean-ink transition-colors placeholder:text-bean-faint focus:border-bean-ink/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-bean-mustard/60"
        />
        {/* honeypot: real visitors never see or fill this */}
        <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="absolute inset-y-0 right-0 rounded-[0.85rem] bg-bean-ink px-6 font-bean-display text-bean-body font-bold text-bean-cream transition-[background-color,transform] hover:bg-bean-slate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bean-mustard focus-visible:ring-offset-2 focus-visible:ring-offset-bean-cream active:scale-[0.97] disabled:opacity-60"
        >
          Say hello
        </button>
      </form>
      <p id="footer-email-status" aria-live="polite" className="mt-2 min-h-[1.25rem] text-bean-fine text-bean-muted">
        {status === 'error' ? (
          <>
            Couldn’t send just now.{' '}
            <a href={`mailto:${EMAIL}`} className="bean-link text-bean-ink">
              Email me instead
            </a>
          </>
        ) : (
          MESSAGES[status] ?? ''
        )}
      </p>

      <ul className="mt-3 flex items-center gap-7">
        {CONNECT.filter((item) => ICONS[item.label]).map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              {...external(item.href)}
              aria-label={item.label}
              className="block text-bean-muted transition-[color,transform] duration-300 hover:-translate-y-0.5 hover:text-bean-ink focus-visible:text-bean-ink focus-visible:outline-none"
            >
              <svg viewBox="0 0 24 24" className="size-[1.6rem]" aria-hidden="true" fill="currentColor">
                <path d={ICONS[item.label]} />
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

const ColumnTitle = ({ children }) => (
  <h2 className="font-bean-display text-bean-head font-bold text-bean-ink">{children}</h2>
)

/**
 * A dozing coder in a bean bag: the film bleeds off the footer's left edge
 * under the name, with the link columns and email box over its empty right
 * side. Below lg it stacks: name, film, links, email box.
 */
const Footer = () => (
  <footer className="relative overflow-hidden bg-bean-cream px-bean-gutter font-bean-text text-bean-ink antialiased selection:bg-bean-mustard selection:text-bean-ink">
    <div className="grid gap-y-12 pt-[clamp(4rem,13vh,9rem)] lg:grid-cols-[minmax(0,1fr)_min(60vw,62rem)] xl:grid-cols-[minmax(0,1fr)_min(52vw,62rem)]">
      {/* Name + the dozing film, which bleeds off the left edge. */}
      <div className="relative">
        <button
          type="button"
          onClick={() => scrollToTop()}
          className="relative z-10 font-bean-display text-bean-wordmark font-bold text-bean-ink"
        >
          Sakshi Gupta
        </button>
        <p className="relative z-10 mt-3 text-bean-tagline text-bean-muted">
          Let’s build something
          <br />
          autonomous.
        </p>

        <div className="bean-film pointer-events-none relative -mx-bean-gutter mt-6 aspect-[100/94] w-screen overflow-hidden lg:mx-0 lg:-ml-bean-gutter lg:-mt-[6.9vw] lg:aspect-video lg:w-[72vw]">
          <LoopVideo
            src={FILM.src}
            poster={FILM.poster}
            label={FILM.label}
            className="absolute left-0 top-[-15%] w-[210%] max-w-none lg:inset-0 lg:h-full lg:w-full lg:object-cover"
          />
        </div>
      </div>

      {/* Link columns | divider | email box. Sits above the film's empty right side. */}
      <div className="relative z-10 grid grid-cols-2 gap-x-8 gap-y-12 self-start sm:grid-cols-[minmax(7rem,1fr)_minmax(7rem,1fr)_1px_minmax(17rem,2.1fr)] sm:gap-x-[clamp(1.75rem,3.4vw,4.25rem)] lg:pb-16">
        <nav aria-label="Explore">
          <ColumnTitle>Explore</ColumnTitle>
          <ul className="mt-6 space-y-[0.95rem]">
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <button
                  type="button"
                  onClick={() => goToSection(section.id)}
                  className="bean-link text-bean-link text-bean-muted"
                >
                  {section.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Connect">
          <ColumnTitle>Connect</ColumnTitle>
          <ul className="mt-6 space-y-[0.95rem]">
            {CONNECT.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  {...external(item.href)}
                  onClick={item.onClick}
                  className="bean-link text-bean-link text-bean-muted"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <span aria-hidden="true" className="hidden h-[clamp(14rem,19vw,22rem)] bg-bean-line sm:block" />
        <div className="col-span-2 sm:col-span-1">
          <SayHello />
        </div>
      </div>
    </div>

    {/* extra bottom / right room keeps this row clear of the floating chat button */}
    <div className="relative z-10 flex flex-col gap-4 border-t border-bean-line pb-24 pt-8 text-bean-fine text-bean-muted sm:flex-row sm:items-center sm:justify-between sm:py-8 sm:pr-48 lg:py-[clamp(2rem,4.5vh,3.25rem)]">
      <p>© {new Date().getFullYear()} Sakshi Gupta. All rights reserved.</p>
      <button type="button" onClick={() => scrollToTop()} className="bean-link self-start sm:self-auto">
        Back to top ↑
      </button>
    </div>
  </footer>
)

export default Footer
