'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Code, 
  Users, 
  BarChart3, 
  BookOpen, 
  ArrowRight, 
  Clock, 
  Trophy,
  Brain,
  Target,
  Zap,
  Heart,
  PlayCircle,
  CalendarDays,
  CheckCircle
} from 'lucide-react';

export default function AssessmentPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

  const categories = [
    {
      id: 'tech',
      name: 'Technology',
      icon: <Code className="w-12 h-12" />,
      color: 'bg-blue-500',
      roles: [
        'Software Engineer',
        'Frontend Developer',
        'Backend Developer',
        'Full Stack Developer',
        'Data Scientist',
        'DevOps Engineer',
        'Mobile App Developer',
        'UI/UX Designer',
        'Cybersecurity Specialist',
        'Cloud Engineer'
      ]
    },
    {
      id: 'management',
      name: 'Management',
      icon: <Users className="w-12 h-12" />,
      color: 'bg-green-500',
      roles: [
        'Project Manager',
        'Product Manager',
        'Operations Manager',
        'Marketing Manager',
        'HR Manager',
        'Business Analyst',
        'Consultant',
        'Team Lead',
        'Strategy Manager',
        'Sales Manager'
      ]
    },
    {
      id: 'social',
      name: 'Social Work',
      icon: <Heart className="w-12 h-12" />,
      color: 'bg-pink-500',
      roles: [
        'Community Outreach Coordinator',
        'Social Worker',
        'NGO Program Manager',
        'Youth Counselor',
        'Public Health Worker',
        'Education Coordinator',
        'Rural Development Officer',
        'Women Empowerment Specialist',
        'Child Welfare Officer',
        'Environmental Activist'
      ]
    },
    {
      id: 'finance',
      name: 'Finance',
      icon: <BarChart3 className="w-12 h-12" />,
      color: 'bg-yellow-500',
      roles: [
        'Financial Analyst',
        'Investment Banker',
        'Accountant',
        'Risk Manager',
        'Tax Consultant',
        'Insurance Agent',
        'Banking Officer',
        'Financial Planner',
        'Auditor',
        'Treasury Manager'
      ]
    }
  ];

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowRoleModal(true);
  };

  const handleRoleSelect = (role) => {
    const categoryData = {
      id: selectedCategory.id,
      name: selectedCategory.name,
      selectedRole: role
    };
    localStorage.setItem('selectedCategory', JSON.stringify(categoryData));
    router.push('/test/difficulty');
  };

  const prepResources = [
    {
      title: 'Technology Interview Prep',
      topic: 'DSA, React, APIs, system design',
      video: 'https://www.youtube.com/results?search_query=software+engineer+interview+preparation+roadmap',
    },
    {
      title: 'Management Case Prep',
      topic: 'Product thinking, prioritization, communication',
      video: 'https://www.youtube.com/results?search_query=product+manager+case+interview+preparation',
    },
    {
      title: 'Finance Career Prep',
      topic: 'Excel, accounting, valuation, analysis',
      video: 'https://www.youtube.com/results?search_query=financial+analyst+interview+preparation+full+course',
    },
    {
      title: 'Social Impact Prep',
      topic: 'Community strategy, NGO programs, field work',
      video: 'https://www.youtube.com/results?search_query=social+work+ngo+program+management+training',
    },
  ];

  const strategySteps = [
    'Take the role-based test to identify weak topics.',
    'Review your score and topic breakdown on the result page.',
    'Follow the 7-day strategy and watch the suggested videos.',
    'Build one small proof project or case note for your target role.',
    'Retake the test and move up difficulty after scoring 80%+.',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Skill Assessment Test
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Choose your field and take a personalized assessment to discover your strengths
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-6 rounded-xl">
                <div className="flex items-center justify-center mb-2">
                  <Brain className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Smart Assessment</h3>
                <p className="text-gray-600">AI-powered questions tailored to your field</p>
              </div>
              <div className="bg-green-50 p-6 rounded-xl">
                <div className="flex items-center justify-center mb-2">
                  <Clock className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Quick & Efficient</h3>
                <p className="text-gray-600">Complete in 3-10 minutes based on difficulty</p>
              </div>
              <div className="bg-purple-50 p-6 rounded-xl">
                <div className="flex items-center justify-center mb-2">
                  <Trophy className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Detailed Results</h3>
                <p className="text-gray-600">Get personalized recommendations</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Selection */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Choose Your Field
          </h2>
          <p className="text-lg text-gray-600">
            Select a category that matches your interests and career goals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategorySelect(category)}
              className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
            >
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-8 text-center border-2 border-transparent hover:border-blue-200">
                <div className={`${category.color} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className="text-white">
                    {category.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {category.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {category.roles.length} career paths available
                </p>
                <div className="flex items-center justify-center text-blue-600 font-semibold group-hover:text-blue-700">
                  <span>Start Assessment</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_420px]">
          <section className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <CalendarDays className="w-7 h-7 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Preparation Strategy</h2>
            </div>
            <div className="space-y-4">
              {strategySteps.map((step, index) => (
                <div key={step} className="flex gap-4 rounded-xl bg-gray-50 p-4">
                  <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                    {index + 1}
                  </div>
                  <p className="text-gray-700">{step}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-6">
              <PlayCircle className="w-7 h-7 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Related Video Tracks</h2>
            </div>
            <div className="space-y-3">
              {prepResources.map((resource) => (
                <a
                  key={resource.title}
                  href={resource.video}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-xl border border-gray-200 p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                      <p className="mt-1 text-sm text-gray-600">{resource.topic}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-blue-600 mt-1" />
                  </div>
                </a>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-10 rounded-2xl bg-gray-900 p-8 text-white">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <CheckCircle className="mb-3 h-7 w-7 text-green-400" />
              <h3 className="text-lg font-bold">Topic-wise Results</h3>
              <p className="mt-2 text-white/70">See exactly which concepts need revision after the quiz.</p>
            </div>
            <div>
              <Target className="mb-3 h-7 w-7 text-blue-300" />
              <h3 className="text-lg font-bold">Personal Strategy</h3>
              <p className="mt-2 text-white/70">Get a 7-day plan based on your score and selected role.</p>
            </div>
            <div>
              <Zap className="mb-3 h-7 w-7 text-yellow-300" />
              <h3 className="text-lg font-bold">Video Practice</h3>
              <p className="mt-2 text-white/70">Open related video tracks and practice weak topics immediately.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Role Selection Modal */}
      {showRoleModal && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">
                  Choose Your Role in {selectedCategory.name}
                </h3>
                <button
                  onClick={() => setShowRoleModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedCategory.roles.map((role, index) => (
                  <button
                    key={index}
                    onClick={() => handleRoleSelect(role)}
                    className="p-4 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors duration-200 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 group-hover:text-blue-700">
                        {role}
                      </span>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
