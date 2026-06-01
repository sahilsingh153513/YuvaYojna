'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

const DaisyThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
  themes: [],
});

export const useDaisyTheme = () => {
  const context = useContext(DaisyThemeContext);
  if (!context) {
    throw new Error('useDaisyTheme must be used within a DaisyThemeProvider');
  }
  return context;
};

export const DaisyThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  // COMPLETE list of DaisyUI themes
  const themes = [
    "light", "dark", "cupcake", "bumblebee", "emerald", "corporate",
    "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden",
    "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black",
    "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade",
    "night", "coffee", "winter", "dim", "nord", "sunset"
  ];

  useEffect(() => {
    // Initialize theme
    const savedTheme = localStorage.getItem('daisyui-theme');
    if (savedTheme && themes.includes(savedTheme)) {
      setTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const defaultTheme = prefersDark ? 'dark' : 'light';
      setTheme(defaultTheme);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      console.log('🎨 Applying theme:', theme);
      
      // CRITICAL: Apply theme to HTML element (DaisyUI requirement)
      document.documentElement.setAttribute('data-theme', theme);
      
      // Also apply to body as backup
      document.body.setAttribute('data-theme', theme);
      
      // Remove any conflicting classes
      document.body.className = document.body.className
        .replace(/theme-\w+/g, '')
        .replace(/data-theme-\w+/g, '');
      
      // Add theme class
      document.body.classList.add(`theme-${theme}`);
      
      // FORCE browser to recalculate styles
      const htmlElement = document.documentElement;
      const originalDisplay = htmlElement.style.display;
      htmlElement.style.display = 'none';
      htmlElement.offsetHeight; // Trigger reflow
      htmlElement.style.display = originalDisplay;
      
      // Save to localStorage
      localStorage.setItem('daisyui-theme', theme);
      
      // Dispatch theme change event
      window.dispatchEvent(new CustomEvent('themeChanged', { 
        detail: { theme, timestamp: Date.now() }
      }));
      
      // Debug logging
      console.log('✅ Theme applied:', {
        theme,
        htmlDataTheme: document.documentElement.getAttribute('data-theme'),
        bodyDataTheme: document.body.getAttribute('data-theme'),
        computedBg: window.getComputedStyle(document.documentElement).backgroundColor,
        timestamp: new Date().toLocaleTimeString()
      });

      // Additional force update for stubborn themes
      setTimeout(() => {
        document.documentElement.setAttribute('data-theme', theme);
        document.body.setAttribute('data-theme', theme);
      }, 100);
    }
  }, [theme, mounted]);

  const changeTheme = (newTheme) => {
    console.log('🔄 Changing theme from', theme, 'to', newTheme);
    if (themes.includes(newTheme)) {
      setTheme(newTheme);
    } else {
      console.error('❌ Invalid theme:', newTheme, 'Available:', themes);
    }
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <DaisyThemeContext.Provider value={{ theme, setTheme: changeTheme, themes }}>
      {children}
    </DaisyThemeContext.Provider>
  );
};