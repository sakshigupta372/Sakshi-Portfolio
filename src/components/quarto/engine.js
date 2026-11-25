import { Spring, clamp } from '../../lib/motion.js'
import { prefersReducedMotion, watchVisible } from '../../lib/visibility.js'

export const PAGE = { w: 300, h: 400 }
/** Board thickness (px at scale 1): covers, inner boards. */
export const THICK = { cover: 7, board: 3.2 }
const TURN = { k: 64, d: 14.5 } // heavy boards: a little slow, no overshoot (clamped)
const LIFT = 26 // px a board rises off the stack mid-turn
const CASCADE = 110 // ms between boards when the book closes back to the front

/**
 * Leaves 0 … n−1 (0 = front cover, n−1 = back cover) hinge on the spine at x = 0. Step s means leaves < s are turned.
 * s = 0 closed (front up) … s = n closed (back up). The book slides so whatever is showing stays centred.
 */
export class QuartoEngine {
  step = 0
  s = 1
  raf = 0
  last = 0
  visible = false
  reduced = prefersReducedMotion()
  timers = []
  cleanups = []

  constructor(root) {
    this.root = root
    this.book = root.querySelector('.qt-book')
    this.leaves = [...root.querySelectorAll('.qt-leaf')]
    this.floor = root.querySelector('.qt-floor')
    this.dots = [...root.querySelectorAll('.qt-dot')]
    this.ang = this.leaves.map(() => new Spring(0, TURN.k, TURN.d))
    this.thick = this.leaves.map((_, i) => (i === 0 || i === this.leaves.length - 1 ? THICK.cover : THICK.board))
    const click = (e) => {
      // links on a page open; they don't turn it
      if (e.target.closest('.qt-ui, a, button')) return
      const r = this.book.getBoundingClientRect()
      const opened = this.step > 0 && this.step < this.leaves.length
      // when open, the left half goes back; otherwise any click moves on
      this.go(opened && e.clientX < r.left + r.width * 0.5 - this.shiftPx() ? -1 : 1)
    }
    const key = (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return // leave browser shortcuts alone
      const onControl = e.target !== root && Boolean(e.target.closest('a, button'))
      let by = 0
      if (e.key === 'ArrowRight') by = 1
      else if (e.key === 'ArrowLeft') by = -1
      else if ((e.key === ' ' || e.key === 'Enter') && !onControl) by = 1
      else return
      e.preventDefault()
      // the focused link is about to be turned away, so keep focus on the book
      if (onControl) root.focus({ preventScroll: true })
      this.go(by)
    }
    const stage = root.querySelector('.qt-stage')
    stage.addEventListener('click', click)
    root.addEventListener('keydown', key)
    this.cleanups.push(() => {
      stage.removeEventListener('click', click)
      root.removeEventListener('keydown', key)
    })
    const ro = new ResizeObserver(() => this.fit())
    ro.observe(root)
    this.cleanups.push(() => ro.disconnect())
    this.cleanups.push(watchVisible(root, (v) => ((this.visible = v), v && this.kick())))
    this.mark()
    this.fit()
  }

  /** Forward from the back cover closes the book back to the front, board by board. */
  go(by) {
    const n = this.leaves.length
    this.timers.forEach(clearTimeout)
    this.timers = []
    if (by > 0 && this.step >= n) {
      this.step = 0
      for (let i = n - 1; i >= 0; i--) {
        const t = window.setTimeout(() => {
          this.ang[i].target = 0
          this.kick()
        }, this.reduced ? 0 : (n - 1 - i) * CASCADE)
        this.timers.push(t)
      }
    } else {
      this.step = clamp(this.step + by, 0, n)
      this.ang.forEach((a, i) => (a.target = i < this.step ? 180 : 0))
    }
    this.mark()
    this.kick()
  }

