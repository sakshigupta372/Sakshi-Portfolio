import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, ExternalLink, Github } from 'lucide-react'
import GradientText from './reactbits/GradientText'
import ShinyText from './reactbits/ShinyText'

const isGithubUrl = (url) => typeof url === 'string' && url.includes('github.com')

const PROJECTS = [
  {
    id: 1,
    title: 'NEXUS.AI – AI Interview Simulation Platform',
    impact: 'Cuts interview prep time with adaptive Gemini feedback across technical, HR, and system-design rounds.',
    description: 'Agentic AI interview platform with adaptive questions and real-time evaluation.',
    image: '/projects/nexus.jpg',
    bgColor: 'bg-indigo-500/10',
    demoLink: 'https://ai-interview-platform-one-wine.vercel.app',
    githubLink: 'https://github.com/sakshigupta372/ai-interview-platform',
    tags: ['Next.js', 'Node.js', 'Gemini'],
    gradient: 'from-indigo-500 to-purple-500',
    featured: true,
  },
  {
    id: 2,
    title: 'Multi-Tenant LLM Gateway',
    impact: 'Tracks LLM cost per tenant with caching, rate limits, and intelligent provider routing.',
    description: 'Production AI gateway with auth, routing, semantic caching, and cost tracking.',
    image: '/projects/llm-gateway.jpg',
    bgColor: 'bg-teal-500/10',
    demoLink: 'https://multi-tenant-llm-gateway.vercel.app',
    githubLink: 'https://github.com/sakshigupta372/Multi-Tenant-LLM-Gateway',
    tags: ['FastAPI', 'Next.js', 'SQLite'],
    gradient: 'from-teal-500 to-cyan-500',
    featured: true,
  },
  {
    id: 3,
    title: 'Health Diagnosis System',
    impact: 'Speeds clinical triage with a crew of specialized AI agents and Gemini Vision analysis.',
    description: 'Multi-agent clinical decision support with medical image analysis.',
    image: '/projects/health-diagnosis.jpg',
    bgColor: 'bg-blue-500/10',
    demoLink: null,
    githubLink: 'https://github.com/sakshigupta372/Health_Diagnosis_System',
    tags: ['Crew AI', 'Gemini', 'Streamlit'],
    gradient: 'from-blue-500 to-purple-500',
  },
  {
    id: 4,
    title: 'AI Agent Observatory — Interactive 3D Observability & Debugging for AI Agents',
    impact: 'Lets developers watch agent execution, tool calls, and memory retrieval unfold in real-time 3D.',
    description: 'Interactive 3D platform for inspecting agent execution traces and failure points.',
    image: '/projects/ai-agent-observatory.jpg',
    bgColor: 'bg-fuchsia-500/10',
    demoLink: 'https://ai-agent-observatory.onrender.com/',
    githubLink: 'https://github.com/sakshigupta372/ai-agent-observatory',
    tags: ['Three.js', 'Astro', 'pgvector'],
    gradient: 'from-fuchsia-500 to-rose-500',
  },
  {
    id: 5,
    title: 'RAG Chatbot',
    impact: 'Answers site questions from your own content — privacy-first RAG, no generic chat fluff.',
    description: 'Privacy-first RAG chatbot powered by Gemini 2.5 Pro and embeddings.',
    image: '/projects/compliledger.jpg',
    bgColor: 'bg-violet-500/10',
    demoLink: 'https://compliagent.vercel.app',
    githubLink: 'https://github.com/sakshigupta372',
    tags: ['RAG', 'Gemini', 'LangChain'],
    gradient: 'from-violet-500 to-fuchsia-500',
  },
  {
    id: 6,
    title: 'Audit-AI',
    impact: 'Turns messy website audits into clear PDF reports covering a11y, mobile, and AI analysis.',
    description: 'AI website auditor with Gradio UI and downloadable PDF reports.',
    image: '/projects/audit-ai.jpg',
    bgColor: 'bg-orange-500/10',
    demoLink: 'https://auditai-2d83.onrender.com',
    githubLink: 'https://github.com/sakshigupta372/AuditAI',
    tags: ['Python', 'Gradio', 'Gemini'],
    gradient: 'from-orange-500 to-red-500',
  },
  {
    id: 7,
    title: 'HireBoard-AI',
    impact: 'Connects seekers and recruiters on one AI-assisted hiring workflow — less back-and-forth.',
    description: 'AI hiring platform with FastAPI backend and Next.js frontend.',
    image: '/projects/hireboard.jpg',
    bgColor: 'bg-cyan-500/10',
    demoLink: 'https://frontend-chi-blush.vercel.app/',
    githubLink: 'https://github.com/sakshigupta372/HireBoard-AI',
    tags: ['FastAPI', 'Next.js', 'TypeScript'],
    gradient: 'from-cyan-500 to-blue-500',
  },
]

