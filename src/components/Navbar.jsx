import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Copy, Check, Menu, X, Briefcase, Code2, User, Mail } from 'lucide-react'

const Navbar = () => {
  const [copied, setCopied] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hoveredItem, setHoveredItem] = useState(null)

  const copyEmail = () => {
    navigator.clipboard.writeText('sg6227174@gmail.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMenuOpen(false)
    }
  }

  const navItems = [
    {
      id: 'projects',
      label: 'Projects',
      icon: Briefcase,
      description: 'Explore my AI & automation projects',
      color: 'from-blue-500/20 to-purple-500/20'
    },
    {
      id: 'stack',
      label: 'Stack',
      icon: Code2,
      description: 'Technologies I work with',
      color: 'from-green-500/20 to-emerald-500/20'
    },
    {
      id: 'about',
      label: 'About',
      icon: User,
      description: 'My journey and experience',
      color: 'from-violet-500/20 to-fuchsia-500/20'
    },
    {
      id: 'contact',
      label: 'Contact',
      icon: Mail,
      description: 'Let\'s connect and collaborate',
      color: 'from-orange-500/20 to-red-500/20'
    }
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-xl font-mono font-bold text-gradient">
              SG
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <div 
                key={item.id}
                className="relative"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <button 
                  onClick={() => scrollToSection(item.id)}
                  className="relative px-4 py-2 text-gray-300 hover:text-white transition-colors font-medium"
                >
                  {item.label}
                </button>

                {/* Hover Card */}
                <AnimatePresence>
                  {hoveredItem === item.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 pointer-events-none z-50"
                    >
                      <div className={`relative bg-gradient-to-br ${item.color} backdrop-blur-xl border border-white/20 rounded-xl p-4 shadow-2xl`}>
                        <div className="flex items-start space-x-3">
                          <div className="p-2 bg-white/10 rounded-lg">
                            <item.icon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-semibold mb-1">{item.label}</h4>
                            <p className="text-gray-300 text-sm">{item.description}</p>
                          </div>
                        </div>
                        {/* Arrow */}
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/10 backdrop-blur-xl border-t border-l border-white/20 rotate-45"></div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
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

        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-white/10 bg-dark/95 backdrop-blur-md overflow-hidden"
            >
              <div className="px-4 py-4 space-y-2">
                {navItems.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="flex items-center space-x-3 w-full text-left px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors group"
                  >
                    <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}

export default Navbar
