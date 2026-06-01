'use client'

import { useState, useEffect } from 'react';
import { 
  TreePine, 
  Building2, 
  Handshake, 
  GraduationCap, 
  Heart, 
  Home, 
  Scale, 
  Atom, 
  TrendingUp, 
  Users, 
  Trophy, 
  Bus, 
  Globe, 
  Wrench, 
  Baby
} from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';
import { useVoiceControl } from '@/context/VoiceControlContext';
import { useDaisyTheme } from '@/context/DaisyThemeContext';

export default function SchemesPage() {
  const { theme } = useDaisyTheme();
  const { speak, processVoiceCommand } = useVoiceControl();
  const { t } = useTranslation();

  const schemeCategories = [
    // Row 1
    {
      id: 'agriculture',
      name: 'Agriculture, Rural & Environment',
      icon: <TreePine className="w-8 h-8" />,
      count: 672,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: 'banking',
      name: 'Banking, Financial Services and Insurance',
      icon: <Building2 className="w-8 h-8" />,
      count: 284,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100'
    },
    {
      id: 'business',
      name: 'Business & Entrepreneurship',
      icon: <Handshake className="w-8 h-8" />,
      count: 593,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 'education',
      name: 'Education & Learning',
      icon: <GraduationCap className="w-8 h-8" />,
      count: 995,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      id: 'health',
      name: 'Health & Wellness',
      icon: <Heart className="w-8 h-8" />,
      count: 229,
      color: 'text-teal-600',
      bgColor: 'bg-teal-100'
    },
    // Row 2
    {
      id: 'housing',
      name: 'Housing & Shelter',
      icon: <Home className="w-8 h-8" />,
      count: 107,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 'law',
      name: 'Public Safety, Law & Justice',
      icon: <Scale className="w-8 h-8" />,
      count: 12,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      id: 'technology',
      name: 'Science, IT & Communications',
      icon: <Atom className="w-8 h-8" />,
      count: 70,
      color: 'text-teal-600',
      bgColor: 'bg-teal-100'
    },
    {
      id: 'employment',
      name: 'Skills & Employment',
      icon: <TrendingUp className="w-8 h-8" />,
      count: 329,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      id: 'social',
      name: 'Social welfare & Empowerment',
      icon: <Users className="w-8 h-8" />,
      count: 1395,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    // Row 3
    {
      id: 'sports',
      name: 'Sports & Culture',
      icon: <Trophy className="w-8 h-8" />,
      count: 225,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      id: 'transport',
      name: 'Transport & Infrastructure',
      icon: <Bus className="w-8 h-8" />,
      count: 63,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      id: 'tourism',
      name: 'Travel & Tourism',
      icon: <Globe className="w-8 h-8" />,
      count: 51,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      id: 'utility',
      name: 'Utility & Sanitation',
      icon: <Wrench className="w-8 h-8" />,
      count: 38,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      id: 'women',
      name: 'Women and Child',
      icon: <Baby className="w-8 h-8" />,
      count: 424,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-gray-900 text-center mb-16">
            Find schemes based on categories.
          </h1>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {schemeCategories.map((category) => (
            <div
              key={category.id}
              className="text-center cursor-pointer group hover:scale-105 transition-all duration-300"
            >
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className={`${category.bgColor} p-4 rounded-full group-hover:shadow-lg group-hover:scale-110 transition-all duration-300`}>
                  <div className={`${category.color} group-hover:scale-110 transition-transform duration-300`}>
                    {category.icon}
                  </div>
                </div>
              </div>
              
              {/* Scheme Count */}
              <div className="text-center mb-3">
                <span className="text-lg font-bold text-green-600 group-hover:text-green-700 group-hover:scale-110 transition-all duration-300">
                  {category.count.toLocaleString()}
                </span>
                <span className="text-sm text-gray-600 ml-1 group-hover:text-gray-700 transition-colors duration-300">Schemes</span>
              </div>
              
              {/* Category Name */}
              <div className="text-center">
                <h3 className="text-sm font-semibold text-gray-800 leading-tight group-hover:text-blue-600 transition-colors duration-300">
                  {category.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
