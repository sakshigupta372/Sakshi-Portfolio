import React from 'react'

const TechStack = () => {
  const skills = [
    { name: 'Python', size: 'large' },
    { name: 'JavaScript', size: 'medium' },
    { name: 'LangGraph', size: 'large' },
    { name: 'CrewAI', size: 'medium' },
    { name: 'LangChain', size: 'large' },
    { name: 'AutoGen', size: 'small' },
    { name: 'Multi-Agent Systems', size: 'large' },
    { name: 'RAG', size: 'small' },
    { name: 'MCP', size: 'small' },
    { name: 'OpenAI API', size: 'large' },
    { name: 'Groq API', size: 'medium' },
    { name: 'PyTorch', size: 'large' },
    { name: 'Transformers', size: 'medium' },
    { name: 'Hugging Face', size: 'medium' },
    { name: 'FastAPI', size: 'large' },
    { name: 'Flask', size: 'medium' },
    { name: 'Streamlit', size: 'medium' },
    { name: 'Docker', size: 'large' },
    { name: 'SQL', size: 'small' },
    { name: 'Git & GitHub', size: 'medium' },
    { name: 'Gemini Vision', size: 'medium' },
    { name: 'NLP & LLM Integration', size: 'large' },
    { name: 'PyPi SDK', size: 'small' },
    { name: 'Agent Orchestration', size: 'medium' }
  ]

  const sizeClasses = {
    small: 'px-4 py-2 text-xs',
    medium: 'px-5 py-2.5 text-sm',
    large: 'px-6 py-3 text-base'
  }

  return (
    <section id="stack" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold font-mono mb-4">
            Tech <span className="text-gradient">Stack</span>
          </h2>
          <p className="text-gray-400 text-lg">Tools and technologies I work with</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {skills.map((skill, idx) => (
            <span
              key={idx}
              className={`${sizeClasses[skill.size]} bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border border-white/30 rounded-full font-medium text-gray-300 hover:text-white hover:bg-white/15 hover:border-white/50 hover:scale-110 hover:shadow-lg hover:shadow-white/20 transition-all duration-300 cursor-default`}
            >
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TechStack
