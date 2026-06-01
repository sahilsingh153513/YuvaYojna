"use client";
import { useState, useEffect } from 'react';
import { useTranslation } from '@/context/TranslationContext';

const TranslatedText = ({ 
  children, 
  className = "", 
  as: Component = "span",
  fallback = null 
}) => {
  const { translateText, currentLanguage, isTranslating } = useTranslation();
  const [translatedText, setTranslatedText] = useState(children);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const translateContent = async () => {
      if (currentLanguage === 'en' || !children) {
        setTranslatedText(children);
        return;
      }

      setLoading(true);
      try {
        const translated = await translateText(children, currentLanguage);
        setTranslatedText(translated);
      } catch (error) {
        console.error('Translation error:', error);
        setTranslatedText(children); // Fallback to original text
      } finally {
        setLoading(false);
      }
    };

    translateContent();
  }, [children, currentLanguage, translateText]);

  // Show loading state or fallback
  if (loading && fallback) {
    return fallback;
  }

  return (
    <Component className={className}>
      {translatedText}
    </Component>
  );
};

export default TranslatedText;