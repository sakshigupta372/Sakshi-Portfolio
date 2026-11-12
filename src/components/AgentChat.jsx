import React, { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUp, ExternalLink, Sparkles, X } from 'lucide-react'
import { SUGGESTIONS, answer, retrieve } from '../data/knowledge.js'
import { EVENTS } from '../lib/ui'
import { goToSection, navigate } from '../lib/router.jsx'
import { trackEvent } from '../lib/analytics.js'

const WELCOME = {
  id: 'welcome',
  role: 'agent',
  text: "Hi, I'm Sakshi's portfolio agent. Ask me about her projects, stack, experience, or availability.",
  actions: [],
  sources: [],
  done: true,
}

let nextId = 1
const uid = () => `m${nextId++}`

// Once the server says the model isn't configured, stop asking for this visit.
let modelUnavailable = false

// Reveals local (offline) answers a few words at a time so they feel streamed.
function useTypewriter(reduce) {
  const timer = useRef(null)
  const stop = useCallback(() => clearInterval(timer.current), [])
  useEffect(() => stop, [stop])

  return useCallback(
    (full, onUpdate) =>
      new Promise((resolve) => {
        stop()
        if (reduce) {
          onUpdate(full)
          resolve()
          return
        }
        const words = full.split(/(\s+)/)
        let i = 0
        timer.current = setInterval(() => {
          i = Math.min(words.length, i + 3)
          onUpdate(words.slice(0, i).join(''))
          if (i >= words.length) {
            stop()
            resolve()
          }
        }, 28)
      }),
    [reduce, stop]
  )
}

// Streams the model's reply. Resolves true if the model answered, false if the
// caller should fall back to the local answer.
async function streamFromModel(history, onText, signal) {
  if (modelUnavailable) return false
  let res
  try {
    res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history }),
      signal,
    })
  } catch {
    return false
  }
  if (!res.ok || !res.body) {
    // 404 = no API on this host (e.g. static preview); 503 = no key configured.
    if (res.status === 404 || res.status === 503) modelUnavailable = true
    return false
  }
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let text = ''
  for (;;) {
    const { value, done } = await reader.read()
    if (done) break
    text += decoder.decode(value, { stream: true })
    onText(text)
  }
  return text.trim().length > 0
}