function ProjectImage({ project, className = '' }) {
  const [src, setSrc] = useState(project.image)

  const handleError = () => setSrc(null)

  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br ${project.gradient} opacity-40 ${className}`}>
        <span className="px-4 text-center text-sm font-mono text-white/80">{project.title}</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={`${project.title} product screenshot`}
      className={`w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-500 ${className}`}
      onError={handleError}
      loading="lazy"
    />
  )
}

function ProjectActions({ project, size = 'default' }) {
  const hasLiveDemo = Boolean(project.demoLink) && !isGithubUrl(project.demoLink)
  const btn =
    size === 'large'
      ? 'px-4 py-2.5 text-sm'
      : 'px-3 py-2 text-xs sm:text-sm'

  return (
    <div className="flex gap-2">
      {hasLiveDemo ? (
        <a
          href={project.demoLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex-1 flex items-center justify-center gap-1.5 ${btn} bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-all`}
        >
          <ExternalLink className="w-3.5 h-3.5" />
          Live Demo
        </a>
      ) : null}
      <a
        href={project.githubLink}
        target="_blank"
        rel="noopener noreferrer"
        className={`${hasLiveDemo ? 'flex-1' : 'w-full'} flex items-center justify-center gap-1.5 ${btn} bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white font-medium hover:bg-white/20 transition-all`}
      >
        <Github className="w-3.5 h-3.5" />
        View Code
      </a>
    </div>
  )
}

function FeaturedCard({ project, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative"
    >
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${project.gradient} rounded-2xl opacity-0 group-hover:opacity-25 blur-xl transition-all duration-500`} />
      <div className="relative h-full bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden group-hover:border-white/30 transition-all duration-500 flex flex-col">
        <div className={`relative h-56 sm:h-72 overflow-hidden ${project.bgColor}`}>
          <ProjectImage project={project} />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span className="text-[10px] font-mono px-2 py-1 bg-white text-black rounded-full font-semibold">
              Featured
            </span>
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono px-2 py-1 bg-black/50 backdrop-blur-md border border-white/20 rounded-full text-white"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="p-5 sm:p-6 flex flex-col flex-1">
          <h3 className="text-xl sm:text-2xl font-bold text-white font-display mb-2 tracking-tight">
            {project.title}
          </h3>
          <p className="text-sm sm:text-base text-white/90 mb-2 leading-relaxed font-medium">
            {project.impact}
          </p>
          <p className="text-sm text-gray-400 mb-5 leading-relaxed flex-1">
            {project.description}
          </p>
          <ProjectActions project={project} size="large" />
        </div>
      </div>
    </motion.div>
  )
}

function GridCard({ project, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
      className="group relative"
    >
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${project.gradient} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500`} />
      <div className="relative h-full bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden group-hover:border-white/30 transition-all duration-500 flex flex-col">
        <div className={`relative h-44 sm:h-48 overflow-hidden ${project.bgColor}`}>
          <ProjectImage project={project} />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[90%]">
            {project.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono px-2 py-1 bg-black/50 backdrop-blur-md border border-white/20 rounded-full text-white"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-lg font-bold text-white font-mono mb-2">{project.title}</h3>
          <p className="text-sm text-white/85 mb-2 leading-relaxed font-medium">{project.impact}</p>
          <p className="text-xs sm:text-sm text-gray-400 mb-5 leading-relaxed flex-1">
            {project.description}
          </p>
          <ProjectActions project={project} />
        </div>
      </div>
    </motion.div>
  )
}

const ProjectShowcase = () => {
  const featured = PROJECTS.filter((p) => p.featured)
  const rest = PROJECTS.filter((p) => !p.featured)

  return (
    <section id="projects" className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-[1400px] mx-auto w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
            <ShinyText text="Featured Work" className="text-sm font-mono" speed={4} />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-display tracking-tight text-white leading-tight mb-4 max-w-3xl mx-auto">
            Crafting{' '}
            <GradientText colors={['#a855f7', '#3b82f6', '#22d3ee', '#a855f7']} speed={5}>
              digital experiences
            </GradientText>{' '}
            that inspire.
          </h2>
          <p className="text-gray-400 text-base sm:text-lg mb-8">
            Building the future with AI Agents, Automation, and Intelligent Systems
          </p>
          <motion.button
            onClick={() => window.open('https://github.com/sakshigupta372', '_blank')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3.5 rounded-full bg-white text-black font-medium text-sm sm:text-base hover:bg-gray-200 transition-colors duration-200"
          >
            View All Projects
          </motion.button>
        </motion.div>

        {/* Featured duo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-10">
          {featured.map((project, index) => (
            <FeaturedCard key={project.id} project={project} index={index} />
          ))}
        </div>

        {/* Remaining projects */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {rest.map((project, index) => (
            <GridCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProjectShowcase
