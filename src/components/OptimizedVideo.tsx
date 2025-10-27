'use client'

import { useEffect, useRef, useState } from 'react'

interface OptimizedVideoProps {
  src: string
  className?: string
  poster?: string
  onLoadedData?: () => void
}

export default function OptimizedVideo({ 
  src, 
  className = '', 
  poster,
  onLoadedData 
}: OptimizedVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Intersection Observer per lazy loading più aggressivo
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Inizia il caricamento solo quando è visibile
            video.preload = 'metadata'
            video.load()
            observer.disconnect() // Disconnetti dopo il primo trigger
          }
        })
      },
      { 
        threshold: 0.1, // Trigger quando 10% è visibile
        rootMargin: '50px' // Inizia il preload 50px prima
      }
    )

    observer.observe(video)

    const handleLoadedData = () => {
      setIsLoaded(true)
      onLoadedData?.()
      
      // Optimize video playback con retry logic
      const attemptPlay = async () => {
        try {
          await video.play()
        } catch (err) {
          console.warn('Video autoplay failed, waiting for user interaction:', err)
          // Fallback: play on first user interaction
          const playOnInteraction = () => {
            video.play().catch(console.error)
            document.removeEventListener('click', playOnInteraction)
            document.removeEventListener('touchstart', playOnInteraction)
          }
          document.addEventListener('click', playOnInteraction, { once: true })
          document.addEventListener('touchstart', playOnInteraction, { once: true })
        }
      }
      
      attemptPlay()
    }

    const handleError = () => {
      setError(true)
      console.error('Video failed to load')
    }

    const handleCanPlay = () => {
      // Ensure video is optimized for web
      video.playbackRate = 1.0
      
      // Preload optimization
      if (video.readyState >= 2) {
        handleLoadedData()
      }
    }

    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('error', handleError)
    video.addEventListener('canplay', handleCanPlay)

    // Set video attributes for maximum optimization
    video.preload = 'none' // Non caricare fino a quando non è necessario
    video.playsInline = true
    video.muted = true
    video.loop = true
    video.controls = false
    video.disablePictureInPicture = true

    return () => {
      observer?.disconnect()
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('error', handleError)
      video.removeEventListener('canplay', handleCanPlay)
    }
  }, [onLoadedData])

  if (error) {
    return (
      <div className={`bg-metis-gradient ${className}`}>
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center text-gray-600">
            <div className="text-4xl mb-4">🎬</div>
            <p>Video not available</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Loading indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-metis-gradient animate-pulse flex items-center justify-center z-10">
          <div className="text-center text-gray-600">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-600 rounded-full animate-spin mb-4"></div>
            <p>Loading video...</p>
          </div>
        </div>
      )}
      
      <video
        ref={videoRef}
        className={`w-full h-full object-cover object-center transition-opacity duration-1000 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        preload="none"
        controlsList="nodownload nofullscreen noremoteplaybook"
        disablePictureInPicture
      >
        {/* Ottimizzato per formati multipli - WebM first per performance */}
        <source src={src.replace('.mp4', '.webm')} type="video/webm" />
        <source src={src} type="video/mp4" />
        
        {/* Fallback per browser molto vecchi */}
        <div className="w-full h-full bg-metis-gradient flex items-center justify-center">
          <p className="text-gray-600">Your browser doesn't support video playback.</p>
        </div>
      </video>
    </div>
  )
}