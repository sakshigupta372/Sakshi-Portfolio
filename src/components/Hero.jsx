import React from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Download, Github, Linkedin, Twitter } from 'lucide-react'
import InteractivePortrait from './InteractivePortrait'
import ScrollCue from './ScrollCue'
import RotatingText from './reactbits/RotatingText'
import { scrollToId } from './SmoothScroll'
import { LINKS } from '../lib/ui'
import { trackEvent } from '../lib/analytics.js'

const item = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

// The name and description are the largest text on first paint. Keeping them
// fully opaque (slide only) lets the browser count them as painted right away,
// which is what Lighthouse's LCP measures.
const slide = {
  hidden: { y: 14 },
  visible: { y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

const ROLES = ['Agentic AI Developer', 'MCP Server Builder', 'LLM Backend Engineer', 'Multi-Agent Architect']

const Hero = () => {
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const portraitY = useTransform(scrollY, [0, 500], [0, 70])
  const portraitScale = useTransform(scrollY, [0, 500], [1, 0.92])

  return (
    <section className="relative flex min-h-screen items-center overflow-x-hidden px-5 pb-16 pt-28 sm:px-8">
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <motion.div
          className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }}
        >
          <div className="max-w-xl">
            <motion.p
              variants={item}
              className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-line bg-surface/70 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-muted backdrop-blur"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Available · Remote &amp; full-time
            </motion.p>

            <motion.h1
              variants={slide}
              className="font-display text-5xl leading-[0.95] tracking-tight text-ink sm:text-6xl lg:text-[5.5rem]"
            >
              Sakshi Gupta
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-5 min-h-[2.5rem] font-display text-2xl italic text-accent sm:text-[1.75rem]"
            >
              {reduce ? ROLES[0] : <RotatingText texts={ROLES} interval={2600} />}
            </motion.p>

            <motion.p
              variants={slide}
              className="mt-4 max-w-md text-base leading-relaxed text-muted sm:text-lg"
            >
              I build multi-agent systems, MCP servers, and backends that hold up in production.
            </motion.p>

            <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => scrollToId('projects')}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-opacity hover:opacity-80"
              >
                View work
                <ArrowRight size={16} />
              </button>
              <a
                href="/resume.pdf"
                download="Sakshi_Gupta_Resume.pdf"
                onClick={() => trackEvent('resume_download', { from: 'hero' })}
                className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-ink"
              >
                <Download size={15} />
                Resume
              </a>
            </motion.div>

            <motion.div variants={item} className="mt-8 flex items-center gap-4 text-muted">
              <a
                href={LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="transition-colors hover:text-ink"
              >
                <Github size={18} />
              </a>
              <a
                href={LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="transition-colors hover:text-ink"
              >
                <Linkedin size={18} />
              </a>
              <a
                href={LINKS.x}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="transition-colors hover:text-ink"
              >
                <Twitter size={18} />
              </a>
            </motion.div>
          </div>

          <motion.div variants={item} className="flex justify-center lg:justify-end">
            <motion.div
              style={{ y: portraitY, scale: portraitScale }}
              className="relative w-[19rem] sm:w-[23rem] lg:w-[27rem]"
            >
              <InteractivePortrait />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 sm:block">
        <ScrollCue targetId="projects" />
      </div>
    </section>
  )
}

export default Hero
