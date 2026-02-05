import React, { useState } from 'react'
import { Copy, Check, Menu, X, Brain } from 'lucide-react'

const Navbar = () => {
  const [copied, setCopied] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const copyEmail = () => {
    navigator.clipboard.writeText('sg6227174@gmail.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-xl font-mono font-bold text-gradient">
              SG
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('projects')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Projects
            </button>
            <button 
              onClick={() => scrollToSection('stack')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Stack
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('contact')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Contact
            </button>
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <button
            onClick={copyEmail}
            className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/30 hover:border-white/60 text-white px-4 py-2 rounded-lg transition-all duration-300"
          >
            {copied ? (
              <>
                <Check size={18} />
                <span className="hidden sm:inline">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={18} />
                <span className="hidden sm:inline">Copy Email</span>
              </>
            )}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-dark/95 backdrop-blur-md">
            <div className="px-4 py-4 space-y-3">
              <button 
                onClick={() => {
                  scrollToSection('projects')
                  setIsMenuOpen(false)
                }}
                className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                Projects
              </button>
              <button 
                onClick={() => {
                  scrollToSection('stack')
                  setIsMenuOpen(false)
                }}
                className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                Stack
              </button>
              <button 
                onClick={() => {
                  scrollToSection('about')
                  setIsMenuOpen(false)
                }}
                className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                About
              </button>
              <button 
                onClick={() => {
                  scrollToSection('contact')
                  setIsMenuOpen(false)
                }}
                className="block w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