  /** Updates the hint and dots, and leaves only the two showing faces focusable and readable. */
  mark() {
    const n = this.leaves.length
    this.root.dataset.step = String(this.step)
    this.root.dataset.state = this.step === 0 ? 'closed' : this.step === n ? 'end' : 'open'
    this.dots.forEach((d, i) => d.toggleAttribute('data-on', i === this.step))
    this.leaves.forEach((leaf, i) => {
      leaf.querySelector('.qt-front').toggleAttribute('inert', i !== this.step)
      leaf.querySelector('.qt-back').toggleAttribute('inert', i !== this.step - 1)
    })
  }

  fit() {
    const r = this.root.getBoundingClientRect()
    this.s = clamp(Math.min((r.width * 0.86) / (PAGE.w * 2), (r.height * 0.7) / PAGE.h), 0.45, 1.35)
    this.root.style.setProperty('--pw', `${PAGE.w * this.s}px`)
    this.root.style.setProperty('--ph', `${PAGE.h * this.s}px`)
    this.root.style.setProperty('--u', `${(PAGE.w * this.s) / 300}px`)
    this.leaves.forEach((l, i) => l.style.setProperty('--t', `${this.thick[i] * this.s}px`))
    this.layout()
    this.kick()
  }

  /** How far the book is slid right of centre (px): closed front −W/2, open 0, closed back +W/2. */
  shiftPx() {
    const n = this.leaves.length
    const front = this.ang[0].x / 180
    const back = this.ang[n - 1].x / 180
    return ((-PAGE.w / 2) * (1 - front) + (PAGE.w / 2) * back) * this.s
  }

  kick() {
    if (!this.raf && this.visible) {
      this.last = performance.now()
      this.raf = requestAnimationFrame(this.frame)
    }
  }

  frame = (now) => {
    this.raf = 0
    const dt = Math.min(1 / 30, Math.max(0, (now - this.last) / 1000))
    this.last = now
    let moving = false
    for (const a of this.ang) {
      if (this.reduced) {
        a.x = a.target
        a.v = 0
      } else a.step(dt)
      if (a.x < 0) (a.x = 0), (a.v = 0)
      if (a.x > 180) (a.x = 180), (a.v = 0)
      if (Math.abs(a.x - a.target) > 0.05 || Math.abs(a.v) > 0.05) moving = true
    }
    this.layout()
    if (moving && this.visible) this.raf = requestAnimationFrame(this.frame)
  }

  layout() {
    const n = this.leaves.length
    const s = this.s
    // stack heights: unturned boards pile on the right (first on top), turned ones on the left (last on top)
    let right = 0
    const zRight = []
    for (let i = n - 1; i >= 0; i--) {
      zRight[i] = right + this.thick[i] / 2
      right += this.thick[i]
    }
    let left = 0
    const zLeft = []
    for (let i = 0; i < n; i++) {
      zLeft[i] = left + this.thick[i] / 2
      left += this.thick[i]
    }
    for (let i = 0; i < n; i++) {
      const a = this.ang[i].x
      const f = a / 180
      const z = (zRight[i] + (zLeft[i] - zRight[i]) * f) * s + Math.sin((a * Math.PI) / 180) * LIFT * s
      const el = this.leaves[i]
      // turning boards: z then rotate about the spine; on the left a turned board's back faces up
      el.style.transform = `translateZ(${z.toFixed(2)}px) rotateY(${(-a).toFixed(3)}deg)`
      // faces darken as the board stands up (light comes from the front)
      el.style.setProperty('--shade', (Math.sin((a * Math.PI) / 180) * 0.35).toFixed(3))
    }
    const shift = this.shiftPx()
    this.book.style.transform = `translateX(${shift.toFixed(2)}px)`
    // floor shadow spans whatever is lying flat
    const front = this.ang[0].x / 180,
      back = this.ang[n - 1].x / 180
    const span = 1 + Math.min(front, 1 - back)
    // the book slides to stay centred, so its shadow only widens and narrows
    this.floor.style.transform = `translateX(-50%) scaleX(${span.toFixed(3)})`
  }

  destroy() {
    cancelAnimationFrame(this.raf)
    this.raf = 0
    this.timers.forEach(clearTimeout)
    this.cleanups.forEach((f) => f())
  }
}
