import React, { useEffect, useRef } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTime,
  useTransform,
} from 'framer-motion'
import { scrollToId } from './SmoothScroll'

// Tilt toward the cursor, in degrees at full deflection.
const TILT_X = 9
const TILT_Y = 11
// How far the photo slides inside the disc as the card tilts, in px.
const PHOTO_SHIFT = 9
const TILT_SPRING = { stiffness: 130, damping: 18, mass: 0.7 }

const RING_WORDS = ['Agentic AI', 'MCP servers', 'RAG pipelines', 'Multi-agent systems', 'LLM backends']
const RING_RADIUS = 91
const RING_LENGTH = Math.floor(2 * Math.PI * RING_RADIUS)
const RING_PATH = `M ${100 - RING_RADIUS},100 a ${RING_RADIUS},${RING_RADIUS} 0 1,1 ${RING_RADIUS * 2},0 a ${RING_RADIUS},${RING_RADIUS} 0 1,1 -${RING_RADIUS * 2},0`


const COLS = 32
const ROWS = 32
const SIZE = 1024
const MAX_PULL = SIZE * 0.1375
const GRAB_RADIUS = SIZE * 0.0875
const BLEED = 1.25 // px each warped triangle overlaps its neighbours, hides seams
const MOVED = 0.2 // px a mesh point must travel before its cells are redrawn

// Same pixels as profile-cutout.png; only the soft alpha edge is tightened so
// the hair doesn't carry a dark smudge onto the accent disc.
const PHOTO_SRC = '/profile-cutout-clean.webp'

// Everything below is in units of the square wrapper (0..1), so the resting
// <img>, the drag canvas, the disc and the clip all share one layout.
const IMG_ASPECT = 1024 / 819
const DISC = { cx: 0.5, cy: 0.5, r: 0.485 }
const FACE_U = 0.518 // horizontal centre of the face within the photo
const PHOTO_H = 1.08
const PHOTO = {
  x: DISC.cx - FACE_U * PHOTO_H * IMG_ASPECT,
  y: -0.06,
  w: PHOTO_H * IMG_ASPECT,
  h: PHOTO_H,
}

// Cheek centres as fractions of the photo itself.
const CHEEKS = [
  { u: 0.452, v: 0.472 },
  { u: 0.598, v: 0.466 },
]

const pct = (value) => `${value * 100}%`

// The photo is trimmed to the disc so its flat bottom edge follows the curve.
const CLIP = `circle(${pct(DISC.r - 0.002)} at ${pct(DISC.cx)} ${pct(DISC.cy)})`

const g = (x, mu, s) => Math.exp(-((x - mu) * (x - mu)) / (2 * s * s))

function cheekWeight(nx, ny) {
  const u = (nx - PHOTO.x) / PHOTO.w
  const v = (ny - PHOTO.y) / PHOTO.h
  let weight = 0
  for (const cheek of CHEEKS) {
    weight += g(u, cheek.u, 0.047) * g(v, cheek.v, 0.065)
  }
  return Math.min(1, weight)
}

function drawTexturedTriangle(ctx, img, x0, y0, x1, y1, x2, y2, u0, v0, u1, v1, u2, v2) {
  const denom = u0 * (v1 - v2) + u1 * (v2 - v0) + u2 * (v0 - v1)
  if (Math.abs(denom) < 1e-4) return

  // Only the clip grows; the mapping below stays exact, so the picture inside
  // each triangle lines up with its neighbours.
  const cx = (x0 + x1 + x2) / 3
  const cy = (y0 + y1 + y2) / 3
  const grow = (px, py) => {
    const ox = px - cx
    const oy = py - cy
    const len = Math.hypot(ox, oy) || 1
    return [px + (ox / len) * BLEED, py + (oy / len) * BLEED]
  }
  const [ax, ay] = grow(x0, y0)
  const [bx, by] = grow(x1, y1)
  const [ex, ey] = grow(x2, y2)

  ctx.save()
  ctx.beginPath()
  ctx.moveTo(ax, ay)
  ctx.lineTo(bx, by)
  ctx.lineTo(ex, ey)
  ctx.closePath()
  ctx.clip()

  const m11 = x0 * (v1 - v2) + x1 * (v2 - v0) + x2 * (v0 - v1)
  const m12 = x0 * (u2 - u1) + x1 * (u0 - u2) + x2 * (u1 - u0)
  const m21 = y0 * (v1 - v2) + y1 * (v2 - v0) + y2 * (v0 - v1)
  const m22 = y0 * (u2 - u1) + y1 * (u0 - u2) + y2 * (u1 - u0)
  const dx = x0 * (u1 * v2 - u2 * v1) + x1 * (u2 * v0 - u0 * v2) + x2 * (u0 * v1 - u1 * v0)
  const dy = y0 * (u1 * v2 - u2 * v1) + y1 * (u2 * v0 - u0 * v2) + y2 * (u0 * v1 - u1 * v0)

  ctx.transform(m11 / denom, m21 / denom, m12 / denom, m22 / denom, dx / denom, dy / denom)
  ctx.drawImage(img, 0, 0)
  ctx.restore()
}

