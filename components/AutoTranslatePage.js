// AutoTranslatePage.js - A wrapper component that automatically translates all text content
'use client'

import { useEffect, useRef } from 'react'
import { useTranslation } from '@/context/TranslationContext'

const AutoTranslatePage = ({ children }) => {
  const { currentLanguage, translateText } = useTranslation()
  const containerRef = useRef(null)
  const originalTexts = useRef(new Map()) // Store original texts

  const isTranslatable = (element) => {
    // Skip elements with these attributes or classes
    const skipSelectors = [
      '[data-no-translate]',
      '.no-translate',
      'script',
      'style',
      'code',
      'pre',
      '[contenteditable]',
      'input',
      'textarea',
      'select'
    ]
    
    return !skipSelectors.some(selector => 
      element.matches?.(selector) || element.closest?.(selector)
    )
  }

  const translateElement = async (element) => {
    if (!isTranslatable(element)) return

    // Handle text nodes
    for (let node of element.childNodes) {
      if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        const originalText = node.textContent.trim()
        
        // Skip if it's just numbers, symbols, or very short text
        if (originalText.length < 2 || /^[\d\s\-.,!@#$%^&*()_+={}[\]|\\:";'<>?/~`]*$/.test(originalText)) {
          continue
        }

        // Store original text if not already stored
        if (!originalTexts.current.has(node)) {
          originalTexts.current.set(node, originalText)
        }

        // If current language is English, restore original text
        if (currentLanguage === 'en') {
          node.textContent = originalTexts.current.get(node) || originalText
        } else {
          // Translate the text
          try {
            const translatedText = await translateText(originalText, currentLanguage)
            if (translatedText && translatedText !== originalText) {
              node.textContent = translatedText
            }
          } catch (error) {
            console.warn('Translation failed for:', originalText, error)
          }
        }
      }
    }

    // Handle placeholder attributes
    if (element.placeholder) {
      const originalPlaceholder = element.getAttribute('data-original-placeholder') || element.placeholder
      if (!element.hasAttribute('data-original-placeholder')) {
        element.setAttribute('data-original-placeholder', originalPlaceholder)
      }

      if (currentLanguage === 'en') {
        element.placeholder = originalPlaceholder
      } else {
        try {
          const translatedPlaceholder = await translateText(originalPlaceholder, currentLanguage)
          if (translatedPlaceholder) {
            element.placeholder = translatedPlaceholder
          }
        } catch (error) {
          console.warn('Placeholder translation failed:', error)
        }
      }
    }

    // Handle title attributes
    if (element.title) {
      const originalTitle = element.getAttribute('data-original-title') || element.title
      if (!element.hasAttribute('data-original-title')) {
        element.setAttribute('data-original-title', originalTitle)
      }

      if (currentLanguage === 'en') {
        element.title = originalTitle
      } else {
        try {
          const translatedTitle = await translateText(originalTitle, currentLanguage)
          if (translatedTitle) {
            element.title = translatedTitle
          }
        } catch (error) {
          console.warn('Title translation failed:', error)
        }
      }
    }

    // Handle alt attributes for images
    if (element.alt) {
      const originalAlt = element.getAttribute('data-original-alt') || element.alt
      if (!element.hasAttribute('data-original-alt')) {
        element.setAttribute('data-original-alt', originalAlt)
      }

      if (currentLanguage === 'en') {
        element.alt = originalAlt
      } else {
        try {
          const translatedAlt = await translateText(originalAlt, currentLanguage)
          if (translatedAlt) {
            element.alt = translatedAlt
          }
        } catch (error) {
          console.warn('Alt text translation failed:', error)
        }
      }
    }
  }

  const translatePage = async () => {
    if (!containerRef.current) return

    // Get all elements that contain text
    const walker = document.createTreeWalker(
      containerRef.current,
      NodeFilter.SHOW_ELEMENT,
      {
        acceptNode: (node) => {
          return isTranslatable(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
        }
      }
    )

    const elementsToTranslate = []
    let currentNode = walker.nextNode()
    
    while (currentNode) {
      elementsToTranslate.push(currentNode)
      currentNode = walker.nextNode()
    }

    // Translate elements in batches to avoid overwhelming the translation service
    const batchSize = 10
    for (let i = 0; i < elementsToTranslate.length; i += batchSize) {
      const batch = elementsToTranslate.slice(i, i + batchSize)
      await Promise.all(batch.map(element => translateElement(element)))
      
      // Small delay between batches to prevent API rate limiting
      if (i + batchSize < elementsToTranslate.length) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
    }
  }

  useEffect(() => {
    // Small delay to ensure DOM is fully rendered
    const timer = setTimeout(() => {
      translatePage()
    }, 100)

    return () => clearTimeout(timer)
  }, [currentLanguage])

  // Handle dynamic content changes
  useEffect(() => {
    if (!containerRef.current) return

    const observer = new MutationObserver((mutations) => {
      let shouldTranslate = false
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Check if added nodes contain text
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE && node.textContent.trim()) {
              shouldTranslate = true
            }
          })
        }
      })

      if (shouldTranslate) {
        // Debounce translation calls
        clearTimeout(observer.translationTimeout)
        observer.translationTimeout = setTimeout(translatePage, 300)
      }
    })

    observer.observe(containerRef.current, {
      childList: true,
      subtree: true,
      characterData: true
    })

    return () => {
      observer.disconnect()
      if (observer.translationTimeout) {
        clearTimeout(observer.translationTimeout)
      }
    }
  }, [currentLanguage])

  return (
    <div ref={containerRef} className="auto-translate-container">
      {children}
    </div>
  )
}

export default AutoTranslatePage