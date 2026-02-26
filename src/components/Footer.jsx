import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react'
import GradientText from './reactbits/GradientText'

const Footer = () => {
  const footerColumns = [
    {
      title: 'Navigation',
      links: [
        { text: 'Projects', action: () => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }) },
        { text: 'About', action: () => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }) },
        { text: 'Tech Stack', action: () => document.getElementById('stack')?.scrollIntoView({ behavior: 'smooth' }) },
        { text: 'Contact', action: () => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }) },
      ],
    },
    {
      title: 'Expertise',
      links: [
        { text: 'Agentic AI Systems', href: '#' },
        { text: 'Multi-Agent Orchestration', href: '#' },
        { text: 'MCP Servers', href: '#' },
        { text: 'RAG Pipelines', href: '#' },
      ],
    },
    {
      title: 'Connect',
      links: [
        { text: 'GitHub', href: 'https://github.com/sakshigupta372', external: true },
        { text: 'LinkedIn', href: 'https://www.linkedin.com/in/sakshi-gupta-ba858a292/', external: true },
        { text: 'Email', href: 'mailto:sg6227174@gmail.com' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { text: 'Resume', href: '/resume.pdf' },
        { text: 'Blog', href: '#' },
        { text: 'Case Studies', href: '#' },
      ],
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <footer className="w-full bg-black">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {/* Headline */}
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="py-12 sm:py-16">
            <h2 className="text-3xl font-medium tracking-tight leading-tight text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display">
              Building intelligent systems.
              <br />
              <GradientText colors={['#a855f7', '#3b82f6', '#22d3ee', '#a855f7']} speed={6}>
                One agent at a time.
              </GradientText>
            </h2>
          </motion.div>
        </div>

        {/* Two Column Layout with Borders */}
        <div className="border-y border-white/10">
          <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 gap-0 lg:grid-cols-[1fr_1.5fr]"
            >
              {/* Left Column - Newsletter Signup */}
              <div className="border-b border-white/10 py-8 lg:border-b-0 lg:border-r lg:py-10 lg:pr-8">
                <div>
                  <h3 className="mb-6 text-lg font-medium tracking-tight text-white sm:text-xl font-display">
                    Stay updated on my latest projects and AI developments.
                  </h3>

                  <div className="mb-6 flex">
                    <input
                      type="email"
                      placeholder="Enter your email address"
                      className="flex-1 border border-r-0 border-white/20 bg-transparent px-4 py-3 text-sm text-white placeholder-gray-500 focus:border-white/40 focus:outline-none sm:px-6 sm:py-4 sm:text-base rounded-l-lg"
                    />
                    <button
                      className="flex items-center justify-center border border-white/20 bg-white/5 px-4 transition-colors hover:bg-white/10 sm:px-6 rounded-r-lg"
                      aria-label="Subscribe"
                    >
                      <ArrowRight className="h-5 w-5 text-white sm:h-6 sm:w-6" />
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 sm:text-sm">
                    Get notified about new AI agent projects, technical articles, and collaboration opportunities.
                  </p>

                  {/* Social Icons */}
                  <div className="flex items-center gap-3 mt-6">
                    <a
                      href="https://github.com/sakshigupta372"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 rounded-lg transition-all duration-300"
                    >
                      <Github size={18} />
                    </a>
                    <a
                      href="https://www.linkedin.com/in/sakshi-gupta-ba858a292/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 rounded-lg transition-all duration-300"
                    >
                      <Linkedin size={18} />
                    </a>
                    <a
                      href="mailto:sg6227174@gmail.com"
                      className="flex items-center justify-center w-10 h-10 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 rounded-lg transition-all duration-300"
                    >
                      <Mail size={18} />
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column - 4 Column Links */}
              <div className="py-8 lg:py-10 lg:pl-8">
                <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
                  {footerColumns.map((column) => (
                    <div key={column.title}>
                      <h4 className="mb-4 text-sm font-medium tracking-tight text-white sm:mb-6 sm:text-base">
                        {column.title}
                      </h4>
                      <ul className="space-y-3">
                        {column.links.map((link) => (
                          <li key={link.text}>
                            {link.action ? (
                              <button
                                onClick={link.action}
                                className="text-sm tracking-tight text-gray-500 transition-colors hover:text-white sm:text-base"
                              >
                                {link.text}
                              </button>
                            ) : (
                              <a
                                href={link.href}
                                target={link.external ? '_blank' : undefined}
                                rel={link.external ? 'noopener noreferrer' : undefined}
                                className="text-sm tracking-tight text-gray-500 transition-colors hover:text-white sm:text-base"
                              >
                                {link.text}
                              </a>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <motion.div variants={itemVariants} className="py-8 sm:py-10">
            {/* Logo */}
            <div className="mb-4">
              <h2 className="text-5xl font-bold text-white sm:text-6xl md:text-7xl lg:text-8xl font-display tracking-tight opacity-10">
                Sakshi Gupta
              </h2>
            </div>

            {/* Copyright and Links */}
            <div className="flex flex-col gap-4 text-xs text-gray-500 sm:flex-row sm:items-center sm:text-sm">
              <p>&copy; {new Date().getFullYear()} Sakshi Gupta</p>
              <span className="hidden sm:inline text-white/20">&bull;</span>
              <span>Agentic AI & Gen AI Developer</span>
              <span className="hidden sm:inline text-white/20">&bull;</span>
              <span>Built with React & Framer Motion</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </footer>
  )
}

export default Footer
