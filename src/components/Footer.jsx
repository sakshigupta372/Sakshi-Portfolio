import React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUp, Github, Linkedin, Mail, Twitter } from 'lucide-react'
import Magnet from './reactbits/Magnet'
import { RevealWords } from './Reveal'
import { scrollToTop } from './SmoothScroll'
import { goToSection } from '../lib/router.jsx'
import { trackEvent } from '../lib/analytics.js'

const SOCIALS = [
  { href: 'https://github.com/sakshigupta372', label: 'GitHub', icon: Github },
  { href: 'https://www.linkedin.com/in/sakshi-gupta-ba858a292/', label: 'LinkedIn', icon: Linkedin },
  { href: 'https://x.com/gupt27951', label: 'X', icon: Twitter },
  { href: 'mailto:sg6227174@gmail.com', label: 'Email', icon: Mail },
]

const Footer = () => {
  const { scrollYProgress } = useScroll()
  const x = useTransform(scrollYProgress, [0.7, 1], [0, -80])

  const toTop = () => scrollToTop()

  return (
    <footer className="overflow-hidden border-t border-line">
      <div className="px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <motion.p style={{ x }} className="mb-6 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
            06 — Next
          </motion.p>

          <RevealWords
            as="p"
            text="Let's build something autonomous."
            className="max-w-4xl font-display text-5xl leading-[0.95] tracking-tight text-ink sm:text-7xl lg:text-[6.5rem]"
          />

          <Magnet strength={0.18} range={140} className="mt-10 inline-block">
            <a
              href="mailto:sg6227174@gmail.com"
              className="group inline-flex items-center gap-3 font-display text-2xl text-ink sm:text-3xl"
            >
              <span className="underline decoration-line underline-offset-[10px] transition-colors group-hover:decoration-ink">
                sg6227174@gmail.com
              </span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
          </Magnet>
        </div>
      </div>

      <div className="border-t border-line px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">© {new Date().getFullYear()} Sakshi Gupta</p>

          <div className="flex items-center gap-6 text-sm text-muted">
            <button type="button" onClick={() => goToSection('projects')} className="hover:text-ink">
              Work
            </button>
            <a href="/resume.pdf" onClick={() => trackEvent('resume_download', { from: 'footer' })} className="hover:text-ink">Resume</a>
            <a href="mailto:sg6227174@gmail.com" className="hover:text-ink">Email</a>
          </div>

          <div className="flex items-center gap-4">
            {SOCIALS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                aria-label={item.label}
                className="text-muted transition-colors hover:text-ink"
              >
                <item.icon size={16} />
              </a>
            ))}
            <button
              type="button"
              onClick={toTop}
              className="ml-2 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs uppercase tracking-[0.14em] text-ink hover:border-ink"
            >
              Top
              <ArrowUp size={12} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
