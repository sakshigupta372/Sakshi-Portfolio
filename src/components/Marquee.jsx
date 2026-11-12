import React from 'react'

const ITEMS = [
  'Multi-agent systems',
  'MCP servers',
  'RAG products',
  'LangGraph',
  'CrewAI',
  'FastAPI',
  'Gemini',
  'Autonomous backends',
]

const Row = ({ ariaHidden = false }) => (
  <div className="flex shrink-0 items-center gap-8 pr-8" aria-hidden={ariaHidden || undefined}>
    {ITEMS.map((item) => (
      <span key={item} className="flex items-center gap-8">
        <span className="font-display text-xl italic text-ink/70 sm:text-2xl">{item}</span>
        <span className="text-accent">●</span>
      </span>
    ))}
  </div>
)

const Marquee = () => {
  return (
    <div className="relative overflow-hidden border-b border-line py-5">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-paper to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-paper to-transparent" />
      <div className="flex w-max animate-marquee">
        <Row />
        <Row ariaHidden />
      </div>
    </div>
  )
}

export default Marquee
