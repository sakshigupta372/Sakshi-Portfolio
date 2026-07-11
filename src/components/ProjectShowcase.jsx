import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, ExternalLink, Github } from 'lucide-react'
import GradientText from './reactbits/GradientText'
import ShinyText from './reactbits/ShinyText'

const PROJECTS = [
  {
    id: 1,
    title: 'Health Diagnosis System',
    description: 'Multi-agent AI clinical decision-making system leveraging OpenAI orchestration and Google Gemini Vision for medical image analysis.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop',
    bgColor: 'bg-blue-500/10',
    demoLink: 'https://github.com/sakshigupta372/Health_Diagnosis_System',
    githubLink: 'https://github.com/sakshigupta372/Health_Diagnosis_System',
    tags: ['Crew AI', 'Gemini', 'Streamlit'],
    gradient: 'from-blue-500 to-purple-500',
  },
  {
    id: 2,
    title: 'Krishi Setu',
    description: 'Real-time agricultural IoT system with ESP32 hardware integration, live sensor monitoring, and remote irrigation control.',
    image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&auto=format&fit=crop',
    bgColor: 'bg-green-500/10',
    demoLink: 'https://github.com/sakshigupta372/Krishi_Setu',
    githubLink: 'https://github.com/sakshigupta372/Krishi_Setu',
    tags: ['IoT', 'ESP32', 'Arduino'],
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    id: 3,
    title: 'CompliLedger RAG Chatbot',
    description: 'Privacy-first RAG backend using Google Gemini 2.5 Pro for generation and Google Embeddings for retrieval over public site content.',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop',
    bgColor: 'bg-violet-500/10',
    demoLink: 'https://compliagent.vercel.app',
    githubLink: 'https://github.com/sakshigupta372',
    tags: ['RAG', 'Gemini', 'LangChain'],
    gradient: 'from-violet-500 to-fuchsia-500',
  },
  {
    id: 4,
    title: 'Audit-AI',
    description: 'AI Website Auditor with Gradio, Gemini AI, accessibility checking, mobile analysis, and downloadable PDF reports.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop',
    bgColor: 'bg-orange-500/10',
    demoLink: 'https://huggingface.co/spaces/Sakshi2005/Audit_AI',
    githubLink: 'https://github.com/sakshigupta372/AuditAI',
    tags: ['Python', 'Gradio', 'Gemini'],
    gradient: 'from-orange-500 to-red-500',
  },
  {
    id: 5,
    title: 'HireBoard-AI',
    description: 'AI-Powered Hiring Platform for Job Seekers & Recruiters, built with a FastAPI backend and Next.js frontend.',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&auto=format&fit=crop',
    bgColor: 'bg-cyan-500/10',
    demoLink: 'https://frontend-chi-blush.vercel.app/',
    githubLink: 'https://github.com/sakshigupta372/HireBoard-AI',
    tags: ['FastAPI', 'Next.js', 'TypeScript'],
    gradient: 'from-cyan-500 to-blue-500',
  },
  {
    id: 6,
    title: 'Multi-Tenant LLM Gateway',
    description: 'A production-ready AI gateway with per-tenant auth, intelligent provider routing, semantic caching, rate limiting, and cost tracking across LLM providers.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop',
    bgColor: 'bg-teal-500/10',
    demoLink: 'https://multi-tenant-llm-gateway.vercel.app',
    githubLink: 'https://github.com/sakshigupta372/Multi-Tenant-LLM-Gateway',
    tags: ['FastAPI', 'Next.js', 'SQLite'],
    gradient: 'from-teal-500 to-cyan-500',
  },
  {
    id: 7,
    title: 'NEXUS.AI – AI Interview Simulation Platform',
    description: 'Agentic AI interview platform simulating technical, HR, system design, and coding interviews with adaptive questions and real-time feedback.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop',
    bgColor: 'bg-indigo-500/10',
    demoLink: 'https://ai-interview-platform-nr7v.vercel.app',
    githubLink: 'https://github.com/sakshigupta372/ai-interview-platform',
    tags: ['Next.js', 'Node.js', 'Gemini'],
    gradient: 'from-indigo-500 to-purple-500',
  },
]

const ProjectShowcase = () => {
  return (
    <section id="projects" className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-[1400px] mx-auto w-full relative z-10">
        {/* Header Section */}
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
            Crafting <GradientText colors={['#a855f7', '#3b82f6', '#22d3ee', '#a855f7']} speed={5}>digital experiences</GradientText> that inspire.
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

        {/* Static Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {PROJECTS.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
              className="group relative"
            >
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${project.gradient} rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500`}></div>

              <div className="relative h-full bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden group-hover:border-white/30 transition-all duration-500 flex flex-col">
                {/* Image */}
                <div className={`relative h-48 sm:h-56 overflow-hidden ${project.bgColor}`}>
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                  <div className="absolute top-3 left-3 flex gap-1.5">
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 flex flex-col flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-white font-mono mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-5 leading-relaxed flex-1">
                    {project.description}
                  </p>

                  {/* Action buttons - always visible */}
                  <div className="flex gap-2">
                    <a
                      href={project.demoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white text-xs sm:text-sm font-medium hover:bg-white/20 transition-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Demo
                    </a>
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white text-xs sm:text-sm font-medium hover:bg-white/20 transition-all"
                    >
                      <Github className="w-3.5 h-3.5" />
                      Code
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProjectShowcase
