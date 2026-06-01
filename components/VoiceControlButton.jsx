"use client";
import React, { useState, useEffect } from 'react';
import { useVoiceControl } from '@/context/VoiceControlContext';

const VoiceControlButton = () => {
  const { 
    isListening, 
    transcript, 
    voiceFeedback, 
    isVoiceEnabled, 
    startListening, 
    stopListening,
    speak 
  } = useVoiceControl();
  
  const [showTranscript, setShowTranscript] = useState(false);
  const [lastTranscript, setLastTranscript] = useState('');

  // Show transcript popup when there's new transcript
  useEffect(() => {
    if (transcript && transcript !== lastTranscript) {
      setShowTranscript(true);
      setLastTranscript(transcript);
      
      // Hide transcript after 3 seconds if no new input
      const timer = setTimeout(() => {
        setShowTranscript(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [transcript, lastTranscript]);

  // Hide transcript when voice feedback starts
  useEffect(() => {
    if (voiceFeedback) {
      setShowTranscript(false);
    }
  }, [voiceFeedback]);

  const handleMicClick = () => {
    if (isVoiceEnabled) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleHelpClick = () => {
    speak('you can speak and control');
  };

  return (
    <>
      {/* Main Voice Control Button - Sticky */}
      <div className="fixed bottom-10 left-6 z-50 flex flex-col items-end space-y-3">
        
        {/* Help Button */}
        <button
          onClick={handleHelpClick}
          className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
          title="Voice Commands Help"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        {/* Main Microphone Button */}
        <button
          onClick={handleMicClick}
          className={`relative p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-105 ${
            isVoiceEnabled 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
          title={isVoiceEnabled ? "Stop Voice Control" : "Start Voice Control"}
        >
          {/* Microphone Icon */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          
          {/* Listening Indicator */}
          {isListening && (
            <div className="absolute -top-1 -right-1">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          )}
          
          {/* Pulse Animation when listening */}
          {isListening && (
            <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-30"></div>
          )}
        </button>
      </div>

      {/* Transcript Display Popup */}
      {showTranscript && transcript && (
        <div className="fixed bottom-28 right-6 z-50 max-w-xs">
          <div className="bg-white border-2 border-blue-500 rounded-lg shadow-lg p-3 transform transition-all duration-300 animate-bounce">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-800">You said:</p>
                <p className="text-sm text-gray-600 italic">"{transcript}"</p>
              </div>
            </div>
            {/* Arrow pointing to mic button */}
            <div className="absolute bottom-0 right-8 transform translate-y-full">
              <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-blue-500"></div>
            </div>
          </div>
        </div>
      )}

      {/* Voice Feedback Display */}
      {voiceFeedback && (
        <div className="fixed bottom-28 right-6 z-50 max-w-xs">
          <div className="bg-green-100 border-2 border-green-500 rounded-lg shadow-lg p-3 transform transition-all duration-300">
            <div className="flex items-start space-x-2">
              <svg className="w-4 h-4 text-green-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-green-800">Assistant:</p>
                <p className="text-sm text-green-700">{voiceFeedback}</p>
              </div>
            </div>
            {/* Arrow pointing to mic button */}
            <div className="absolute bottom-0 right-8 transform translate-y-full">
              <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-green-500"></div>
            </div>
          </div>
        </div>
      )}

      {/* Status Indicator */}
      {isVoiceEnabled && (
        <div className="fixed top-4 right-6 z-40">
         
        </div>
      )}
    </>
  );
};

export default VoiceControlButton;