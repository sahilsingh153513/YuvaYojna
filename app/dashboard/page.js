'use client'

import React, { useEffect } from 'react';
import { ArrowRight, Users, Award, Calendar, MapPin } from 'lucide-react';
import { useTranslation } from '@/context/TranslationContext';
import { useVoiceControl } from '@/context/VoiceControlContext';
import { useDaisyTheme } from '@/context/DaisyThemeContext';

export default function PMSchemesPage() {
  const { t } = useTranslation();
  const { speak, processVoiceCommand } = useVoiceControl();
  const { theme } = useDaisyTheme();

  const handleCardClick = (scheme) => {
    if (scheme === 'PM Internship Scheme') {
      navigateToScheme('internship', 'PM Internship Scheme');
    } else if (scheme === 'PM Development Yojana') {
      navigateToScheme('yojana', 'PM Development Yojana');
    }
  };

  const navigateToScheme = (scheme, schemeName) => {
    let route = '';
    
    if (scheme === 'internship') {
      route = '/dashboard/internship';
    } else if (scheme === 'yojana') {
      route = '/dashboard/yojana';
    }
    
    // speak(`Navigating to ${schemeName}`);
    console.log(`Navigating to ${route}`);
    
    // Navigate to the route
    if (typeof window !== 'undefined') {
      window.location.href = route;
    }
  };

  return (
    <div className="min-h-screen bg-base-200" data-theme={theme}>
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-base-content mb-4">
            Empowering India Through Innovation & Development
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* PM Internship Scheme Card */}
          <div 
            onClick={() => handleCardClick('PM Internship Scheme')}
            className="group card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-500 border-l-4 border-success cursor-pointer transform hover:-translate-y-2"
          >
            <div className="relative">
              <div className="card-body p-8">
                <div className="flex items-start space-x-6">
                  <div className="avatar">
                    <div className="w-20 h-20 rounded-full border-4 border-accent">
                      <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/2/2e/Prime_Minister%2C_Shri_Narendra_Modi%2C_in_New_Delhi_on_August_08%2C_2019_%28cropped%29.jpg" 
                        alt="Prime Minister" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-base-content mb-3 group-hover:text-success transition-colors">
                      PM Internship Scheme
                    </h3>
                    <p className="text-base-content/70 mb-4 leading-relaxed">
                      Bridging the gap between education and employment through hands-on industry experience for India's youth.
                    </p>
                    <div className="badge badge-info badge-md px-3 py-1">
                      💬 Say "internship"
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6 mb-6">
                  <div className="flex items-center space-x-2 text-sm text-base-content/60">
                    <Users className="w-4 h-4 text-success" />
                    <span>10 Lakh+ Interns</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-base-content/60">
                    <Calendar className="w-4 h-4 text-warning" />
                    <span>12 Month Duration</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-base-content/60">
                    <Award className="w-4 h-4 text-success" />
                    <span>₹5,000 Stipend</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-base-content/60">
                    <MapPin className="w-4 h-4 text-warning" />
                    <span>Pan India</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <span className="badge badge-success badge-outline">
                      Skills Development
                    </span>
                    <span className="badge badge-warning badge-outline">
                      Employment
                    </span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-success group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          {/* PM Yojana Card */}
          <div 
            onClick={() => handleCardClick('PM Development Yojana')}
            className="group card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-500 border-l-4 border-warning cursor-pointer transform hover:-translate-y-2"
          >
            <div className="relative">
              <div className="card-body p-8">
                <div className="flex items-start space-x-6">
                  <div className="avatar">
                    <div className="w-20 h-20 rounded-full border-4 border-success">
                      <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/2/2e/Prime_Minister%2C_Shri_Narendra_Modi%2C_in_New_Delhi_on_August_08%2C_2019_%28cropped%29.jpg" 
                        alt="Prime Minister" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-base-content mb-3 group-hover:text-warning transition-colors">
                      PM Development Yojana
                    </h3>
                    <p className="text-base-content/70 mb-4 leading-relaxed">
                      Comprehensive development initiatives focused on rural empowerment, infrastructure, and sustainable growth.
                    </p>
                    <div className="badge badge-info badge-md px-3 py-1">
                      💬 Say "yojana"
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6 mb-6">
                  <div className="flex items-center space-x-2 text-sm text-base-content/60">
                    <Users className="w-4 h-4 text-warning" />
                    <span>5 Crore+ Beneficiaries</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-base-content/60">
                    <Calendar className="w-4 h-4 text-success" />
                    <span>Ongoing</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-base-content/60">
                    <Award className="w-4 h-4 text-warning" />
                    <span>₹2 Lakh Crore Fund</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-base-content/60">
                    <MapPin className="w-4 h-4 text-success" />
                    <span>All States</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <span className="badge badge-warning badge-outline">
                      Rural Development
                    </span>
                    <span className="badge badge-success badge-outline">
                      Infrastructure
                    </span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-warning group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 text-center">
          <div className="card bg-base-100 shadow-xl border-t-4 border-primary">
            <div className="card-body p-8">
              <p className="text-base-content/70 mb-6">
                Together for development, with everyone's trust - Building a New India
              </p>
              <button className="btn btn-primary btn-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                Explore More Schemes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Animated Elements with theme colors */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl animate-pulse" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary/10 rounded-full blur-xl animate-pulse delay-1000" />
    </div>
  );
}