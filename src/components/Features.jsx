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

        {/* Magic Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">
          {/* Profile Card - Tall Left */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:row-span-2 group relative"
            onMouseEnter={() => setHoveredId('profile')}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500"></div>
            
            <div className="relative h-full bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden group-hover:border-white/30 transition-all duration-500 p-8 flex flex-col">
              {/* Profile Image */}
              <div className="relative mx-auto mb-6">
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-full blur-2xl"
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white/20">
                  <img 
                    src="/profile.jpg" 
                    alt="Sakshi Gupta"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Profile Info */}
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Sakshi Gupta</h3>
                <p className="text-gray-400 text-sm mb-4">Agentic AI & Gen AI Developer</p>
                
                <div className="flex flex-col space-y-2 text-sm text-gray-400">
                  <div className="flex items-center justify-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>India</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <Mail className="w-4 h-4" />
                    <span>sg6227174@gmail.com</span>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="mt-auto space-y-3">
                <a 
                  href="/resume.pdf"
                  download
                  className="block w-full text-center px-4 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105"
                >
                  Download Resume
                </a>
                <div className="flex gap-2">
                  <a 
                    href="https://www.linkedin.com/in/sakshi-gupta-ba858a292/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span className="text-sm">LinkedIn</span>
                  </a>
                  <a 
                    href="https://github.com/sakshigupta372"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all"
                  >
                    <Github className="w-4 h-4" />
                    <span className="text-sm">GitHub</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Project 1 - Large Top Right */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onMouseEnter={() => setHoveredId(projects[0].id)}
            onMouseLeave={() => setHoveredId(null)}
            className="lg:col-span-2 group relative"
          >
            <div className={`absolute -inset-0.5 bg-gradient-to-r ${projects[0].gradient} rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500`}></div>
            
            <div className="relative h-full bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden group-hover:border-white/30 transition-all duration-500">
              <div className="grid lg:grid-cols-2 h-full">
                <div className="relative h-64 lg:h-full overflow-hidden">
                  <motion.img 
                    src={projects[0].image} 
                    alt={projects[0].title}
                    className="w-full h-full object-cover"
                    animate={hoveredId === projects[0].id ? { scale: 1.1 } : { scale: 1 }}
                    transition={{ duration: 0.6 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-dark/80 via-dark/40 to-transparent"></div>
                </div>

                <div className="p-6 lg:p-8 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold font-mono mb-3 group-hover:text-gradient transition-all duration-300">
                    {projects[0].title}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                    {projects[0].description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {projects[0].tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs font-mono px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-gray-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <a 
                      href={projects[0].demoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all"
                    >
                      <ExternalLink size={16} />
                      <span className="text-sm">View</span>
                    </a>
                    <a 
                      href={projects[0].githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 transition-all"
                    >
                      <Github size={16} />
                      <span className="text-sm">Code</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Project 2 - Medium */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            onMouseEnter={() => setHoveredId(projects[1].id)}
            onMouseLeave={() => setHoveredId(null)}
            className="group relative"
          >
            <div className={`absolute -inset-0.5 bg-gradient-to-r ${projects[1].gradient} rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500`}></div>
            
            <div className="relative h-full bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden group-hover:border-white/30 transition-all duration-500">
              <div className="relative h-48 overflow-hidden">
                <motion.img 
                  src={projects[1].image} 
                  alt={projects[1].title}
                  className="w-full h-full object-cover"
                  animate={hoveredId === projects[1].id ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ duration: 0.6 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent"></div>
                
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <a 
                    href={projects[1].demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg hover:bg-white/20 hover:scale-110 transition-all duration-300"
                  >
                    <ExternalLink size={16} className="text-white" />
                  </a>
                  <a 
                    href={projects[1].githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg hover:bg-white/20 hover:scale-110 transition-all duration-300"
                  >
                    <Github size={16} className="text-white" />
                  </a>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold font-mono mb-2 group-hover:text-gradient transition-all duration-300">
                  {projects[1].title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {projects[1].description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {projects[1].tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-mono px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Project 3 - Medium with Live Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onMouseEnter={() => setHoveredId(projects[2].id)}
            onMouseLeave={() => setHoveredId(null)}
            className="group relative"
          >
            <div className={`absolute -inset-0.5 bg-gradient-to-r ${projects[2].gradient} rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500`}></div>
            
            <div className="relative h-full bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden group-hover:border-white/30 transition-all duration-500">
              <div className="relative h-48 overflow-hidden">
                <motion.img 
                  src={projects[2].image} 
                  alt={projects[2].title}
                  className="w-full h-full object-cover"
                  animate={hoveredId === projects[2].id ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ duration: 0.6 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent"></div>
                
                {/* Live Demo Badge */}
                <div className="absolute top-3 left-3">
                  <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-md border border-white/30 rounded-full px-3 py-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs font-mono text-white">Live Demo</span>
                  </div>
                </div>

                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <a 
                    href={projects[2].demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg hover:bg-white/20 hover:scale-110 transition-all duration-300"
                  >
                    <ExternalLink size={16} className="text-white" />
                  </a>
                  <a 
                    href={projects[2].githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg hover:bg-white/20 hover:scale-110 transition-all duration-300"
                  >
                    <Github size={16} className="text-white" />
                  </a>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold font-mono mb-2 group-hover:text-gradient transition-all duration-300">
                  {projects[2].title}
                </h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                  {projects[2].description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {projects[2].tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-mono px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Features
