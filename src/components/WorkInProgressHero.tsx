'use client'

import { motion } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'

export default function WorkInProgressHero() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowVideo(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleVideoLoad = () => {
    setIsVideoLoaded(true)
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Fallback silenzioso se autoplay non funziona
      })
    }
  }

  return (
    <section className="relative h-screen w-full overflow-hidden bg-gradient-to-br from-[#dde0e3] to-[#dfe2e5]">
      {/* Video Background */}
      {showVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isVideoLoaded ? 1 : 0 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 z-0"
        >
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            onLoadedData={handleVideoLoad}
            className="w-full h-full object-cover"
          >
            <source src="/hero_video.mp4" type="video/mp4" />
          </video>
          
          {/* Video Overlay */}
          <div className="absolute inset-0 bg-black/20" />
        </motion.div>
      )}

      {/* Content Container */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mb-12"
        >
          <img
            src="/solo logo trasparente.png"
            alt="Metis Logo"
            className="w-32 h-32 md:w-40 md:h-40 mx-auto drop-shadow-2xl"
          />
        </motion.div>

        {/* Company Name */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-6xl md:text-8xl font-bold text-white drop-shadow-lg">
            METIS
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-light tracking-wide">
            Innovative IT Solutions
          </p>
        </motion.div>

        {/* Work in Progress Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="glass rounded-3xl p-8 md:p-12 max-w-2xl mx-auto"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            🚧 Work in Progress
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-6 leading-relaxed">
            Il nostro nuovo sito web è in fase di sviluppo. <br />
            Stiamo creando qualcosa di straordinario per voi.
          </p>
          <p className="text-base md:text-lg text-white/80">
            <strong>Coming Soon</strong> ✨
          </p>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-12 text-center"
        >
          <p className="text-white/80 mb-2">
            📧 info@metis-tech.it
          </p>
          <p className="text-white/80">
            📱 +39 370 360 3909
          </p>
        </motion.div>

        {/* Animated Loading Dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="mt-8 flex space-x-2"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-white/60 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Subtle Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 3 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60"
      >
        <div className="flex flex-col items-center">
          <span className="text-sm mb-2">Developing</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-8 bg-white/40 rounded-full"
          />
        </div>
      </motion.div>
    </section>
  )
}