import React, { useEffect, useRef } from 'react'

// Full-page background: a slow-drifting network of nodes. Messages travel
// along the links like agents handing off work; a few ringed "hub" nodes
// attract more of the traffic. Colors follow the theme and accent palette.
//
// Kept light on purpose: node count scales with screen size, the pixel ratio
// is capped, it pauses when the tab is hidden, and reduced-motion users get
// a single still frame.

const LINK_DIST = 150
const PULSE_EVERY_MS = 650
const PULSE_SPEED = 0.0016 // fraction of a link per ms

function readColors() {
  const s = getComputedStyle(document.documentElement)
  const rgb = (name) => s.getPropertyValue(name).trim().split(/\s+/).join(',')
  return {
    accent: rgb('--accent'),
    ink: rgb('--ink'),
    dark: document.documentElement.classList.contains('dark'),
  }
}

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

const AmbientBackground = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return undefined

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let w = 0
    let h = 0
    let nodes = []
    let pulses = []
    let colors = readColors()
    const mouse = { x: -9999, y: -9999 }
    let raf = 0
    let last = performance.now()
    let sincePulse = 0

    const seed = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.round(Math.min(70, Math.max(24, (w * h) / 26000)))
      const hubCount = w < 640 ? 5 : 9
      nodes = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: Math.random() * 1.4 + 0.8,
        glow: 0,
        hub: i < hubCount,
      }))
      pulses = []
    }

    const neighbours = (i, pos) => {
      const out = []
      for (let j = 0; j < nodes.length; j++) {
        if (j === i) continue
        const dx = pos[i].x - pos[j].x
        const dy = pos[i].y - pos[j].y
        if (dx * dx + dy * dy < LINK_DIST * LINK_DIST) out.push(j)
      }
      return out
    }

    // Prefer handing a message to a hub when one is in reach.
    const chooseNext = (options) => {
      const hubs = options.filter((k) => nodes[k].hub)
      return hubs.length && Math.random() < 0.6 ? pick(hubs) : pick(options)
    }

    const frame = (now) => {
      const dt = Math.min(now - last, 50)
      last = now
      const { accent, ink, dark } = colors
      const lineAlpha = dark ? 0.16 : 0.11
      const nodeAlpha = dark ? 0.45 : 0.32

      // Scroll parallax: the field moves at a fraction of scroll speed.
      const shift = (window.scrollY * 0.12) % h

      ctx.clearRect(0, 0, w, h)

      const pos = nodes.map((n) => {
        n.x += n.vx * dt * 0.06
        n.y += n.vy * dt * 0.06
        if (n.x < -20) n.x = w + 20
        if (n.x > w + 20) n.x = -20
        if (n.y < -20) n.y = h + 20
        if (n.y > h + 20) n.y = -20
        const x = n.x
        let y = n.y - shift
        if (y < -20) y += h + 40
        // gentle pull toward the cursor
        const dx = mouse.x - x
        const dy = mouse.y - y
        const d2 = dx * dx + dy * dy
        const pull = d2 < 180 * 180 ? (1 - Math.sqrt(d2) / 180) * 18 : 0
        const d = Math.sqrt(d2) || 1
        return { x: x + (dx / d) * pull, y: y + (dy / d) * pull }
      })

      // links
      ctx.lineWidth = 1
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = pos[i].x - pos[j].x
          const dy = pos[i].y - pos[j].y
          const d2 = dx * dx + dy * dy
          if (d2 > LINK_DIST * LINK_DIST) continue
          const a = (1 - Math.sqrt(d2) / LINK_DIST) * lineAlpha
          ctx.strokeStyle = `rgba(${ink},${a})`
          ctx.beginPath()
          ctx.moveTo(pos[i].x, pos[i].y)
          ctx.lineTo(pos[j].x, pos[j].y)
          ctx.stroke()
        }
        // links to the cursor, in the accent color
        const mx = pos[i].x - mouse.x
        const my = pos[i].y - mouse.y
        const md2 = mx * mx + my * my
        if (md2 < 170 * 170) {
          ctx.strokeStyle = `rgba(${accent},${(1 - Math.sqrt(md2) / 170) * 0.35})`
          ctx.beginPath()
          ctx.moveTo(pos[i].x, pos[i].y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.stroke()
        }
      }

      // spawn a message between two linked nodes
      if (!reduce) {
        sincePulse += dt
        if (sincePulse > PULSE_EVERY_MS && pulses.length < 6) {
          sincePulse = 0
          const from = Math.floor(Math.random() * nodes.length)
          const options = neighbours(from, pos)
          if (options.length) pulses.push({ from, to: chooseNext(options), t: 0, hops: 2 })
        }
      }

      // move messages; on arrival, light up the node and maybe hop onward
      const next = []
      for (const p of pulses) {
        p.t += dt * PULSE_SPEED
        const a = pos[p.from]
        const b = pos[p.to]
        if (p.t >= 1) {
          nodes[p.to].glow = 1
          if (p.hops > 0) {
            const options = neighbours(p.to, pos).filter((k) => k !== p.from)
            if (options.length) next.push({ from: p.to, to: chooseNext(options), t: 0, hops: p.hops - 1 })
          }
          continue
        }
        const dx = b.x - a.x
        const dy = b.y - a.y
        if (dx * dx + dy * dy > (LINK_DIST * 1.4) ** 2) continue // link broke apart
        ctx.strokeStyle = `rgba(${accent},0.55)`
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.moveTo(a.x + dx * Math.max(0, p.t - 0.25), a.y + dy * Math.max(0, p.t - 0.25))
        ctx.lineTo(a.x + dx * p.t, a.y + dy * p.t)
        ctx.stroke()
        ctx.fillStyle = `rgba(${accent},0.95)`
        ctx.beginPath()
        ctx.arc(a.x + dx * p.t, a.y + dy * p.t, 2, 0, Math.PI * 2)
        ctx.fill()
        next.push(p)
      }
      pulses = next

      // nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        const { x, y } = pos[i]
        if (n.glow > 0.02) {
          ctx.fillStyle = `rgba(${accent},${n.glow * 0.25})`
          ctx.beginPath()
          ctx.arc(x, y, n.r + 8 * n.glow, 0, Math.PI * 2)
          ctx.fill()
          n.glow *= 0.94
        }
        if (n.hub) {
          // hubs: a slightly larger dot with a ring
          ctx.strokeStyle = `rgba(${accent},0.35)`
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.arc(x, y, 5, 0, Math.PI * 2)
          ctx.stroke()
          ctx.fillStyle = `rgba(${accent},0.85)`
          ctx.beginPath()
          ctx.arc(x, y, 2.2, 0, Math.PI * 2)
          ctx.fill()
        } else {
          ctx.fillStyle = n.glow > 0.1 ? `rgba(${accent},0.9)` : `rgba(${ink},${nodeAlpha})`
          ctx.beginPath()
          ctx.arc(x, y, n.r, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      if (!reduce) raf = requestAnimationFrame(frame)
    }

    const start = () => {
      cancelAnimationFrame(raf)
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }

    seed()
    start()

    let resizeTimer
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        seed()
        if (reduce) start()
      }, 150)
    }
    const onMove = (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    const onLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
    }
    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(raf)
      else if (!reduce) start()
    }

    // Re-read colors when the theme or accent palette changes.
    const observer = new MutationObserver(() => {
      colors = readColors()
      if (reduce) start()
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-palette'] })

    window.addEventListener('resize', onResize)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(resizeTimer)
      observer.disconnect()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* two soft accent glows drifting behind the network */}
      <div
        className="absolute -left-[15%] -top-[20%] h-[55vmax] w-[55vmax] animate-blob rounded-full opacity-[0.10] blur-3xl dark:opacity-[0.14]"
        style={{ background: 'radial-gradient(circle, rgb(var(--accent)) 0%, transparent 65%)' }}
      />
      <div
        className="absolute -bottom-[25%] -right-[15%] h-[50vmax] w-[50vmax] animate-blob rounded-full opacity-[0.08] blur-3xl dark:opacity-[0.12]"
        style={{
          background: 'radial-gradient(circle, rgb(var(--accent)) 0%, transparent 65%)',
          animationDelay: '-9s',
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}

export default AmbientBackground
