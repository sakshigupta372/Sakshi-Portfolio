import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Github, Sparkles, ArrowRight } from 'lucide-react'

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
      gradient: 'from-blue-500/20 to-purple-500/20'
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
      gradient: 'from-green-500/20 to-emerald-500/20'
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
      gradient: 'from-violet-500/20 to-fuchsia-500/20'
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

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {projects.slice(0, 2).map((project, index) => (
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
              {/* Spotlight Effect */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${project.gradient} rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500`}></div>
              
              <div className="relative h-full bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden group-hover:border-white/30 transition-all duration-500">
                {/* Image Section */}
                <div className="relative h-64 overflow-hidden">
                  <motion.img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                    animate={hoveredId === project.id ? { scale: 1.1 } : { scale: 1 }}
                    transition={{ duration: 0.6 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent"></div>
                  
                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
                  <h3 className="text-2xl font-bold font-mono mb-3 group-hover:text-gradient transition-all duration-300">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-mono px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all duration-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* View Project Link */}
                  <a 
                    href={project.demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-sm font-semibold text-gray-400 group-hover:text-white transition-colors duration-300"
                  >
                    <span>View Project</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Third Project - Full Width Featured */}
        {projects[2] && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onMouseEnter={() => setHoveredId(projects[2].id)}
            onMouseLeave={() => setHoveredId(null)}
            className="group relative"
          >
            {/* Spotlight Effect */}
            <div className={`absolute -inset-0.5 bg-gradient-to-r ${projects[2].gradient} rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500`}></div>
            
            <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden group-hover:border-white/30 transition-all duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Image Section */}
                <div className="relative h-80 lg:h-auto overflow-hidden">
                  <motion.img 
                    src={projects[2].image} 
                    alt={projects[2].title}
                    className="w-full h-full object-cover"
                    animate={hoveredId === projects[2].id ? { scale: 1.1 } : { scale: 1 }}
                    transition={{ duration: 0.6 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-dark/80 via-dark/40 to-transparent"></div>
                </div>

                {/* Content Section */}
                <div className="p-8 flex flex-col justify-center">
                  <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-full px-3 py-1 mb-4 w-fit">
                    <Sparkles className="w-3 h-3 text-white" />
                    <span className="text-xs font-mono text-gray-300">Live Demo Available</span>
                  </div>

                  <h3 className="text-3xl font-bold font-mono mb-4 group-hover:text-gradient transition-all duration-300">
                    {projects[2].title}
                  </h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    {projects[2].description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {projects[2].tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-mono px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:text-white hover:border-white/30 hover:bg-white/10 transition-all duration-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <a 
                      href={projects[2].demoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-white/20"
                    >
                      <span>View Live Demo</span>
                      <ExternalLink size={16} />
                    </a>
                    <a 
                      href={projects[2].githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 hover:scale-105"
                    >
                      <Github size={16} />
                      <span>Source Code</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default Features
