import React from 'react'
import { Briefcase, GraduationCap, Award } from 'lucide-react'
import SpotlightCard from './reactbits/SpotlightCard'
import GradientText from './reactbits/GradientText'

const Timeline = () => {
  const experiences = [
    {
      type: 'work',
      icon: <Briefcase className="w-5 h-5" />,
      title: 'Agentic AI Developer',
      organization: 'BlockX',
      period: 'July 2025 - December 2025',
      description: 'Architected a comprehensive SDK to streamline the orchestration and deployment of autonomous AI agents for production environments. Engineered custom MCP servers to enable secure tool integration for LLMs and delivered a RAG-powered chatbot for precise, context-aware reasoning.',
      achievements: [
        'Built comprehensive SDK for autonomous AI agent deployment',
        'Engineered custom MCP servers for secure LLM tool integration',
        'Delivered RAG-powered chatbot with context-aware reasoning'
      ]
    },
    {
      type: 'work',
      icon: <Briefcase className="w-5 h-5" />,
      title: 'Freelance AI Developer',
      organization: 'Independent',
      period: '2024 - Present',
      description: 'Delivered scalable AI solutions for diverse clients, architecting robust backends and orchestrating complex API integrations. Specialized in building autonomous AI agents and multi-agent systems that streamlined workflows and optimized operational efficiency.',
      achievements: [
        'Delivered AI agent solutions for 10+ clients globally',
        'Worked with Compliledger Team (California), Omelo, and CoinX',
        'Improved workflow efficiency through multi-agent systems'
      ]
    },
    {
      type: 'education',
      icon: <GraduationCap className="w-5 h-5" />,
      title: 'B.Tech in Computer Science',
      organization: 'Acropolis Institute of Technology and Research (AITR), Indore',
      period: '2023 - 2027',
      description: 'Specializing in Artificial Intelligence and autonomous systems with focus on agentic AI, LLMs, and multi-agent orchestration.',
      achievements: [
        'CGPA: 7.4/10',
        'Presented Research papers at NSSAFE 2025',
        'Focus on AI Agents and Automation'
      ]
    }
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold font-display mb-4">
            Experience & <GradientText colors={['#ffffff', '#a855f7', '#3b82f6', '#ffffff']} speed={6}>Education</GradientText>
          </h2>
          <p className="text-gray-400 text-lg">My journey in tech and AI development</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((exp, index) => (
            <SpotlightCard
              key={index}
              className="group bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:border-white/30 hover:shadow-xl hover:shadow-white/10 transition-all duration-300 hover:scale-[1.02]"
              spotlightColor="rgba(168, 85, 247, 0.06)"
            >
              {/* Icon & Type Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white/10 border border-white/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  {exp.icon}
                </div>
                <span className="text-xs font-mono px-3 py-1 bg-white/5 border border-white/20 rounded-full">
                  {exp.type === 'work' ? 'Work' : 'Education'}
                </span>
              </div>

              {/* Title & Organization */}
              <h3 className="text-lg font-bold font-mono mb-1 line-clamp-1">{exp.title}</h3>
              <p className="text-sm text-gray-400 mb-2 line-clamp-1">{exp.organization}</p>
              <p className="text-xs text-gray-500 font-mono mb-4">{exp.period}</p>

              {/* Description */}
              <p className="text-sm text-gray-400 mb-4 line-clamp-3">{exp.description}</p>

              {/* Key Achievements - First 2 only */}
              <div className="space-y-2">
                {exp.achievements.slice(0, 2).map((achievement, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-white mt-0.5 text-xs">✓</span>
                    <span className="text-xs text-gray-300 line-clamp-1">{achievement}</span>
                  </div>
                ))}
                {exp.achievements.length > 2 && (
                  <p className="text-xs text-gray-500 mt-2">+{exp.achievements.length - 2} more</p>
                )}
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Timeline
