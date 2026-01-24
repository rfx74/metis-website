'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/lib/LanguageContext'
import { useState } from 'react'

interface LanguageSelectorProps {
  variant?: 'light' | 'dark'
}

export default function LanguageSelector({ variant = 'dark' }: LanguageSelectorProps) {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const languages = [
    { code: 'it' as const, name: 'Italiano', flag: '🇮🇹' },
    { code: 'en' as const, name: 'English', flag: '🇬🇧' }
  ]

  const currentLanguage = languages.find(lang => lang.code === language)

  return (
    <div className="relative">
      <motion.button
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg backdrop-blur-sm border transition-all duration-300 ${
          variant === 'dark'
            ? 'bg-white/10 hover:bg-white/20 border-white/20'
            : 'bg-black/5 hover:bg-black/10 border-black/10'
        }`}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-lg">{currentLanguage?.flag}</span>
        <span className={`text-sm font-medium hidden sm:block ${variant === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {currentLanguage?.name}
        </span>
        <motion.svg
          className={`w-4 h-4 ${variant === 'dark' ? 'text-white' : 'text-gray-900'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 right-0 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50"
          >
            {languages.map((lang) => (
              <motion.button
                key={lang.code}
                className={`flex items-center space-x-3 w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors ${
                  language === lang.code ? 'bg-gray-100 text-gray-900' : 'text-gray-700'
                }`}
                onClick={() => {
                  setLanguage(lang.code)
                  setIsOpen(false)
                }}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
                {language === lang.code && (
                  <motion.svg
                    className="w-4 h-4 text-gray-900 ml-auto"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </motion.svg>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}