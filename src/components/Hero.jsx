import React, { useState, useEffect } from 'react'
import { ArrowRight, Linkedin, Download, Brain, Blocks } from 'lucide-react'

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
        {/* OPTION 2: Side-by-Side Layout - ACTIVE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="space-y-6">
              {/* Animated Badge with Glassmorphism */}
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 animate-fade-in shadow-lg shadow-white/10">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-xs font-mono text-gray-300">Available for opportunities</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-sans leading-tight tracking-tight">
                <span className="inline-block animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-white">Sakshi Gupta</span>
                </span>
              </h1>
              
              <div className="space-y-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <p className="text-xl sm:text-2xl lg:text-3xl text-white font-semibold tracking-tight">
                  Agentic AI & Gen AI Developer
                </p>
                <div className="w-20 h-0.5 bg-gradient-to-r from-white via-gray-400 to-transparent rounded-full"></div>
              </div>
              
              <div className="max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                <p className="text-lg sm:text-xl text-white font-medium leading-relaxed mb-3 italic">
                  "Building the bridge between what AI says and what AI does."
                </p>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                  Agentic AI Developer specializing in <span className="text-gray-300">multi-agent orchestration</span>, <span className="text-gray-300">custom MCP servers</span>, and <span className="text-gray-300">autonomous backend systems</span>.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <button 
                onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}
                className="group relative flex items-center justify-center space-x-2 bg-white hover:bg-gray-100 text-black font-bold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/30 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative z-10">View Projects</span>
                <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <a
                href="/resume.pdf"
                download="Sakshi_Gupta_Resume.pdf"
                className="group relative flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/50 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-white/20"
              >
                <Download size={20} className="group-hover:animate-bounce" />
                <span>Download Resume</span>
              </a>
              
              <a
                href="https://www.linkedin.com/in/sakshi-gupta-ba858a292/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/50 text-white font-semibold px-6 py-4 rounded-xl transition-all duration-300 hover:scale-105"
              >
                <Linkedin size={20} className="group-hover:scale-110 transition-transform" />
                <span className="hidden lg:inline">LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Profile Photo with Stats */}
          <div className="hidden lg:flex flex-col items-center space-y-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative w-80 h-80 rounded-full overflow-hidden border-4 border-white/20 backdrop-blur-sm shadow-2xl shadow-white/20 group hover:scale-105 transition-transform duration-500">
                <img 
                  src="/profile.jpg" 
                  alt="Sakshi Gupta"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            </div>
            
            {/* Elegant Tagline */}
            <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <p className="text-sm font-light tracking-[0.2em] text-gray-400 uppercase">
                Specializing in
              </p>
              <p className="text-lg font-semibold tracking-tight text-white mt-1">
                AI Agents & Automation
              </p>
            </div>
          </div>
        </div>

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
