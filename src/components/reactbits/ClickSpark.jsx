import React, { useRef, useCallback } from 'react'

const ClickSpark = ({ children, sparkColor = '#ffffff', sparkCount = 8, sparkSize = 10, duration = 600 }) => {
  const containerRef = useRef(null)

  const createSpark = useCallback((x, y) => {
    const container = containerRef.current
    if (!container) return

    for (let i = 0; i < sparkCount; i++) {
      const spark = document.createElement('div')
      const angle = (360 / sparkCount) * i
      const velocity = 30 + Math.random() * 40
      const rad = (angle * Math.PI) / 180
      const tx = Math.cos(rad) * velocity
      const ty = Math.sin(rad) * velocity

      spark.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: ${sparkSize * (0.5 + Math.random() * 0.5)}px;
        height: ${sparkSize * (0.5 + Math.random() * 0.5)}px;
        background: ${sparkColor};
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        opacity: 1;
        transform: translate(-50%, -50%);
        transition: all ${duration}ms cubic-bezier(0.22, 1, 0.36, 1);
      `

      document.body.appendChild(spark)

      requestAnimationFrame(() => {
        spark.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`
        spark.style.opacity = '0'
      })

      setTimeout(() => {
        if (spark.parentNode) spark.parentNode.removeChild(spark)
      }, duration)
    }
  }, [sparkColor, sparkCount, sparkSize, duration])

  const handleClick = (e) => {
    createSpark(e.clientX, e.clientY)
  }

  return (
    <div ref={containerRef} onClick={handleClick} style={{ display: 'contents' }}>
      {children}
    </div>
  )
}

export default ClickSpark
