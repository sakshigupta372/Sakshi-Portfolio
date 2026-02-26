import React from 'react'

const GradientText = ({
  children,
  className = '',
  colors = ['#ffffff', '#a855f7', '#3b82f6', '#ffffff'],
  speed = 8,
  animateOnHover = false,
}) => {
  const gradientStyle = {
    backgroundImage: `linear-gradient(90deg, ${colors.join(', ')})`,
    backgroundSize: '300% 100%',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: animateOnHover ? 'none' : `gradient-flow ${speed}s linear infinite`,
  }

  return (
    <span
      className={`inline-block ${className}`}
      style={gradientStyle}
      onMouseEnter={(e) => {
        if (animateOnHover) {
          e.currentTarget.style.animation = `gradient-flow ${speed}s linear infinite`
        }
      }}
      onMouseLeave={(e) => {
        if (animateOnHover) {
          e.currentTarget.style.animation = 'none'
        }
      }}
    >
      {children}
    </span>
  )
}

export default GradientText
