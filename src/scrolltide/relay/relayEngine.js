// The Relay button's layer rolls, rewired so the contact form drives them. The
// original simulates a sync on a timer; here the bar waits short of full until
// the server answers.
import { clamp, smoothstep } from './lib/motion.ts'

const ROLL = { ms: 320, rise: 0.55, blur: 6, ease: 'cubic-bezier(.2,.8,.2,1)' } // layer roll: travel × pill height
const SETTLE = 160 // ms at 100 % before the bar rolls out
const CHECK = { rise: 300, slide: 360, text: 300 } // ms: check rises in the middle, slides left, the word blurs in
/** How long after "done" starts that the check has settled and the word is in. */
export const DONE_MS = 250 + SETTLE + CHECK.rise + CHECK.slide + 700
/** Progress over time [s, 0..1]: quick start, a couple of stalls; the last stretch waits for the reply. */
const SCHEDULE = [
  [0, 0],
  [0.45, 0.17],
  [0.8, 0.21],
  [1.45, 0.63],
  [1.75, 0.66],
  [3.5, 0.9],
]

export class RelayEngine {
  phase = 'idle'
  raf = 0
  progress = 0
  timers = []
  reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  constructor(root) {
    const q = (s) => root.querySelector(s)
    this.label = q('.rl-label')
    this.track = q('.rl-track')
    this.done = q('.rl-done')
    this.tick = q('.rl-tick')
    this.word = q('.rl-word')
  }

  destroy() {
    cancelAnimationFrame(this.raf)
    this.timers.forEach(clearTimeout)
  }

  set(phase) {
    if (phase === this.phase) return
    this.destroy()
    this.timers = []
    const from = this.phase
    this.phase = phase
    if (phase === 'sending') this.send()
    else if (phase === 'done') this.finish()
    else this.reset(from)
  }

  later(ms, fn) {
    this.timers.push(window.setTimeout(fn, this.reduced ? 0 : ms))
  }

  /** Roll a layer in from below / above (dir +1 = from below) or out upward / downward. */
  roll(el, show, dir) {
    const y = `${dir * ROLL.rise * 100}%`
    const off = { transform: `translateY(${show ? y : `${-dir * ROLL.rise * 100}%`})`, opacity: 0, filter: `blur(${ROLL.blur}px)` }
    const on = { transform: 'translateY(0)', opacity: 1, filter: 'blur(0px)' }
    el.getAnimations().forEach((a) => a.cancel())
    el.dataset.on = String(show)
    if (this.reduced) return
    el.animate(show ? [off, on] : [on, off], { duration: ROLL.ms, easing: ROLL.ease, fill: 'both' })
  }

  paint(p) {
    this.progress = p
    this.track.style.setProperty('--p', p.toFixed(4))
  }

  send() {
    this.paint(0)
    this.roll(this.label, false, 1)
    this.roll(this.track, true, 1)
    const t0 = performance.now() + (this.reduced ? 0 : ROLL.ms * 0.5)
    const frame = (now) => {
      const t = Math.max(0, (now - t0) / 1000)
      let p = SCHEDULE[SCHEDULE.length - 1][1]
      for (let i = 1; i < SCHEDULE.length; i++) {
        const [ta, pa] = SCHEDULE[i - 1]
        const [tb, pb] = SCHEDULE[i]
        if (t < tb) {
          p = pa + (pb - pa) * smoothstep(ta, tb, t)
          break
        }
      }
      this.paint(p)
      if (t < SCHEDULE[SCHEDULE.length - 1][0]) this.raf = requestAnimationFrame(frame)
    }
    this.raf = requestAnimationFrame(frame)
  }

  finish() {
    const start = this.progress
    const t0 = performance.now()
    const fill = (now) => {
      const k = this.reduced ? 1 : clamp((now - t0) / 250)
      this.paint(start + (1 - start) * k)
      if (k < 1) this.raf = requestAnimationFrame(fill)
      else this.later(SETTLE, () => this.check())
    }
    this.raf = requestAnimationFrame(fill)
  }

  check() {
    this.roll(this.track, false, 1)
    // the tick rises into the middle, then steps left as the word arrives beside it
    this.done.dataset.on = 'true'
    if (this.reduced) return
    const d = this.done.getBoundingClientRect()
    const k = this.tick.getBoundingClientRect()
    const mid = `${d.left + d.width / 2 - (k.left + k.width / 2)}px`
    this.tick.animate(
      [
        { transform: `translate(${mid}, 70%) scale(.55)`, opacity: 0, filter: 'blur(4px)' },
        { transform: `translate(${mid}, 0) scale(1)`, opacity: 1, filter: 'blur(0px)', offset: CHECK.rise / (CHECK.rise + CHECK.slide) },
        { transform: 'translate(0, 0) scale(1)', opacity: 1, filter: 'blur(0px)' },
      ],
      { duration: CHECK.rise + CHECK.slide, easing: 'cubic-bezier(.3,.7,.2,1)', fill: 'both' }
    )
    this.word.animate(
      [
        { transform: 'translateX(18%)', opacity: 0, filter: 'blur(5px)' },
        { transform: 'none', opacity: 1, filter: 'blur(0px)' },
      ],
      { duration: CHECK.text, delay: CHECK.rise + 60, easing: 'ease-out', fill: 'both' }
    )
  }

  reset(from) {
    this.roll(from === 'done' ? this.done : this.track, false, -1)
    if (from === 'done') this.track.dataset.on = 'false'
    else this.done.dataset.on = 'false'
    this.roll(this.label, true, -1)
  }
}
