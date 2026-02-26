import React, { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useAnimationFrame } from 'framer-motion'
import { Sparkles, ExternalLink, Github } from 'lucide-react'
import GradientText from './reactbits/GradientText'
import ShinyText from './reactbits/ShinyText'

const PROJECTS = [
  {
    id: 1,
    title: 'Health Diagnosis System',
    description: 'Multi-agent AI clinical decision-making system',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop',
    height: 'h-[420px]',
    bgColor: 'bg-blue-500/10',
    demoLink: 'https://github.com/sakshigupta372/Health_Diagnosis_System',
    githubLink: 'https://github.com/sakshigupta372/Health_Diagnosis_System',
    tags: ['Crew AI', 'Gemini', 'Streamlit'],
    gradient: 'from-blue-500 to-purple-500',
  },
  {
    id: 2,
    title: 'Krishi Setu',
    description: 'Real-time agricultural IoT monitoring system',
    image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&auto=format&fit=crop',
    height: 'h-[380px]',
    bgColor: 'bg-green-500/10',
    demoLink: 'https://github.com/sakshigupta372/Krishi_Setu',
    githubLink: 'https://github.com/sakshigupta372/Krishi_Setu',
    tags: ['IoT', 'ESP32', 'Arduino'],
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    id: 3,
    title: 'CompliLedger RAG',
    description: 'Privacy-first RAG chatbot with Gemini 2.5 Pro',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop',
    height: 'h-[440px]',
    bgColor: 'bg-violet-500/10',
    demoLink: 'https://compliagent.vercel.app',
    githubLink: 'https://github.com/sakshigupta372',
    tags: ['RAG', 'Gemini', 'LangChain'],
    gradient: 'from-violet-500 to-fuchsia-500',
  },
  {
    id: 4,
    title: 'Audit-AI',
    description: 'AI Website Auditor with PDF reports & analysis',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop',
    height: 'h-[400px]',
    bgColor: 'bg-orange-500/10',
    demoLink: 'https://huggingface.co/spaces/Sakshi2005/Audit_AI',
    githubLink: 'https://github.com/sakshigupta372/AuditAI',
    tags: ['Python', 'Gradio', 'Gemini'],
    gradient: 'from-orange-500 to-red-500',
  },
  {
    id: 5,
    title: 'HireBoard-AI',
    description: 'AI-Powered hiring platform for seekers & recruiters',
    image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&auto=format&fit=crop',
    height: 'h-[410px]',
    bgColor: 'bg-cyan-500/10',
    demoLink: 'https://frontend-chi-blush.vercel.app/',
    githubLink: 'https://github.com/sakshigupta372/HireBoard-AI',
    tags: ['FastAPI', 'Next.js', 'TypeScript'],
    gradient: 'from-cyan-500 to-blue-500',
  },
]

const ProjectShowcase = () => {
  const [isDragging, setIsDragging] = useState(false)
  const [hoveredId, setHoveredId] = useState(null)
  const [oneSetWidth, setOneSetWidth] = useState(0)

  const baseVelocity = -25
  const baseX = useMotionValue(0)
  const scrollVelocity = useRef(baseVelocity)
  const scrollerRef = useRef(null)

  const items = [
    ...PROJECTS,
    ...PROJECTS,
    ...PROJECTS,
    ...PROJECTS,
    ...PROJECTS,
    ...PROJECTS,
  ]

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 640
      const itemWidth = isMobile ? 280 : 340
      const gap = 24
      const width = (itemWidth + gap) * PROJECTS.length
      setOneSetWidth(width)
      baseX.set(-width)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [baseX])

  useAnimationFrame((t, delta) => {
    if (!oneSetWidth) return

    if (!isDragging) {
      scrollVelocity.current = scrollVelocity.current * 0.9 + baseVelocity * 0.1
      const moveBy = scrollVelocity.current * (delta / 1000)
      baseX.set(baseX.get() + moveBy)

      const x = baseX.get()
      if (x <= -oneSetWidth * 2) {
        baseX.set(x + oneSetWidth)
      } else if (x > 0) {
        baseX.set(x - oneSetWidth)
      }
    }
  })

  return (
    <section id="projects" className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-[1400px] mx-auto w-full relative z-10">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-xl">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
              <ShinyText text="Featured Work" className="text-sm font-mono" speed={4} />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-mono tracking-tight text-white leading-tight mb-4">
              Crafting <GradientText colors={['#a855f7', '#3b82f6', '#22d3ee', '#a855f7']} speed={5}>digital experiences</GradientText> that inspire.
            </h2>
            <p className="text-gray-400 text-base sm:text-lg mb-8">
              Building the future with AI Agents, Automation, and Intelligent Systems
            </p>
            <motion.button
              onClick={() => window.open('https://github.com/sakshigupta372', '_blank')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3.5 rounded-full bg-white text-black font-medium text-sm sm:text-base hover:bg-gray-200 transition-colors duration-200"
            >
              View All Projects
            </motion.button>
          </div>
        </motion.div>

        {/* Infinite Carousel */}
        <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 overflow-hidden py-16 sm:py-20">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>

          <motion.div
            ref={scrollerRef}
            className="flex items-end gap-6 cursor-grab active:cursor-grabbing"
            style={{ x: baseX }}
            drag="x"
            onDragStart={() => setIsDragging(true)}
            onDragEnd={(e, info) => {
              setIsDragging(false)
              scrollVelocity.current = info.velocity.x
            }}
            dragElastic={0.05}
            dragMomentum={false}
          >
            {items.map((item, index) => (
              <motion.div
                key={`${item.id}-${index}`}
                className={`shrink-0 w-[280px] sm:w-[340px] ${item.height} rounded-2xl overflow-hidden select-none relative pointer-events-auto group`}
                animate={
                  hoveredId === index
                    ? {
                        scale: 1.05,
                        rotateX: -12,
                        y: -30,
                        zIndex: 50,
                      }
                    : {
                        scale: 1,
                        rotateX: 0,
                        y: 0,
                        zIndex: 1,
                      }
                }
                transition={{
                  duration: 0.35,
                  ease: 'backOut',
                  zIndex: { delay: hoveredId === index ? 0 : 0.4 },
                }}
                onMouseEnter={() => setHoveredId(index)}
                onMouseLeave={() => setHoveredId(null)}
                style={{ transformPerspective: 1000 }}
              >
                <div className={`w-full h-full ${item.bgColor} relative`}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover object-center pointer-events-none"
                    draggable="false"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                  {/* Hover glow border */}
                  <div className={`absolute inset-0 rounded-2xl border-2 border-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    style={{
                      borderImage: hoveredId === index ? `linear-gradient(135deg, var(--tw-gradient-from), var(--tw-gradient-to)) 1` : 'none',
                    }}
                  ></div>

                  {/* Top badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <div className="flex gap-1.5">
                      {item.tags.slice(0, 2).map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-mono px-2 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-base sm:text-lg font-bold text-white font-mono mb-1 line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-300 mb-3 line-clamp-2">
                      {item.description}
                    </p>

                    {/* Action buttons - visible on hover */}
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                      <a
                        href={item.demoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white text-xs font-medium hover:bg-white/20 transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="w-3 h-3" />
                        Demo
                      </a>
                      <a
                        href={item.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white text-xs font-medium hover:bg-white/20 transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Github className="w-3 h-3" />
                        Code
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Drag hint */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1 }}
          className="text-center text-gray-500 text-sm font-mono"
        >
          ← Drag to explore →
        </motion.p>
      </div>
    </section>
  )
}

export default ProjectShowcase
