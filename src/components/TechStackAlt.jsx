import React from 'react'

// ALTERNATIVE TECH STACK LAYOUTS
// Uncomment the one you want to use and replace TechStack.jsx content

// ====================================
// OPTION 1: MINIMAL GRID LAYOUT
// ====================================
export const TechStackGrid = () => {
  const skills = [
    'Python', 'JavaScript', 'SQL',
    'LangGraph', 'CrewAI', 'LangChain', 'AutoGen',
    'Multi-Agent Systems', 'RAG', 'MCP', 'Agent Orchestration',
    'OpenAI API', 'Groq API', 'Gemini Vision', 'PyTorch', 
    'Transformers', 'Hugging Face', 'NLP & LLM Integration',
    'FastAPI', 'Flask', 'Streamlit', 'Docker', 'Git & GitHub', 'PyPi SDK'
  ]

  return (
    <section id="stack" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold font-mono mb-4">
            Tech <span className="text-gradient">Stack</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {skills.map((skill, idx) => (
            <div
              key={idx}
              className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 text-center hover:border-white/40 hover:bg-white/10 transition-all duration-300"
            >
              <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                {skill}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ====================================
// OPTION 2: FLOATING CLOUDS LAYOUT
// ====================================
export const TechStackClouds = () => {
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
    { name: 'Git & GitHub', size: 'medium' }
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
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {skills.map((skill, idx) => (
            <span
              key={idx}
              className={`${sizeClasses[skill.size]} bg-white/5 backdrop-blur-sm border border-white/20 rounded-full font-medium text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/40 hover:scale-110 transition-all duration-300 cursor-default`}
            >
              {skill.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

// ====================================
// OPTION 3: COMPACT LIST LAYOUT
// ====================================
export const TechStackList = () => {
  const categories = [
    { title: 'Languages', skills: 'Python • JavaScript • SQL' },
    { title: 'Agentic AI', skills: 'LangGraph • CrewAI • LangChain • AutoGen' },
    { title: 'AI & Orchestration', skills: 'Multi-Agent Systems • RAG • MCP • Agent Orchestration' },
    { title: 'ML & APIs', skills: 'OpenAI API • Groq API • Gemini Vision • PyTorch • Transformers • Hugging Face • NLP' },
    { title: 'Backend & Tools', skills: 'FastAPI • Flask • Streamlit • Docker • Git & GitHub • PyPi SDK' }
  ]

  return (
    <section id="stack" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold font-mono mb-4">
            Tech <span className="text-gradient">Stack</span>
          </h2>
        </div>

        <div className="space-y-6">
          {categories.map((cat, idx) => (
            <div 
              key={idx} 
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/30 transition-all"
            >
              <h3 className="text-sm font-mono text-gray-400 uppercase mb-3">{cat.title}</h3>
              <p className="text-gray-300 leading-relaxed">{cat.skills}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// TO USE ANY OF THESE:
// 1. Copy the entire function you want (e.g., TechStackGrid)
// 2. Replace the content of TechStack.jsx with it
// 3. Rename the function to "TechStack" (remove Grid/Clouds/List suffix)
// 4. Make sure to keep: export default TechStack
