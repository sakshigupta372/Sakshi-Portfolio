import { useEffect } from 'react'

const ScrollAnimations = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.05,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in')
        }
      })
    }, observerOptions)

    // Observe all reveal variants
    const elements = document.querySelectorAll(
      '.scroll-reveal, .scroll-reveal-glass, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-pop'
    )
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return null
}

export default ScrollAnimations
