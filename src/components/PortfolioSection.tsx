'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { useTranslation } from '@/lib/LanguageContext'

export default function PortfolioSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)
  const t = useTranslation()

  const technologies = ['Next.js', 'React', 'Stripe', 'MongoDB']
  const projectGradients = [
    'from-blue-500/30 to-purple-500/30',
    'from-green-500/30 to-blue-500/30',
    'from-orange-500/30 to-red-500/30'
  ]

  const projects = [
    t.portfolio.projects.fintech,
    t.portfolio.projects.defi,
    t.portfolio.projects.tokenization
  ]

  return (
    <section id="portfolio" ref={ref} className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 sm:mb-8"
        >
          {t.portfolio.title.split(' ')[0]} <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t.portfolio.title.split(' ').slice(1).join(' ')}
          </span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg sm:text-xl lg:text-2xl text-gray-700 mb-12 sm:mb-16 max-w-3xl mx-auto px-4"
        >
          {t.portfolio.description}
        </motion.p>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 mb-12 sm:mb-16">
            {/* Featured Project */}
            <motion.div 
              initial={{ opacity: 0, x: -60 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="glass-light rounded-3xl p-6 sm:p-8 md:p-12"
              onHoverStart={() => setHoveredProject(0)}
              onHoverEnd={() => setHoveredProject(null)}
            >
              <motion.div 
                className="w-full h-48 sm:h-64 bg-gradient-to-br from-blue-500/30 to-green-500/30 rounded-xl mb-6 sm:mb-8 relative overflow-hidden"
                animate={hoveredProject === 0 ? { scale: 1.05 } : { scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white text-sm font-medium opacity-80">
                  E-commerce Platform
                </div>
              </motion.div>
              
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                {t.portfolio.featured.title}
              </h3>
              
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base leading-relaxed">
                {t.portfolio.featured.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4 sm:mb-6 justify-center">
                {technologies.map((tech, index) => (
                  <motion.span 
                    key={tech} 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                    className="px-2 sm:px-3 py-1 bg-gray-200 rounded-full text-xs sm:text-sm text-gray-800"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
              
              <motion.button 
                className="btn-secondary-dark w-full sm:w-auto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {t.portfolio.featured.viewDetails}
              </motion.button>
            </motion.div>
            
            {/* Other Projects Grid */}
            <motion.div 
              initial={{ opacity: 0, x: 60 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6"
            >
              {projects.map((project, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 40 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.15 }}
                  className="glass-light rounded-2xl p-4 sm:p-6 group cursor-pointer"
                  onHoverStart={() => setHoveredProject(index + 1)}
                  onHoverEnd={() => setHoveredProject(null)}
                  whileHover={{ y: -5 }}
                >
                  <motion.div 
                    className={`w-full h-24 sm:h-32 bg-gradient-to-br ${projectGradients[index]} rounded-xl mb-3 sm:mb-4 relative overflow-hidden`}
                    animate={hoveredProject === index + 1 ? { scale: 1.05 } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent group-hover:from-black/20 transition-all duration-300" />
                  </motion.div>
                  
                  <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {project.title}
                  </h4>
                  
                  <p className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors duration-300">
                    {project.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}