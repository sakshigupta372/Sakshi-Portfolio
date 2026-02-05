import React from 'react'
import { Brain, Blocks } from 'lucide-react'

const StatsStrip = () => {
  const stats = [
    {
      icon: <Brain className="w-5 h-5" />,
      label: 'Focus',
      value: 'Agentic AI Systems'
    },
    {
      icon: <Blocks className="w-5 h-5" />,
      label: 'Core Tech',
      value: 'AI Agents & Automation'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl shadow-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="flex items-center space-x-4 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:border-white/40 hover:shadow-lg hover:shadow-white/10 transition-all duration-300"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-white/10 border border-white/30 rounded-lg text-white">
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-400">{stat.label}</p>
                <p className="text-lg font-semibold font-mono text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StatsStrip
