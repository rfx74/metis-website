
'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion'
import { useTranslation } from '@/lib/LanguageContext'
import OptimizedVideo from './OptimizedVideo'

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const t = useTranslation()

  const heroVideoSrc = useMemo(() => encodeURI('/hero-wow-loop.mp4'), [])

  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, -150])

  const isInView = useInView(containerRef, { once: true, margin: '-100px' })

  const particles = useMemo(
    () =>
      Array.from({ length: 15 }).map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 25}s`,
        animationDuration: `${20 + Math.random() * 15}s`,
        intensity: (Math.floor(Math.random() * 3) + 1) * 0.3
      })),
    []
  )

  const handleVideoLoaded = useCallback(() => {
    setIsVideoLoaded(true)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window
      setMousePosition({
        x: (clientX / innerWidth - 0.5) * 20,
        y: (clientY / innerHeight - 0.5) * 20,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) element.scrollIntoView({ behavior: 'smooth' })
  }

  const heroPoster =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1920 1080'%3E%3Cdefs%3E%3ClinearGradient id='grad' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23070a12;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%230b0f1a;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grad)' /%3E%3C/svg%3E"

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative min-h-[100svh] w-full overflow-hidden pt-20 sm:pt-24 bg-transparent"
    >
      {/* Fullscreen animated background */}
      <motion.div className="absolute inset-0 z-0" style={{ y }}>
        <img
          src={heroPoster}
          alt="Sfondo hero Metis Srl"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isVideoLoaded ? 'opacity-0' : 'opacity-100'}`}
          aria-hidden="true"
        />

        <OptimizedVideo
          src={heroVideoSrc}
          objectFit="cover"
          className="absolute inset-0 w-full h-full brightness-125 saturate-200 contrast-125"
          onLoadedData={handleVideoLoaded}
          poster={heroPoster}
          loadingClassName="bg-[#070a12]"
          errorClassName="bg-[#070a12]"
        />

        {/* Neon color boost (cyan / pink / yellow) */}
        <div
          className="absolute inset-0 pointer-events-none mix-blend-screen opacity-60"
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/25 via-fuchsia-500/20 to-yellow-300/25 blur-2xl" />
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-300/15 via-transparent to-pink-400/15 blur-3xl" />
        </div>

        <motion.div
          className="absolute inset-0 bg-black/25"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVideoLoaded ? 1 : 0.7 }}
          transition={{ duration: 1 }}
        />
      </motion.div>

      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <motion.div
            key={i}
            className="particle absolute opacity-30"
            style={{
              left: p.left,
              top: p.top,
              animationDelay: p.animationDelay,
              animationDuration: p.animationDuration
            }}
            animate={{
              x: mousePosition.x * p.intensity,
              y: mousePosition.y * p.intensity
            }}
            transition={{ type: 'spring', stiffness: 30, damping: 25 }}
          />
        ))}
      </div>

      <div
        className="absolute inset-x-0 bottom-0 h-28 sm:h-36 md:h-44 z-10 pointer-events-none bg-gradient-to-b from-transparent to-[#0b0f1a]"
        aria-hidden="true"
      />

      <motion.div className="relative z-20 text-center px-6 max-w-7xl mx-auto py-12 min-h-[calc(100svh-6rem)] flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="mb-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.5 }}
            className="mb-10 sm:mb-12"
          >
            <motion.img
              src="/metis-scritta-800.webp"
              alt="Metis"
              width={800}
              height={162}
              className="w-80 sm:w-96 md:w-[32rem] lg:w-[40rem] max-w-full h-auto mx-auto"
              style={{
                filter:
                  'brightness(0) invert(1) drop-shadow(0 0 14px rgba(255,255,255,0.92)) drop-shadow(0 0 34px rgba(255,255,255,0.60)) drop-shadow(0 0 64px rgba(255,255,255,0.30))',
                WebkitFilter:
                  'brightness(0) invert(1) drop-shadow(0 0 14px rgba(255,255,255,0.92)) drop-shadow(0 0 34px rgba(255,255,255,0.60)) drop-shadow(0 0 64px rgba(255,255,255,0.30))'
              }}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="relative mb-6"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white mb-4 tracking-tight">
              {t.hero.payoff}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-white/50 to-white/90 mx-auto rounded-full" />
          </motion.div>

          <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/85 mb-8 max-w-5xl mx-auto leading-relaxed font-medium text-justify">
            {t.hero.subtitle}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 2.2 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <motion.button
            className="btn-primary group relative overflow-hidden"
            style={{ backgroundColor: '#1fdefe' }}
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
            className="btn-primary group relative overflow-hidden"
            style={{ backgroundColor: '#ff45a9' }}
            onClick={() => scrollToSection('method')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">{t.hero.viewPortfolio}</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-900"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
            <motion.span
              className="relative z-10 inline-block ml-2"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.button>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute top-1/2 left-10 md:left-20 z-10"
        animate={{ y: [-20, 20, -20], rotate: [0, 180, 360] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-12 h-12 md:w-16 md:h-16 glass rounded-full opacity-20" />
      </motion.div>

      <motion.div
        className="absolute top-1/3 right-10 md:right-20 z-10"
        animate={{ y: [20, -20, 20], rotate: [360, 180, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-10 h-10 md:w-14 md:h-14 glass rounded-full opacity-25" />
      </motion.div>
    </section>
  )
}