const InteractivePortrait = () => {
  const canvasRef = useRef(null)
  const imgRef = useRef(null)
  const textureRef = useRef(null)
  const pointsRef = useRef([])
  const dragRef = useRef(null)
  const pullRef = useRef({ gx: 0, gy: 0, dx: 0, dy: 0, active: false })
  const rafRef = useRef(0)
  const startLoopRef = useRef(null)
  const rootRef = useRef(null)

  const reduceMotion = useReducedMotion()

  // Pointer position relative to the portrait's centre, -1..1 on each axis.
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const tiltX = useSpring(pointerX, TILT_SPRING)
  const tiltY = useSpring(pointerY, TILT_SPRING)
  const rotateY = useTransform(tiltX, (v) => v * TILT_Y)
  const rotateX = useTransform(tiltY, (v) => -v * TILT_X)
  const photoX = useTransform(tiltX, (v) => v * PHOTO_SHIFT)
  const photoY = useTransform(tiltY, (v) => v * PHOTO_SHIFT)

  // The ring drifts on its own and turns a little faster as the page scrolls.
  const time = useTime()
  const { scrollY } = useScroll()
  const ringRotate = useTransform([time, scrollY], ([t, s]) => (reduceMotion ? 0 : t * 0.008) + s * 0.08)

  useEffect(() => {
    if (reduceMotion) return

    const clamp = (v) => Math.max(-1, Math.min(1, v))

    const onMove = (event) => {
      // Touch has no hover, and the card holds still while a cheek is pulled.
      if (event.pointerType !== 'mouse' || dragRef.current) return
      const root = rootRef.current
      if (!root) return
      const rect = root.getBoundingClientRect()
      const reach = rect.width * 1.1
      pointerX.set(clamp((event.clientX - (rect.left + rect.width / 2)) / reach))
      pointerY.set(clamp((event.clientY - (rect.top + rect.height / 2)) / reach))
    }

    const reset = () => {
      pointerX.set(0)
      pointerY.set(0)
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('blur', reset)
    document.documentElement.addEventListener('mouseleave', reset)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('blur', reset)
      document.documentElement.removeEventListener('mouseleave', reset)
    }
  }, [reduceMotion, pointerX, pointerY])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    canvas.width = SIZE
    canvas.height = SIZE

    const cols = COLS
    const rows = ROWS
    const points = []
    for (let y = 0; y <= rows; y++) {
      for (let x = 0; x <= cols; x++) {
        const nx = x / cols
        const ny = y / rows
        points.push({
          nx,
          ny,
          restX: nx * SIZE,
          restY: ny * SIZE,
          x: nx * SIZE,
          y: ny * SIZE,
        })
      }
    }
    pointsRef.current = points

    const img = new Image()
    img.src = PHOTO_SRC
    img.onload = () => {
      const tex = document.createElement('canvas')
      tex.width = SIZE
      tex.height = SIZE
      const tctx = tex.getContext('2d')
      tctx.drawImage(img, PHOTO.x * SIZE, PHOTO.y * SIZE, PHOTO.w * SIZE, PHOTO.h * SIZE)
      textureRef.current = tex
    }

    const idx = (x, y) => y * (cols + 1) + x

    const tick = () => {
      const tex = textureRef.current
      const pts = pointsRef.current
      const pull = pullRef.current
      const photo = imgRef.current

      ctx.clearRect(0, 0, SIZE, SIZE)

      if (!pull.active || !tex) {
        if (photo) photo.style.opacity = '1'
        // Idle: stop the loop until the next drag instead of redrawing every frame.
        if (!pull.active) {
          rafRef.current = 0
          return
        }
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      if (photo) photo.style.opacity = '0'

      for (const p of pts) {
        const ddx = p.restX - pull.gx
        const ddy = p.restY - pull.gy
        const w =
          Math.exp(-(ddx * ddx + ddy * ddy) / (2 * GRAB_RADIUS * GRAB_RADIUS)) * cheekWeight(p.nx, p.ny)
        p.x = p.restX + pull.dx * w
        p.y = p.restY + pull.dy * w
        p.moved = Math.abs(pull.dx * w) + Math.abs(pull.dy * w) > MOVED
      }

      // The untouched photo goes down first; only the cells around the pulled
      // cheek are cut out and redrawn stretched.
      ctx.drawImage(tex, 0, 0)

      const warped = []
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const p00 = pts[idx(x, y)]
          const p10 = pts[idx(x + 1, y)]
          const p01 = pts[idx(x, y + 1)]
          const p11 = pts[idx(x + 1, y + 1)]
          if (!(p00.moved || p10.moved || p01.moved || p11.moved)) continue
          ctx.clearRect(p00.restX, p00.restY, p11.restX - p00.restX, p11.restY - p00.restY)
          warped.push([p00, p10, p01, p11])
        }
      }

      for (const [p00, p10, p01, p11] of warped) {
        drawTexturedTriangle(
          ctx, tex,
          p00.x, p00.y, p10.x, p10.y, p01.x, p01.y,
          p00.restX, p00.restY, p10.restX, p10.restY, p01.restX, p01.restY
        )
        drawTexturedTriangle(
          ctx, tex,
          p10.x, p10.y, p11.x, p11.y, p01.x, p01.y,
          p10.restX, p10.restY, p11.restX, p11.restY, p01.restX, p01.restY
        )
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    // Lets the pointer handlers wake the loop up when a drag starts.
    startLoopRef.current = () => {
      if (!rafRef.current) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
      startLoopRef.current = null
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const toLocal = (event) => {
      const rect = canvas.getBoundingClientRect()
      return {
        x: ((event.clientX - rect.left) / rect.width) * SIZE,
        y: ((event.clientY - rect.top) / rect.height) * SIZE,
      }
    }

    const onDisc = (x, y) => {
      const dx = x - SIZE * DISC.cx
      const dy = y - SIZE * DISC.cy
      const r = SIZE * DISC.r
      return dx * dx + dy * dy <= r * r
    }

    const onPointerDown = (event) => {
      const pos = toLocal(event)
      if (!onDisc(pos.x, pos.y)) return
      event.preventDefault()
      try {
        canvas.setPointerCapture(event.pointerId)
      } catch {
        /* ignore */
      }
      dragRef.current = { startX: pos.x, startY: pos.y }
      pullRef.current = { gx: pos.x, gy: pos.y, dx: 0, dy: 0, active: true }
      startLoopRef.current?.()
    }

    const onPointerMove = (event) => {
      const drag = dragRef.current
      if (!drag) return
      const pos = toLocal(event)
      let dx = pos.x - drag.startX
      let dy = pos.y - drag.startY
      const dist = Math.hypot(dx, dy)
      if (dist > MAX_PULL) {
        dx = (dx / dist) * MAX_PULL
        dy = (dy / dist) * MAX_PULL
      }
      pullRef.current = { gx: drag.startX, gy: drag.startY, dx, dy, active: true }
    }

    const endDrag = () => {
      if (!dragRef.current) return
      dragRef.current = null
      pullRef.current = { gx: 0, gy: 0, dx: 0, dy: 0, active: false }
    }

    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', endDrag)
    canvas.addEventListener('pointercancel', endDrag)
    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', endDrag)
      canvas.removeEventListener('pointercancel', endDrag)
    }
  }, [])

  const openProjects = (event) => {
    event.preventDefault()
    scrollToId('projects')
  }

  return (
    <div ref={rootRef} className="relative aspect-square w-full" style={{ perspective: 1100 }}>
      {/* Everything inside tilts as one card; each layer sits at its own depth. */}
      <motion.div className="absolute inset-0" style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}>
        {/* Back layer: text ring turning around the disc */}
        <div className="pointer-events-none absolute inset-0" style={{ transform: 'translateZ(-40px)' }} aria-hidden="true">
          <motion.svg viewBox="0 0 200 200" className="h-full w-full overflow-visible" style={{ rotate: ringRotate }}>
            <defs>
              <path id="portrait-ring" d={RING_PATH} />
            </defs>
            <text
              className="font-mono uppercase"
              fontSize="5.2"
              style={{ fill: 'rgb(var(--ink) / 0.6)' }}
              textLength={RING_LENGTH}
              lengthAdjust="spacing"
            >
              <textPath href="#portrait-ring" textLength={RING_LENGTH} lengthAdjust="spacing">
                {[0, 1].map((round) =>
                  RING_WORDS.map((word) => (
                    <React.Fragment key={`${round}-${word}`}>
                      {word}
                      <tspan style={{ fill: 'rgb(var(--accent))' }}>
                        {' ✦ '}
                      </tspan>
                    </React.Fragment>
                  ))
                )}
              </textPath>
            </text>
          </motion.svg>
        </div>

        <div className="absolute inset-[8%]" style={{ transformStyle: 'preserve-3d' }}>
          <div
            className="absolute rounded-full bg-accent"
            style={{
              left: pct(DISC.cx - DISC.r),
              top: pct(DISC.cy - DISC.r),
              width: pct(DISC.r * 2),
              height: pct(DISC.r * 2),
            }}
          />

          {/* The clip stays locked to the disc; the photo slides a little inside it.
              No transform on this layer: Chrome drops the clip if it has one here. */}
          <div className="absolute inset-0" style={{ clipPath: CLIP }}>
            <motion.div className="absolute inset-0" style={{ x: photoX, y: photoY }}>
              <img
                ref={imgRef}
                src={PHOTO_SRC}
                alt="Sakshi Gupta"
                draggable={false}
                fetchpriority="high"
                decoding="async"
                className="pointer-events-none absolute max-w-none select-none"
                style={{
                  left: pct(PHOTO.x),
                  top: pct(PHOTO.y),
                  width: pct(PHOTO.w),
                  height: pct(PHOTO.h),
                }}
              />

              <canvas
                ref={canvasRef}
                width={SIZE}
                height={SIZE}
                className="absolute inset-0 h-full w-full cursor-grab touch-none select-none active:cursor-grabbing"
                aria-label="Portrait — drag a cheek"
              />
            </motion.div>
          </div>

          {/* Front layer: speech bubble */}
          <div className="pointer-events-none absolute inset-0" style={{ transform: 'translateZ(75px)' }}>
            <a
              href="#projects"
              onClick={openProjects}
              className="pointer-events-auto absolute -right-[5%] -top-[3%] w-[10.75rem] origin-top-right rotate-[3deg] scale-[0.8] rounded-[6px] border-[3px] border-ink bg-accent px-3.5 py-2.5 text-accent-fg shadow-[4px_4px_0_rgb(var(--ink))] transition-transform duration-200 hover:-translate-y-0.5 sm:-right-[7%] sm:top-[5%] sm:scale-100"
            >
              <span className="block font-sans text-[10px] font-extrabold uppercase leading-none tracking-[0.16em]">
                Pssst.
              </span>
              <span className="mt-1.5 block font-sans text-[17px] font-black leading-none tracking-tight">
                View my work →
              </span>
              <span
                className="absolute -bottom-[9px] left-6 h-0 w-0"
                style={{
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderTop: '10px solid rgb(var(--ink))',
                }}
              />
              <span
                className="absolute -bottom-[5px] left-[26px] h-0 w-0"
                style={{
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderTop: '8px solid rgb(var(--accent))',
                }}
              />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default InteractivePortrait
