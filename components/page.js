'use client';

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
      color: 'text-success'
    },
    {
      id: 'banking',
      name: 'Banking, Financial Services and Insurance',
      icon: <Building2 className="w-8 h-8" />,
      count: 284,
      color: 'text-warning'
    },
    {
      id: 'business',
      name: 'Business & Entrepreneurship',
      icon: <Handshake className="w-8 h-8" />,
      count: 593,
      color: 'text-info'
    },
    {
      id: 'education',
      name: 'Education & Learning',
      icon: <GraduationCap className="w-8 h-8" />,
      count: 995,
      color: 'text-error'
    },
    {
      id: 'health',
      name: 'Health & Wellness',
      icon: <Heart className="w-8 h-8" />,
      count: 229,
      color: 'text-accent'
    },
    // Row 2
    {
      id: 'housing',
      name: 'Housing & Shelter',
      icon: <Home className="w-8 h-8" />,
      count: 107,
      color: 'text-info'
    },
    {
      id: 'law',
      name: 'Public Safety, Law & Justice',
      icon: <Scale className="w-8 h-8" />,
      count: 12,
      color: 'text-error'
    },
    {
      id: 'technology',
      name: 'Science, IT & Communications',
      icon: <Atom className="w-8 h-8" />,
      count: 70,
      color: 'text-accent'
    },
    {
      id: 'employment',
      name: 'Skills & Employment',
      icon: <TrendingUp className="w-8 h-8" />,
      count: 329,
      color: 'text-warning'
    },
    {
      id: 'social',
      name: 'Social welfare & Empowerment',
      icon: <Users className="w-8 h-8" />,
      count: 1395,
      color: 'text-secondary'
    },
    // Row 3
    {
      id: 'sports',
      name: 'Sports & Culture',
      icon: <Trophy className="w-8 h-8" />,
      count: 225,
      color: 'text-success'
    },
    {
      id: 'transport',
      name: 'Transport & Infrastructure',
      icon: <Bus className="w-8 h-8" />,
      count: 63,
      color: 'text-warning'
    },
    {
      id: 'tourism',
      name: 'Travel & Tourism',
      icon: <Globe className="w-8 h-8" />,
      count: 51,
      color: 'text-primary'
    },
    {
      id: 'utility',
      name: 'Utility & Sanitation',
      icon: <Wrench className="w-8 h-8" />,
      count: 38,
      color: 'text-primary'
    },
    {
      id: 'women',
      name: 'Women and Child',
      icon: <Baby className="w-8 h-8" />,
      count: 424,
      color: 'text-info'
    }
  ];

  return (
    <div className="min-h-screen bg-base-100 py-12" data-theme={theme}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-primary mb-4">
            Find Schemes Based on Categories
          </h1>
          <p className="text-lg text-base-content/70">
            Explore government schemes across different sectors and find the ones that match your needs
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
          {schemeCategories.map((category) => (
            <div
              key={category.id}
              className="   transition-all duration-300 cursor-pointer group hover:scale-105"
            >
              <div className="card-body items-center text-center p-6">
                {/* Icon */}
                <div className="mb-2">
                  <div className={`p-4 rounded-full bg-base-300 group-hover:bg-base-100 transition-all duration-300`}>
                    <div className={`${category.color} group-hover:scale-110 transition-transform duration-300`}>
                      {category.icon}
                    </div>
                  </div>
                </div>
                
                {/* Scheme Count */}
                <div className="mb-2">
                  <div className="text-2xl font-bold text-primary group-hover:scale-110 transition-all duration-300">
                    {/* {category.count.toLocaleString()} */}
                  </div>
                 
                </div>
                
                {/* Category Name */}
                <h3 className="card-title text-sm font-semibold text-base-content leading-tight text-center justify-center group-hover:text-primary transition-colors duration-300">
                  {category.name}
                </h3>

                {/* Action Button */}
                <div className="card-actions justify-center mt-4">
                  <button className="btn btn-primary btn-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    View Schemes
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16">
          <div className="stats stats-vertical lg:stats-horizontal shadow-lg bg-base-200 w-full">
            <div className="stat">
              <div className="stat-title text-base-content/60">Total Schemes</div>
              <div className="stat-value text-primary">
                {schemeCategories.reduce((sum, cat) => sum + cat.count, 0).toLocaleString()}
              </div>
              <div className="stat-desc text-base-content/50">Across all categories</div>
            </div>
            
            <div className="stat">
              <div className="stat-title text-base-content/60">Categories</div>
              <div className="stat-value text-secondary">{schemeCategories.length}</div>
              <div className="stat-desc text-base-content/50">Different sectors covered</div>
            </div>
            
            <div className="stat">
              <div className="stat-title text-base-content/60">Most Popular</div>
              <div className="stat-value text-accent">Social Welfare</div>
              <div className="stat-desc text-base-content/50">1,395 schemes available</div>
            </div>
            
            <div className="stat">
              <div className="stat-title text-base-content/60">Success Rate</div>
              <div className="stat-value text-info">92%</div>
              <div className="stat-desc text-base-content/50">Application approval</div>
            </div>
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div className="card bg-base-200 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="card-body">
              <h3 className="card-title text-secondary">How to Apply</h3>
              <p className="text-base-content/70">
                Select a category above to browse available schemes. Each scheme has detailed 
                eligibility criteria and step-by-step application instructions.
              </p>
              <div className="card-actions justify-end">
                <button className="btn btn-secondary btn-sm">Learn More</button>
              </div>
            </div>
          </div>
          
          <div className="card bg-base-200 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="card-body">
              <h3 className="card-title text-accent">Need Help?</h3>
              <p className="text-base-content/70">
                Our support team is available to help you find the right schemes and 
                guide you through the application process.
              </p>
              <div className="card-actions justify-end">
                <button className="btn btn-accent btn-sm">Contact Support</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}