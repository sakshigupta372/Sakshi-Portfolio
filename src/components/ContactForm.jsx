import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Loader2, Mail, RotateCcw } from 'lucide-react'
import { RevealWords } from './Reveal'
import { EMAIL } from '../lib/ui'
import { trackEvent } from '../lib/analytics.js'

const EMPTY = { name: '', email: '', message: '', company: '' }

function validate(data) {
  const next = {}
  if (!data.name.trim()) next.name = 'Name is required'
  if (!data.email.trim()) next.email = 'Email is required'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim())) next.email = 'Enter a valid email'
  if (!data.message.trim()) next.message = 'Message is required'
  else if (data.message.trim().length < 10) next.message = 'At least 10 characters'
  return next
}

const mailtoFor = (data) => {
  const subject = encodeURIComponent(`Portfolio note from ${data.name || 'a visitor'}`)
  const body = encodeURIComponent(`${data.message}\n\n— ${data.name}\n${data.email}`)
  return `mailto:${EMAIL}?subject=${subject}&body=${body}`
}

// Animated check mark drawn on success.
const SuccessMark = () => (
  <svg viewBox="0 0 52 52" className="h-14 w-14" aria-hidden="true">
    <motion.circle
      cx="26"
      cy="26"
      r="24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    />
    <motion.path
      d="M15 27 l7 7 l15 -16"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 0.4, duration: 0.35, ease: 'easeOut' }}
    />
  </svg>
)

const ContactForm = () => {
  const [formData, setFormData] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  // idle | sending | sent | error
  const [status, setStatus] = useState('idle')
  const [errorText, setErrorText] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const next = validate(formData)
    setErrors(next)
    if (Object.keys(next).length) return

    setStatus('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok) {
        setStatus('sent')
        trackEvent('contact_submit', { result: 'sent' })
        return
      }
      if (res.status === 422 && data.fields) {
        setErrors(data.fields)
        setStatus('idle')
        return
      }
      setErrorText(
        res.status === 429
          ? data.error || 'Too many messages. Please try again in a few minutes.'
          : "The form couldn't send your message just now."
      )
      setStatus('error')
    } catch {
      setErrorText("The form couldn't send your message just now.")
      setStatus('error')
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }

  const reset = () => {
    setFormData(EMPTY)
    setErrors({})
    setStatus('idle')
  }

  const field =
    'w-full border-0 border-b bg-transparent py-3 text-ink placeholder:text-muted/60 focus:outline-none'

  return (
    <section id="contact" className="scroll-mt-24 border-t border-line px-5 py-24 sm:px-8">
      <div className="mx-auto grid max-w-6xl gap-16 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55 }}
        >
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">05 — Contact</p>
          <RevealWords
            as="h2"
            text="Tell me what you want built."
            className="font-display text-4xl tracking-tight text-ink sm:text-5xl"
          />
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
            Agentic systems, MCP servers, RAG products, or a backend that needs to hold up.
            The form lands straight in my inbox, and I usually reply within a day.
          </p>
          <a
            href={`mailto:${EMAIL}`}
            className="mt-8 inline-block font-display text-2xl text-ink underline decoration-line underline-offset-4 hover:decoration-ink"
          >
            {EMAIL}
          </a>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait" initial={false}>
            {status === 'sent' ? (
              <motion.div
                key="sent"
                role="status"
                className="flex h-full min-h-[22rem] flex-col items-start justify-center rounded-2xl border border-line bg-surface p-8 text-accent"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <SuccessMark />
                <motion.h3
                  className="mt-6 font-display text-3xl text-ink"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                >
                  Message sent. Thank you, {formData.name.split(' ')[0]}!
                </motion.h3>
                <motion.p
                  className="mt-2 max-w-sm text-sm leading-relaxed text-muted"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  It&apos;s in my inbox. I&apos;ll reply to {formData.email}, usually within a day.
                </motion.p>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-ink hover:text-accent"
                >
                  <RotateCcw size={14} />
                  Send another
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                noValidate
                className="space-y-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.45 }}
              >
                {/* Honeypot: hidden from people and screen readers, bots fill it in. */}
                <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
                  <label>
                    Company
                    <input type="text" name="company" tabIndex={-1} autoComplete="off" value={formData.company} onChange={handleChange} />
                  </label>
                </div>

                <div>
                  <label htmlFor="cf-name" className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Name</label>
                  <input
                    id="cf-name"
                    type="text"
                    name="name"
                    autoComplete="name"
                    maxLength={100}
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    aria-invalid={Boolean(errors.name)}
                    className={`${field} ${errors.name ? 'border-red-500' : 'border-line focus:border-accent'}`}
                  />
                  {errors.name ? <p className="mt-1 text-sm text-red-500">{errors.name}</p> : null}
                </div>
                <div>
                  <label htmlFor="cf-email" className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Email</label>
                  <input
                    id="cf-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    maxLength={200}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@email.com"
                    aria-invalid={Boolean(errors.email)}
                    className={`${field} ${errors.email ? 'border-red-500' : 'border-line focus:border-accent'}`}
                  />
                  {errors.email ? <p className="mt-1 text-sm text-red-500">{errors.email}</p> : null}
                </div>
                <div>
                  <label htmlFor="cf-message" className="font-mono text-[11px] uppercase tracking-[0.16em] text-muted">Message</label>
                  <textarea
                    id="cf-message"
                    name="message"
                    maxLength={5000}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="What should we build?"
                    rows="4"
                    aria-invalid={Boolean(errors.message)}
                    className={`${field} resize-none ${errors.message ? 'border-red-500' : 'border-line focus:border-accent'}`}
                  />
                  {errors.message ? <p className="mt-1 text-sm text-red-500">{errors.message}</p> : null}
                </div>

                {status === 'error' ? (
                  <div role="alert" className="rounded-xl border border-line bg-surface p-4 text-sm">
                    <p className="text-ink">{errorText}</p>
                    <a
                      href={mailtoFor(formData)}
                      className="mt-2 inline-flex items-center gap-1.5 font-medium text-accent hover:underline"
                    >
                      <Mail size={14} />
                      Send it with your email app instead
                    </a>
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-opacity hover:opacity-80 disabled:opacity-60"
                >
                  {status === 'sending' ? (
                    <>
                      Sending…
                      <Loader2 size={16} className="animate-spin" />
                    </>
                  ) : (
                    <>
                      Send message
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

export default ContactForm
