import React from 'react'

const Aurora = ({ className = '' }) => {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div
        className="absolute -top-[40%] -left-[20%] w-[140%] h-[140%] opacity-30"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 40%, rgba(120, 80, 255, 0.15), transparent),
            radial-gradient(ellipse 60% 40% at 70% 60%, rgba(59, 130, 246, 0.1), transparent),
            radial-gradient(ellipse 50% 30% at 50% 30%, rgba(168, 85, 247, 0.08), transparent)
          `,
          animation: 'aurora-drift 12s ease-in-out infinite alternate',
        }}
      />
      <div
        className="absolute -bottom-[30%] -right-[20%] w-[120%] h-[120%] opacity-20"
        style={{
          background: `
            radial-gradient(ellipse 70% 40% at 80% 50%, rgba(34, 211, 238, 0.12), transparent),
            radial-gradient(ellipse 50% 30% at 30% 70%, rgba(139, 92, 246, 0.08), transparent)
          `,
          animation: 'aurora-drift 15s ease-in-out infinite alternate-reverse',
        }}
      />
    </div>
  )
}

export default Aurora
