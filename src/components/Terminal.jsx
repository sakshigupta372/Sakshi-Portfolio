import React, { useState, useEffect } from 'react'
import { Terminal as TerminalIcon } from 'lucide-react'

const Terminal = () => {
  const [lines, setLines] = useState([])
  
  const terminalLines = [
    { text: '$ npm install @sakshi/agentic-ai', delay: 0 },
    { text: 'Installing dependencies...', delay: 800 },
    { text: '✓ ml-core@2.1.0', delay: 1400 },
    { text: '✓ iot-protocols@1.8.3', delay: 1800 },
    { text: '✓ llm-engine@3.2.1', delay: 2200 },
    { text: '✓ ai-agents@4.0.0', delay: 2600 },
    { text: '', delay: 3200 },
    { text: '✓ Successfully initialized Agentic AI System', delay: 3400 },
    { text: '✓ ML models: Connected', delay: 3800 },
    { text: '✓ IoT devices: 12 active', delay: 4200 },
    { text: '✓ AI agents: Loaded and ready', delay: 4600 },
    { text: '', delay: 5200 },
    { text: '$ Ready to build the future 🚀', delay: 5400 },
  ]

  useEffect(() => {
    terminalLines.forEach((line, index) => {
      setTimeout(() => {
        setLines(prev => [...prev, line.text])
      }, line.delay)
    })
  }, [])

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-dark-secondary border border-white/10 rounded-xl overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between bg-dark-tertiary border-b border-white/10 px-4 py-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <TerminalIcon size={16} />
              <span className="text-sm font-mono">terminal</span>
            </div>
            <div className="w-16"></div>
          </div>
          
          <div className="p-6 font-mono text-sm min-h-[400px] bg-[#0d1117]">
            {lines.map((line, index) => (
              <div key={index} className="mb-2">
                {line.startsWith('$') ? (
                  <span className="text-white">{line}</span>
                ) : line.startsWith('✓') ? (
                  <span className="text-gray-300">{line}</span>
                ) : line.includes('Installing') ? (
                  <span className="text-gray-400">{line}</span>
                ) : (
                  <span className="text-gray-400">{line}</span>
                )}
              </div>
            ))}
            {lines.length > 0 && lines.length < terminalLines.length && (
              <span className="inline-block w-2 h-4 bg-white animate-blink"></span>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Terminal
