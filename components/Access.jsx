// // components/AccessibilityPanel.jsx
// 'use client';

// import React, { useState, useEffect } from 'react';
// import { X, Type, MoreHorizontal, Eye, Droplet, RotateCcw, Pause, EyeOff, MousePointer, Link } from 'lucide-react';

// const AccessibilityPanel = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [settings, setSettings] = useState({
//     biggerText: false,
//     smallerText: false,
//     textSpacing: false,
//     lineHeight: false,
//     dyslexiaFriendly: false,
//     adhdMode: false,
//     highSaturation: false,
//     invertColors: false,
//     highlightLinks: false,
//     cursor: false,
//     pauseAnimation: false,
//     hideImages: false
//   });

//   // Load settings from localStorage on mount
//   useEffect(() => {
//     const savedSettings = localStorage.getItem('accessibility-settings');
//     if (savedSettings) {
//       setSettings(JSON.parse(savedSettings));
//     }
//   }, []);

//   // Save settings to localStorage whenever they change
//   useEffect(() => {
//     localStorage.setItem('accessibility-settings', JSON.stringify(settings));
//     applySettings(settings);
//   }, [settings]);

//   const applySettings = (newSettings) => {
//     const root = document.documentElement;
    
//     // Reset all classes first
//     document.body.classList.remove(
//       'bigger-text', 'smaller-text', 'increased-spacing', 'increased-line-height',
//       'dyslexia-friendly', 'adhd-mode', 'high-saturation', 'invert-colors',
//       'highlight-links', 'big-cursor', 'pause-animations', 'hide-images'
//     );

//     // Apply active settings
//     if (newSettings.biggerText) document.body.classList.add('bigger-text');
//     if (newSettings.smallerText) document.body.classList.add('smaller-text');
//     if (newSettings.textSpacing) document.body.classList.add('increased-spacing');
//     if (newSettings.lineHeight) document.body.classList.add('increased-line-height');
//     if (newSettings.dyslexiaFriendly) document.body.classList.add('dyslexia-friendly');
//     if (newSettings.adhdMode) document.body.classList.add('adhd-mode');
//     if (newSettings.highSaturation) document.body.classList.add('high-saturation');
//     if (newSettings.invertColors) document.body.classList.add('invert-colors');
//     if (newSettings.highlightLinks) document.body.classList.add('highlight-links');
//     if (newSettings.cursor) document.body.classList.add('big-cursor');
//     if (newSettings.pauseAnimation) document.body.classList.add('pause-animations');
//     if (newSettings.hideImages) document.body.classList.add('hide-images');
//   };

//   const toggleSetting = (setting) => {
//     setSettings(prev => ({
//       ...prev,
//       [setting]: !prev[setting]
//     }));
//   };

//   const resetAllSettings = () => {
//     const resetSettings = {
//       biggerText: false,
//       smallerText: false,
//       textSpacing: false,
//       lineHeight: false,
//       dyslexiaFriendly: false,
//       adhdMode: false,
//       highSaturation: false,
//       invertColors: false,
//       highlightLinks: false,
//       cursor: false,
//       pauseAnimation: false,
//       hideImages: false
//     };
//     setSettings(resetSettings);
//   };

//   const AccessibilityButton = ({ 
//     icon: Icon, 
//     label, 
//     setting, 
//     isActive, 
//     color = 'purple',
//     onClick 
//   }) => (
//     <button
//       onClick={onClick}
//       className={`
//         relative w-32 h-20 rounded-xl border-2 transition-all duration-200 flex flex-col items-center justify-center gap-1
//         ${isActive 
//           ? `bg-${color}-100 border-${color}-500 text-${color}-700` 
//           : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
//         }
//       `}
//       aria-pressed={isActive}
//       aria-label={`${isActive ? 'Disable' : 'Enable'} ${label}`}
//     >
//       {isActive && (
//         <div className={`absolute top-2 right-2 w-5 h-5 bg-${color}-500 rounded-full flex items-center justify-center`}>
//           <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//           </svg>
//         </div>
//       )}
//       <Icon className="w-6 h-6" />
//       <span className="text-xs font-medium text-center leading-tight">{label}</span>
//     </button>
//   );

//   return (
//     <>
//       {/* Floating Accessibility Button */}
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="fixed top-4 right-4 z-50 bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors duration-200"
//         aria-label="Open accessibility options"
//       >
//         <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
//           <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" />
//           <path d="M10 4a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
//         </svg>
//       </button>

