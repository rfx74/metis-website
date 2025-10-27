'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useTranslation } from '@/lib/LanguageContext'
import OptimizedVideo from './OptimizedVideo'

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const t = useTranslation()
  
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, -150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  const scale = useTransform(scrollY, [0, 300], [1, 1.1])
  
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  const handleVideoLoaded = () => {
    setIsVideoLoaded(true)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window
      setMousePosition({
        x: (clientX / innerWidth - 0.5) * 20,
        y: (clientY / innerHeight - 0.5) * 20
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section 
      id="home"
      ref={containerRef}
      className="relative min-h-screen flex flex-col overflow-hidden"
    >
      {/* Video in primo piano - occupa 70% della viewport */}
      <motion.div 
        className="relative z-20 flex-grow flex items-center justify-center"
        style={{ height: '70vh' }}
      >
        <motion.div
          className="w-full h-full relative"
          style={{ y, scale }}
        >
          <OptimizedVideo
            src="/hero_video.mp4"
            className="w-full h-full object-cover rounded-lg shadow-2xl"
            onLoadedData={handleVideoLoaded}
            poster="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23dde0e3;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23dfe2e5;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grad)' /%3E%3C/svg%3E"
          />
          
          {/* Rimuovo l'overlay del logo dal video */}
          {/* Subtle video overlay per contrasto */}
          <motion.div 
            className="absolute inset-0 bg-black/10 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: isVideoLoaded ? 1 : 0.2 }}
            transition={{ duration: 1 }}
          />
        </motion.div>
      </motion.div>

      {/* Dynamic Particles con intensità ridotta */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="particle absolute opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 25}s`,
              animationDuration: `${20 + Math.random() * 15}s`,
            }}
            animate={{
              x: mousePosition.x * (i % 3 + 1) * 0.3,
              y: mousePosition.y * (i % 3 + 1) * 0.3,
            }}
            transition={{ type: "spring", stiffness: 30, damping: 25 }}
          />
        ))}
      </div>

      {/* Contenuto testuale sotto il video */}
      <motion.div 
        className="relative z-20 text-center px-6 max-w-7xl mx-auto py-12"
        style={{ opacity }}
      >
        {/* Tagline e descrizione */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="mb-8"
        >
          {/* Logo Metis prima del titolo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="mb-6"
          >
            <motion.img
              src="/Metis scritta trasparente.png"
              alt="Metis"
              className="w-48 md:w-64 lg:w-80 h-auto mx-auto drop-shadow-lg"
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="relative mb-6"
          >
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-light text-gray-800 mb-4 tracking-wide">
              {t.hero.tagline}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-gray-600 to-gray-800 mx-auto rounded-full" />
          </motion.div>

          <p className="text-lg md:text-xl lg:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed font-medium">
            {t.hero.description}
          </p>
        </motion.div>

        {/* Key Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1.5 }}
          className="flex flex-wrap justify-center gap-6 mb-8"
        >
          {t.hero.features.map((feature, index) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.7 + index * 0.1 }}
              className="glass-dark px-4 py-2 rounded-full text-sm md:text-base text-gray-100 font-medium"
            >
              {feature}
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 2.2 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <motion.button
            className="btn-primary group relative overflow-hidden"
            onClick={() => scrollToSection('services')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">{t.hero.exploreServices}</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-900"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
          
          <motion.button
            className="btn-secondary-dark group"
            onClick={() => scrollToSection('portfolio')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t.hero.viewPortfolio}
            <motion.span
              className="inline-block ml-2"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30"
      >
        <motion.div
          className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center cursor-pointer"
          onClick={() => scrollToSection('services')}
          whileHover={{ scale: 1.1 }}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-3 bg-gray-700 rounded-full mt-2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>

      {/* Floating Decorative Elements - posizionati per non interferire */}
      <motion.div
        className="absolute top-1/2 left-10 md:left-20 z-10"
        animate={{
          y: [-20, 20, -20],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-12 h-12 md:w-16 md:h-16 glass rounded-full opacity-20" />
      </motion.div>
      
      <motion.div
        className="absolute top-1/3 right-10 md:right-20 z-10"
        animate={{
          y: [20, -20, 20],
          rotate: [360, 180, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-10 h-10 md:w-14 md:h-14 glass rounded-full opacity-25" />
      </motion.div>
    </section>
  )
}