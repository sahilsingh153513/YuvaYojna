// 'use client';

// import React, { createContext, useContext, useEffect, useState } from 'react';

// const AccessibilityContext = createContext();

// export const useAccessibility = () => {
//   const context = useContext(AccessibilityContext);
//   if (!context) {
//     throw new Error('useAccessibility must be used within AccessibilityProvider');
//   }
//   return context;
// };

// export const AccessibilityProvider = ({ children }) => {
//   const [settings, setSettings] = useState({
//     biggerText: false,
//     smallerText: false,
//     textSpacing: false,
//     lineHeight: false,
//     dyslexiaFriendly: false,
//     adhdMode: false,
//     saturation: false,
//     invertColors: false,
//     highlightLinks: false,
//     cursor: false,
//     pauseAnimation: false,
//     hideImages: false,
//   });

//   // Apply classes to document.documentElement (html tag) for better global effect
//   useEffect(() => {
//     const applyAccessibilityClasses = () => {
//       const htmlElement = document.documentElement;
      
//       // Remove all existing accessibility classes
//       const existingClasses = Array.from(htmlElement.classList).filter(className => 
//         className.startsWith('accessibility-')
//       );
//       existingClasses.forEach(className => htmlElement.classList.remove(className));

//       // Apply active accessibility classes
//       Object.entries(settings).forEach(([key, isActive]) => {
//         if (isActive) {
//           const className = `accessibility-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
//           htmlElement.classList.add(className);
//         }
//       });

//       // Handle conflicting settings
//       if (settings.biggerText && settings.smallerText) {
//         // If both are enabled, disable the other one
//         setSettings(prev => ({ ...prev, smallerText: false }));
//       }
//     };

//     applyAccessibilityClasses();
//   }, [settings]);

//   // Add keyboard shortcut listener
//   useEffect(() => {
//     const handleKeydown = (event) => {
//       // Ctrl+F2 to toggle accessibility panel
//       if (event.ctrlKey && event.key === 'F2') {
//         event.preventDefault();
//         // This will be handled by the AccessibilityPanel component
//         const trigger = document.querySelector('[aria-label="Open Accessibility Options"]');
//         if (trigger) {
//           trigger.click();
//         }
//       }
//     };

//     document.addEventListener('keydown', handleKeydown);
//     return () => document.removeEventListener('keydown', handleKeydown);
//   }, []);

//   const toggleSetting = (key) => {
//     setSettings(prev => {
//       const newSettings = { ...prev };
      
//       // Handle conflicting settings
//       if (key === 'biggerText' && !prev.biggerText) {
//         newSettings.smallerText = false;
//       } else if (key === 'smallerText' && !prev.smallerText) {
//         newSettings.biggerText = false;
//       }
      
//       newSettings[key] = !prev[key];
//       return newSettings;
//     });
//   };

//   const resetAllSettings = () => {
//     setSettings({
//       biggerText: false,
//       smallerText: false,
//       textSpacing: false,
//       lineHeight: false,
//       dyslexiaFriendly: false,
//       adhdMode: false,
//       saturation: false,
//       invertColors: false,
//       highlightLinks: false,
//       cursor: false,
//       pauseAnimation: false,
//       hideImages: false,
//     });
//   };

//   const value = {
//     settings,
//     toggleSetting,
//     resetAllSettings,
//   };

//   return (
//     <AccessibilityContext.Provider value={value}>
//       {children}
//     </AccessibilityContext.Provider>
//   );
// };