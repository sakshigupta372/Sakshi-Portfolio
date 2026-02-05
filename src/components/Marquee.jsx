import React from 'react'

const Marquee = () => {
  const skills = [
    'Python',
    'JavaScript',
    'SQL',
    'LangGraph',
    'CrewAI',
    'LangChain',
    'AutoGen',
    'Multi-Agent Systems',
    'RAG',
    'MCP',
    'OpenAI API',
    'Groq API',
    'Gemini Vision',
    'PyTorch',
    'Transformers',
    'Hugging Face',
    'FastAPI',
    'Flask',
    'Streamlit',
    'Docker',
    'Git & GitHub',
    'Raspberry Pi',
    'NLP',
    'AI Agents',
    'Agentic AI'
  ]

  return (
    <div className="py-12 overflow-hidden bg-dark-secondary border-y border-white/10">
      <div className="relative flex">
        <div className="flex space-x-8 animate-marquee whitespace-nowrap">
          {[...skills, ...skills].map((skill, index) => (
            <div
              key={index}
              className="inline-flex items-center px-6 py-3 bg-dark border border-white/30 rounded-full text-white font-mono text-sm font-semibold"
            >
              {skill}
            </div>
          ))}
        </div>
        <div className="absolute flex space-x-8 animate-marquee whitespace-nowrap" aria-hidden="true">
          {[...skills, ...skills].map((skill, index) => (
            <div
              key={index}
              className="inline-flex items-center px-6 py-3 bg-dark border border-white/30 rounded-full text-white font-mono text-sm font-semibold"
            >
              {skill}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Marquee
