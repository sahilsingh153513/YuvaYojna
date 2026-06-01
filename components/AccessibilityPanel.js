// 'use client';

// import React, { useState } from 'react';
// import { useAccessibility } from '@/context/AccessibilityContext';

// const AccessibilityPanel = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const { settings, toggleSetting, resetAllSettings } = useAccessibility();

//   const togglePanel = () => {
//     setIsOpen(!isOpen);
//   };

//   const accessibilityOptions = [
//     {
//       key: 'biggerText',
//       label: 'Bigger Text',
//       icon: '🔍',
//       description: 'Increase text size for better readability'
//     },
//     {
//       key: 'smallerText',
//       label: 'Smaller Text',
//       icon: '🔍',
//       description: 'Decrease text size'
//     },
//     {
//       key: 'textSpacing',
//       label: 'Text Spacing',
//       icon: '📏',
//       description: 'Increase spacing between letters and words'
//     },
//     {
//       key: 'lineHeight',
//       label: 'Line Height',
//       icon: '📐',
//       description: 'Increase spacing between lines'
//     },
//     {
//       key: 'dyslexiaFriendly',
//       label: 'Dyslexia Friendly',
//       icon: '🔤',
//       description: 'Use dyslexia-friendly font'
//     },
//     {
//       key: 'adhdMode',
//       label: 'ADHD Mode',
//       icon: '🎯',
//       description: 'Focus mode with reduced distractions'
//     },
//     {
//       key: 'saturation',
//       label: 'Low Saturation',
//       icon: '🌑',
//       description: 'Reduce color saturation'
//     },
//     {
//       key: 'invertColors',
//       label: 'Invert Colors',
//       icon: '🔄',
//       description: 'Invert page colors for better contrast'
//     },
//     {
//       key: 'highlightLinks',
//       label: 'Highlight Links',
//       icon: '🔗',
//       description: 'Make links more visible'
//     },
//     {
//       key: 'cursor',
//       label: 'Big Cursor',
//       icon: '👆',
//       description: 'Increase cursor size'
//     },
//     {
//       key: 'pauseAnimation',
//       label: 'Pause Animation',
//       icon: '⏸️',
//       description: 'Stop all animations and motion'
//     },
//     {
//       key: 'hideImages',
//       label: 'Hide Images',
//       icon: '🖼️',
//       description: 'Hide images for faster loading'
//     }
//   ];

//   return (
//     <>
//       {/* Trigger Button */}
//       <button
//         onClick={togglePanel}
//         className="fixed top-1/2 right-4 transform -translate-y-1/2 z-50 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
//         aria-label="Open Accessibility Options"
//       >
//         <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
//           <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
//         </svg>
//       </button>

//       {/* Overlay */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
//           onClick={togglePanel}
//         />
//       )}

//       {/* Panel */}
//       <div
//         className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
//           isOpen ? 'translate-x-0' : 'translate-x-full'
//         }`}
//       >
//         {/* Header */}
//         <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
//           <div className="flex items-center justify-between">
//             <h2 className="text-xl font-bold">Accessibility Options</h2>
//             <button
//               onClick={togglePanel}
//               className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-full transition-colors"
//               aria-label="Close Panel"
//             >
//               <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
//                 <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
//               </svg>
//             </button>
//           </div>
//           <p className="text-sm opacity-90 mt-1">Ctrl+F2</p>
//         </div>

//         {/* Options Grid */}
//         <div className="p-4 overflow-y-auto h-full pb-20">
//           <div className="grid grid-cols-2 gap-3">
//             {accessibilityOptions.map((option) => (
//               <button
//                 key={option.key}
//                 onClick={() => toggleSetting(option.key)}
//                 className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left ${
//                   settings[option.key]
//                     ? 'border-purple-500 bg-purple-50 text-purple-700'
//                     : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-25'
//                 }`}
//                 title={option.description}
//               >
//                 {/* Check mark for active options */}
//                 {settings[option.key] && (
//                   <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
//                     <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
//                       <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
//                     </svg>
//                   </div>
//                 )}
                
//                 <div className="text-2xl mb-2">{option.icon}</div>
//                 <div className="font-medium text-sm">{option.label}</div>
//               </button>
//             ))}
//           </div>

//           {/* Reset Button */}
//           <button
//             onClick={resetAllSettings}
//             className="w-full mt-6 p-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
//           >
//             <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
//               <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"/>
//             </svg>
//             Reset All Settings
//           </button>
//         </div>

//         {/* Footer */}
//         <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 border-t">
//           <p className="text-xs text-gray-500 text-center">
//             Created by <span className="font-medium text-purple-600">UX4G</span>
//           </p>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AccessibilityPanel;