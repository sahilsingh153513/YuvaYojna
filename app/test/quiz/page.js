'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Clock, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useDaisyTheme } from '@/context/DaisyThemeContext';

// Tech questions based on difficulty
const techQuestions = {
  easy: [
    {
      id: 1,
      question: "What does HTML stand for?",
      options: [
        "HyperText Markup Language",
        "High Tech Modern Language",
        "Home Tool Markup Language",
        "Hyperlink and Text Markup Language"
      ],
      correct: 0
    },
    {
      id: 2,
      question: "Which programming language is primarily used for web development?",
      options: ["Python", "JavaScript", "C++", "Java"],
      correct: 1
    },
    {
      id: 3,
      question: "What is the purpose of CSS?",
      options: [
        "To create databases",
        "To style web pages",
        "To write server code",
        "To manage files"
      ],
      correct: 1
    },
    {
      id: 4,
      question: "What does API stand for?",
      options: [
        "Application Programming Interface",
        "Advanced Programming Integration",
        "Automated Program Interface",
        "Application Process Integration"
      ],
      correct: 0
    },
    {
      id: 5,
      question: "Which of the following is a version control system?",
      options: ["Git", "MySQL", "Apache", "Docker"],
      correct: 0
    },
    {
      id: 6,
      question: "What is the main purpose of a database?",
      options: [
        "To store and organize data",
        "To create websites",
        "To send emails",
        "To play games"
      ],
      correct: 0
    },
    {
      id: 7,
      question: "Which tag is used to create a hyperlink in HTML?",
      options: ["<link>", "<a>", "<href>", "<url>"],
      correct: 1
    },
    {
      id: 8,
      question: "What does SQL stand for?",
      options: [
        "Structured Query Language",
        "Simple Query Language",
        "Standard Query Language",
        "System Query Language"
      ],
      correct: 0
    },
    {
      id: 9,
      question: "Which of the following is a frontend framework?",
      options: ["Node.js", "Express", "React", "MongoDB"],
      correct: 2
    },
    {
      id: 10,
      question: "What is the purpose of JavaScript?",
      options: [
        "To style web pages",
        "To add interactivity to web pages",
        "To create databases",
        "To manage servers"
      ],
      correct: 1
    }
  ],
  medium: [
    {
      id: 1,
      question: "What is the difference between 'let' and 'var' in JavaScript?",
      options: [
        "No difference, they work the same",
        "let has block scope, var has function scope",
        "var is faster than let",
        "let can only be used in loops"
      ],
      correct: 1
    },
    {
      id: 2,
      question: "What is the purpose of the 'useState' hook in React?",
      options: [
        "To create components",
        "To manage state in functional components",
        "To handle API calls",
        "To style components"
      ],
      correct: 1
    },
    {
      id: 3,
      question: "What is the time complexity of binary search?",
      options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
      correct: 1
    },
    {
      id: 4,
      question: "What does REST stand for in RESTful API?",
      options: [
        "Representational State Transfer",
        "Remote Execution State Transfer",
        "Resource Exchange State Transfer",
        "Rapid Execution State Transfer"
      ],
      correct: 0
    },
    {
      id: 5,
      question: "What is the purpose of middleware in Express.js?",
      options: [
        "To create HTML templates",
        "To handle requests between request and response",
        "To connect to databases",
        "To manage user authentication only"
      ],
      correct: 1
    },
    {
      id: 6,
      question: "What is the difference between SQL and NoSQL databases?",
      options: [
        "SQL is faster than NoSQL",
        "SQL uses tables, NoSQL uses documents/collections",
        "NoSQL is only for small applications",
        "SQL is only for web applications"
      ],
      correct: 1
    },
    {
      id: 7,
      question: "What is the purpose of Docker containers?",
      options: [
        "To create virtual machines",
        "To package applications with dependencies",
        "To write code faster",
        "To manage databases"
      ],
      correct: 1
    },
    {
      id: 8,
      question: "What is the difference between GET and POST HTTP methods?",
      options: [
        "GET is faster than POST",
        "GET retrieves data, POST sends data",
        "POST is only for forms",
        "GET is only for APIs"
      ],
      correct: 1
    },
    {
      id: 9,
      question: "What is the purpose of the 'map' function in JavaScript?",
      options: [
        "To create new arrays",
        "To transform each element in an array",
        "To filter arrays",
        "To sort arrays"
      ],
      correct: 1
    },
    {
      id: 10,
      question: "What is the purpose of environment variables?",
      options: [
        "To store sensitive configuration data",
        "To create user interfaces",
        "To manage databases",
        "To write tests"
      ],
      correct: 0
    }
  ],
  hard: [
    {
      id: 1,
      question: "What is the difference between shallow copy and deep copy in JavaScript?",
      options: [
        "No difference, they work the same",
        "Shallow copy copies references, deep copy copies values",
        "Deep copy is faster than shallow copy",
        "Shallow copy only works with arrays"
      ],
      correct: 1
    },
    {
      id: 2,
      question: "What is the purpose of the 'useEffect' hook's dependency array?",
      options: [
        "To specify which props to watch",
        "To control when the effect runs",
        "To improve performance",
        "To handle errors"
      ],
      correct: 1
    },
    {
      id: 3,
      question: "What is the time complexity of quicksort in the worst case?",
      options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"],
      correct: 1
    },
    {
      id: 4,
      question: "What is the purpose of JWT (JSON Web Token) in authentication?",
      options: [
        "To encrypt passwords",
        "To create stateless authentication",
        "To manage databases",
        "To style web pages"
      ],
      correct: 1
    },
    {
      id: 5,
      question: "What is the difference between microservices and monolithic architecture?",
      options: [
        "Microservices are faster than monoliths",
        "Microservices break applications into small services",
        "Monoliths are more secure",
        "Microservices only work with databases"
      ],
      correct: 1
    },
    {
      id: 6,
      question: "What is the purpose of Redis in web applications?",
      options: [
        "To store permanent data",
        "To provide in-memory caching",
        "To manage user authentication",
        "To create APIs"
      ],
      correct: 1
    },
    {
      id: 7,
      question: "What is the difference between horizontal and vertical scaling?",
      options: [
        "Horizontal adds more servers, vertical adds more power to existing servers",
        "Vertical is always better than horizontal",
        "Horizontal is only for databases",
        "Vertical is only for web applications"
      ],
      correct: 0
    },
    {
      id: 8,
      question: "What is the purpose of GraphQL compared to REST APIs?",
      options: [
        "GraphQL is faster than REST",
        "GraphQL allows clients to request specific data",
        "REST is more secure than GraphQL",
        "GraphQL only works with databases"
      ],
      correct: 1
    },
    {
      id: 9,
      question: "What is the purpose of WebSockets in real-time applications?",
      options: [
        "To create static websites",
        "To enable bidirectional communication",
        "To manage databases",
        "To handle file uploads"
      ],
      correct: 1
    },
    {
      id: 10,
      question: "What is the purpose of the 'useMemo' hook in React?",
      options: [
        "To create components",
        "To memoize expensive calculations",
        "To handle API calls",
        "To manage state"
      ],
      correct: 1
    }
  ]
};

