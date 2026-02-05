import React from 'react'
import { Github, Linkedin, Mail, Heart } from 'lucide-react'

const Footer = () => {
  return (
    <footer id="contact" className="border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-mono font-bold text-gradient mb-4">SG | Agentic AI</h3>
            <p className="text-gray-400">
              Building intelligent systems that shape the future of technology.
            </p>
          </div>

          <div id="about">
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <button 
                onClick={() => document.getElementById('projects').scrollIntoView({ behavior: 'smooth' })}
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Projects
              </button>
              <button 
                onClick={() => document.getElementById('stack').scrollIntoView({ behavior: 'smooth' })}
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Tech Stack
              </button>
              <a 
                href="mailto:sg6227174@gmail.com"
                className="block text-gray-400 hover:text-white transition-colors"
              >
                Contact
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a
                href="https://github.com/sakshigupta372"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/50 rounded-lg transition-all hover:scale-110"
              >
                <Github size={20} />
              </a>
              <a
                href="https://www.linkedin.com/in/sakshi-gupta-ba858a292/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/50 rounded-lg transition-all hover:scale-110"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="mailto:sg6227174@gmail.com"
                className="flex items-center justify-center w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/50 rounded-lg transition-all hover:scale-110"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            Built by <span className="text-white font-semibold">Sakshi Gupta</span>. 2026.
          </p>
          <div className="flex items-center space-x-2 text-gray-400 text-sm">
            <span>Made with</span>
            <Heart size={16} className="text-white fill-white" />
           
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
