// TranslationContext.js
'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

const TranslationContext = createContext()

// Available languages
export const availableLanguages = {
  en: { name: 'English', flag: '🇺🇸', code: 'en' },
  hi: { name: 'हिंदी', flag: '🇮🇳', code: 'hi' },
  bn: { name: 'বাংলা', flag: '🇧🇩', code: 'bn' },
  te: { name: 'తెలుగు', flag: '🇮🇳', code: 'te' },
  ta: { name: 'தமிழ்', flag: '🇮🇳', code: 'ta' },
  gu: { name: 'ગુજરાતી', flag: '🇮🇳', code: 'gu' },
  kn: { name: 'ಕನ್ನಡ', flag: '🇮🇳', code: 'kn' },
  ml: { name: 'മലയാളം', flag: '🇮🇳', code: 'ml' },
  mr: { name: 'मराठी', flag: '🇮🇳', code: 'mr' },
  pa: { name: 'ਪੰਜਾਬੀ', flag: '🇮🇳', code: 'pa' },
  ur: { name: 'اردو', flag: '🇵🇰', code: 'ur' },
  or: { name: 'ଓଡ଼ିଆ', flag: '🇮🇳', code: 'or' },
  as: { name: 'অসমীয়া', flag: '🇮🇳', code: 'as' },
}

// Translation cache
const translationCache = new Map()

export const TranslationProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en')
  const [isLoading, setIsLoading] = useState(false)

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage')
    if (savedLanguage && availableLanguages[savedLanguage]) {
      setCurrentLanguage(savedLanguage)
    }
  }, [])

  // Save language preference
  const changeLanguage = (languageCode) => {
    if (availableLanguages[languageCode]) {
      setCurrentLanguage(languageCode)
      localStorage.setItem('preferredLanguage', languageCode)
    }
  }

  // Using Google Translate's free endpoint (no API key needed)
  const translateText = async (text, targetLanguage) => {
    if (!text || targetLanguage === 'en' || text.trim().length < 2) {
      return text
    }

    // Create cache key
    const cacheKey = `${text.trim()}-${targetLanguage}`
    
    // Check cache first
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey)
    }

    try {
      // Using Google Translate's web interface (free, no API key)
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      })

      if (!response.ok) {
        throw new Error(`Translation failed: ${response.status}`)
      }

      const data = await response.json()
      
      // Extract translated text from Google's response format
      let translatedText = ''
      if (data && data[0]) {
        for (let i = 0; i < data[0].length; i++) {
          if (data[0][i][0]) {
            translatedText += data[0][i][0]
          }
        }
      }

      if (translatedText && translatedText.trim()) {
        // Cache the translation
        translationCache.set(cacheKey, translatedText)
        return translatedText
      }

      return text // Return original if translation failed
    } catch (error) {
      console.error('Translation error:', error)
      return text // Return original text on error
    }
  }

  const value = {
    currentLanguage,
    availableLanguages,
    changeLanguage,
    translateText,
    isLoading,
    setIsLoading
  }

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  )
}

export const useTranslation = () => {
  const context = useContext(TranslationContext)
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider')
  }
  return context
}