const ActionChip = ({ action, onNavigate }) => {
  const cls =
    'inline-flex items-center gap-1 rounded-full border border-line bg-paper px-2.5 py-1 text-[11px] font-medium text-ink transition-colors hover:border-accent hover:text-accent'
  if (action.href) {
    const external = action.href.startsWith('http')
    return (
      <a
        href={action.href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className={cls}
      >
        {action.label}
        {external ? <ExternalLink size={10} /> : null}
      </a>
    )
  }
  return (
    <button type="button" onClick={() => onNavigate(action)} className={cls}>
      {action.label}
    </button>
  )
}

const AgentChat = () => {
  const reduce = useReducedMotion()
  const typewrite = useTypewriter(reduce)
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([WELCOME])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [trace, setTrace] = useState([])
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const abortRef = useRef(null)
  const messagesRef = useRef(messages)
  messagesRef.current = messages

  useEffect(() => () => abortRef.current?.abort(), [])

  const patch = (id, fields) => setMessages((m) => m.map((x) => (x.id === id ? { ...x, ...fields } : x)))

  const send = useCallback(
    async (raw) => {
      const text = raw.trim()
      if (!text || busy) return
      setInput('')
      setBusy(true)

      const history = [...messagesRef.current, { role: 'user', text }]
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text }))

      setMessages((m) => [...m, { id: uid(), role: 'user', text, done: true }])

      // Chips and sources come from local retrieval, so they work in both modes.
      const hits = retrieve(text)
      const local = answer(text)
      const actions = hits[0]?.entry.actions ?? local.actions
      const sources = hits.map((h) => h.entry.title)

      const id = uid()
      setTrace([`retriever: ${hits.length || 0} portfolio source${hits.length === 1 ? '' : 's'}`])
      const controller = new AbortController()
      abortRef.current = controller

      let started = false
      const onText = (t) => {
        if (!started) {
          started = true
          setTrace([])
          setMessages((m) => [...m, { id, role: 'agent', text: t, actions: [], sources: [], done: false }])
        } else {
          patch(id, { text: t })
        }
      }

      setTimeout(() => !started && setTrace((t) => [...t, 'model: generating…']), reduce ? 0 : 350)
      const viaModel = await streamFromModel(history, onText, controller.signal)

      if (!viaModel) {
        // Offline fallback: keyword retrieval over the same portfolio data.
        if (!started) {
          setTrace(local.trace)
          await new Promise((r) => setTimeout(r, reduce ? 0 : 500))
          setTrace([])
          setMessages((m) => [...m, { id, role: 'agent', text: '', actions: [], sources: [], done: false }])
        }
        await typewrite(local.text, (t) => patch(id, { text: t }))
        patch(id, { done: true, actions: local.actions, sources: local.sources })
      } else {
        patch(id, { done: true, actions, sources })
      }

      trackEvent('chat_message', { mode: viaModel ? 'model' : 'local' })
      setBusy(false)
    },
    [busy, reduce, typewrite]
  )

  // Open from anywhere (command palette, etc.), optionally with a prompt.
  useEffect(() => {
    const onOpen = (e) => {
      setOpen(true)
      const prompt = e.detail?.prompt
      if (prompt) setTimeout(() => send(prompt), 250)
    }
    window.addEventListener(EVENTS.openChat, onOpen)
    return () => window.removeEventListener(EVENTS.openChat, onOpen)
  }, [send])

  useEffect(() => {
    if (!open) return undefined
    trackEvent('chat_open')
    const t = setTimeout(() => inputRef.current?.focus(), 200)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, trace, open])

  const onNavigate = (action) => {
    setOpen(false)
    setTimeout(() => (action.route ? navigate(action.route) : goToSection(action.section)), 150)
  }

  const onSubmit = (e) => {
    e.preventDefault()
    send(input)
  }

  const showSuggestions = messages.length <= 1 && !busy

  return (
    <>
      <AnimatePresence>
        {!open ? (
          <motion.button
            key="fab"
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Ask my agent"
            className="group fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-ink py-3 pl-4 pr-5 text-sm font-medium text-paper shadow-[0_16px_36px_-12px_rgb(var(--ink)/0.55)] transition-transform hover:-translate-y-0.5 sm:bottom-6 sm:right-6"
            initial={{ opacity: 0, scale: 0.85, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 12 }}
            transition={{ delay: 0.4, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Sparkles size={16} className="text-accent" />
            Ask my agent
          </motion.button>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {open ? (
          <motion.section
            key="panel"
            role="dialog"
            aria-label="Ask Sakshi's agent"
            className="fixed inset-x-3 bottom-3 z-[65] flex h-[min(34rem,calc(100dvh-1.5rem))] flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_30px_70px_-20px_rgb(var(--ink)/0.5)] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[25rem]"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="flex items-center justify-between border-b border-line px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-accent-fg">
                  <Sparkles size={15} />
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-ink">Ask my agent</p>
                  <p className="text-[11px] text-muted">Answers come from this portfolio only</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-ink/10 hover:text-ink"
              >
                <X size={16} />
              </button>
            </header>

            <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4" aria-live="polite" data-lenis-prevent>
              {messages.map((m) =>
                m.role === 'user' ? (
                  <div key={m.id} className="flex justify-end">
                    <p className="max-w-[85%] rounded-2xl rounded-br-md bg-ink px-3.5 py-2 text-sm text-paper">
                      {m.text}
                    </p>
                  </div>
                ) : (
                  <div key={m.id} className="max-w-[92%]">
                    <p className="whitespace-pre-line rounded-2xl rounded-bl-md bg-paper px-3.5 py-2.5 text-sm leading-relaxed text-ink">
                      {m.text}
                      {!m.done ? <span className="ml-0.5 inline-block h-3.5 w-[2px] translate-y-0.5 animate-blink bg-accent" /> : null}
                    </p>
                    {m.done && m.actions?.length ? (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {m.actions.map((a) => (
                          <ActionChip key={a.label} action={a} onNavigate={onNavigate} />
                        ))}
                      </div>
                    ) : null}
                    {m.done && m.sources?.length ? (
                      <p className="mt-1.5 font-mono text-[10px] text-muted">sources: {m.sources.join(' · ')}</p>
                    ) : null}
                  </div>
                )
              )}

              {trace.length ? (
                <div className="space-y-0.5 font-mono text-[11px] text-muted">
                  {trace.map((step) => (
                    <p key={step} className="flex items-center gap-1.5">
                      <span className="h-1 w-1 rounded-full bg-accent" />
                      {step}
                    </p>
                  ))}
                </div>
              ) : null}

              {showSuggestions ? (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-full border border-line px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-line p-3">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about projects, stack, experience…"
                aria-label="Your question"
                maxLength={500}
                className="min-w-0 flex-1 rounded-full border border-line bg-paper px-4 py-2.5 text-sm text-ink placeholder:text-muted/70 focus:border-accent focus:outline-none"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label="Send"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-accent-fg transition-opacity disabled:opacity-40"
              >
                <ArrowUp size={16} />
              </button>
            </form>
          </motion.section>
        ) : null}
      </AnimatePresence>
    </>
  )
}

export default AgentChat
