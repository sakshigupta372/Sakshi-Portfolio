import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Github, Sparkles, ArrowRight, Mail, MapPin, Linkedin } from 'lucide-react'

const Features = () => {
  const [hoveredId, setHoveredId] = useState(null)

  const projects = [
    {
      id: 'health-diagnosis',
      title: 'Health Diagnosis System',
      description: 'Python-based application leveraging a crew of domain-specialized AI agents to streamline clinical decision-making. The system utilizes OpenAI for logic orchestration and Google Gemini Vision for high-fidelity medical image analysis.',
      tags: ['Crew AI', 'Google Gemini', 'Streamlit'],
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop',
      demoLink: 'https://github.com/sakshigupta372/Health_Diagnosis_System',
      githubLink: 'https://github.com/sakshigupta372/Health_Diagnosis_System',
      featured: true,
      gradient: 'from-blue-500/20 to-purple-500/20',
      size: 'large'
    },
    {
      id: 'krishi-setu',
      title: 'Krishi Setu',
      description: 'A complete real-time agricultural IoT system featuring ESP32 hardware integration, live sensor monitoring, remote irrigation control.',
      tags: ['IoT', 'ESP32', 'Arduino'],
      image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&auto=format&fit=crop',
      demoLink: 'https://github.com/sakshigupta372/Krishi_Setu',
      githubLink: 'https://github.com/sakshigupta372/Krishi_Setu',
      featured: false,
      gradient: 'from-green-500/20 to-emerald-500/20',
      size: 'medium'
    },
    {
      id: 'compliledger-rag',
      title: 'CompliLedger RAG Chatbot',
      description: 'A privacy-first RAG backend that uses Google Gemini 2.5 Pro for generation and Google Embeddings for retrieval over your public site content.',
      tags: ['RAG', 'Google Gemini', 'LangChain'],
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop',
      demoLink: 'https://compliagent.vercel.app',
      githubLink: 'https://github.com/sakshigupta372',
      featured: true,
      gradient: 'from-violet-500/20 to-fuchsia-500/20',
      size: 'medium'
    },
    {
      id: 'audit-ai',
      title: 'Audit-AI',
      description: 'AI Website Auditor with Gradio, Gemini AI, Accessibility Checker, Mobile Analysis & PDF Reports.',
      tags: ['Python', 'Gradio', 'BeautifulSoup', 'Matplotlib'],
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop',
      demoLink: 'https://huggingface.co/spaces/Sakshi2005/Audit_AI',
      githubLink: 'https://github.com/sakshigupta372/AuditAI',
      featured: false,
      gradient: 'from-orange-500/20 to-red-500/20',
      size: 'medium'
    }
  ]

  return (
    <section id="projects" className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
            <span className="text-sm font-mono text-gray-300">Featured Work</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-mono mb-6">
            <span className="text-white">Crafted </span>
            <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Building the future with AI Agents, Automation, and Intelligent Systems
          </p>
        </motion.div>

        {/* Projects Grid - 2x2 Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="group relative"
            >
            <div className={`absolute -inset-0.5 bg-gradient-to-r ${project.gradient} rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500`}></div>
            
            <div className="relative h-full bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden group-hover:border-white/30 transition-all duration-500">
              {/* Image Section */}
              <div className="relative h-56 overflow-hidden">
                <motion.img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover"
                  animate={hoveredId === project.id ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ duration: 0.6 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent"></div>
                
                {/* Badges */}
                {project.id === 'compliledger-rag' && (
                  <div className="absolute top-3 left-3">
                    <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-md border border-white/30 rounded-full px-3 py-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs font-mono text-white">Live Demo</span>
                    </div>
                  </div>
                )}
                
                {project.id === 'audit-ai' && (
                  <div className="absolute top-3 left-3">
                    <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-md border border-white/30 rounded-full px-3 py-1">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                      <span className="text-xs font-mono text-white">HuggingFace</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <a 
                    href={project.demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 hover:scale-110 transition-all duration-300"
                  >
                    <ExternalLink size={18} className="text-white" />
                  </a>
                  <a 
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl hover:bg-white/20 hover:scale-110 transition-all duration-300"
                  >
                    <Github size={18} className="text-white" />
                  </a>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                <h3 className="text-xl font-bold font-mono mb-3 group-hover:text-gradient transition-all duration-300">
                  {project.title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-mono px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all duration-300"
                    >
                      {tag}
                    </span>
                  ))}
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

export default Features