//       {/* Accessibility Panel */}
//       {isOpen && (
//         <div className="fixed inset-0 z-40 bg-black bg-opacity-50">
//           <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl overflow-y-auto">
//             {/* Header */}
//             <div className="bg-purple-600 text-white p-4 flex items-center justify-between">
//               <h2 className="text-lg font-semibold">Accessibility options</h2>
//               <div className="flex items-center gap-2">
//                 <span className="text-sm bg-purple-500 px-2 py-1 rounded">Ctrl+F2</span>
//                 <button
//                   onClick={() => setIsOpen(false)}
//                   className="text-white hover:bg-purple-500 p-1 rounded"
//                   aria-label="Close accessibility panel"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>
//             </div>

//             {/* Content */}
//             <div className="p-4 space-y-6">
//               {/* Row 1 */}
//               <div className="grid grid-cols-3 gap-3">
//                 <AccessibilityButton
//                   icon={Type}
//                   label="Bigger Text"
//                   setting="biggerText"
//                   isActive={settings.biggerText}
//                   color="purple"
//                   onClick={() => toggleSetting('biggerText')}
//                 />
//                 <AccessibilityButton
//                   icon={Type}
//                   label="Smaller Text"
//                   setting="smallerText"
//                   isActive={settings.smallerText}
//                   color="gray"
//                   onClick={() => toggleSetting('smallerText')}
//                 />
//                 <AccessibilityButton
//                   icon={MoreHorizontal}
//                   label="Text Spacing"
//                   setting="textSpacing"
//                   isActive={settings.textSpacing}
//                   color="gray"
//                   onClick={() => toggleSetting('textSpacing')}
//                 />
//               </div>

//               {/* Row 2 */}
//               <div className="grid grid-cols-3 gap-3">
//                 <AccessibilityButton
//                   icon={MoreHorizontal}
//                   label="Line Height"
//                   setting="lineHeight"
//                   isActive={settings.lineHeight}
//                   color="purple"
//                   onClick={() => toggleSetting('lineHeight')}
//                 />
//                 <AccessibilityButton
//                   icon={() => <span className="text-2xl font-bold">Df</span>}
//                   label="Dyslexia Friendly"
//                   setting="dyslexiaFriendly"
//                   isActive={settings.dyslexiaFriendly}
//                   color="purple"
//                   onClick={() => toggleSetting('dyslexiaFriendly')}
//                 />
//                 <AccessibilityButton
//                   icon={() => <span className="text-lg">😶‍🌫️</span>}
//                   label="ADHD Mode"
//                   setting="adhdMode"
//                   isActive={settings.adhdMode}
//                   color="gray"
//                   onClick={() => toggleSetting('adhdMode')}
//                 />
//               </div>

//               {/* Row 3 */}
//               <div className="grid grid-cols-3 gap-3">
//                 <AccessibilityButton
//                   icon={Droplet}
//                   label="High Saturation"
//                   setting="highSaturation"
//                   isActive={settings.highSaturation}
//                   color="purple"
//                   onClick={() => toggleSetting('highSaturation')}
//                 />
//                 <AccessibilityButton
//                   icon={Eye}
//                   label="Invert Colors"
//                   setting="invertColors"
//                   isActive={settings.invertColors}
//                   color="pink"
//                   onClick={() => toggleSetting('invertColors')}
//                 />
//                 <AccessibilityButton
//                   icon={Link}
//                   label="Highlight Links"
//                   setting="highlightLinks"
//                   isActive={settings.highlightLinks}
//                   color="gray"
//                   onClick={() => toggleSetting('highlightLinks')}
//                 />
//               </div>

//               {/* Row 4 */}
//               <div className="grid grid-cols-3 gap-3">
//                 <AccessibilityButton
//                   icon={MousePointer}
//                   label="Cursor"
//                   setting="cursor"
//                   isActive={settings.cursor}
//                   color="gray"
//                   onClick={() => toggleSetting('cursor')}
//                 />
//                 <AccessibilityButton
//                   icon={Pause}
//                   label="Pause Animation"
//                   setting="pauseAnimation"
//                   isActive={settings.pauseAnimation}
//                   color="gray"
//                   onClick={() => toggleSetting('pauseAnimation')}
//                 />
//                 <AccessibilityButton
//                   icon={EyeOff}
//                   label="Hide Images"
//                   setting="hideImages"
//                   isActive={settings.hideImages}
//                   color="gray"
//                   onClick={() => toggleSetting('hideImages')}
//                 />
//               </div>

//               {/* Reset Button */}
//               <div className="pt-4">
//                 <button
//                   onClick={resetAllSettings}
//                   className="w-full bg-pink-100 text-pink-700 py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-pink-200 transition-colors"
//                   aria-label="Reset all accessibility settings"
//                 >
//                   <RotateCcw className="w-5 h-5" />
//                   Reset All Settings
//                 </button>
//               </div>

//               {/* Footer */}
//               <div className="text-right text-sm text-gray-500 pt-4 border-t">
//                 Created by <span className="font-semibold text-blue-600">UX4G</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default AccessibilityPanel;