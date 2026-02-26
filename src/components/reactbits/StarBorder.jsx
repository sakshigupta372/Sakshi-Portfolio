import React from 'react'

const StarBorder = ({
  children,
  className = '',
  color = 'white',
  speed = 6,
}) => {
  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className="absolute inset-0 rounded-[inherit] overflow-hidden"
        style={{ padding: '1px' }}
      >
        <div
          className="absolute inset-[-100%] rounded-[inherit]"
          style={{
            background: `conic-gradient(from 0deg, transparent 0%, ${color} 10%, transparent 20%)`,
            animation: `star-rotate ${speed}s linear infinite`,
          }}
        />
      </div>
      <div className="relative bg-black rounded-[inherit]">
        {children}
      </div>
    </div>
  )
}

export default StarBorder
