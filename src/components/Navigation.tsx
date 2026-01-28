'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from '@/lib/LanguageContext'
import { useLanguage } from '@/lib/LanguageContext'
import LanguageSelector from './LanguageSelector'

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [isDarkSection, setIsDarkSection] = useState(true)
  const [isLogoAnimating, setIsLogoAnimating] = useState(false)
  const logoAnimTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const navRef = useRef<HTMLElement | null>(null)
  const t = useTranslation()
  const { language, setLanguage } = useLanguage()

  const isLightTransparent = !isDarkSection && !isScrolled

  const navItems = useMemo(() => [
    { href: '#home', label: t.nav.home },
    { href: '#services', label: t.nav.services },
    { href: '#about', label: t.nav.about },
    { href: '#method', label: t.nav.portfolio },
    { href: '#contact', label: t.nav.contact }
  ], [t.nav])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)')

    const handleMediaChange = () => {
      setIsDesktop(mediaQuery.matches)
    }

    handleMediaChange()
    mediaQuery.addEventListener('change', handleMediaChange)

    return () => mediaQuery.removeEventListener('change', handleMediaChange)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const navHeight = (navRef.current?.getBoundingClientRect().height ?? 0) + 12
      setIsScrolled(window.scrollY > 50)

      const viewportLine = navHeight + 8

      // Update active section based on scroll position using offset line near top
      const sections = navItems.map(item => item.href.slice(1))
      const current = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= viewportLine && rect.bottom >= viewportLine
        }
        return false
      })
      setActiveSection(current || 'home')

      // Drive nav theme by actual background zones
      const darkSections = ['home', 'services']
      const isDark = darkSections.some((section) => {
        const element = document.getElementById(section)
        if (!element) return false
        const rect = element.getBoundingClientRect()
        return rect.top <= viewportLine && rect.bottom >= viewportLine
      })
      setIsDarkSection(isDark)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [navItems])

  useEffect(() => {
    return () => {
      if (logoAnimTimeoutRef.current) {
        clearTimeout(logoAnimTimeoutRef.current)
      }
    }
  }, [])

  const scrollToSection = (href: string) => {
    const section = href === '#home' ? 'top' : href.slice(1)
    setIsMobileMenuOpen(false)

    if (section === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setActiveSection('home')
      return
    }

    const element = document.getElementById(section)
    if (!element) return

    const doScroll = (behavior: ScrollBehavior = 'smooth') => {
      const navHeight = (navRef.current?.getBoundingClientRect().height ?? 0) + 12
      const targetTop = element.getBoundingClientRect().top + window.scrollY - navHeight
      window.scrollTo({ top: Math.max(targetTop, 0), behavior })
    }

    requestAnimationFrame(() => {
      doScroll('smooth')
      window.setTimeout(() => doScroll('auto'), 220)
    })

    setActiveSection(section)
  }

  const triggerLogoAnimation = () => {
    setIsLogoAnimating(true)
    if (logoAnimTimeoutRef.current) {
      clearTimeout(logoAnimTimeoutRef.current)
    }
    logoAnimTimeoutRef.current = setTimeout(() => {
      setIsLogoAnimating(false)
    }, 3200)
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isDarkSection
            ? (isDesktop || isScrolled ? 'glass-dark backdrop-blur-xl border-b border-white/10' : 'bg-transparent')
            : `${isDesktop || isScrolled ? 'bg-white/85 backdrop-blur-xl border-b border-black/10' : 'bg-transparent border-b border-transparent'}`
        }`}
        ref={navRef}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer flex items-center outline-none focus:outline-none"
              onClick={() => {
                triggerLogoAnimation()
                scrollToSection('#home')
              }}
              tabIndex={-1}
            >
              <div className="flex items-center">
                <motion.img
                  src="/solo-logo-80.webp"
                  srcSet="/solo-logo-80.webp 1x, /solo-logo-160.webp 2x"
                  alt="Metis Logo"
                  width={40}
                  height={30}
                  className="w-8 h-8 md:w-10 md:h-10 outline-none focus:outline-none"
                  layoutId="nav-logo"
                />
              </div>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-center flex-wrap gap-x-3 lg:gap-x-6 gap-y-2">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  href={item.href}
                  onClick={(event) => {
                    event.preventDefault()
                    scrollToSection(item.href)
                  }}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    activeSection === (item.href === '#home' ? 'home' : item.href.slice(1))
                      ? (isDarkSection ? 'text-white' : 'text-gray-900')
                      : (isDarkSection ? 'text-white/70 hover:text-white' : 'text-gray-900/70 hover:text-gray-900')
                  } ${isLightTransparent ? 'drop-shadow-sm' : ''}`}
                >
                  {item.label}
                  {activeSection === (item.href === '#home' ? 'home' : item.href.slice(1)) && (
                    <motion.div
                      layoutId="activeTab"
                      className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${
                        isDarkSection ? 'from-white/60 to-white' : 'from-gray-600 to-gray-900'
                      }`}
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.a>
              ))}
              
              {/* Language Selector */}
              <LanguageSelector variant={isDarkSection ? 'dark' : 'light'} />
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <button 
                className="btn-primary text-sm"
                onClick={() => scrollToSection('#contact')}
              >
                {t.nav.getStarted}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden relative w-8 h-8 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <motion.span
                className={`absolute top-1 left-0 w-full h-0.5 transform transition-all duration-300 ${
                  isDarkSection ? 'bg-white' : 'bg-gray-900'
                }`}
                animate={{
                  rotate: isMobileMenuOpen ? 45 : 0,
                  y: isMobileMenuOpen ? 6 : 0
                }}
              />
              <motion.span
                className={`absolute top-3.5 left-0 w-full h-0.5 transition-opacity duration-300 ${
                  isDarkSection ? 'bg-white' : 'bg-gray-900'
                }`}
                animate={{ opacity: isMobileMenuOpen ? 0 : 1 }}
              />
              <motion.span
                className={`absolute top-6 left-0 w-full h-0.5 transform transition-all duration-300 ${
                  isDarkSection ? 'bg-white' : 'bg-gray-900'
                }`}
                animate={{
                  rotate: isMobileMenuOpen ? -45 : 0,
                  y: isMobileMenuOpen ? -6 : 0
                }}
              />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-0 right-0 w-64 h-full glass-dark shadow-2xl"
            >
              <div className="p-6 pt-20">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-sm font-semibold text-white/80">Language</div>
                  <div className="flex items-center rounded-lg overflow-hidden border border-white/15">
                    <button
                      type="button"
                      onClick={() => setLanguage('it')}
                      className={`px-3 py-2 text-sm font-semibold transition-colors ${
                        language === 'it'
                          ? 'bg-white/15 text-white'
                          : 'bg-transparent text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      IT
                    </button>
                    <button
                      type="button"
                      onClick={() => setLanguage('en')}
                      className={`px-3 py-2 text-sm font-semibold transition-colors ${
                        language === 'en'
                          ? 'bg-white/15 text-white'
                          : 'bg-transparent text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      EN
                    </button>
                  </div>
                </div>
                <div className="space-y-6">
                  {navItems.map((item, index) => (
                    <motion.a
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      href={item.href}
                      onClick={(event) => {
                        event.preventDefault()
                        scrollToSection(item.href)
                      }}
                      className="block w-full text-left px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                    >
                      {item.label}
                    </motion.a>
                  ))}
                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navItems.length * 0.1 }}
                    onClick={() => scrollToSection('#contact')}
                    className="w-full btn-primary mt-6"
                  >
                    {t.nav.getStarted}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isLogoAnimating && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.img
              src="/solo-logo-320.webp"
              alt="Metis Logo"
              width={320}
              height={242}
              className="w-24 h-24 sm:w-32 sm:h-32"
              layoutId="nav-logo"
                animate={{ scale: [1, 5.5, 1.6, 1.2] }}
                transition={{ duration: 2.4, times: [0, 0.16, 0.5, 1], ease: 'easeInOut' }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}