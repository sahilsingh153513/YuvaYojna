'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Clock, 
  Star, 
  Zap, 
  Target,
  ArrowRight,
  CheckCircle
} from 'lucide-react';
import { useDaisyTheme } from '@/context/DaisyThemeContext';

const difficulties = [
  {
    id: 'easy',
    name: 'Easy',
    description: 'Basic concepts and fundamentals',
    duration: '3 minutes',
    questions: 10,
    icon: <Star className="w-8 h-8" />,
    color: 'bg-success',
    bgColor: 'bg-success bg-opacity-10',
    textColor: 'text-success',
    borderColor: 'border-success border-opacity-30'
  },
  {
    id: 'medium',
    name: 'Medium',
    description: 'Intermediate level with practical scenarios',
    duration: '5 minutes',
    questions: 10,
    icon: <Target className="w-8 h-8" />,
    color: 'bg-warning',
    bgColor: 'bg-warning bg-opacity-10',
    textColor: 'text-warning',
    borderColor: 'border-warning border-opacity-30'
  },
  {
    id: 'hard',
    name: 'Hard',
    description: 'Advanced concepts and complex problem solving',
    duration: '10 minutes',
    questions: 10,
    icon: <Zap className="w-8 h-8" />,
    color: 'bg-error',
    bgColor: 'bg-error bg-opacity-10',
    textColor: 'text-error',
    borderColor: 'border-error border-opacity-30'
  }
];

