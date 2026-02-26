import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Linkedin, Download, Sparkles, Code2 } from 'lucide-react'
import SplitText from './reactbits/SplitText'
import RotatingText from './reactbits/RotatingText'
import Magnet from './reactbits/Magnet'
import ShinyText from './reactbits/ShinyText'

const Hero = () => {
  const [displayText, setDisplayText] = useState('')
  const fullText = 'const developer = new AgenticAI();'
  
  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index))
        index++
      } else {
        clearInterval(timer)
      }
    }, 50)
    
    return () => clearInterval(timer)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
    }
  }

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-screen flex items-center">
      {/* Enhanced Background Effects - Black & White */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-white/10 to-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-gradient-to-l from-white/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl"></div>
        
        {/* Floating particles */}
        <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-1/3 left-1/4 w-3 h-3 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-2/3 right-1/3 w-2 h-2 bg-white/20 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="space-y-8">
            <motion.div className="space-y-6" variants={itemVariants}>
              {/* Animated Badge */}
              <motion.div 
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 shadow-lg shadow-white/10"
                whileHover={{ scale: 1.05, borderColor: 'rgba(255, 255, 255, 0.4)' }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="w-2 h-2 bg-white rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <ShinyText text="Available for opportunities" className="text-xs font-mono" speed={4} />
              </motion.div>
              
              {/* Name with gradient */}
              <div className="text-5xl sm:text-6xl lg:text-7xl font-bold font-display leading-tight tracking-tight">
                <SplitText
                  text="Sakshi Gupta"
                  className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-white"
                  delay={0.3}
                  duration={0.6}
                />
              </div>
              
              {/* Role */}
              <motion.div className="space-y-3" variants={itemVariants}>
                <p className="text-2xl sm:text-3xl lg:text-4xl text-white font-semibold tracking-tight font-display">
                  <RotatingText
                    texts={[
                      'Agentic AI Developer',
                      'Gen AI Engineer',
                      'Multi-Agent Architect',
                      'AI Systems Builder',
                    ]}
                    interval={3000}
                  />
                </p>
                <motion.div 
                  className="w-20 h-0.5 bg-gradient-to-r from-white via-gray-400 to-transparent rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: 80 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                />
              </motion.div>
              
              {/* Description */}
              <motion.div className="max-w-2xl" variants={itemVariants}>
                <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
                  Specializing in{' '}
                  <span className="text-white font-medium">multi-agent orchestration</span>,{' '}
                  <span className="text-white font-medium">custom MCP servers</span>, and{' '}
                  <span className="text-white font-medium">autonomous backend systems</span>.
                </p>
              </motion.div>
            </motion.div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              variants={itemVariants}
            >
              <Magnet strength={0.2}>
                <motion.button 
                  onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}
                  className="group relative flex items-center justify-center space-x-2 bg-white text-black font-bold px-8 py-4 rounded-xl overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10">View Projects</span>
                  <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Magnet>
              
              <Magnet strength={0.2}>
                <motion.a
                  href="/resume.pdf"
                  download="Sakshi_Gupta_Resume.pdf"
                  className="group relative flex items-center justify-center space-x-2 bg-white/5 backdrop-blur-sm border border-white/20 text-white font-semibold px-8 py-4 rounded-xl"
                  whileHover={{ scale: 1.05, borderColor: 'rgba(255, 255, 255, 0.5)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download size={20} className="group-hover:animate-bounce" />
                  <span>Download Resume</span>
                </motion.a>
              </Magnet>
              
              <motion.a
                href="https://www.linkedin.com/in/sakshi-gupta-ba858a292/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center space-x-2 bg-white/5 backdrop-blur-sm border border-white/20 text-white font-semibold px-6 py-4 rounded-xl"
                whileHover={{ scale: 1.05, borderColor: 'rgba(255, 255, 255, 0.5)' }}
                whileTap={{ scale: 0.95 }}
              >
                <Linkedin size={20} className="group-hover:scale-110 transition-transform" />
                <span className="hidden lg:inline">LinkedIn</span>
              </motion.a>
            </motion.div>
          </div>

          {/* Profile Photo */}
          <motion.div 
            className="flex flex-col items-center space-y-6"
            variants={itemVariants}
          >
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-full blur-2xl"
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <div className="relative w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 rounded-full overflow-hidden border-4 border-white/20 backdrop-blur-sm shadow-2xl shadow-white/20 group">
                <img 
                  src="/profile.jpg" 
                  alt="Sakshi Gupta"
                  className="w-full h-full object-cover"
                />
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            </motion.div>
            
            {/* Tagline Badge */}
            <motion.div 
              className="mt-8 inline-flex items-center space-x-2 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-full px-6 py-3"
              variants={itemVariants}
              whileHover={{ scale: 1.05, borderColor: 'rgba(255, 255, 255, 0.4)' }}
            >
              <Sparkles className="w-4 h-4 text-white" />
              <p className="text-sm font-semibold tracking-tight text-white">
                AI Agents & Automation
              </p>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* OPTION 3: Text Overlay on Photo - Uncomment below and comment out Option 2 above to use */}
        {/* <div className="max-w-4xl mx-auto">
          <div className="relative animate-fade-in">
            <div className="relative w-full max-w-2xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-3xl blur-2xl animate-pulse"></div>
              <div className="relative aspect-square rounded-3xl overflow-hidden border-4 border-white/20 backdrop-blur-sm shadow-2xl shadow-white/20">
                <img 
                  src="/profile.jpg" 
                  alt="Sakshi Gupta"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                  <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-4">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span className="text-xs font-mono text-gray-300">Available for opportunities</span>
                  </div>
                  
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-sans leading-tight tracking-tight mb-4">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-white">Sakshi Gupta</span>
                  </h1>
                  
                  <p className="text-xl sm:text-2xl md:text-3xl text-white font-semibold tracking-tight mb-4">
                    Agentic AI & Gen AI Developer
                  </p>
                  
                  <p className="text-sm sm:text-base text-gray-300 mb-6 max-w-xl">
                    Building the Next Generation of Agentic AI
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}
                      className="bg-white hover:bg-gray-100 text-black font-bold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
                    >
                      View Projects
                    </button>
                    <a
                      href="/resume.pdf"
                      download="Sakshi_Gupta_Resume.pdf"
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 hover:scale-105"
                    >
                      Download Resume
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  )
}

export default Hero
