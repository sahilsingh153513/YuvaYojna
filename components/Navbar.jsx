"use client";
import { useState, useEffect, useRef } from 'react';
import { useSession } from "next-auth/react";
import VoiceControlProvider from '@/context/VoiceControlContext';
import { useDaisyTheme } from '@/context/DaisyThemeContext';
import { 
  Menu, 
  X, 
  User, 
  Brain, 
  Briefcase, 
  FolderOpen, 
  FileText, 
  BarChart3, 
  Home, 
  LogOut, 
  Settings, 
  LogIn, 
  Globe, 
  ChevronDown, 
  School2, 
  Mic, 
  MicOff,
  UserCircle,
  Users,
  Group,
 
} from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';
import TranslatedText from '@/app/language/page';

const Navbar = () => {
  const { theme } = useDaisyTheme();
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [userToken, setUserToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [voiceFeedback, setVoiceFeedback] = useState('');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  
  const recognitionRef = useRef(null);
  const speechSynthesisRef = useRef(null);
  
  const { currentLanguage, changeLanguage, availableLanguages } = useTranslation();

useEffect(() => {
  checkAuthStatus();
}, [session, status]);

const checkAuthStatus = async () => {
  try {
    const mentorData = localStorage.getItem('mentorData');
    const yuvaToken = localStorage.getItem('yuvaToken');
    const storedYuvaUser = localStorage.getItem('yuvaUser');

    if (session?.user) {
      setUserProfile({
        name: session.user.name,
        email: session.user.email,
        picture: session.user.image,
        role: 'student'
      });
      setIsAuthenticated(true);
      return;
    }

    if (mentorData) {
      try {
        const parsedMentor = JSON.parse(mentorData);
        setUserProfile({
          id: parsedMentor.id || parsedMentor._id,
          name: `${parsedMentor.firstName || ''} ${parsedMentor.lastName || ''}`.trim() || parsedMentor.email,
          email: parsedMentor.email,
          role: 'mentor',
        });
        setUserToken(parsedMentor.id || parsedMentor._id || null);
        setIsAuthenticated(true);
        return;
      } catch (parseError) {
        console.error('Error reading stored mentor data:', parseError);
        localStorage.removeItem('mentorData');
      }
    }

    if (yuvaToken) {
      setUserToken(yuvaToken);
      setIsAuthenticated(true);

      if (storedYuvaUser) {
        try {
          const parsedUser = JSON.parse(storedYuvaUser);
          setUserProfile({
            id: parsedUser.id,
            name: parsedUser.name,
            email: parsedUser.email,
            role: 'student',
          });
        } catch (parseError) {
          console.error('Error reading stored YUVA user:', parseError);
          localStorage.removeItem('yuvaUser');
        }
      }
    } else {
      setIsAuthenticated(false);
      setUserProfile(null);
      setUserToken(null);
    }
  } catch (error) {
    console.error('Error checking authentication status:', error);
    setIsAuthenticated(false);
    setUserProfile(null);
    setUserToken(null);
  }
  };

  const isMentorUser = userProfile?.role === 'mentor';

  const navigationLinks = isMentorUser ? [
    { href: '/mentor/dashboard', label: 'Dashboard', icon: Home, voiceCommands: ['dashboard', 'mentor dashboard', 'requests'] },
    { href: '/community/feed', label: 'Community', icon: Group, voiceCommands: ['community', 'community tab'] },
    { href: '/mentors', label: 'Mentors', icon: School2, voiceCommands: ['mentors', 'mentor', 'mentors tab', 'mentor tab'] },
  ] : [
    { href: '/dashboard', label: 'Dashboard', icon: Home, voiceCommands: ['dashboard', 'home', 'home tab', 'dashboard tab'] },
    { href: '/skills', label: 'Skills', icon: Brain, voiceCommands: ['skills', 'skill', 'skills tab', 'skill tab'] },
    { href: '/community/feed', label: 'Community', icon: Group, voiceCommands: ['community', 'community tab'] },
    { href: '/project', label: 'Projects', icon: FolderOpen, voiceCommands: ['projects', 'project', 'projects tab', 'project tab'] },
    { href: '/test', label: 'Prepare', icon: BarChart3, voiceCommands: ['games', 'game', 'games tab', 'game tab', 'ai insights'] },
    { href: '/mentors', label: 'Mentors', icon: School2, voiceCommands: ['mentors', 'mentor', 'mentors tab', 'mentor tab'] },
  ];

  const voiceCommands = {
    'home': () => navigateToPage('/dashboard'),
    'dashboard': () => navigateToPage('/dashboard'),
    'skills': () => navigateToPage('/skills'),
    'community': () => navigateToPage('/community/feed'),
    'projects': () => navigateToPage('/project'),
    'games': () => navigateToPage('/test'),
    'mentors': () => navigateToPage('/mentors'),
    'mentor': () => navigateToPage('/mentors'),
    
    'change language': () => {
      setIsLanguageMenuOpen(true);
      speak('Language menu opened. Say a language name to select it.');
    },
    'language': () => {
      setIsLanguageMenuOpen(true);
      speak('Language menu opened. Say a language name to select it.');
    },
    
    'english': () => handleVoiceLanguageChange('en'),
    'hindi': () => handleVoiceLanguageChange('hi'),
    'hindustani': () => handleVoiceLanguageChange('hi'),
    'spanish': () => handleVoiceLanguageChange('es'),
    'french': () => handleVoiceLanguageChange('fr'),
    'german': () => handleVoiceLanguageChange('de'),
    'japanese': () => handleVoiceLanguageChange('ja'),
    'chinese': () => handleVoiceLanguageChange('zh'),
    'arabic': () => handleVoiceLanguageChange('ar'),
    
    'switch to english': () => handleVoiceLanguageChange('en'),
    'switch to hindi': () => handleVoiceLanguageChange('hi'),
    'switch to spanish': () => handleVoiceLanguageChange('es'),
    'switch to french': () => handleVoiceLanguageChange('fr'),
    'switch to german': () => handleVoiceLanguageChange('de'),
    'switch to japanese': () => handleVoiceLanguageChange('ja'),
    'switch to chinese': () => handleVoiceLanguageChange('zh'),
    'switch to arabic': () => handleVoiceLanguageChange('ar'),
    
    'open menu': () => {
      setIsMobileMenuOpen(true);
      speak('Mobile menu opened');
    },
    'close menu': () => {
      setIsMobileMenuOpen(false);
      speak('Menu closed');
    },
    'menu': () => {
      setIsMobileMenuOpen(!isMobileMenuOpen);
      speak(isMobileMenuOpen ? 'Menu closed' : 'Menu opened');
    },
    
    'logout': () => handleLogout(),
    'log out': () => handleLogout(),
    'login': () => handleLogin(),
    'log in': () => handleLogin(),
    'profile': () => handleProfileClick(),
    
    'stop listening': () => {
      stopListening();
      speak('Voice control stopped');
    },
    'help': () => {
      const helpText = 'You can say: home, skills, jobs, projects, games, change language, logout, profile, open menu, close menu, or any language name like english, hindi, spanish.';
      speak(helpText);
    },
    'commands': () => {
      const helpText = 'Available commands: navigate to dashboard, skills, jobs, projects, games. Change language by saying english, hindi, spanish, french, german, japanese, chinese, or arabic. Say menu to open or close menu, logout to sign out, profile to view profile, or help for this message.';
      speak(helpText);
    }
  };

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
          setTimeout(() => {
            recognition.start();
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

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesisRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isVoiceEnabled]);

  const speak = (text) => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      setVoiceFeedback(text);
      speechSynthesisRef.current.speak(utterance);
      
      utterance.onend = () => {
        setVoiceFeedback('');
      };
    }
  };

  const startListening = () => {
    if (recognitionRef.current) {
      setIsVoiceEnabled(true);
      recognitionRef.current.start();
      speak('Voice control activated. Say help for available commands.');
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
    
    if (voiceCommands[transcript]) {
      voiceCommands[transcript]();
      return;
    }
    
    for (const [command, action] of Object.entries(voiceCommands)) {
      if (transcript.includes(command)) {
        action();
        return;
      }
    }
    
    for (const link of navigationLinks) {
      for (const voiceCommand of link.voiceCommands) {
        if (transcript.includes(voiceCommand)) {
          navigateToPage(link.href);
          return;
        }
      }
    }
    
    const languageMap = {
      'english': 'en',
      'hindi': 'hi',
      'hindustani': 'hi',
      'spanish': 'es',
      'french': 'fr',
      'german': 'de',
      'japanese': 'ja',
      'chinese': 'zh',
      'arabic': 'ar'
    };
    
    for (const [langName, langCode] of Object.entries(languageMap)) {
      if (transcript.includes(langName)) {
        handleVoiceLanguageChange(langCode);
        return;
      }
    }
    
    speak('Command not recognized. Say help for available commands.');
  };

  const navigateToPage = (href) => {
    const pageName = href.split('/').pop() || 'dashboard';
    speak(`Navigating to ${pageName}`);
    window.location.href = href;
  };

  const handleVoiceLanguageChange = (languageCode) => {
    if (availableLanguages[languageCode]) {
      changeLanguage(languageCode);
      setIsLanguageMenuOpen(false);
      speak(`Language changed to ${availableLanguages[languageCode].name}`);
    } else {
      speak('Language not available');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleLanguageMenu = () => {
    setIsLanguageMenuOpen(!isLanguageMenuOpen);
  };

  const handleLanguageChange = (languageCode) => {
    changeLanguage(languageCode);
    setIsLanguageMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleProfileClick = () => {
    if (userProfile?.role === 'mentor') {
      window.location.href = '/mentor/dashboard';
      return;
    }

    if (userProfile?.email) {
      // speak('Opening profile page');
      window.location.href = `/user/profile/${userProfile.email}`;
    } else if (userToken) {
      speak('Please login again to load your profile');
      window.location.href = '/login';
    }
  };

  const handleLogout = async () => {
    try {
     if (session) {
      const { signOut } = await import("next-auth/react");
      await signOut({ callbackUrl: "/" });}
      localStorage.removeItem('yuvaToken');
      localStorage.removeItem('yuvaUser');
      localStorage.removeItem('userToken');
      localStorage.removeItem('mentorData');
      
      setUserToken(null);
      setUserProfile(null);
      setIsAuthenticated(false);

      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.clear();
      window.location.href = '/login';
    }
  };

  const handleLogin = () => {
    speak('Redirecting to login page');
    window.location.href = '/login';
  };

  const handleStudentJoin = () => {
    window.location.href = '/register';
  };

  const handleMentorJoin = () => {
    window.location.href = '/mentor/register';
  };

  return (
    <div data-theme={theme}>
      {(isListening || voiceFeedback) && (
        <div className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 bg-success text-success-content px-4 py-2 rounded-b-lg shadow-lg">
          <div className="flex items-center space-x-1">
            {isListening && (
              <>
                <div className="w-2 h-2 bg-error rounded-full animate-pulse"></div>
                <span className="text-sm">Listening...</span>
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

    
      
      <div className="navbar bg-base-100 shadow-lg border-b border-base-300 h-18">
        <div className="w-full px-2 flex items-center justify-between">
          {/* Logo - Very Compact */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center">
              <img
                className="w-18 h-17 object-contain"
                src="/sih.png"
                alt="YUVA YOJNA Logo"
              />
            </a>
          </div>

          {/* Navigation Links - Ultra Compact */}
          {isAuthenticated && ( 
            <div className="hidden lg:flex flex-1 justify-center max-w-md mx-4">
              <div className="flex items-center gap-5">
                {navigationLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      className="btn btn-ghost btn-sm h-12 flex flex-col items-center justify-center px-2 text-base-content hover:text-primary transition-colors duration-200 group"
                      style={{ minWidth: '70px' }}
                    >
                      <IconComponent className="w-4 h-4 mb-0.5 group-hover:scale-110 transition-transform duration-200" />
                      <span className="text-xs font-medium leading-tight">
                        <TranslatedText>{link.label}</TranslatedText>
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Right Section - Ultra Compact */}
          <div className="flex-shrink-0 hidden md:flex">
            <div className="flex items-center gap-1">
              <VoiceControlProvider />

              {/* Language Dropdown - Ultra Compact */}
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-outline btn-xs h-10 px-5">
                  <Globe className="w-4 h-4" />
                  <span className="text-sm">
                    {availableLanguages[currentLanguage]?.flag}
                  </span>
                  <ChevronDown className="w-3 h-3" />
                </div>
                <ul tabIndex={0} className="dropdown-content z-50 menu p-2 shadow-xl bg-base-100 rounded-box w-52 max-h-64 overflow-y-auto border border-base-300">
                  <li className="menu-title">
                    <span className="text-primary text-xs flex items-center">
                      <Mic className="w-3 h-3 mr-1" />
                      Say language name or click to select
                    </span>
                  </li>
                  {Object.entries(availableLanguages).map(([code, language]) => (
                    <li key={code}>
                      <a
                        onClick={() => handleLanguageChange(code)}
                        className={`${
                          currentLanguage === code ? 'bg-primary/20 text-primary' : 'text-base-content'
                        }`}
                      >
                        <span className="text-lg">{language.flag}</span>
                        <span className="text-sm font-medium">{language.name}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {isAuthenticated ? (
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="btn btn-outline btn-xs h-10 px-5">
                    {(session?.user?.image || userProfile?.picture || userProfile?.image) ? (
                      <div className="avatar">
                        <div className="w-5 h-5 rounded-full">
                          <img
                            src={session?.user?.image || userProfile?.picture || userProfile?.image}
                            alt="Profile"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              const fallback = document.createElement('div');
                              fallback.className = 'w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center';
                              fallback.innerHTML = '<svg class="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>';
                              e.target.parentNode.insertBefore(fallback, e.target);
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <UserCircle className="w-10 h-10 text-primary" />
                    )}
                  </div>
                  <ul tabIndex={0} className="dropdown-content z-50 menu p-2 shadow-xl bg-base-100 rounded-box w-52 border border-base-300">
                    <li>
                      <a onClick={handleProfileClick} className="text-base-content">
                        <UserCircle className="w-4 h-4" />
                        Profile
                      </a>
                    </li>
                    <li>
                      <a onClick={handleLogout} className="text-error">
                        <LogOut className="w-4 h-4" />
                        Logout
                      </a>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="btn btn-primary btn-xs h-10 px-4">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">Join</span>
                    <ChevronDown className="w-3 h-3" />
                  </div>
                  <ul tabIndex={0} className="dropdown-content z-50 menu p-2 shadow-xl bg-base-100 rounded-box w-64 border border-base-300">
                    <li className="mb-2">
                      <div className="block overflow-hidden rounded-xl bg-base-200 p-0">
                        <img
                          src="/yo.png"
                          alt="Join Yuva Yojna"
                          className="h-28 w-full object-cover"
                        />
                        <div className="p-3">
                          <p className="text-sm font-semibold text-base-content">Join Yuva Yojna</p>
                          <p className="text-xs text-base-content/60">Choose your path</p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <a onClick={handleStudentJoin} className="text-base-content">
                        <User className="w-4 h-4" />
                        Join as Student
                      </a>
                    </li>
                    <li>
                      <a onClick={handleMentorJoin} className="text-base-content">
                        <School2 className="w-4 h-4" />
                        Join as Mentor
                      </a>
                    </li>
                    <li>
                      <a onClick={handleLogin} className="text-base-content/70">
                        <LogIn className="w-4 h-4" />
                        Already have account
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex-shrink-0">
            <button
              onClick={toggleMobileMenu}
              className="btn btn-square btn-ghost btn-xs h-8 w-8"
            >
              {isMobileMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-base-100 shadow-lg border-t border-base-300">
          <div className="px-4 pt-2 pb-3 space-y-3">
            <div className="mb-4">
              <VoiceControlProvider />
            </div>

            {/* Language Selection Mobile */}
            <div className="mb-4 p-4 bg-base-200 rounded-xl border border-base-300">
              <div className="flex items-center mb-3">
                <Globe className="w-5 h-5 mr-2 text-primary" />
                <span className="text-sm font-medium text-primary">
                  <TranslatedText>Select Language</TranslatedText>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(availableLanguages).slice(0, 8).map(([code, language]) => (
                  <button
                    key={code}
                    onClick={() => handleLanguageChange(code)}
                    className={`btn btn-sm ${
                      currentLanguage === code 
                        ? 'btn-primary' 
                        : 'btn-outline'
                    }`}
                  >
                    <span className="mr-2 text-base">{language.flag}</span>
                    <span className="font-medium text-xs">{language.name}</span>
                  </button>
                ))}
              </div>
                
              {Object.keys(availableLanguages).length > 8 && (
                <div className="mt-2 max-h-32 overflow-y-auto">
                  {Object.entries(availableLanguages).slice(8).map(([code, language]) => (
                    <button
                      key={code}
                      onClick={() => handleLanguageChange(code)}
                      className={`btn btn-sm w-full mb-1 ${
                        currentLanguage === code 
                          ? 'btn-primary' 
                          : 'btn-outline'
                      }`}
                    >
                      <span className="mr-2 text-base">{language.flag}</span>
                      <span className="font-medium text-xs">{language.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {isAuthenticated ? (
              <>
                {navigationLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      className="btn btn-outline w-full justify-start"
                    >
                      <IconComponent className="w-6 h-6 mr-4" />
                      <span className="text-sm font-medium">
                        <TranslatedText>{link.label}</TranslatedText>
                      </span>
                    </a>
                  );
                })}
                
                <button
                  onClick={handleProfileClick}
                  className="btn btn-outline w-full justify-start"
                >
                  {(session?.user?.image || userProfile?.picture || userProfile?.image) ? (
                    <div className="avatar">
                      <div className="w-8 rounded-full">
                        <img 
                          src={session?.user?.image || userProfile?.picture || userProfile?.image} 
                          alt="Profile" 
                          onError={(e) => {
                            e.target.style.display = 'none';
                            const fallback = document.createElement('div');
                            fallback.className = 'w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center';
                            fallback.innerHTML = '<svg class="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>';
                            e.target.parentNode.insertBefore(fallback, e.target);
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <UserCircle className="w-8 h-8 text-primary mr-3" />
                  )}
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium">
                      {session?.user?.name || userProfile?.name || <TranslatedText>Profile</TranslatedText>}
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={handleLogout}
                  className="btn btn-error btn-outline w-full"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  <TranslatedText>Logout</TranslatedText>
                </button>
              </>
            ) : (
              <div className="py-4 space-y-3">
                <div className="overflow-hidden rounded-xl border border-base-300 bg-base-200">
                  <img
                    src="/yo.png"
                    alt="Join Yuva Yojna"
                    className="h-36 w-full object-cover"
                  />
                  <div className="p-3">
                    <p className="text-sm font-semibold">Join Yuva Yojna</p>
                    <p className="text-xs opacity-70">Register as student or mentor</p>
                  </div>
                </div>
                <button
                  onClick={handleStudentJoin}
                  className="btn btn-primary w-full"
                >
                  <Users className="w-5 h-5 mr-2" />
                  <span>Join as Student</span>
                </button>
                <button
                  onClick={handleMentorJoin}
                  className="btn btn-outline btn-primary w-full"
                >
                  <School2 className="w-5 h-5 mr-2" />
                  <span>Join as Mentor</span>
                </button>
                <button
                  onClick={handleLogin}
                  className="btn btn-ghost w-full"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  <span>Already have account</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
