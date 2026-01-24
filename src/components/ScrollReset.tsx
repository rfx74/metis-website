'use client'

import { useEffect } from 'react'

export default function ScrollReset() {
  useEffect(() => {
    // Ensure initial load starts at top/hero
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    const resetToTop = () => {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }

    resetToTop()
    window.addEventListener('load', resetToTop)
    window.addEventListener('pageshow', resetToTop)

    return () => {
      window.removeEventListener('load', resetToTop)
      window.removeEventListener('pageshow', resetToTop)
    }
  }, [])
  return null
}
