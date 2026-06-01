'use client';

import React, { useState, useEffect } from 'react';
import { useDaisyTheme } from '@/context/DaisyThemeContext';

const FloatingThemeSelector = () => {
  const { theme, setTheme, themes } = useDaisyTheme();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Toggle clicked, current state:', isOpen);
    setIsOpen(prev => !prev);
  };

  const handleThemeChange = (newTheme) => {
    console.log('Changing theme to:', newTheme);
    setTheme(newTheme);
    setIsOpen(false);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  // Debug effect
  useEffect(() => {
    console.log('Dropdown state changed:', isOpen);
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.floating-theme-container')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="floating-theme-container fixed top-90 right-1" style={{ zIndex: 9999 }}>
      {/* Floating Theme Button */}
      <button
        onClick={toggleDropdown}
        className="btn btn-circle btn-primary shadow-2xl hover:shadow-xl transition-all duration-300 w-14 h-14 floating-theme-selector"
        title="Change Theme"
        style={{
          position: 'relative',
          zIndex: 9999,
        }}
      >
        {/* Theme/Palette Icon */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
        >
          <path
            d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z"
            fill="currentColor"
            fillOpacity="0.3"
          />
          <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
          <circle cx="16" cy="8" r="1.5" fill="currentColor"/>
          <circle cx="8" cy="16" r="1.5" fill="currentColor"/>
          <circle cx="16" cy="16" r="1.5" fill="currentColor"/>
          <circle cx="12" cy="12" r="2" fill="currentColor"/>
        </svg>
      </button>

      {/* Theme Dropdown - Simple conditional rendering */}
      {isOpen && (
        <div 
          className="absolute bottom-full right-0 mb-4 w-64 bg-base-100 rounded-lg shadow-2xl border border-base-300 max-h-96 overflow-hidden"
          style={{ 
            zIndex: 10000,
            animation: 'slideUpFade 0.2s ease-out'
          }}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-base-300 bg-base-200">
            <h3 className="text-sm font-bold text-base-content flex items-center gap-2">
              🎨 Select Theme
              <span className="text-xs opacity-60">({themes.length} available)</span>
            </h3>
          </div>
          
          {/* Theme List */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-1">
            {themes.map((themeName) => (
              <button
                key={themeName}
                className={`w-full px-3 py-2 text-left text-sm rounded-md transition-all duration-150 flex items-center justify-between hover:bg-base-200 ${
                  theme === themeName 
                    ? 'bg-primary text-primary-content shadow-sm' 
                    : 'text-base-content hover:text-base-content'
                }`}
                onClick={() => handleThemeChange(themeName)}
              >
                <span className="capitalize font-medium">{themeName}</span>
                {theme === themeName && (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
          
          {/* Footer */}
          <div className="px-4 py-2 border-t border-base-300 bg-base-200">
            <p className="text-xs text-base-content/60 text-center">
              Current: <span className="font-semibold capitalize">{theme}</span>
            </p>
          </div>
        </div>
      )}

      {/* Debug Info - Remove this in production */}
     

      <style jsx>{`
        @keyframes slideUpFade {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default FloatingThemeSelector;