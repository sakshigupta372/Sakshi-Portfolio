import React, { useEffect, useRef, useState } from 'react'
import { animate, motion, useAnimationFrame, useMotionValue, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AnimatedNumber } from './kit/AnimatedNumber.tsx'
import { BlurSwap } from './kit/BlurSwap.tsx'
import { END, STAGES, WPS, elev, farElev } from './data.js'

/* ── geometry ─────────────────────────────────────────────────── */
export const CW = 1100
export const CH = 584
const PAD = 14
const HEAD = 76
const IW = CW - PAD * 2
const COL = 196
const OPEN = IW - COL * (STAGES.length - 1)
const PEEK = 30
const BASE = CH - 26
const PH = 240
const E0 = 800
const E1 = 3000
const Y = (m) => BASE - ((m - E0) / (E1 - E0)) * PH

const INK = '#171612'
const CORAL = '#FF5B37'

const targets = (open, hover) =>
  STAGES.map((_, i) => {
    if (i === open) return OPEN - (hover != null && hover !== open ? PEEK : 0)
    return COL + (hover === i && hover !== open ? PEEK : 0)
  })

export default function RidgeStretch() {
  const reduce = !!useReducedMotion()
  const first = STAGES.length - 1 // open on the latest stage
  const [open, setOpen] = useState(first)
  const [hover, setHover] = useState(null)
  const [booted, setBooted] = useState(false)

  // one width per stage; they share a spring so the row always sums to the card width
  const w0 = useMotionValue(targets(first, null)[0])
  const w1 = useMotionValue(targets(first, null)[1])
  const w2 = useMotionValue(targets(first, null)[2])
  const ws = [w0, w1, w2]
  useEffect(() => {
    const t = targets(open, hover)
    const settle = hover == null || hover === open
    const cs = ws.map((w, i) =>
      animate(w, t[i], reduce ? { duration: 0.2 } : { type: 'spring', duration: settle ? 0.72 : 0.42, bounce: settle ? 0.16 : 0.1 })
    )
    return () => cs.forEach((c) => c.stop())
  }, [open, hover, reduce])

  useEffect(() => {
    const id = setTimeout(() => setBooted(true), 1600)
    return () => clearTimeout(id)
  }, [])

  const go = (i) => setOpen((i + STAGES.length) % STAGES.length)

  /* ── refs written every frame ───────────────────────────────── */
  const panels = useRef([])
  const cols = useRef([])
  const fillRef = useRef(null)
  const clipRef = useRef(null)
  const farRef = useRef(null)
  const dashRef = useRef(null)
  const hotRef = useRef(null)
  const hotGlow = useRef(null)
  const seps = useRef([])
  const huts = useRef([])
  const periodLabels = useRef([])
  const wpRefs = useRef({})
  const clouds = useRef([])
  const revealRef = useRef(null)
  const reveal = useMotionValue(0)
  const t0 = useRef(performance.now())

  useEffect(() => {
    const set = (v) => revealRef.current?.setAttribute('width', String(v * CW))
    const off = reveal.on('change', set)
    const c = animate(reveal, 1, { duration: reduce ? 0.2 : 1.5, ease: [0.45, 0, 0.15, 1], delay: reduce ? 0 : 0.35 })
    return () => (c.stop(), off())
  }, [reveal, reduce])

  // the coral route segment re-inks itself in the newly opened stage
  const hotFade = useMotionValue(1)
  useEffect(() => {
    hotFade.set(0)
    const c = animate(hotFade, 1, { duration: reduce ? 0.1 : 0.95, delay: reduce ? 0 : 0.12, ease: [0.45, 0, 0.2, 1] })
    return () => c.stop()
  }, [open, hotFade, reduce])

  const layout = () => {
    const w = ws.map((m) => m.get())
    const x = []
    let acc = PAD
    for (let i = 0; i < w.length; i++) {
      x.push(acc)
      acc += w[i]
    }
    return { w, x }
  }
  /** km → x under the current (stretched) layout */
  const kmToX = (km, L) => {
    const i = Math.max(0, STAGES.findIndex((d) => km <= d.k1 + 1e-9))
    const d = STAGES[i]
    return L.x[i] + ((km - d.k0) / (d.k1 - d.k0)) * L.w[i]
  }

  useAnimationFrame(() => {
    const L = layout()
    if (!reduce) {
      const ts = (performance.now() - t0.current) / 1000
      clouds.current[0]?.setAttribute('cx', (((ts * 21 + 300) % (CW + 500)) - 250).toFixed(1))
      clouds.current[1]?.setAttribute('cx', (((ts * 13 + 820) % (CW + 400)) - 200).toFixed(1))
    }

    // columns + panels
    for (let i = 0; i < STAGES.length; i++) {
      const tr = `translateX(${L.x[i].toFixed(2)}px)`
      for (const el of [panels.current[i], cols.current[i]]) {
        if (!el) continue
        el.style.transform = tr
        el.style.width = `${L.w[i].toFixed(2)}px`
      }
    }

    // sample the whole route, column by column (stretched)
    const P = []
    let far = ''
    for (let i = 0; i < STAGES.length; i++) {
      const d = STAGES[i]
      const n = Math.max(10, Math.round(L.w[i] / 3.2))
      for (let s = i === 0 ? 0 : 1; s <= n; s++) {
        const km = d.k0 + ((d.k1 - d.k0) * s) / n
        const x = L.x[i] + (L.w[i] * s) / n
        P.push({ x, y: Y(elev(km)), km })
        far += `${far ? 'L' : 'M'}${x.toFixed(1)} ${Y(farElev(km)).toFixed(1)}`
      }
    }
    const line = (pts) => pts.map((p, k) => `${k ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join('')
    const all = line(P)
    const fill = `M0 ${P[0].y.toFixed(1)}L${all.slice(1)}L${CW} ${P[P.length - 1].y.toFixed(1)}L${CW} ${CH + 2}L0 ${CH + 2}Z`
    fillRef.current?.setAttribute('d', fill)
    clipRef.current?.setAttribute('d', fill)
    // start the distant range at the card's edge, not at the first column
    farRef.current?.setAttribute('d', `M0 ${Y(farElev(0)).toFixed(1)}L${far.slice(1)}L${CW} ${CH + 2}L0 ${CH + 2}Z`)
    dashRef.current?.setAttribute('d', all)
    const od = STAGES[open]
    const hot = line(P.filter((p) => p.km >= od.k0 - 1e-6 && p.km <= od.k1 + 1e-6))
    hotRef.current?.setAttribute('d', hot)
    hotGlow.current?.setAttribute('d', hot)
    const hf = hotFade.get()
    for (const el of [hotRef.current, hotGlow.current]) el?.setAttribute('stroke-dashoffset', (1 - hf).toFixed(4))
    if (hotGlow.current) hotGlow.current.style.opacity = (0.35 * Math.min(1, hf * 1.5)).toFixed(3)

    // stage boundaries: hairline drops to the hut on the ridge
    for (let i = 0; i < STAGES.length - 1; i++) {
      const km = STAGES[i].k1
      const x = L.x[i + 1]
      const y = Y(elev(km))
      const s = seps.current[i]
      if (s) {
        s.setAttribute('x1', x.toFixed(1))
        s.setAttribute('x2', x.toFixed(1))
        s.setAttribute('y2', (y - 13).toFixed(1))
      }
      huts.current[i]?.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`)
    }
    for (let i = 0; i < STAGES.length; i++) periodLabels.current[i]?.setAttribute('x', (L.x[i] + 14).toFixed(1))

    // waypoint labels ride the profile; clamp the text inside its column
    STAGES.forEach((d, di) => {
      for (const w of WPS) {
        const g = wpRefs.current[`${di}:${w.km}`]
        if (!g) continue
        const x = kmToX(w.km, L)
        const y = Y(w.m)
        const lx = Math.min(L.x[di] + L.w[di] - 74, Math.max(L.x[di] + 74, x))
        g.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`)
        const t = g.children[1]
        if (t && !t.dataset.free) t.setAttribute('transform', `translate(${(lx - x).toFixed(1)} 0)`)
      }
    })
  })

  return (
    <div
      className="relative isolate select-none"
      style={{ width: CW, height: CH }}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') (e.preventDefault(), go(open + 1))
        if (e.key === 'ArrowLeft') (e.preventDefault(), go(open - 1))
      }}
    >
      {/* soft floor shadow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-10 -bottom-6 -z-10 h-16 rounded-[50%] bg-black/25 blur-2xl" />
      <motion.div
        className="relative h-full w-full overflow-hidden"
        style={{
          borderRadius: 30,
          background: '#FAF9F6',
          boxShadow:
            'inset 0 1px 0 #fff, 0 0 0 1px rgba(23,22,18,0.05), 0 2px 4px rgba(23,22,18,0.04), 0 30px 60px -30px rgba(40,34,24,0.35)',
        }}
        initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ type: 'spring', duration: 0.8, bounce: 0.06 }}
      >
        {/* sky panels (the open stage gets its own sky) */}
        {STAGES.map((d, i) => (
          <motion.div
            key={d.title}
            ref={(el) => void (panels.current[i] = el)}
            aria-hidden="true"
            className="pointer-events-none absolute left-0"
            style={{ top: HEAD - 4, bottom: 8, padding: '0 5px' }}
            initial={false}
            animate={{ opacity: i === open ? 1 : hover === i ? 0.55 : 0 }}
            transition={{ duration: i === open ? 0.5 : 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="h-full w-full"
              style={{
                borderRadius: 22,
                background: `linear-gradient(180deg, ${d.sky} 0%, ${d.sky} 22%, rgba(255,255,255,0) 72%)`,
                boxShadow: 'inset 0 0 0 1px rgba(23,22,18,0.045), inset 0 1px 0 rgba(255,255,255,0.9)',
              }}
            />
          </motion.div>
        ))}

        {/* the range */}
        <svg className="pointer-events-none absolute inset-0" width={CW} height={CH} aria-hidden="true">
          <defs>
            <linearGradient id="rs-rock" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1={Y(3000)} y2={Y(900)}>
              <stop offset="0" stopColor="#F6F8F9" />
              <stop offset="0.1" stopColor="#EFF2F3" />
              <stop offset="0.21" stopColor="#E2DFD7" />
              <stop offset="0.43" stopColor="#DCD8CE" />
              <stop offset="1" stopColor="#ECEAE3" />
            </linearGradient>
            <linearGradient id="rs-far" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#DCE2E8" />
              <stop offset="0.6" stopColor="#EEF0F1" />
            </linearGradient>
            <clipPath id="rs-clip">
              <path ref={clipRef} />
            </clipPath>
            <clipPath id="rs-reveal">
              <rect ref={revealRef} x={0} y={0} height={CH} width={0} />
            </clipPath>
            <filter id="rs-soft" x="-30%" y="-80%" width="160%" height="260%">
              <feGaussianBlur stdDeviation="16" />
            </filter>
            <filter id="rs-glow" x="-5%" y="-40%" width="110%" height="180%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>
          <g clipPath="url(#rs-reveal)">
            <path ref={farRef} fill="url(#rs-far)" opacity={0.85} />
            <path ref={fillRef} fill="url(#rs-rock)" />
            {/* contour lines, only inside the rock */}
            <g clipPath="url(#rs-clip)" stroke="rgba(23,22,18,0.075)" strokeWidth={1}>
              {Array.from({ length: 11 }, (_, k) => 1000 + k * 200).map((m) => (
                <line key={m} x1={0} x2={CW} y1={Y(m)} y2={Y(m)} />
              ))}
            </g>
            {/* cloud shadows drifting over the rock */}
            <g clipPath="url(#rs-clip)" filter="url(#rs-soft)">
              <ellipse ref={(el) => void (clouds.current[0] = el)} cy={Y(2250)} rx={170} ry={34} fill="rgba(40,34,24,0.075)" />
              <ellipse ref={(el) => void (clouds.current[1] = el)} cy={Y(1500)} rx={120} ry={24} fill="rgba(40,34,24,0.06)" />
            </g>
            {/* stage boundaries */}
            {STAGES.slice(0, -1).map((d, i) => (
              <line key={d.title} ref={(el) => void (seps.current[i] = el)} y1={HEAD + 18} stroke="rgba(23,22,18,0.09)" strokeDasharray="2 4" />
            ))}
            <path ref={dashRef} fill="none" stroke="rgba(23,22,18,0.38)" strokeWidth={1.3} strokeDasharray="1.5 3.5" strokeLinecap="round" />
            <path ref={hotGlow} fill="none" stroke={CORAL} strokeWidth={6} filter="url(#rs-glow)" pathLength={1} strokeDasharray="1 1" />
            <path ref={hotRef} fill="none" stroke={CORAL} strokeWidth={2.4} strokeLinejoin="round" strokeLinecap="round" pathLength={1} strokeDasharray="1 1" />
            {STAGES.slice(0, -1).map((d, i) => (
              <g key={d.title} ref={(el) => void (huts.current[i] = el)}>
                <path d="M-6 -3 L0 -9.5 L6 -3 V3.5 H-6 Z" fill="#FAF9F6" stroke={INK} strokeWidth={1.3} strokeLinejoin="round" />
                <rect x={-1.6} y={-0.5} width={3.2} height={4} fill={INK} />
              </g>
            ))}
            {STAGES.map((d, i) => (
              <text
                key={d.title}
                ref={(el) => void (periodLabels.current[i] = el)}
                y={CH - 14}
                className="font-geist-mono"
                fontSize={9.5}
                letterSpacing="0.08em"
                fill="rgba(23,22,18,0.42)"
              >
                {d.period.toUpperCase()}
              </text>
            ))}
            {/* waypoints of the open stage */}
            {STAGES.map((d, di) => (
              <motion.g
                key={d.title}
                initial={false}
                animate={{ opacity: di === open ? 1 : 0 }}
                transition={{ duration: di === open ? 0.45 : 0.15, delay: di === open ? 0.32 : 0 }}
              >
                {WPS.filter((w) => w.km > d.k0 + 0.01 && w.km <= d.k1 + 0.01).map((w, k) => {
                  const end = Math.abs(w.km - d.k1) < 0.01
                  const low = end || w.kind === 'lake' || w.kind === 'alpe' || w.kind === 'town'
                  const anchor = end ? 'end' : 'middle'
                  const tx = end ? -12 : 0
                  const last = w.km === END
                  return (
                    <g key={w.km} ref={(el) => void (wpRefs.current[`${di}:${w.km}`] = el)}>
                      <g className={di === open ? 'rs-pop' : undefined} style={{ animationDelay: `${0.36 + k * 0.07}s` }}>
                        <circle r={3.6} fill="#fff" stroke={w.kind === 'hut' || w.kind === 'town' ? INK : CORAL} strokeWidth={1.6} />
                      </g>
                      <g data-free={end ? '1' : undefined}>
                        {end ? (
                          <path d="M-5 6 L-5 20 L-10 25" fill="none" stroke="rgba(23,22,18,0.25)" strokeWidth={1} />
                        ) : (
                          <line x1={0} x2={0} y1={low ? 7 : -7} y2={low ? 20 : -20} stroke="rgba(23,22,18,0.25)" strokeWidth={1} />
                        )}
                        <text x={last ? -16 : tx} y={low ? 34 : w.sub ? -38 : -26} textAnchor={anchor} className="font-hanken" fontSize={12.5} fontWeight={600} fill={INK}>
                          {w.name}
                        </text>
                        {w.sub ? (
                          <text x={tx} y={low ? 48 : -24} textAnchor={anchor} className="font-geist-mono" fontSize={10} fill="rgba(23,22,18,0.5)">
                            {w.sub}
                          </text>
                        ) : null}
                      </g>
                    </g>
                  )
                })}
              </motion.g>
            ))}
          </g>
        </svg>

        {/* stage columns */}
        {STAGES.map((d, i) => (
          <Column
            key={d.title}
            d={d}
            i={i}
            open={i === open}
            hovered={hover === i}
            booted={booted}
            colRef={(el) => void (cols.current[i] = el)}
            onOpen={() => go(i)}
            onHover={(h) => setHover((cur) => (h ? i : cur === i ? null : cur))}
          />
        ))}

        {/* header */}
        <header className="absolute inset-x-0 top-0 flex h-[76px] items-center justify-between px-7">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <svg width="18" height="20" viewBox="0 0 18 20" aria-hidden="true">
                <ellipse cx="9" cy="16.5" rx="8" ry="3.3" fill={INK} />
                <ellipse cx="9.6" cy="10.4" rx="5.6" ry="2.8" fill={INK} />
                <ellipse cx="8.6" cy="5" rx="3.6" ry="2.2" fill={CORAL} />
              </svg>
              <span className="font-hanken text-[18px] font-semibold tracking-[-0.03em]" style={{ color: INK }}>
                path
              </span>
            </span>
            <span className="h-5 w-px bg-black/10" />
            <span className="font-display text-[27px] italic leading-none tracking-[-0.01em]" style={{ color: INK }}>
              The route so far
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-geist-mono text-[10.5px] uppercase tracking-[0.12em] text-black/45">
              {STAGES.length} stages · 2023 — now
            </span>
            <div className="flex h-9 items-center gap-1 rounded-full bg-black/[0.04] p-1 shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]">
              <NavBtn label="Previous stage" onClick={() => go(open - 1)}>
                <ChevronLeft size={15} strokeWidth={2} />
              </NavBtn>
              <span className="w-[84px] text-center font-hanken text-[13px] font-medium tabular-nums" style={{ color: INK }}>
                <BlurSwap swapKey={open}>Stage {open + 1}</BlurSwap>
                <span className="text-black/35"> / {STAGES.length}</span>
              </span>
              <NavBtn label="Next stage" onClick={() => go(open + 1)}>
                <ChevronRight size={15} strokeWidth={2} />
              </NavBtn>
            </div>
          </div>
        </header>
      </motion.div>
      <style>{`
        .rs-pop { transform-box: fill-box; transform-origin: center; animation: rs-pop .5s cubic-bezier(.3,1.6,.5,1) both; }
        @keyframes rs-pop { from { transform: scale(0) } to { transform: scale(1) } }
      `}</style>
    </div>
  )
}

function NavBtn({ children, label, onClick }) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClick}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', duration: 0.2, bounce: 0.25 }}
      className="grid size-7 place-items-center rounded-full bg-white text-black/70 shadow-[0_1px_2px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.05)] outline-none hover:text-black focus-visible:ring-2 focus-visible:ring-[#FF5B37]/50"
    >
      {children}
    </motion.button>
  )
}

/* ── a stage column: collapsed summary ↔ open detail ──────────── */
function Column({ d, i, open, hovered, booted, colRef, onOpen, onHover }) {
  return (
    <div ref={colRef} className="absolute left-0 overflow-hidden" style={{ top: HEAD, bottom: 0 }}>
      {/* collapsed summary */}
      <motion.div
        aria-hidden="true"
        className="absolute left-0 top-0 pl-[20px] pt-[18px]"
        style={{ width: COL }}
        initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
        animate={open ? { opacity: 0, y: -6, filter: 'blur(6px)' } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={open ? { duration: 0.16 } : { duration: 0.4, delay: booted ? 0.14 : 0.3 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="font-geist-mono text-[10px] uppercase tracking-[0.14em] text-black/45">{d.type}</div>
        <div className="mt-3 font-hanken text-[30px] font-light leading-none tracking-[-0.04em] tabular-nums" style={{ color: INK }}>
          {d.year}
        </div>
        <motion.div className="mt-4 font-hanken text-[15px] font-medium" style={{ color: INK }} animate={{ x: hovered ? 2 : 0 }}>
          {d.short}
        </motion.div>
        <div className="mt-1 pr-3 font-geist-mono text-[10.5px] leading-snug text-black/45">{d.title}</div>
      </motion.div>

      {/* open detail */}
      <motion.div
        className="absolute left-0 top-0 pl-[26px] pr-[22px] pt-[16px]"
        style={{ width: OPEN - 4 }}
        initial={false}
        animate={open ? { opacity: 1, y: 0, filter: 'blur(0px)' } : { opacity: 0, y: 8, filter: 'blur(6px)' }}
        transition={open ? { duration: 0.45, delay: booted ? 0.16 : 0.45, ease: [0.16, 1, 0.3, 1] } : { duration: 0.15 }}
        aria-hidden={!open}
      >
        <div className="flex items-center gap-2.5">
          <span className="font-geist-mono text-[10.5px] uppercase tracking-[0.16em]" style={{ color: CORAL }}>
            {d.type}
          </span>
          <span className="font-hanken text-[13px] font-medium text-black/50">{d.period}</span>
          {d.chip ? (
            <span className="rounded-full px-2 py-[3px] font-hanken text-[11px] font-medium text-black/55 ring-1 ring-black/10">{d.chip}</span>
          ) : null}
        </div>
        <h3 className="mt-2 font-hanken text-[25px] font-medium tracking-[-0.03em]" style={{ color: INK }}>
          {d.title} <span className="text-black/30">·</span> <span className="text-black/55">{d.organization}</span>
        </h3>
        <p className="mt-1.5 max-w-[600px] font-hanken text-[13.5px] leading-[1.5] text-black/60">{d.description}</p>
        <div className="mt-3 flex gap-8">
          {d.stats.map((s) => (
            <div key={s.label}>
              <div className="font-geist-mono text-[9.5px] uppercase tracking-[0.14em] text-black/40">{s.label}</div>
              <div className="mt-1 flex items-baseline font-hanken text-[30px] font-light leading-none tracking-[-0.045em] tabular-nums" style={{ color: INK }}>
                {open ? (
                  <AnimatedNumber
                    value={s.value}
                    from={s.plain ? s.value : 0}
                    duration={0.7}
                    format={(n) => (s.decimals ? n.toFixed(s.decimals) : String(Math.round(n))) + (s.suffix || '')}
                  />
                ) : (
                  `${s.value}${s.suffix || ''}`
                )}
                {s.unit ? <span className="ml-1.5 text-[13px] font-normal tracking-normal text-black/40">{s.unit}</span> : null}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* a collapsed column is one big button */}
      {open ? null : (
        <button
          type="button"
          aria-label={`Open stage ${i + 1}: ${d.title} at ${d.organization}`}
          onClick={onOpen}
          onPointerEnter={() => onHover(true)}
          onPointerLeave={() => onHover(false)}
          onFocus={() => onHover(true)}
          onBlur={() => onHover(false)}
          className="absolute inset-0 cursor-pointer rounded-[22px] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#FF5B37]/50"
        />
      )}
    </div>
  )
}
