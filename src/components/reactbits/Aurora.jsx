import React from 'react'

const Aurora = ({ className = '' }) => {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div
        className="absolute -top-[40%] -left-[20%] w-[140%] h-[140%] opacity-40"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 40%, rgba(255, 90, 0, 0.16), transparent),
            radial-gradient(ellipse 60% 40% at 70% 60%, rgba(255, 143, 74, 0.10), transparent),
            radial-gradient(ellipse 50% 30% at 50% 30%, rgba(255, 154, 82, 0.08), transparent)
          `,
          animation: 'aurora-drift 12s ease-in-out infinite alternate',
        }}
      />
      <div
        className="absolute -bottom-[30%] -right-[20%] w-[120%] h-[120%] opacity-30"
        style={{
          background: `
            radial-gradient(ellipse 70% 40% at 80% 50%, rgba(255, 122, 51, 0.12), transparent),
            radial-gradient(ellipse 50% 30% at 30% 70%, rgba(255, 176, 122, 0.08), transparent)
          `,
          animation: 'aurora-drift 15s ease-in-out infinite alternate-reverse',
        }}
      />
    </div>
  )
}

export default Aurora
