'use client'

import Image from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 90
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState(src)
  const [isLoading, setIsLoading] = useState(true)

  // Try WebP first, fallback to original format
  const webpSrc = src.replace(/\.(png|jpg|jpeg)$/i, '.webp')

  const handleError = () => {
    // Fallback to original format if WebP fails
    if (imageSrc.includes('.webp')) {
      setImageSrc(src)
    }
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  return (
    <div className={`relative ${className}`}>
      {/* Loading placeholder */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/10 animate-pulse rounded-lg" />
      )}
      
      <Image
        src={webpSrc}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        priority={priority}
        quality={quality}
        onError={handleError}
        onLoad={handleLoad}
        style={{
          maxWidth: '100%',
          height: 'auto',
        }}
      />
    </div>
  )
}