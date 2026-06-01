"use client";
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useTranslation } from '@/context/TranslationContext';

const VoiceControlContext = createContext();

export const useVoiceControl = () => {
  const context = useContext(VoiceControlContext);
  if (!context) {
    throw new Error('useVoiceControl must be used within a VoiceControlProvider');
  }
  return context;
};

export const VoiceControlProvider = ({ children }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceFeedback, setVoiceFeedback] = useState('');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [currentPage, setCurrentPage] = useState('');
  
  const recognitionRef = useRef(null);
  const speechSynthesisRef = useRef(null);
  
  const { changeLanguage, availableLanguages } = useTranslation();

  // All voice commands for the entire application
  const voiceCommands = {
    // Navigation commands
    'home': () => navigateToPage('/dashboard', 'home'),
    'dashboard': () => navigateToPage('/dashboard', 'dashboard'),
    'skills': () => navigateToPage('/dashboard/skills', 'skills'),
    'jobs': () => navigateToPage('/dashboard/jobs', 'jobs'),
    'projects': () => navigateToPage('/projects', 'projects'),
    'test': () => navigateToPage('/test', 'games'),
    'ai insights': () => navigateToPage('/dashboard/ai-insights', 'AI insights'),
    
    // PM Schemes navigation
    'internship': () => navigateToPage('/dashboard/internship', 'PM Internship Scheme'),
    'pm internship': () => navigateToPage('/dashboard/internship', 'PM Internship Scheme'),
    'internship scheme': () => navigateToPage('/dashboard/internship', 'PM Internship Scheme'),
    'pm internship scheme': () => navigateToPage('/dashboard/internship', 'PM Internship Scheme'),
    'intern': () => navigateToPage('/dashboard/internship', 'internship'),
    
    'yojana': () => navigateToPage('/dashboard/yojana', 'PM Development Yojana'),
    'yojna': () => navigateToPage('/dashboard/yojana', 'PM Development Yojana'),
    'pm yojana': () => navigateToPage('/dashboard/yojana', 'PM Development Yojana'),
    'pm yojna': () => navigateToPage('/dashboard/yojana', 'PM Development Yojana'),
    'development yojana': () => navigateToPage('/dashboard/yojana', 'PM Development Yojana'),
    'development yojna': () => navigateToPage('/dashboard/yojana', 'PM Development Yojana'),
    'pm development yojana': () => navigateToPage('/dashboard/yojana', 'PM Development Yojana'),
    'pm development yojna': () => navigateToPage('/dashboard/yojana', 'PM Development Yojana'),
    
    // Go back to schemes page
    'schemes': () => navigateToPage('/dashboard/pm-schemes', 'PM Schemes'),
    'pm schemes': () => navigateToPage('/dashboard/pm-schemes', 'PM Schemes'),
    'back to schemes': () => navigateToPage('/dashboard/pm-schemes', 'PM Schemes'),
    
    // Language commands
    'change language': () => {
      speak('Say a language name to select it: English, Hindi, Spanish, French, German, Japanese, Chinese, or Arabic.');
    },
    'language': () => {
      speak('Say a language name to select it.');
    },
    
    // Language selection commands
    'english': () => handleVoiceLanguageChange('en'),
    'hindi': () => handleVoiceLanguageChange('hi'),
    'hindustani': () => handleVoiceLanguageChange('hi'),
    'spanish': () => handleVoiceLanguageChange('es'),
    'french': () => handleVoiceLanguageChange('fr'),
    'german': () => handleVoiceLanguageChange('de'),
    'japanese': () => handleVoiceLanguageChange('ja'),
    'chinese': () => handleVoiceLanguageChange('zh'),
    'arabic': () => handleVoiceLanguageChange('ar'),
    
    // Alternative language commands
    'switch to english': () => handleVoiceLanguageChange('en'),
    'switch to hindi': () => handleVoiceLanguageChange('hi'),
    'switch to spanish': () => handleVoiceLanguageChange('es'),
    'switch to french': () => handleVoiceLanguageChange('fr'),
    'switch to german': () => handleVoiceLanguageChange('de'),
    'switch to japanese': () => handleVoiceLanguageChange('ja'),
    'switch to chinese': () => handleVoiceLanguageChange('zh'),
    'switch to arabic': () => handleVoiceLanguageChange('ar'),
    
    // Auth commands
    'logout': () => handleLogout(),
    'log out': () => handleLogout(),
    'login': () => handleLogin(),
    'log in': () => handleLogin(),
    
    // Control commands
    'stop listening': () => {
      stopListening();
      speak('Voice control stopped');
    },
    
    // Help commands
    'help': () => getContextualHelp(),
    'commands': () => getContextualHelp(),
    'what can i say': () => getContextualHelp(),
    
    // Page-specific commands based on current page
    'apply': () => handlePageSpecificCommand('apply'),
    'learn more': () => handlePageSpecificCommand('learn_more'),
    'details': () => handlePageSpecificCommand('details'),
    'register': () => handlePageSpecificCommand('register'),
    'eligibility': () => handlePageSpecificCommand('eligibility'),
    'benefits': () => handlePageSpecificCommand('benefits'),
    'requirements': () => handlePageSpecificCommand('requirements'),
  };

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        console.log('Voice recognition started');
      };

      recognition.onend = () => {
        setIsListening(false);
        if (isVoiceEnabled) {
          // Restart recognition if voice is still enabled
          setTimeout(() => {
            try {
              recognition.start();
            } catch (e) {
              console.log('Recognition restart failed:', e);
            }
          }, 100);
        }
      };

      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript.toLowerCase().trim();
        
        setTranscript(transcript);
        
        if (event.results[current].isFinal) {
          console.log('Final transcript:', transcript);
          processVoiceCommand(transcript);
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    // Initialize speech synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesisRef.current = window.speechSynthesis;
    }

    // Set current page
    if (typeof window !== 'undefined') {
      setCurrentPage(window.location.pathname);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isVoiceEnabled]);

  // Update current page when location changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleLocationChange = () => {
        setCurrentPage(window.location.pathname);
      };
      
      window.addEventListener('popstate', handleLocationChange);
      return () => window.removeEventListener('popstate', handleLocationChange);
    }
  }, []);

  const speak = (text) => {
    if (speechSynthesisRef.current) {
      // Cancel any ongoing speech
      speechSynthesisRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      setVoiceFeedback(text);
      speechSynthesisRef.current.speak(utterance);
      
      // Clear feedback after speech
      utterance.onend = () => {
        setVoiceFeedback('');
      };
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setIsVoiceEnabled(true);
      try {
        recognitionRef.current.start();
        speak('Voice control activated.');
      } catch (e) {
        console.error('Failed to start recognition:', e);
      }
    }
  };

  const stopListening = () => {
    setIsVoiceEnabled(false);
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  };

  const processVoiceCommand = (transcript) => {
    console.log('Processing command:', transcript);
    
    // Check for exact matches first
    if (voiceCommands[transcript]) {
      voiceCommands[transcript]();
      return;
    }
    
    // Check for partial matches
    for (const [command, action] of Object.entries(voiceCommands)) {
      if (transcript.includes(command)) {
        action();
        return;
      }
    }
    
    // If no command found
    speak('Command not recognized. Say help for available commands.');
  };

  const navigateToPage = (href, pageName) => {
    // speak(`Navigating to ${pageName}`);
    console.log(`Navigating to ${href}`);
    
    if (typeof window !== 'undefined') {
      window.location.href = href;
    }
  };

  const handleVoiceLanguageChange = (languageCode) => {
    if (availableLanguages[languageCode]) {
      changeLanguage(languageCode);
      speak(`Language changed to ${availableLanguages[languageCode].name}`);
    } else {
      speak('Language not available');
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('userToken');
      speak('Logged out successfully');
      window.location.href = '/login';
    }
  };

  const handleLogin = () => {
    speak('Redirecting to login page');
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  const getContextualHelp = () => {
    let helpText = 'Available commands: ';
    
    if (currentPage.includes('/dashboard/pm-schemes')) {
      helpText += 'Say internship or yojana to navigate to schemes. ';
    } else if (currentPage.includes('/internship')) {
      helpText += 'Say apply, learn more, details, eligibility, or benefits for internship information. ';
    } else if (currentPage.includes('/yojana')) {
      helpText += 'Say apply, details, benefits, or requirements for yojana information. ';
    }
    
    helpText += 'Navigation: home, dashboard, skills, jobs, projects, games, internship, yojana. Language: change language then say english, hindi, spanish, etc. Control: stop listening, logout.';
    
    speak(helpText);
  };

  const handlePageSpecificCommand = (command) => {
    // This can be extended based on specific page needs
    switch (command) {
      case 'apply':
        if (currentPage.includes('/internship')) {
          speak('Opening internship application form');
          // Add logic to open application form
        } else if (currentPage.includes('/yojana')) {
          speak('Opening yojana application form');
          // Add logic to open application form
        } else {
          speak('Apply option not available on this page');
        }
        break;
      case 'learn_more':
        speak('Showing more information');
        // Add logic to show more details
        break;
      case 'details':
        speak('Showing detailed information');
        break;
      case 'eligibility':
        speak('Showing eligibility criteria');
        break;
      case 'benefits':
        speak('Showing benefits information');
        break;
      case 'requirements':
        speak('Showing requirements');
        break;
      default:
        speak('Command not available on this page');
    }
  };

  const value = {
    isListening,
    transcript,
    voiceFeedback,
    isVoiceEnabled,
    currentPage,
    startListening,
    stopListening,
    speak,
    processVoiceCommand
  };

  return (
    <VoiceControlContext.Provider value={value}>
      {children}
      
      {/* Voice Control Indicator - Global */}
      {(isListening || voiceFeedback) && (
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 bg-blue-600 text-white px-4 py-2 rounded-b-lg shadow-lg">
          <div className="flex items-center space-x-2">
            {isListening && (
              <>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                {/* <span className="text-sm">Listening...</span> */}
              </>
            )}
            {transcript && (
              <span className="text-sm italic">"{transcript}"</span>
            )}
            {voiceFeedback && (
              <span className="text-sm font-medium">{voiceFeedback}</span>
            )}
          </div>
        </div>
      )}
    </VoiceControlContext.Provider>
  );
};

export default VoiceControlProvider;