import React, { useEffect, useRef } from 'react'
import { FACES, PHOTO, releaseFaces, rig } from './config.js'
import { FaceEngine } from './engine.js'

/** Neutral time after a release before the face goes back to just watching the cursor. */
const HOLD_MS = 5000
const TEXTURE = 1024

function load(src) {
  return new Promise((resolve) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

/** Places a photo in the square the renderer works in. */
function compose(img) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = TEXTURE
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingQuality = 'high'
  const h = PHOTO.h * TEXTURE
  ctx.drawImage(img, PHOTO.x * TEXTURE, PHOTO.y * TEXTURE, (h * img.naturalWidth) / img.naturalHeight, h)
  return canvas
}

/** The disc takes the site's accent colour, stored as "r g b" in a CSS variable. */
const readAccent = () =>
  getComputedStyle(document.documentElement)
    .getPropertyValue('--accent')
    .trim()
    .split(/\s+/)
    .map((n) => Number(n) / 255)

/** Which face a grab pulls, by where it lands. */
function grabFace(u, v) {
  const side = Math.abs(u - 0.5)
  if (v < rig.hairLine || (side > rig.sides && v < rig.jaw)) return 'g_ouch'
  if (side > 0.06 && v > rig.cheekBand[0] && v < rig.cheekBand[1]) return 'g_squish'
  return 'g_grimace'
}

/**
 * Full-hero canvas plus a hit layer over the stage. The canvas never takes
 * pointer events, so the stretched face can spill over the copy without
 * blocking it; grabs only start on opaque pixels of the cut-out. `children`
 * are laid over the stage, above the face.
 */
export function FaceCanvas({ stageRef, onReady, onPull, children }) {
  const canvasRef = useRef(null)
  const hitRef = useRef(null)
  const overlayRef = useRef(null)
  const ringRef = useRef(null)
  const callbacks = useRef({})
  callbacks.current = { onReady, onPull }

  useEffect(() => {
    const canvas = canvasRef.current
    const hit = hitRef.current
    const ring = ringRef.current
    let engine = null
    let disposed = false
    const cleanups = []

    const stage = { x: 0, y: 0, size: 1 }
    let placed = ''
    // Runs every frame while on screen: the stage can move without resizing
    // (fonts loading, text reflowing), which no observer reports.
    const layout = () => {
      const s = stageRef.current
      if (!s) return
      const c = canvas.getBoundingClientRect()
      const r = s.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const key = [r.left - c.left, r.top - c.top, r.width, c.width, c.height, dpr].join()
      if (key !== placed) {
        placed = key
        Object.assign(stage, { x: r.left - c.left, y: r.top - c.top, size: r.width })
        for (const el of [hit, overlayRef.current]) {
          Object.assign(el.style, {
            left: `${stage.x}px`,
            top: `${stage.y}px`,
            width: `${stage.size}px`,
            height: `${stage.size}px`,
          })
        }
      }
      engine?.resize(c.width, c.height, dpr)
      engine?.setStage(stage)
    }

    ;(async () => {
      const keys = Object.keys(FACES)
      const loaded = await Promise.all(keys.map((k) => load(FACES[k])))
      if (disposed) return
      // Without the base photo or WebGL2 the plain image underneath stays.
      if (!loaded[keys.indexOf('base')]) return
      const images = new Map()
      keys.forEach((k, i) => loaded[i] && images.set(k, compose(loaded[i])))

      try {
        engine = new FaceEngine(canvas, images, 'base', readAccent(), layout)
      } catch (err) {
        console.warn('Face renderer unavailable', err)
        return
      }
      const e = engine
      layout()
      e.draw()
      e.start()
      e.warm()
      callbacks.current.onReady?.()

      // --- director -------------------------------------------------------
      let face = 'base'
      let mode = 'neutral'
      let afterAt = 0
      let pulls = 0
      let lastRelease = null
      let cursor = null
      const downs = new Map()

      // A missing grab face borrows the grimace; anything else falls back to base.
      const resolve = (k) =>
        images.has(k) ? k : k.startsWith('g_') && images.has('g_grimace') ? 'g_grimace' : 'base'
      const show = (k) => {
        face = resolve(k)
        e.setFace(face)
      }

      // Idle: the eyes follow the cursor; hovering the nose makes a cross-eyed face.
      const neutralFace = () => {
        if (!cursor) return 'base'
        const p = e.pick(cursor.x, cursor.y)
        if (p && Math.hypot(p.u - rig.nose.x, p.v - rig.nose.y) < rig.nose.r * 1.4) return 'x_cross'
        const dx = (cursor.x - (stage.x + stage.size / 2)) / stage.size
        if (dx < -0.42) return 'l_left'
        if (dx > 0.42) return 'l_right'
        return 'base'
      }

      const local = (ev) => {
        const c = canvas.getBoundingClientRect()
        return { x: ev.clientX - c.left, y: ev.clientY - c.top }
      }

      const setRing = (ev, over) => {
        if (ev.pointerType !== 'mouse') return
        ring.style.transform = `translate3d(${ev.clientX}px, ${ev.clientY}px, 0)`
        const on = over || e.held
        ring.dataset.on = on ? '1' : ''
        ring.dataset.held = e.held ? '1' : ''
        hit.style.cursor = on ? 'none' : ''
      }

      const onDown = (ev) => {
        if (ev.pointerType === 'mouse' && ev.button !== 0) return
        layout()
        const p = local(ev)
        const at = e.pick(p.x, p.y)
        if (!at) return
        ev.preventDefault()
        hit.setPointerCapture(ev.pointerId)
        e.grab(ev.pointerId, at.u, at.v, p.x, p.y)
        downs.set(ev.pointerId, { t: performance.now(), x: p.x, y: p.y, moved: 0, u: at.u, v: at.v })
        if (downs.size === 1) show(grabFace(at.u, at.v))
        mode = 'held'
        setRing(ev, true)
      }

      const onMove = (ev) => {
        const p = local(ev)
        const d = downs.get(ev.pointerId)
        if (d) {
          d.moved = Math.max(d.moved, Math.hypot(p.x - d.x, p.y - d.y))
          e.drag(ev.pointerId, p.x, p.y)
        }
        setRing(ev, !!e.pick(p.x, p.y))
      }

      const onUp = (ev) => {
        const d = downs.get(ev.pointerId)
        if (!d) return
        downs.delete(ev.pointerId)
        e.release(ev.pointerId)
        setRing(ev, !!e.pick(local(ev).x, local(ev).y))
        if (downs.size) return
        const tap = performance.now() - d.t < 240 && d.moved < 8
        if (tap) {
          e.poke(d.u, d.v)
          show('x_shock')
        } else {
          pulls += 1
          let next
          if (e.flush > 0.8) next = 'x_dizzy'
          else {
            const pool = releaseFaces.filter((k) => k !== lastRelease && images.has(k))
            next = pool.length ? pool[Math.floor(Math.random() * pool.length)] : 'base'
          }
          lastRelease = next
          show(next)
          callbacks.current.onPull?.(pulls)
        }
        mode = 'after'
        afterAt = performance.now()
      }

      // Touch: block the page scroll only when the finger lands on the face.
      const onTouchStart = (ev) => {
        const c = canvas.getBoundingClientRect()
        const t = ev.changedTouches[0]
        if (t && e.pick(t.clientX - c.left, t.clientY - c.top)) ev.preventDefault()
      }

      const onWindowMove = (ev) => {
        if (ev.pointerType !== 'mouse') return
        cursor = local(ev)
        if (mode === 'neutral') {
          const n = neutralFace()
          if (resolve(n) !== face) show(n)
        }
      }
      const onLeave = () => {
        ring.dataset.on = ''
      }

      hit.addEventListener('pointerdown', onDown)
      hit.addEventListener('pointermove', onMove)
      hit.addEventListener('pointerup', onUp)
      hit.addEventListener('pointercancel', onUp)
      hit.addEventListener('pointerleave', onLeave)
      hit.addEventListener('touchstart', onTouchStart, { passive: false })
      window.addEventListener('pointermove', onWindowMove, { passive: true })

      const timer = window.setInterval(() => {
        if (mode === 'after' && !e.held && performance.now() - afterAt > HOLD_MS) {
          mode = 'neutral'
          show(neutralFace())
        }
      }, 120)

      // Follow light/dark and accent colour changes.
      const theme = new MutationObserver(() => {
        e.discColor = readAccent()
      })
      theme.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-palette'] })

      // Only run the loop while the hero is on screen.
      const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? e.start() : e.stop()))
      io.observe(canvas)

      cleanups.push(() => {
        hit.removeEventListener('pointerdown', onDown)
        hit.removeEventListener('pointermove', onMove)
        hit.removeEventListener('pointerup', onUp)
        hit.removeEventListener('pointercancel', onUp)
        hit.removeEventListener('pointerleave', onLeave)
        hit.removeEventListener('touchstart', onTouchStart)
        window.removeEventListener('pointermove', onWindowMove)
        window.clearInterval(timer)
        theme.disconnect()
        io.disconnect()
        e.destroy()
      })
    })()

    const ro = new ResizeObserver(layout)
    ro.observe(canvas)
    if (stageRef.current) ro.observe(stageRef.current)
    document.fonts?.ready.then(() => !disposed && layout())

    return () => {
      disposed = true
      ro.disconnect()
      cleanups.forEach((f) => f())
    }
  }, [stageRef])

  return (
    <>
      <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 h-full w-full" />
      <div
        ref={hitRef}
        role="img"
        aria-label="Sakshi Gupta. Grab and stretch the photo."
        className="absolute z-30 select-none"
      />
      <div ref={overlayRef} className="pointer-events-none absolute z-40">
        {children}
      </div>
      <div ref={ringRef} aria-hidden="true" className="grab-ring" />
    </>
  )
}
