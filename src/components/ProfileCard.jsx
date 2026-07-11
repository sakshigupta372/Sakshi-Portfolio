import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, MessageSquare, Github, Linkedin, Mail, ExternalLink } from 'lucide-react'
import CountUp from './reactbits/CountUp'
import ShinyText from './reactbits/ShinyText'
import GradientText from './reactbits/GradientText'

const ProfileCard = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const [liked, setLiked] = useState(false)

  const tabs = ['profile', 'experience', 'skills']

  return (
    <section id="about" className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-mono text-gray-300">About Me</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display mb-4">
            <span className="text-white">Get to </span>
            <GradientText colors={['#a855f7', '#3b82f6', '#a855f7']} speed={6}>Know Me</GradientText>
          </h2>
        </motion.div>

        <div className="flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full max-w-2xl"
          >
            {/* Card Glow Effect */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-all duration-700"></div>

              {/* Profile Card */}
              <div className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl rounded-[2rem] shadow-2xl overflow-hidden border border-white/10 p-2">
                {/* Header with Gradient Background */}
                <div className="relative h-32 sm:h-40 rounded-3xl bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 overflow-hidden">
                  <div className="absolute inset-0 opacity-30">
                    <svg viewBox="0 0 1000 200" className="w-full h-full" preserveAspectRatio="none">
                      <path d="M0,100 C150,150 350,50 500,100 C650,150 850,50 1000,100 L1000,0 L0,0 Z" fill="white" fillOpacity="0.3" />
                    </svg>
                  </div>

                  {/* Floating particles in header */}
                  <motion.div
                    className="absolute top-6 left-12 w-2 h-2 bg-white/40 rounded-full"
                    animate={{ y: [0, -8, 0], opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute top-10 right-20 w-1.5 h-1.5 bg-white/30 rounded-full"
                    animate={{ y: [0, -6, 0], opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                  />

                  <div className="absolute top-4 right-4">
                    <motion.a
                      href="mailto:sg6227174@gmail.com"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-9 h-9 rounded-lg bg-white/20 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-colors duration-200"
                      aria-label="Send message"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </motion.a>
                  </div>
                </div>

                {/* Profile Content */}
                <div className="relative px-4 sm:px-6 pb-4">
                  {/* Profile Picture & Stats Row */}
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12 sm:-mt-16 mb-4">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="relative"
                    >
                      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-black p-1.5 shadow-xl shadow-purple-500/20">
                        <div className="relative w-full h-full rounded-full overflow-hidden ring-2 ring-purple-500/30">
                          <img
                            src="/profile.jpg"
                            alt="Sakshi Gupta"
                            className="w-full h-full rounded-full object-cover bg-neutral-800"
                          />
                        </div>
                      </div>
                      {/* Online indicator */}
                      <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black"></div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto"
                    >
                      {/* Stats */}
                      <div className="flex items-center gap-4 sm:gap-6">
                        <div className="text-center">
                          <div className="text-lg sm:text-xl font-bold text-white"><CountUp target={5} suffix="+" duration={1500} /></div>
                          <div className="text-xs text-gray-400">Projects</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg sm:text-xl font-bold text-white"><CountUp target={4} suffix="+" duration={1800} /></div>
                          <div className="text-xs text-gray-400 leading-tight max-w-[5rem]">International Clients</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg sm:text-xl font-bold text-white"><CountUp target={1} suffix="+" duration={1200} /></div>
                          <div className="text-xs text-gray-400 leading-tight max-w-[5rem]">Year Experience</div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <motion.a
                          href="https://www.linkedin.com/in/sakshi-gupta-ba858a292/"
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-lg bg-white text-black font-medium text-sm hover:bg-gray-200 transition-colors duration-200 text-center"
                        >
                          Connect
                        </motion.a>
                        <motion.a
                          href="mailto:sg6227174@gmail.com"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 sm:flex-none px-4 sm:px-6 py-2 rounded-lg border border-white/20 text-white font-medium text-sm hover:bg-white/10 transition-colors duration-200 text-center"
                        >
                          Hire me
                        </motion.a>
                        <motion.button
                          onClick={() => setLiked(!liked)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.85 }}
                          className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all duration-300 ${
                            liked
                              ? 'border-red-500/50 bg-red-500/20 text-red-400'
                              : 'border-white/20 text-white hover:bg-white/10'
                          }`}
                          aria-label="Favorite"
                        >
                          <Heart className={`w-4 h-4 ${liked ? 'fill-red-400' : ''}`} />
                        </motion.button>
                      </div>
                    </motion.div>
                  </div>

                  {/* User Info */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mb-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                      <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">Sakshi Gupta</h2>
                      <span className="inline-flex items-center px-3 py-1 rounded-md bg-purple-500/20 text-xs font-medium w-fit border border-purple-500/30">
                        <ShinyText text="Agentic AI Developer" className="text-purple-400" speed={3} />
                      </span>
                    </div>

                    <p className="text-sm sm:text-base text-gray-300 mb-3 leading-relaxed">
                      I specialise in multi-agent orchestration, custom MCP servers, and building autonomous AI systems
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-500">
                      <span className="font-mono">@sakshigupta372</span>
                      <span>•</span>
                      <span>Agentic AI & Gen AI Developer</span>
                      <span>•</span>
                      <span>Joined 2024</span>
                    </div>
                  </motion.div>

                  {/* Tabs */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="border-b border-white/10 mb-6 overflow-x-auto"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    <div className="flex items-center gap-6 min-w-max">
                      {tabs.map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`pb-3 px-1 text-sm font-medium transition-colors duration-200 border-b-2 whitespace-nowrap capitalize ${
                            activeTab === tab
                              ? 'border-purple-500 text-white'
                              : 'border-transparent text-gray-500 hover:text-gray-300'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Tab Content */}
                  <AnimatePresence mode="wait">
                    {activeTab === 'profile' && (
                      <motion.div
                        key="profile"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        {/* About */}
                        <div className="bg-white/5 rounded-xl p-4 sm:p-5 border border-white/10 hover:border-white/20 transition-colors">
                          <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                            About <span className="text-lg">👋</span>
                          </h3>
                          <p className="text-sm text-gray-300 leading-relaxed">
                            I&apos;m Sakshi Gupta, an Agentic AI & Gen AI Developer passionate about building intelligent, autonomous systems. I specialize in multi-agent orchestration, custom MCP servers, and RAG-powered solutions. I architected a comprehensive SDK for autonomous AI agent deployment and delivered production-grade chatbots with context-aware reasoning.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Location */}
                          <div className="bg-white/5 rounded-xl p-4 sm:p-5 border border-white/10 hover:border-white/20 transition-colors">
                            <h3 className="text-sm font-semibold text-white mb-3">Location</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-300">
                              <span className="text-base">🇮🇳</span>
                              <span>Indore, India</span>
                            </div>
                          </div>

                          {/* Social */}
                          <div className="bg-white/5 rounded-xl p-4 sm:p-5 border border-white/10 hover:border-white/20 transition-colors">
                            <h3 className="text-sm font-semibold text-white mb-3">Connect</h3>
                            <div className="flex items-center gap-3">
                              <a
                                href="https://github.com/sakshigupta372"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-200"
                              >
                                <Github className="w-4 h-4 text-white" />
                              </a>
                              <a
                                href="https://www.linkedin.com/in/sakshi-gupta-ba858a292/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-200"
                              >
                                <Linkedin className="w-4 h-4 text-white" />
                              </a>
                              <a
                                href="mailto:sg6227174@gmail.com"
                                className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 hover:scale-110 transition-all duration-200"
                              >
                                <Mail className="w-4 h-4 text-white" />
                              </a>
                            </div>
                          </div>
                        </div>

                        {/* Education */}
                        <div className="bg-white/5 rounded-xl p-4 sm:p-5 border border-white/10 hover:border-white/20 transition-colors">
                          <h3 className="text-sm font-semibold text-white mb-3">Education</h3>
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shrink-0">
                              <span className="text-white font-bold text-sm">🎓</span>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-white">B.Tech in Computer Science</h4>
                              <p className="text-xs text-gray-400">AITR, Indore • 2023 - 2027</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'experience' && (
                      <motion.div
                        key="experience"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <div className="bg-white/5 rounded-xl p-4 sm:p-5 border border-white/10 hover:border-purple-500/30 transition-all duration-300">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">
                              <span className="text-white font-bold text-lg">BX</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-white mb-1">Agentic AI Developer</h4>
                              <div className="text-xs text-gray-400 space-y-0.5">
                                <div>BlockX • Remote</div>
                                <div>Jul 2025 - Dec 2025 • 6 mos</div>
                              </div>
                              <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                                Architected a comprehensive SDK for autonomous AI agent deployment. Engineered custom MCP servers for secure LLM tool integration.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white/5 rounded-xl p-4 sm:p-5 border border-white/10 hover:border-green-500/30 transition-all duration-300">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shrink-0 shadow-lg shadow-green-500/20">
                              <span className="text-white font-bold text-lg">FL</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-white mb-1">Freelance AI Developer</h4>
                              <div className="text-xs text-gray-400 space-y-0.5">
                                <div>Independent • Global</div>
                                <div>2024 - Present</div>
                              </div>
                              <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                                Delivered scalable AI solutions for 4+ international clients including Compliledger Team (California), Omelo, and CoinX.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white/5 rounded-xl p-4 sm:p-5 border border-white/10 hover:border-blue-500/30 transition-all duration-300">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                              <span className="text-white font-bold text-lg">🎓</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-white mb-1">B.Tech Computer Science</h4>
                              <div className="text-xs text-gray-400 space-y-0.5">
                                <div>AITR, Indore</div>
                                <div>2023 - 2027 • CGPA: 7.4/10</div>
                              </div>
                              <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                                Specializing in AI and autonomous systems. Presented research papers at NSSAFE 2025.
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'skills' && (
                      <motion.div
                        key="skills"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4"
                      >
                        <div className="bg-white/5 rounded-xl p-4 sm:p-5 border border-white/10">
                          <h3 className="text-sm font-semibold text-white mb-3">AI & Agents</h3>
                          <div className="flex flex-wrap gap-2">
                            {['LangGraph', 'CrewAI', 'LangChain', 'AutoGen', 'RAG', 'MCP Servers', 'Multi-Agent Systems', 'Agent Orchestration'].map((skill) => (
                              <span key={skill} className="px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-300 text-xs font-medium border border-purple-500/20 hover:border-purple-500/40 hover:bg-purple-500/20 transition-all duration-200">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-white/5 rounded-xl p-4 sm:p-5 border border-white/10">
                          <h3 className="text-sm font-semibold text-white mb-3">Languages & Frameworks</h3>
                          <div className="flex flex-wrap gap-2">
                            {['Python', 'JavaScript', 'FastAPI', 'Flask', 'Streamlit', 'Docker', 'SQL'].map((skill) => (
                              <span key={skill} className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-300 text-xs font-medium border border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-500/20 transition-all duration-200">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-white/5 rounded-xl p-4 sm:p-5 border border-white/10">
                          <h3 className="text-sm font-semibold text-white mb-3">AI/ML Tools</h3>
                          <div className="flex flex-wrap gap-2">
                            {['OpenAI API', 'Google Gemini', 'PyTorch', 'Transformers', 'Hugging Face', 'NLP', 'Groq API'].map((skill) => (
                              <span key={skill} className="px-3 py-1.5 rounded-lg bg-green-500/10 text-green-300 text-xs font-medium border border-green-500/20 hover:border-green-500/40 hover:bg-green-500/20 transition-all duration-200">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default ProfileCard
