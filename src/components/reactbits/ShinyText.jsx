import React from 'react'

const ShinyText = ({
  text = '',
  className = '',
  shimmerWidth = 100,
  speed = 3,
}) => {
  return (
    <span
      className={`inline-block bg-clip-text text-transparent bg-no-repeat ${className}`}
      style={{
        backgroundImage: `linear-gradient(120deg, rgba(255,255,255,0.4) 40%, rgba(255,255,255,1) 50%, rgba(255,255,255,0.4) 60%)`,
        backgroundSize: `${shimmerWidth}% 100%`,
        animation: `shiny-text ${speed}s linear infinite`,
        WebkitBackgroundClip: 'text',
      }}
    >
      {text}
    </span>
  )
}

export default ShinyText