export default function DifficultyPage() {
  const router = useRouter();
  const { theme } = useDaisyTheme();
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    setMounted(true);
    const category = localStorage.getItem('selectedCategory');
    if (category) {
      try {
        const parsedCategory = JSON.parse(category);
        console.log('Loaded selected category:', parsedCategory); // Debug log
        if (parsedCategory && parsedCategory.id && parsedCategory.name && parsedCategory.selectedRole) {
          setSelectedCategory(parsedCategory);
        } else {
          console.error('Invalid category data structure:', parsedCategory);
          router.push('/test');
        }
      } catch (error) {
        console.error('Error parsing category data:', error);
        router.push('/test');
      }
    } else {
      console.error('No selected category found in localStorage');
      router.push('/test');
    }
  }, [router]);

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return null;
  }

  const handleDifficultySelect = (difficulty) => {
    const testData = {
      id: selectedCategory.id,
      name: selectedCategory.name,
      selectedRole: selectedCategory.selectedRole,
      difficulty: difficulty.id,
      difficultyName: difficulty.name,
      duration: difficulty.duration,
      questions: difficulty.questions
    };
    console.log('Storing test data:', testData); // Debug log
    localStorage.setItem('testData', JSON.stringify(testData));
    router.push('/test/quiz');
  };

  if (!selectedCategory) {
    return (
      <>
        <style jsx>{`
          .difficulty-container[data-theme="${theme}"] {
            background: hsl(var(--b1));
            color: hsl(var(--bc));
            min-height: 100vh;
          }
        `}</style>
        <div className="difficulty-container min-h-screen flex items-center justify-center" data-theme={theme}>
          <div className="text-center">
            <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
            <p className="text-base-content opacity-70">Loading...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style jsx>{`
        .difficulty-container[data-theme="${theme}"] {
          background: hsl(var(--b1));
          color: hsl(var(--bc));
          min-height: 100vh;
        }
        .difficulty-container[data-theme="${theme}"] .bg-base-100 {
          background: hsl(var(--b1)) !important;
        }
        .difficulty-container[data-theme="${theme}"] .bg-base-200 {
          background: hsl(var(--b2)) !important;
        }
        .difficulty-container[data-theme="${theme}"] .text-base-content {
          color: hsl(var(--bc)) !important;
        }
        .difficulty-container[data-theme="${theme}"] .border-base-200 {
          border-color: hsl(var(--b2)) !important;
        }
        .difficulty-container[data-theme="${theme}"] .text-primary {
          color: hsl(var(--p)) !important;
        }
        .difficulty-container[data-theme="${theme}"] .bg-primary {
          background: hsl(var(--p)) !important;
        }
        .difficulty-container[data-theme="${theme}"] .text-success {
          color: hsl(var(--su)) !important;
        }
        .difficulty-container[data-theme="${theme}"] .bg-success {
          background: hsl(var(--su)) !important;
        }
        .difficulty-container[data-theme="${theme}"] .text-warning {
          color: hsl(var(--wa)) !important;
        }
        .difficulty-container[data-theme="${theme}"] .bg-warning {
          background: hsl(var(--wa)) !important;
        }
        .difficulty-container[data-theme="${theme}"] .text-error {
          color: hsl(var(--er)) !important;
        }
        .difficulty-container[data-theme="${theme}"] .bg-error {
          background: hsl(var(--er)) !important;
        }
        .difficulty-container[data-theme="${theme}"] .text-info {
          color: hsl(var(--in)) !important;
        }
        .difficulty-container[data-theme="${theme}"] .bg-info {
          background: hsl(var(--in)) !important;
        }
        .difficulty-container[data-theme="${theme}"] .text-secondary {
          color: hsl(var(--s)) !important;
        }
        .difficulty-container[data-theme="${theme}"] .bg-secondary {
          background: hsl(var(--s)) !important;
        }
        .difficulty-container[data-theme="${theme}"] .border-success {
          border-color: hsl(var(--su)) !important;
        }
        .difficulty-container[data-theme="${theme}"] .border-warning {
          border-color: hsl(var(--wa)) !important;
        }
        .difficulty-container[data-theme="${theme}"] .border-error {
          border-color: hsl(var(--er)) !important;
        }
      `}</style>

      <div className="difficulty-container" data-theme={theme}>
        {/* Header */}
        <div className="bg-base-100 shadow-lg border-b border-base-200">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-base-content mb-4">
                Choose Difficulty Level
              </h1>
              <p className="text-xl text-base-content opacity-70 mb-4">
                Selected Field: <span className="font-semibold text-primary">{selectedCategory.name}</span>
              </p>
              <p className="text-lg text-base-content opacity-70 mb-4">
                Selected Role: <span className="font-semibold text-primary">{selectedCategory.selectedRole}</span>
              </p>
              <p className="text-base-content opacity-60">
                Choose the difficulty level that best matches your current knowledge
              </p>
            </div>
          </div>
        </div>

        {/* Difficulty Selection */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {difficulties.map((difficulty) => (
              <div
                key={difficulty.id}
                onClick={() => handleDifficultySelect(difficulty)}
                className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
              >
                <div className={`card ${difficulty.bgColor} ${difficulty.borderColor} border-2 shadow-lg hover:shadow-xl group-hover:border-opacity-100 transition-all duration-300`}>
                  <div className="card-body p-8 text-center">
                    <div className={`${difficulty.color} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <div className="text-base-100">
                        {difficulty.icon}
                      </div>
                    </div>
                    
                    <h3 className={`text-2xl font-bold ${difficulty.textColor} mb-2`}>
                      {difficulty.name}
                    </h3>
                    
                    <p className="text-base-content opacity-70 mb-4">
                      {difficulty.description}
                    </p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-center text-base-content opacity-80">
                        <Clock className="w-5 h-5 mr-2" />
                        <span className="font-semibold">{difficulty.duration}</span>
                      </div>
                      <div className="flex items-center justify-center text-base-content opacity-80">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        <span className="font-semibold">{difficulty.questions} Questions</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center text-primary font-semibold group-hover:text-primary-focus">
                      <span>Start {difficulty.name} Test</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Instructions */}
          <div className="card bg-base-100 shadow-lg border border-base-200 mt-12">
            <div className="card-body p-8">
              <h3 className="text-2xl font-bold text-base-content mb-6 text-center">
                Test Instructions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="badge badge-info badge-lg p-4 mr-4 mt-1">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-base-content">Time Management</h4>
                      <p className="text-base-content opacity-70">Each difficulty level has a specific time limit. Use your time wisely!</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="badge badge-success badge-lg p-4 mr-4 mt-1">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-base-content">Answer All Questions</h4>
                      <p className="text-base-content opacity-70">Make sure to answer all 10 questions for accurate results.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="badge badge-warning badge-lg p-4 mr-4 mt-1">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-base-content">Be Honest</h4>
                      <p className="text-base-content opacity-70">Answer based on your actual knowledge for better recommendations.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="badge badge-secondary badge-lg p-4 mr-4 mt-1">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-base-content">No Pressure</h4>
                      <p className="text-base-content opacity-70">This is a learning tool, not a pass/fail exam.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}