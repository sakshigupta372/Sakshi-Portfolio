import React, { useEffect, useRef, useState } from 'react'

/**
 * Shows a fixed-size widget scaled to the width available. Below `min` pixels it
 * would be unreadable, so the plain `fallback` is shown instead. With `whenNear`
 * the widget only runs while it is close to the screen.
 */
const ScaledStage = ({ width, height, min, fallback, whenNear = false, bleed = 0, className = '', children }) => {
  const box = useRef(null)
  const [scale, setScale] = useState(null)
  const [near, setNear] = useState(!whenNear)

  useEffect(() => {
    const el = box.current
    const fit = () => {
      const w = el.clientWidth
      setScale(w >= min ? Math.min(1, (w - bleed * 2) / width) : 0)
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [width, min, bleed])

  useEffect(() => {
    if (!whenNear) return undefined
    const io = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), { rootMargin: '150px 0px' })
    io.observe(box.current)
    return () => io.disconnect()
  }, [whenNear])

  return (
    <div ref={box} className="w-full">
      {scale === 0 ? (
        fallback
      ) : scale ? (
        <div className={className} style={{ padding: `${bleed}px 0` }}>
          <div className="relative mx-auto" style={{ width: width * scale, height: height * scale }}>
            <div className="absolute left-0 top-0" style={{ width, height, transform: `scale(${scale})`, transformOrigin: 'top left' }}>
              {near ? children : null}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ height: height * 0.8 }} />
      )}
    </div>
  )
}

export default ScaledStage
