import React from 'react'
import { Play, Droplets, Code2, Database, Cpu, Globe, ExternalLink, Github } from 'lucide-react'

const Features = () => {
  const projects = [
    {
      id: 'health-diagnosis',
      title: 'Health Diagnosis System',
      description: 'Python-based application leveraging a crew of domain-specialized AI agents to streamline clinical decision-making. The system utilizes OpenAI for logic orchestration and Google Gemini Vision for high-fidelity medical image analysis (identifying modalities, findings, and severity).',
      tags: ['Crew AI', 'Google Gemini', 'Streamlit'],
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop',
      demoLink: 'https://github.com/sakshigupta372/Health_Diagnosis_System',
      githubLink: 'https://github.com/sakshigupta372/Health_Diagnosis_System'
    },
    {
      id: 'krishi-setu',
      title: 'Krishi Setu',
      description: 'A complete real-time agricultural IoT system featuring ESP32 hardware integration, live sensor monitoring, remote irrigation control.',
      tags: ['IoT', 'ESP32', 'Arduino'],
      image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&auto=format&fit=crop',
      demoLink: 'https://github.com/sakshigupta372/Krishi_Setu',
      githubLink: 'https://github.com/sakshigupta372/Krishi_Setu'
    },
    {
      id: 'compliledger-rag',
      title: 'CompliLedger Website RAG Chatbot',
      description: 'A privacy-first RAG backend that uses Google Gemini 2.5 Pro for generation and Google Embeddings for retrieval over your public site content.',
      tags: ['RAG', 'Google Gemini', 'LangChain'],
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop',
      demoLink: 'https://compliagent.vercel.app',
      githubLink: 'https://github.com/sakshigupta372'
    },
    {
      id: 'nlp',
      title: 'NLP Text Analyzer',
      description: 'Sentiment analysis tool processing 1M+ documents. Achieved 94% accuracy in entity recognition across multiple languages.',
      tags: ['NLP', 'AI', 'Python'],
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop',
      demoLink: 'https://github.com/sakshigupta372',
      githubLink: 'https://github.com/sakshigupta372'
    },
    {
      id: 'cloud',
      title: 'Cloud Infrastructure',
      description: 'Microservices architecture handling 50K requests/min. Reduced infrastructure costs by 45% using containerization.',
      tags: ['AWS', 'Docker', 'K8s'],
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop',
      demoLink: 'https://github.com/sakshigupta372',
      githubLink: 'https://github.com/sakshigupta372'
    },
    {
      id: 'data',
      title: 'Data Analytics Dashboard',
      description: 'Real-time analytics processing 100GB+ daily data. Predictive models with 89% accuracy for business forecasting.',
      tags: ['Analytics', 'React', 'Python'],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop',
      demoLink: 'https://github.com/sakshigupta372',
      githubLink: 'https://github.com/sakshigupta372'
    }
  ]

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold font-mono mb-4">
            Featured <span className="text-gradient">Projects & Skills</span>
          </h2>
          <p className="text-gray-400 text-lg">Building innovative solutions with AI Agents and Intelligent Automation</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative bg-dark-secondary border border-white/10 rounded-xl overflow-hidden hover:border-white/40 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-white/10"
            >
              <div className="relative h-48 overflow-hidden bg-dark-tertiary">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-secondary via-dark-secondary/60 to-transparent"></div>
                <div className="absolute top-3 right-3 flex gap-2">
                  <a 
                    href={project.demoLink}
                    className="p-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-all"
                    onClick={(e) => e.preventDefault()}
                  >
                    <ExternalLink size={16} className="text-white" />
                  </a>
                  <a 
                    href={project.githubLink}
                    className="p-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg hover:bg-white/20 transition-all"
                    onClick={(e) => e.preventDefault()}
                  >
                    <Github size={16} className="text-white" />
                  </a>
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="text-xl font-bold font-mono mb-2 group-hover:text-white transition-colors">{project.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>

                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-mono px-2.5 py-1 bg-dark border border-white/20 rounded-md text-gray-300 hover:text-white hover:border-white/50 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
