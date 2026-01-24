'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  sizes?: string
  className?: string
  priority?: boolean
  quality?: number
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  sizes,
  className = '',
  priority = false,
  quality = 90
}: OptimizedImageProps) {
  const webpSrc = useMemo(() => src.replace(/\.(png|jpg|jpeg)$/i, '.webp'), [src])
  const [imageSrc, setImageSrc] = useState(webpSrc)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setImageSrc(webpSrc)
    setIsLoading(true)
  }, [webpSrc])

  const handleError = () => {
    // Fallback to original format if WebP fails
    if (imageSrc === webpSrc && webpSrc !== src) {
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
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
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