export default function QuizPage() {
  const router = useRouter();
  const { theme } = useDaisyTheme();
  const [mounted, setMounted] = useState(false);
  const [testData, setTestData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const data = localStorage.getItem('testData');
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        console.log('Parsed test data:', parsedData); // Debug log
        if (parsedData && parsedData.difficulty && parsedData.name && parsedData.selectedRole) {
          setTestData(parsedData);
          setIsLoading(false);
          
          // Set timer based on difficulty
          const timeMap = { easy: 3, medium: 5, hard: 10 };
          setTimeLeft(timeMap[parsedData.difficulty] * 60); // Convert to seconds
        } else {
          console.error('Invalid test data structure:', parsedData);
          router.push('/test');
        }
      } catch (error) {
        console.error('Error parsing test data:', error);
        router.push('/test');
      }
    } else {
      console.error('No test data found in localStorage');
      router.push('/test');
    }
  }, [router]);

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted && !isLoading && testData) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isSubmitted && !isLoading && testData) {
      handleSubmit();
    }
  }, [timeLeft, isSubmitted, isLoading, testData]);

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return null;
  }

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNext = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = selectedAnswer;
      setAnswers(newAnswers);
      
      if (currentQuestion < 9) {
        const nextQuestion = currentQuestion + 1;
        setCurrentQuestion(nextQuestion);
        setSelectedAnswer(newAnswers[nextQuestion] || null);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      const prevQuestion = currentQuestion - 1;
      setCurrentQuestion(prevQuestion);
      setSelectedAnswer(answers[prevQuestion] || null);
    }
  };

  const handleSubmit = () => {
    if (!testData || !testData.difficulty) {
      console.error('Test data is missing or invalid');
      router.push('/test');
      return;
    }

    const finalAnswers = [...answers];
    if (selectedAnswer !== null) {
      finalAnswers[currentQuestion] = selectedAnswer;
      setAnswers(finalAnswers);
    }
    const questions = techQuestions[testData.difficulty];
    let score = 0;
    
    finalAnswers.forEach((answer, index) => {
      if (answer === questions[index].correct) {
        score++;
      }
    });
    
    const result = {
      ...testData,
      score: score,
      totalQuestions: 10,
      percentage: (score / 10) * 100,
      answers: finalAnswers,
      completedAt: new Date().toISOString()
    };
    
    localStorage.setItem('testResult', JSON.stringify(result));
    setIsSubmitted(true);
    router.push('/test/results');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading || !testData) {
    return (
      <>
        <style jsx>{`
          .quiz-container[data-theme="${theme}"] {
            background: hsl(var(--b1));
            color: hsl(var(--bc));
            min-height: 100vh;
          }
        `}</style>
        <div className="quiz-container min-h-screen flex items-center justify-center" data-theme={theme}>
          <div className="text-center">
            <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
            <p className="text-base-content opacity-70">Loading quiz...</p>
          </div>
        </div>
      </>
    );
  }

  const questions = techQuestions[testData.difficulty];
  const currentQ = questions[currentQuestion];

  return (
    <>
      <style jsx>{`
        .quiz-container[data-theme="${theme}"] {
          background: hsl(var(--b1));
          color: hsl(var(--bc));
          min-height: 100vh;
        }
        .quiz-container[data-theme="${theme}"] .bg-base-100 {
          background: hsl(var(--b1)) !important;
        }
        .quiz-container[data-theme="${theme}"] .bg-base-200 {
          background: hsl(var(--b2)) !important;
        }
        .quiz-container[data-theme="${theme}"] .bg-base-300 {
          background: hsl(var(--b3)) !important;
        }
        .quiz-container[data-theme="${theme}"] .text-base-content {
          color: hsl(var(--bc)) !important;
        }
        .quiz-container[data-theme="${theme}"] .border-base-200 {
          border-color: hsl(var(--b2)) !important;
        }
        .quiz-container[data-theme="${theme}"] .border-base-300 {
          border-color: hsl(var(--b3)) !important;
        }
        .quiz-container[data-theme="${theme}"] .text-primary {
          color: hsl(var(--p)) !important;
        }
        .quiz-container[data-theme="${theme}"] .bg-primary {
          background: hsl(var(--p)) !important;
        }
        .quiz-container[data-theme="${theme}"] .text-error {
          color: hsl(var(--er)) !important;
        }
        .quiz-container[data-theme="${theme}"] .bg-error {
          background: hsl(var(--er)) !important;
        }
        .quiz-container[data-theme="${theme}"] .bg-success {
          background: hsl(var(--su)) !important;
        }
        .quiz-container[data-theme="${theme}"] .border-primary {
          border-color: hsl(var(--p)) !important;
        }
        .quiz-container[data-theme="${theme}"] .hover\\:border-primary:hover {
          border-color: hsl(var(--p)) !important;
        }
      `}</style>

      <div className="quiz-container" data-theme={theme}>
        {/* Header */}
        <div className="bg-base-100 shadow-lg border-b border-base-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-base-content">
                  {testData.name} - {testData.selectedRole}
                </h1>
                <p className="text-base-content opacity-70">
                  {testData.difficultyName} Level Assessment
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="badge badge-error badge-lg gap-2 p-4">
                  <Clock className="w-5 h-5" />
                  <span className="font-bold text-lg">{formatTime(timeLeft)}</span>
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-base-content opacity-70 mb-2">
                <span>Question {currentQuestion + 1} of 10</span>
                <span>{Math.round(((currentQuestion + 1) / 10) * 100)}% Complete</span>
              </div>
              <progress 
                className="progress progress-primary w-full" 
                value={((currentQuestion + 1) / 10) * 100} 
                max="100"
              ></progress>
            </div>
          </div>
        </div>

        {/* Quiz Content */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="card bg-base-100 shadow-lg border border-base-200">
            <div className="card-body p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-base-content mb-6">
                  {currentQ.question}
                </h2>
                
                <div className="space-y-4">
                  {currentQ.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full p-4 text-left border-2 rounded-lg transition-all duration-200 ${
                        selectedAnswer === index
                          ? 'border-primary bg-primary bg-opacity-10 text-primary'
                          : 'border-base-300 hover:border-primary hover:bg-primary hover:bg-opacity-5'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                          selectedAnswer === index
                            ? 'border-primary bg-primary'
                            : 'border-base-300'
                        }`}>
                          {selectedAnswer === index && (
                            <CheckCircle className="w-4 h-4 text-primary-content" />
                          )}
                        </div>
                        <span className="font-medium">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className={`btn ${
                    currentQuestion === 0
                      ? 'btn-disabled'
                      : 'btn-outline btn-neutral'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </button>

                <div className="flex space-x-2">
                  {Array.from({ length: 10 }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentQuestion(index);
                        setSelectedAnswer(answers[index] || null);
                      }}
                      className={`btn btn-sm btn-circle ${
                        index === currentQuestion
                          ? 'btn-primary'
                          : answers[index] !== undefined
                          ? 'btn-success'
                          : 'btn-outline btn-neutral'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  disabled={selectedAnswer === null}
                  className={`btn ${
                    selectedAnswer === null
                      ? 'btn-disabled'
                      : 'btn-primary'
                  }`}
                >
                  {currentQuestion === 9 ? 'Submit' : 'Next'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
